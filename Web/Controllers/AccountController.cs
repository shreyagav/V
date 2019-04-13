using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Dto;
using Services.Data;

namespace Web.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly SignInManager<TRRUser> _signInManager;
        private readonly UserManager<TRRUser> _userManager;
        private readonly ApplicationDbContext _ctx;
        public AccountController(SignInManager<TRRUser> signInManager,
            UserManager<TRRUser> userManager, ApplicationDbContext ctx)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _ctx = ctx;
        }

        [HttpGet("[action]")]
        public dynamic GetUser()
        {
            return new { User.Identity.Name };
        }

        [HttpPost("[action]")]
        public async Task<Microsoft.AspNetCore.Identity.SignInResult> SignIn(SignInInfo info)
        {
            try {
                var user = _ctx.Users.FirstOrDefault(u => u.UserName == info.UserName || u.OldLogin == info.UserName || u.Email == info.UserName);
                return await _signInManager.PasswordSignInAsync(user, info.Password, info.IsPersistant, false);
            }catch(Exception ex)
            {
                return Microsoft.AspNetCore.Identity.SignInResult.Failed;
            }
        }


        [HttpGet]
        public IActionResult Index()
        {
            return RedirectToAction("Login");
        }

        [HttpGet]
        public async Task<IActionResult> Login()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
            return View();
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult ExternalLogin(string provider, string returnUrl = null)
        {
            var redirectUrl = Url.Action("ExternalLoginCallback", values: new { returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return new ChallengeResult(provider, properties);
        }
        [HttpGet]
        public async Task<IActionResult> Confirmation(string returnUrl = null)
        {
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                ViewBag.ErrorMessage = "Error loading external login information.";
                return RedirectToAction("Login", new { ReturnUrl = returnUrl });
            }
            ViewBag.ReturnUrl = returnUrl;
            ViewBag.LoginProvider = info.LoginProvider;
            if (info.Principal.HasClaim(c => c.Type == ClaimTypes.Email))
            {
                ViewBag.Email = info.Principal.FindFirstValue(ClaimTypes.Email);
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Confirmation(string Email, string returnUrl = null)
        {
            returnUrl = returnUrl ?? Url.Content("~/");
            // Get the information about the user from the external login provider
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                ViewBag.ErrorMessage = "Error loading external login information during confirmation.";
                return RedirectToAction("Login", new { ReturnUrl = returnUrl });
            }
            if (Regex.IsMatch(Email, @"^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$"))
            {
                var user = new TRRUser { UserName = Email, Email = Email };
                var result = await _userManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await _userManager.AddLoginAsync(user, info);
                    if (result.Succeeded)
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return LocalRedirect(returnUrl);
                    }
                }
                ViewBag.Error = "";
                foreach (var error in result.Errors)
                {
                    ViewBag.Error += error.Description + "\n";
                }
            }

            ViewBag.LoginProvider = info.LoginProvider;
            ViewBag.ReturnUrl = returnUrl;
            return View("Confirmation");
        }
        [HttpGet]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
        {
            returnUrl = returnUrl ?? Url.Content("~/");
            if (remoteError != null)
            {
                ViewBag.ErrorMessage = $"Error from external provider: {remoteError}";
                return RedirectToAction("Login", new { ReturnUrl = returnUrl });
            }
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                ViewBag.ErrorMessage = "Error loading external login information.";
                return RedirectToAction("Login", new { ReturnUrl = returnUrl });
            }

            // Sign in the user with this external login provider if the user already has a login.
            var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);
            if (result.Succeeded)
            {
                //_logger.LogInformation("{Name} logged in with {LoginProvider} provider.", info.Principal.Identity.Name, info.LoginProvider);
                return LocalRedirect(returnUrl);
            }
            if (result.IsLockedOut)
            {
                return RedirectToPage("./Lockout");
            }
            else
            {
                // If the user does not have an account, then ask the user to create an account.
                return RedirectToAction("Confirmation", new { returnUrl });
            }
        }

    }
}
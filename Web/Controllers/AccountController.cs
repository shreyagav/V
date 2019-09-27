using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Dto;
using Services.Data;
using Services.Interfaces;

namespace Web.Controllers
{
    public class ChangePasswordDto
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
        public string NewPasswordRepeat { get; set; }
        public string Token { get; set; }
    }
    public class ChangePasswordEmailDto
    {
        public string UserName { get; set; }
    }


    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly SignInManager<TRRUser> _signInManager;
        private readonly UserManager<TRRUser> _userManager;
        private readonly ApplicationDbContext _ctx;
        private readonly IMailService _mailService;
        public AccountController(SignInManager<TRRUser> signInManager,
            UserManager<TRRUser> userManager, ApplicationDbContext ctx, IMailService mailService)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _ctx = ctx;
            _mailService = mailService;
        }

        [HttpGet("[action]")]
        public async Task<dynamic> SignOut()
        {
            await _signInManager.SignOutAsync();
            return new { result="ok" };
        }

        [HttpGet("[action]")]
        public async Task<SignInResponse> GetUser()
        {
            var res = new SignInResponse() { Error = "Not authenticated." };
            if (User.Identity.IsAuthenticated)
            {
                var user = await _userManager.FindByNameAsync(User.Identity.Name);
                if(user != null)
                {
                    await FillSignInResponse(user, res);
                }
            }
            return res;
        }
        [HttpPost("[action]")]
        public async Task<ActionResult> SendResetPasswordToken(ChangePasswordEmailDto model)
        {
            var normalized = model.UserName.ToUpper();
            var users = _ctx.Users.Include(a=>a.Site).Include(a=>a.Site.Main).Where(a => (a.NormalizedUserName == normalized || a.NormalizedEmail == normalized) && !a.Deleted).ToArray();
            if (users.Length == 1)
            {
                var trrUser = users[0];
                if (string.IsNullOrWhiteSpace(trrUser.Email))
                {
                    return BadRequest($"Your account doesn't have email. Please contact {trrUser.Site.Main.Name} <{trrUser.Site.Main.Email}> to update email at your account and then use password reset feature.");
                }
                var user = await _userManager.FindByIdAsync(users[0].Id);
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                token = WebUtility.UrlEncode(token);
                var html = $"To reset your password <a href=\"https://ors.teamriverrunner.org/PasswordReset/{token}\">click here</a>";
                try
                {
                    string from = "webmaster@teamriverrunner.org";
                    string fromName = "Webmaster Team River Runner";
                    if (trrUser.Site != null && trrUser.Site.Main != null && !string.IsNullOrWhiteSpace(trrUser.Site.Main.Email))
                    {
                        from = trrUser.Site.Main.Email;
                        fromName = trrUser.Site.Main.Name;
                    }
                    await _mailService.Send("TRR Password reset", null, html, (from, fromName),
                     new[] { (trrUser.Email, $"{trrUser.FirstName} {trrUser.LastName}") });
                }
                catch { }
            }
            return Ok(new { Ok = true });
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> ResetPassword(ChangePasswordDto model)
        {
            var normalized = model.Email.ToUpper();
            var users = _ctx.Users.Where(a => (a.NormalizedUserName == normalized || a.NormalizedEmail == normalized) && !a.Deleted).ToArray();
            if (users.Length == 1)
            {
                if(model.NewPassword != model.NewPasswordRepeat)
                {
                    return Ok(new { Succeeded = false, Errors = new IdentityError[] { new IdentityError() { Description = "Passwords are not matching." } } });
                }
                var user = await _userManager.FindByIdAsync(users[0].Id);
                var res = await _userManager.ResetPasswordAsync(user, WebUtility.UrlDecode(model.Token), model.NewPassword);
                return Ok(res);
            }
            return Ok(new { Succeeded = false, Errors = new IdentityError[] { new IdentityError(){Description="We couldn't find provided login or email in the database." } } });
        }


        private async Task FillSignInResponse(TRRUser user, SignInResponse resp)
        {
            resp.UserName = user.UserName;
            resp.UserType = user.OldType.ToString();
            resp.UserRoles = await _userManager.GetRolesAsync(user);
            if (resp.UserRoles.Contains("Admin"))
            {
                resp.AuthType = "Admin";
            }else if (resp.UserRoles.Contains("Secretary"))
            {
                resp.AuthType = "Secretary";
            }
            else
            {
                resp.AuthType = "Member";
            }
            resp.ChapterId = user.SiteId;
            resp.Error = null;
        }

        [HttpPost("[action]")]
        public async Task<SignInResponse> SignUp(SignUpInfo info)
        {
            var resp = new SignInResponse() { Error = null };
            try
            {
                var user = _ctx.Users.FirstOrDefault(u => u.UserName == info.Email);
                if(user != null)
                {
                    throw new Exception("User with provided email already exists. Use 'Forgot Password' to regain access.");
                }
                user = new TRRUser();
                user.Active = true;
                user.Email = info.Email;
                user.Address = info.Zip;
                user.UserName = info.Email;
                user.PhoneNumber = info.Phone;
                user.FirstName = info.FirstName;
                user.LastName = info.LastName;
                user.Created = DateTime.Now;
                var add_res = await _userManager.CreateAsync(user, info.Password);
                if (add_res.Succeeded)
                {
                    var res = await _signInManager.PasswordSignInAsync(user, info.Password, false, false);
                    if (res.Succeeded)
                    {
                        var addToRoleRes = await _userManager.AddToRoleAsync(user, "Member");
                        await FillSignInResponse(user, resp);
                    }
                    else
                    {
                        resp.Error = "Wrong user name or password.";
                    }
                }
                else
                {
                    throw new Exception(string.Join("\r\n",add_res.Errors.Select(a=>$"{a.Code}:: {a.Description}")));
                }
            }
            catch (Exception ex)
            {
                resp.Error = ex.Message;
            }
            return resp;

        }

        [HttpPost("[action]")]
        public async Task<SignInResponse> SignIn(SignInInfo info)
        {
            var resp = new SignInResponse() { Error = null };
            try {
                var user = _ctx.Users.FirstOrDefault(u => (u.UserName == info.UserName || u.OldLogin == info.UserName || u.Email == info.UserName) && !u.Deleted && u.Active);
                var res = await _signInManager.PasswordSignInAsync(user, info.Password, info.IsPersistant, false);
                if (res.Succeeded)
                {
                    await FillSignInResponse(user, resp);
                }
                else
                {
                    resp.Error = "Wrong user name or password.";
                }
            }catch(Exception ex)
            {
                resp.Error = ex.Message;
            }
            return resp;
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
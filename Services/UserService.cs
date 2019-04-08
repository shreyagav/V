using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Models;
using Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace Services
{
    public class UserService: IUserService
    {
        private UserManager<TRRUser> _userManager;
        private SignInManager<TRRUser> _signinManager;

        public UserService(UserManager<TRRUser> userManager, SignInManager<TRRUser> signInManager)
        {
            _userManager = userManager;
            _signinManager = signInManager;
        }

        public async Task<SignInResult> SignIn(string userName, string password)
        {
            return await _signinManager.PasswordSignInAsync(userName, password, true, true);
        }

        public async Task<IdentityResult> AddLogin(TRRUser user)
        {
            var res = await _userManager.CreateAsync(user);
            if (res.Succeeded)
            {
                res = await _userManager.AddLoginAsync(user, new UserLoginInfo("facebook", "test", "FB"));
            }
            return res;
        }

        public async Task<IdentityResult> SignUp(TRRUser user)
        {
            DateTime min = new DateTime(1900, 1, 1);
            try
            {
                if (user.DateInjured.HasValue && user.DateInjured.Value < min)
                {
                    user.DateInjured = null;
                }
                if (user.DateOfBirth.HasValue && user.DateOfBirth.Value < min)
                {
                    user.DateOfBirth = null;
                }
                if (user.JoinDate.HasValue && user.JoinDate.Value < min)
                {
                    user.JoinDate = null;
                }
                var res = await _userManager.CreateAsync(user);
                return res;
            }catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}

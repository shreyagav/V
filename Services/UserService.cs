using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Models;
using Services.Data;
using Services.Interfaces;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Services
{
    public class UserService: IUserService
    {
        private UserManager<TRRUser> _userManager;
        private SignInManager<TRRUser> _signinManager;
        private ApplicationDbContext _ctx;

        public UserService(UserManager<TRRUser> userManager, SignInManager<TRRUser> signInManager, ApplicationDbContext ctx)
        {
            _userManager = userManager;
            _signinManager = signInManager;
            _ctx = ctx;
        }

        public TRRUser FindBy(Expression<Func<TRRUser, bool>> predicate)
        {
            return _ctx.Users.FirstOrDefault(predicate);
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

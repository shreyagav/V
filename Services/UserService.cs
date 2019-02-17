using Microsoft.AspNetCore.Identity;
using Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace Services
{
    public class UserService: IUserService
    {
        private UserManager<IdentityUser> _userManager;
        private SignInManager<IdentityUser> _signinManager;

        public UserService(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signinManager = signInManager;
        }

        public async Task<IdentityResult> SignUp(IdentityUser user)
        {
            var res = await _userManager.CreateAsync(user, Guid.NewGuid().ToString());

            return res;
        }
    }
}

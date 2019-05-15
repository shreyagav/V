using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;
using Services.Data;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Services
{
    public class UserService: IUserService
    {
        private UserManager<TRRUser> _userManager;
        private SignInManager<TRRUser> _signinManager;
        private RoleManager<IdentityRole> _roleManager;
        private ApplicationDbContext _ctx;

        public UserService(UserManager<TRRUser> userManager, SignInManager<TRRUser> signInManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext ctx)
        {
            _userManager = userManager;
            _signinManager = signInManager;
            _roleManager = roleManager;
            _ctx = ctx;
        }

        public Option[] GetRolesFromOptions()
        {
            return _ctx.Options.Where(a => a.OptionCategoryId == 18).ToArray();
        }

        public TRRUser[] GetUsersInRole(int id)
        {
            return _ctx.UserOptions.Where(a => a.OptionId == id).Include(a => a.User).Select(a=>a.User).ToArray();
        }

        public async Task<Dictionary<TRRUser, IdentityResult>> AddUsersToRole(TRRUser[] users, IdentityRole role)
        {
            Dictionary<TRRUser, IdentityResult> result = new Dictionary<TRRUser, IdentityResult>();
            foreach(var user in users)
            {
                var res = await _userManager.AddToRoleAsync(user, role.Name);
                result.Add(user, res);
            }
            return result;
        }

        public async Task<IdentityResult> AddRole(IdentityRole role)
        {
            return await _roleManager.CreateAsync(role);
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

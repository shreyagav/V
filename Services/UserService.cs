using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models.Context;
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
        private UserManager<AspNetUser> _userManager;
        private SignInManager<AspNetUser> _signinManager;
        private RoleManager<IdentityRole> _roleManager;
        private ApplicationDbContext _ctx;

        public UserService(UserManager<AspNetUser> userManager, SignInManager<AspNetUser> signInManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext ctx)
        {
            _userManager = userManager;
            _signinManager = signInManager;
            _roleManager = roleManager;
            _ctx = ctx;
        }

        public async Task CreateRoles(string[] names)
        {
            foreach (var name in names)
                await _roleManager.CreateAsync(new IdentityRole() { Name = name, NormalizedName = name.ToUpper(), ConcurrencyStamp = DateTime.Now.ToString() });
        }

        public Option[] GetRolesFromOptions()
        {
            return _ctx.Options.Where(a => a.OptionCategoryId == 18).ToArray();
        }

        public AspNetUser[] GetUsersInRole(int id)
        {
            return _ctx.UserOptions.Where(a => a.OptionId == id).Include(a => a.User).Select(a=>a.User).ToArray();
        }

        public async Task<Dictionary<AspNetUser, IdentityResult>> AddUsersToRole(AspNetUser[] users,  string role)
        {
            Dictionary<AspNetUser, IdentityResult> result = new Dictionary<AspNetUser, IdentityResult>();
            foreach(var user in users)
            {
                var res = await _userManager.AddToRoleAsync(user, role);
                result.Add(user, res);
            }
            return result;
        }

        public async Task<IdentityResult> AddRole(IdentityRole role)
        {
            return await _roleManager.CreateAsync(role);
        }

        public AspNetUser FindBy(Expression<Func<AspNetUser, bool>> predicate)
        {
            return _ctx.AspNetUsers.FirstOrDefault(predicate);
        }


        public async Task<SignInResult> SignIn(string userName, string password)
        {
            return await _signinManager.PasswordSignInAsync(userName, password, true, true);
        }

    }
}

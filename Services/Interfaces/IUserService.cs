using Microsoft.AspNetCore.Identity;
using Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IUserService
    {
        Task<IdentityResult> AddLogin(TRRUser user);
        TRRUser FindBy(Expression<Func<TRRUser, bool>> predicate);
        Task<IdentityResult> AddRole(IdentityRole role);
        Task<Dictionary<TRRUser, IdentityResult>> AddUsersToRole(TRRUser[] users, string role);
        Option[] GetRolesFromOptions();
        TRRUser[] GetUsersInRole(int id);
        Task CreateRoles(string[] names);
    }
}

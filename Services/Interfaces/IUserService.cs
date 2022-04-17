using Microsoft.AspNetCore.Identity;
using Models.Context;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IUserService
    {
        AspNetUser FindBy(Expression<Func<AspNetUser, bool>> predicate);
        Task<IdentityResult> AddRole(IdentityRole role);
        Task<Dictionary<AspNetUser, IdentityResult>> AddUsersToRole(AspNetUser[] users, string role);
        Option[] GetRolesFromOptions();
        AspNetUser[] GetUsersInRole(int id);
        Task CreateRoles(string[] names);
    }
}

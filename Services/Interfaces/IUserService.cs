using Microsoft.AspNetCore.Identity;
using Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IUserService
    {
        Task<IdentityResult> SignUp(TRRUser user);
        Task<IdentityResult> AddLogin(TRRUser user);
    }
}

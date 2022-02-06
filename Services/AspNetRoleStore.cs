using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Models.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class AspNetRoleStore : RoleStore<AspNetRole, ApplicationDbContext, string>
    {
        public AspNetRoleStore(ApplicationDbContext context, IdentityErrorDescriber describer = null) : base(context, describer)
        {
        }
    }
}

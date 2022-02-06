using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Context
{
    public partial class AspNetUserLogin : IdentityUserLogin<string> { }
    public partial class AspNetRoleClaim : IdentityRoleClaim<string> { }
    public partial class AspNetUserToken : IdentityUserToken<string> { }
    public partial class AspNetUserClaim : IdentityUserClaim<string> { }
    public partial class AspNetRole : IdentityRole<string> { }
    public partial class AspNetUser : IdentityUser { }
    public class AspNetUserRole : IdentityUserRole<string>
    {
    }

    public partial class ApplicationDbContext //: IdentityDbContext<AspNetUser, AspNetRole, string, AspNetUserClaim, AspNetUserRole, AspNetUserLogin, AspNetRoleClaim, AspNetUserToken>
    {
        //public DbSet<AspNetUserRole> AspNetUserRoles { get; set; }
        //partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<AspNetUserRole>(entity =>
        //    {
        //        entity.HasKey(e => new { e.RoleId, e.UserId });
        //    });
        //}

        public IQueryable<AspNetUser> Veterans()
        {
            return this.AspNetUsers.Where(a => a.OldType == (int)TRRUserType.Veteran || a.UserOptions.Any(b=>b.OptionId == 37));
        }
    }
}

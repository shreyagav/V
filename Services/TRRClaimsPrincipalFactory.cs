using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Models.Context;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Services
{
    public class TRRClaimsPrincipalFactory : UserClaimsPrincipalFactory<AspNetUser>
    {
        public TRRClaimsPrincipalFactory(UserManager<AspNetUser> userManager, IOptions<IdentityOptions> optionsAccessor) : base(userManager, optionsAccessor)
        {
        }


        private Claim newClaim(string name, object val)
        {
            return new Claim(name, val==null?"":val.ToString());
        }
        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(AspNetUser user)
        {
            var id = await base.GenerateClaimsAsync(user);
            id.AddClaim(newClaim(nameof(user.BranchId), user.BranchId));
            id.AddClaim(newClaim(nameof(user.Medical), user.Medical));
            id.AddClaim(newClaim(nameof(user.OldAuthLevel), user.OldAuthLevel));

            /*id.AddClaim(newClaim(nameof(user.Address), user.Address));
            id.AddClaim(newClaim(nameof(user.Active), user.Active));
            id.AddClaim(newClaim(nameof(user.AltPhone), user.AltPhone??""));
            id.AddClaim(newClaim(nameof(user.Comments), user.Comments));
            id.AddClaim(newClaim(nameof(user.DateInjured), user.DateInjured));
            id.AddClaim(newClaim(nameof(user.DeactiveCause), user.DeactiveCause));
            id.AddClaim(newClaim(nameof(user.FirstName), user.FirstName));
            id.AddClaim(newClaim(nameof(user.LastName), user.LastName));
            id.AddClaim(newClaim(nameof(user.LiabilitySigned), user.LiabilitySigned));
            id.AddClaim(newClaim(nameof(user.OldId), user.OldId));
            id.AddClaim(newClaim(nameof(user.OldSiteId), user.OldSiteId.ToString()));
            id.AddClaim(newClaim(nameof(user.OldStatus), user.OldStatus.ToString()));
            id.AddClaim(newClaim(nameof(user.OldType), user.OldType.ToString()));
            id.AddClaim(newClaim(nameof(user.ReleaseSigned), user.ReleaseSigned.ToString()));
            id.AddClaim(newClaim(nameof(user.TravelTime), user.TravelTime));*/
            return id;
        }
    }
}
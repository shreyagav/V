using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Models;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Services
{
    public class TRRClaimsPrincipalFactory<TUser> : UserClaimsPrincipalFactory<TUser> where TUser : TRRUser
    {
        public TRRClaimsPrincipalFactory(
            UserManager<TUser> userManager,
            IOptions<IdentityOptions> optionsAccessor) : base(userManager, optionsAccessor)
        {

        }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(TUser user)
        {
            var id = await base.GenerateClaimsAsync(user);
            id.AddClaim(new Claim(nameof(user.Address), user.Address));
            id.AddClaim(new Claim(nameof(user.Active), user.Active.ToString()));
            id.AddClaim(new Claim(nameof(user.AltPhone), user.AltPhone));
            id.AddClaim(new Claim(nameof(user.BranchId), user.BranchId.ToString()));
            id.AddClaim(new Claim(nameof(user.Comments), user.Comments));
            id.AddClaim(new Claim(nameof(user.DateInjured), user.DateInjured.ToString()));
            id.AddClaim(new Claim(nameof(user.DeactiveCause), user.DeactiveCause));
            id.AddClaim(new Claim(nameof(user.FirstName), user.FirstName));
            id.AddClaim(new Claim(nameof(user.LastName), user.LastName));
            id.AddClaim(new Claim(nameof(user.LiabilitySigned), user.LiabilitySigned.ToString()));
            id.AddClaim(new Claim(nameof(user.Medical), user.Medical.ToString()));
            id.AddClaim(new Claim(nameof(user.OldAuthLevel), user.OldAuthLevel.ToString()));
            id.AddClaim(new Claim(nameof(user.OldId), user.OldId.ToString()));
            id.AddClaim(new Claim(nameof(user.OldPassword), user.OldPassword.ToString()));
            id.AddClaim(new Claim(nameof(user.OldSiteId), user.OldSiteId.ToString()));
            id.AddClaim(new Claim(nameof(user.OldStatus), user.OldStatus.ToString()));
            id.AddClaim(new Claim(nameof(user.OldType), user.OldType.ToString()));
            id.AddClaim(new Claim(nameof(user.ReleaseSigned), user.ReleaseSigned.ToString()));
            id.AddClaim(new Claim(nameof(user.TravelTime), user.TravelTime));
            return id;
        }
    }
}
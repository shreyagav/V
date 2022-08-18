using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Models.Context;
using System.Linq;
using System.Net;

namespace Web
{
    public class AuthorizedRoles : TypeFilterAttribute
    {
        public AuthorizedRoles(params string[] authorizedRoles) : base(typeof(AuthorizationFilter))
        {
            Arguments = new object[] { authorizedRoles };
        }

        private class AuthorizationFilter : IActionFilter
        {
            private readonly string[] _authorizedRoles;
            private ApplicationDbContext ctx;
            public AuthorizationFilter(ApplicationDbContext context, string[] authorizedRoles)
            {
                ctx = context;
                _authorizedRoles = authorizedRoles;
            }

            public void OnActionExecuting(ActionExecutingContext context)
            {
                if(!ctx.AspNetRoles.Any(a => a.Users.Any(b => b.UserName == context.HttpContext.User.Identity.Name) && _authorizedRoles.Contains(a.Name)))
                {
                    context.Result = new BadRequestResult();
                }
            }

            public void OnActionExecuted(ActionExecutedContext context)
            {
            }
        }
    }
}

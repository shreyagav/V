using Azure.Core;
using Azure.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Services.Helpers
{
    public class TrrDbConnectionInterceptor : DbConnectionInterceptor
    {

        public override InterceptionResult ConnectionOpening(DbConnection connection, ConnectionEventData eventData, InterceptionResult result)
        {
            var conn = ((SqlConnection)connection);
            if (conn != null && !result.IsSuppressed && conn.ConnectionString.Contains("database.windows.net"))
            {
                conn.AccessToken = new DefaultAzureCredential().GetToken(new TokenRequestContext(new string[] { "https://database.windows.net/.default" })).Token;
            }
            return result;
        }

        public override async ValueTask<InterceptionResult> ConnectionOpeningAsync(DbConnection connection, ConnectionEventData eventData, InterceptionResult result, CancellationToken cancellationToken = default)
        {
            var conn = ((SqlConnection)connection);
            if (conn != null && !result.IsSuppressed && conn.ConnectionString.Contains("database.windows.net"))
            {
                var res = await (new DefaultAzureCredential()).GetTokenAsync(new TokenRequestContext(new string[] { "https://database.windows.net/.default" }));
                conn.AccessToken = res.Token;
            }
            return result;
        }
    }
}

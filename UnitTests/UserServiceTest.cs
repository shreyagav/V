using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Services.Interfaces;
using Services;
using System.Threading.Tasks;
using Services.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IO;
using Models;
using System.Xml;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Reflection;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Query;

namespace UnitTests
{
    public static class QueryableExtensions
    {
        private static readonly TypeInfo QueryCompilerTypeInfo = typeof(QueryCompiler).GetTypeInfo();

        private static readonly FieldInfo QueryCompilerField = typeof(EntityQueryProvider).GetTypeInfo().DeclaredFields.First(x => x.Name == "_queryCompiler");
        private static readonly FieldInfo QueryModelGeneratorField = typeof(QueryCompiler).GetTypeInfo().DeclaredFields.First(x => x.Name == "_queryModelGenerator");
        private static readonly FieldInfo DataBaseField = QueryCompilerTypeInfo.DeclaredFields.Single(x => x.Name == "_database");
        private static readonly PropertyInfo DatabaseDependenciesField = typeof(Database).GetTypeInfo().DeclaredProperties.Single(x => x.Name == "Dependencies");

        //public static string ToSql<TEntity>(this IQueryable<TEntity> query)
        //{
        //    var queryCompiler = (QueryCompiler)QueryCompilerField.GetValue(query.Provider);
        //    var queryModelGenerator = (QueryModelGenerator)QueryModelGeneratorField.GetValue(queryCompiler);
        //    var queryModel = queryModelGenerator.ParseQuery(query.Expression);
        //    var database = DataBaseField.GetValue(queryCompiler);
        //    var databaseDependencies = (DatabaseDependencies)DatabaseDependenciesField.GetValue(database);
        //    var queryCompilationContext = databaseDependencies.QueryCompilationContextFactory.Create(false);
        //    var modelVisitor = (RelationalQueryModelVisitor)queryCompilationContext.CreateQueryModelVisitor();
        //    modelVisitor.CreateQueryExecutor<TEntity>(queryModel);
        //    var sql = modelVisitor.Queries.First().ToString();

        //    return sql;
        //}
    }

    [TestClass]
    public partial class UserServiceTest
    {
        private readonly IUserService userService;
        private readonly IImportService importService;
        private readonly ICalendarEventService eventService;
        //private readonly RoleManager<IdentityRole> _roleManager;
        public UserServiceTest()
        {
            var services = new ServiceCollection();
            //services.AddTransient<IUserClaimsPrincipalFactory<TRRUser>, TRRClaimsPrincipalFactory<TRRUser>>();
            services.AddTransient<IPasswordHasher<TRRUser>, TRRPasswordHasher>();
            services.AddTransient<ICalendarEventService, CalendarEventService>();
            services.AddTransient<IImportService, ImportService>();
            services.AddDbContext<ApplicationDbContext>(options =>
                            options.UseSqlServer(
                                "Server=tcp:trr.database.windows.net,1433;Initial Catalog=trr-ors;Persist Security Info=False;User ID=trr_admin;Password=Pa$$w0rd;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;", b => b.MigrationsAssembly("Services")));
            services.AddIdentity<TRRUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();
            services.AddTransient<IUserService, UserService>();
            /*services.Configure<IdentityOptions>(options => {
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
            });*/
            var serviceProvider = services.BuildServiceProvider();
            userService = serviceProvider.GetService<IUserService>();
            importService = serviceProvider.GetService<IImportService>();
            eventService = serviceProvider.GetService<ICalendarEventService>();
        }

        private static string SanitizeUserName(string name)
        {
            return Regex.Replace(name, "[^a-zA-Z\\d-\\.@\\+]", "");
        }

        [TestMethod]
        public void QueryTest() 
        {
            Console.WriteLine("test");
            var _ctx = importService.GetContext();



        }

        [TestMethod]
        public async Task ImportAll()
        {
            var failed = new List<XmlNode>();
            XmlDocument doc = new XmlDocument();
            Console.WriteLine($"{DateTime.Now} ImportSites");
            doc.Load(@"E:\Alla\2019\Team River Runner\UnitTests\failed_without_options_and_diagnosis.xml");
            //doc.Load("C:\\Work\\TeamRiverRunnerOld\\teamriv_admin.xml");
            var nodes = doc.SelectNodes("//table[@name='site']");

            //            var failedSites = ImportSites(nodes, eventService);
            //            failed.AddRange(failedSites);
            //            importService.GetContext().Database.ExecuteSqlCommand(@"update EventSites set GroupName=SUBSTRING(Name, 0, CHARINDEX('-',Name,0));
            //update dest set GroupId=source.GroupId
            //from EventSites dest left join 
            //(select ROW_NUMBER() over (order by groupName) as GroupId, GroupName from  (select distinct GroupName from EventSites) temp) source on dest.GroupName=source.GroupName;");
            //            nodes = doc.SelectNodes("//table[@name='syscode' and ./column='E']");
            //            Console.WriteLine($"{DateTime.Now} ImportEventTypes");
            //            var failedEventTypes = ImportEventTypes(nodes, eventService);
            //            failed.AddRange(failedEventTypes);
            //            nodes = doc.SelectNodes("//table[@name='option_category']");
            //            Console.WriteLine($"{DateTime.Now} ImportOptionCategories");
            //            ImportOptionCategories(nodes, importService);
            //            nodes = doc.SelectNodes("//table[@name='options']");
            //            Console.WriteLine($"{DateTime.Now} ImportOptions");
            //            ImportOptions(nodes, importService);
            //            nodes = doc.SelectNodes("//table[@name='syscode']");
            //            Console.WriteLine($"{DateTime.Now} ImportSystemCodes");
            //            ImportSystemCodes(nodes, importService);

            //            await userService.CreateRoles(new string[] { "Admin", "Member", "Secretary" });

            //nodes = doc.SelectNodes("//table[@name='user']");
            //Console.WriteLine($"{DateTime.Now} ImportUsers");
            //var failedUsers = await ImportUsersNew(nodes, importService);
            //failed.AddRange(failedUsers);
            //            //ImportUsersNew(nodes, importService);
            //            importService.GetContext().Database.ExecuteSqlCommand(@"insert into AspNetUserRoles (UserId, RoleId)
            //select a.UserId, b.Id as RoleId
            //from(select Id as UserId, case OldAuthLevel when 1 then 'Admin' when 2 then 'Secretary' when 3 then 'Member' end as Role from AspNetUsers) a
            //left join AspNetRoles b on a.Role = b.Name");
            //            importService.GetContext().Database.ExecuteSqlCommand(@"update a set a.SponsoredById = b.Id from AspNetUsers a join AspNetUsers b on a.OldSponsoredById = b.OldId");

            //nodes = doc.SelectNodes("//table[@name='calendar_events']");
            //Console.WriteLine($"{DateTime.Now} ImportEvents");
            //var failedEvents = ImportEvents(nodes, eventService, importService);
            //failed.AddRange(failedEvents);

            //            nodes = doc.SelectNodes("//table[@name='diagnosis']");
            //            Console.WriteLine($"{DateTime.Now} ImportUserDiagnosis");
            //            var failedDiagnosis = ImportUserDiagnosis(nodes, importService);
            //            failed.AddRange(failedDiagnosis);

            //            nodes = doc.SelectNodes("//table[@name='user_options']");
            //            Console.WriteLine($"{DateTime.Now} ImportUserOptions");
            //            var failedOptions = ImportUserOptions(nodes, importService);
            //            failed.AddRange(failedOptions);

            nodes = doc.SelectNodes("//table[@name='user_event']");
            var failedUserEvents = ImportUserEvents(nodes, importService);
            failed.AddRange(failedUserEvents);
            var count = importService.GetContext().UserEvents.Count();
            Console.WriteLine($"{DateTime.Now} ImportUserEvents imported {count} out of {nodes.Count}");

            //            importService.GetContext().Database.ExecuteSqlCommand(@"  DECLARE @cat INT;
            //  UPDATE dbo.UserOptions SET OptionId=37 WHERE OptionId=32 AND UserId NOT IN (SELECT UserId from dbo.UserOptions WHERE OptionId=37);
            //  UPDATE dbo.Options SET Title='Veteran' WHERE Id=37;
            //  SELECT @cat = OptionCategoryId FROM dbo.Options WHERE Id=32;
            //  DELETE FROM dbo.Options WHERE id=32;
            //  DELETE FROM dbo.OptionCategories WHERE Id=@cat;

            //  DELETE FROM dbo.UserOptions WHERE OptionId IN ( SELECT Id FROM dbo.Options WHERE OptionCategoryId IN (SELECT Id FROM dbo.OptionCategories WHERE OldId IN (15,13,19)));
            //  delete FROM dbo.Options WHERE OptionCategoryId IN (SELECT Id FROM dbo.OptionCategories WHERE OldId IN (15,13,19));
            //  DELETE FROM dbo.OptionCategories WHERE OldId IN (13,15,19);
            //DELETE FROM dbo.CalendarEvents WHERE EventTypeId IN (SELECT Id FROM dbo.CalendarEventTypes WHERE OldId=100);
            //  DELETE FROM dbo.CalendarEventTypes WHERE OldId=100;");


            String result = "<?xml version=\"1.0\" encoding=\"utf-8\"?><pma_xml_export>";
            result += string.Join("\n", failed.Select(a => a.OuterXml).ToArray());
            result += "</pma_xml_export>";
            File.WriteAllText(@"E:\Alla\2019\Team River Runner\UnitTests\failed_user_events.xml", result);
        }


        [TestMethod]
        public async Task AddLoginTestMethod()
        {
            TRRUser user = new TRRUser();
            user.Email = "dozcent2@mcdean.com";
            user.UserName = "dmytro2";
            var res = await userService.AddLogin(user);
            Assert.AreEqual(false, res.Succeeded);
        }
    }
}

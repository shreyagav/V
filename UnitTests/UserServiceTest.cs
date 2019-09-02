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

namespace UnitTests
{
    [TestClass]
    public partial class UserServiceTest
    {
        private readonly IUserService userService;
        private readonly IImportService importService;
        private readonly ICalendarEventService eventService;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UserServiceTest()
        {
            var services = new ServiceCollection();
            //services.AddTransient<IUserClaimsPrincipalFactory<TRRUser>, TRRClaimsPrincipalFactory<TRRUser>>();
            services.AddTransient<IPasswordHasher<TRRUser>, TRRPasswordHasher>();
            services.AddTransient<ICalendarEventService, CalendarEventService>();
            services.AddTransient<IImportService, ImportService>();
            services.AddDbContext<ApplicationDbContext>(options =>
                            options.UseSqlServer(
                                "Data Source=912-4801\\sql2016std;Initial Catalog=test-teamriverrunner3;User ID=sql_dmytrod;Password=Pa$$w0rd;MultipleActiveResultSets=False;Connection Timeout=30;", b => b.MigrationsAssembly("Services")));
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
        public async Task ImportAll()
        {
            var failed = new List<XmlNode>();
            XmlDocument doc = new XmlDocument();
            Console.WriteLine($"{DateTime.Now} ImportSites");
            doc.Load("C:\\Work\\TeamRiverRunnerOld\\teamriv_admin (1).xml");
            var nodes = doc.SelectNodes("//table[@name='site']");

            var failedSites = ImportSites(nodes, eventService);
            failed.AddRange(failedSites);
            nodes = doc.SelectNodes("//table[@name='syscode' and ./column='E']");
            Console.WriteLine($"{DateTime.Now} ImportEventTypes");
            var failedEventTypes = ImportEventTypes(nodes, eventService);
            failed.AddRange(failedEventTypes);
            nodes = doc.SelectNodes("//table[@name='option_category']");
            Console.WriteLine($"{DateTime.Now} ImportOptionCategories");
            ImportOptionCategories(nodes, importService);
            nodes = doc.SelectNodes("//table[@name='options']");
            Console.WriteLine($"{DateTime.Now} ImportOptions");
            ImportOptions(nodes, importService);
            nodes = doc.SelectNodes("//table[@name='syscode']");
            Console.WriteLine($"{DateTime.Now} ImportSystemCodes");
            ImportSystemCodes(nodes, importService);

            await userService.CreateRoles(new string[] { "Admin", "Member", "Secretary" });

            nodes = doc.SelectNodes("//table[@name='user']");
            Console.WriteLine($"{DateTime.Now} ImportUsers");
            var failedUsers = await ImportUsersNew(nodes, importService);
            failed.AddRange(failedUsers);
            //ImportUsersNew(nodes, importService);
            importService.GetContext().Database.ExecuteSqlCommand(@"insert into AspNetUserRoles (UserId, RoleId)
select a.UserId, b.Id as RoleId
from(select Id as UserId, case OldAuthLevel when 1 then 'Admin' when 2 then 'Secretary' when 3 then 'Member' end as Role from AspNetUsers) a
left join AspNetRoles b on a.Role = b.Name");
            importService.GetContext().Database.ExecuteSqlCommand(@"update a set a.SponsoredById = b.Id from AspNetUsers a join AspNetUsers b on a.OldSponsoredById = b.OldId");

            nodes = doc.SelectNodes("//table[@name='calendar_events']");
            Console.WriteLine($"{DateTime.Now} ImportEvents");
            var failedEvents = ImportEvents(nodes, eventService, importService);
            failed.AddRange(failedEvents);

            nodes = doc.SelectNodes("//table[@name='diagnosis']");
            Console.WriteLine($"{DateTime.Now} ImportUserDiagnosis");
            var failedDiagnosis = ImportUserDiagnosis(nodes, importService);
            failed.AddRange(failedDiagnosis);

            nodes = doc.SelectNodes("//table[@name='user_options']");
            Console.WriteLine($"{DateTime.Now} ImportUserOptions");
            var failedOptions = ImportUserOptions(nodes, importService);
            failed.AddRange(failedOptions);

            nodes = doc.SelectNodes("//table[@name='user_event']");
            var failedUserEvents = ImportUserEvents(nodes, importService);
            failed.AddRange(failedUserEvents);
            var count = importService.GetContext().UserEvents.Count();
            Console.WriteLine($"{DateTime.Now} ImportUserEvents imported {count} out of {nodes.Count}");


            String result = "<?xml version=\"1.0\" encoding=\"utf-8\"?><pma_xml_export>";
            result += string.Join("\n", failed.Select(a => a.OuterXml).ToArray());
            result += "</pma_xml_export>";
            File.WriteAllText("C:\\Work\\TeamRiverRunnerOld\\failed.xml", result);
        }


        [TestMethod]
        public async Task CreateUserTestMethod()
        {
            TRRUser user = new TRRUser();
            user.Email = "dozcent3@mcdean.com";
            user.UserName = "dmyt.ro3";
            var res = await userService.SignUp(user);
            Assert.AreEqual(false, res.Succeeded);
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

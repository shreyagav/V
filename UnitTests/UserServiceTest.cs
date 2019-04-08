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

namespace UnitTests
{
    [TestClass]
    public class UserServiceTest
    {
        readonly IUserService userService;
        public UserServiceTest()
        {
            var services = new ServiceCollection();
            //services.AddTransient<IUserClaimsPrincipalFactory<TRRUser>, TRRClaimsPrincipalFactory<TRRUser>>();
            services.AddTransient<IPasswordHasher<TRRUser>, TRRPasswordHasher>();
            services.AddDbContext<ApplicationDbContext>(options =>
                            options.UseSqlServer(
                                "Data Source=912-4801\\sql2016std;Initial Catalog=test-teamriverrunner;User ID=sql_dmytrod;Password=Pa$$w0rd;MultipleActiveResultSets=False;Connection Timeout=30;", b => b.MigrationsAssembly("Services")));
            services.AddDefaultIdentity<TRRUser>()
                .AddEntityFrameworkStores<ApplicationDbContext>();
            services.AddTransient<IUserService, UserService>();
            services.Configure<IdentityOptions>(options => {
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+ ";
            });
            var serviceProvider = services.BuildServiceProvider();
            userService = serviceProvider.GetService<IUserService>();
        }

        [TestMethod]
        public async Task ImportUsers()
        {
            File.AppendAllText("ImportUsers.log", $"{DateTime.Now}  :: Start");
            XmlDocument doc = new XmlDocument();
            doc.Load("C:\\Work\\TeamRiverRunner\\ImportOldData\\teamriv_admin.xml");
            var nodes = doc.SelectNodes("//table[@name='user']");
            foreach (XmlNode user in nodes)
            {
                TRRUser usr = new TRRUser();
                foreach (XmlNode node in user.ChildNodes)
                {
                    string name = node.Attributes["name"].Value;
                    try
                    {
                        switch (name)
                        {
                            case "user_email":
                                usr.Email = node.InnerText;
                                break;
                            case "user_login":
                                usr.UserName = node.InnerText;
                                break;
                                case "user_password":
                                    usr.OldPassword = node.InnerText;
                                    break;
                                case "user_first_name":
                                    usr.FirstName = node.InnerText;
                                    break;
                                case "user_last_name":
                                    usr.LastName = node.InnerText;
                                    break;
                                case "user_id":
                                    usr.OldId = int.Parse(node.InnerText);
                                    break;
                                case "user_phone":
                                    usr.PhoneNumber = node.InnerText;
                                    break;
                                case "user_alt_phone":
                                    usr.AltPhone = node.InnerText;
                                    break;
                                case "user_address":
                                    usr.Address = node.InnerText;
                                    break;

                                    case "user_dob":
                                        usr.DateOfBirth = DateTime.Parse(node.InnerText);
                                        break;
                                    case "user_site_id":
                                        usr.OldSiteId = int.Parse(node.InnerText);
                                        break;
                                    case "user_type":
                                        usr.OldType = int.Parse(node.InnerText);
                                        break;
                                    case "user_gender":
                                        usr.Gender = node.InnerText.Length==0?' ':node.InnerText[0];
                                        break;
                                    case "user_travel_time":
                                        usr.TravelTime = node.InnerText;
                                        break;
                                    case "user_join_date":
                                        usr.JoinDate = DateTime.Parse(node.InnerText);
                                        break;
                                    case "user_sponsored_by":
                                        usr.SponsoredBy = int.Parse(node.InnerText);
                                        break;
                                    case "user_auth_level":
                                        usr.OldAuthLevel = int.Parse(node.InnerText);
                                        break;
                                    case "user_active":
                                        usr.Active = node.InnerText[0]=='Y';
                                        break;
                                    case "user_deactive_cause":
                                        usr.DeactiveCause = node.InnerText;
                                        break;
                                    case "user_branch_id":
                                        usr.BranchId = int.Parse(node.InnerText);
                                        break;
                                    case "user_status":
                                        usr.OldStatus = int.Parse(node.InnerText);
                                        break;
                                    case "user_medical":
                                        usr.Medical = int.Parse(node.InnerText);
                                        break;
                                    case "user_date_injured":
                                        usr.DateInjured = DateTime.Parse(node.InnerText);
                                        break;
                                    case "user_release_signed":
                                        usr.ReleaseSigned = node.InnerText == "Y";
                                        break;
                                    case "user_liability_signed":
                                        usr.LiabilitySigned = node.InnerText == "Y";
                                        break;
                                    case "user_comments":
                                        usr.Comments = node.InnerText;
                                        break;
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }
                var exists = userService.FindBy(a => a.OldId == usr.OldId);
                IdentityResult res = null;
                if(exists == null)
                {
                    res = await userService.SignUp(usr);
                    if (!res.Succeeded)
                    {
                        File.AppendAllText("ImportUsers.log", $"{DateTime.Now}  :: Failed to import user with id={usr.OldId}; Error={string.Join("\n\t", res.Errors.Select(a => $"{a.Code}:{a.Description};").ToArray())}\n");
                    }
                }
            }
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

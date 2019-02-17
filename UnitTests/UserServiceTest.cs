using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Services.Interfaces;
using Services;
using System.Threading.Tasks;
using Services.Data;

namespace UnitTests
{
    [TestClass]
    public class UserServiceTest
    {
        readonly IUserService userService;
        public UserServiceTest()
        {
            var services = new ServiceCollection();
            services.AddDbContext<ApplicationDbContext>(options =>
                            options.UseSqlServer(
                                Configuration.GetConnectionString("DefaultConnection"), b => b.MigrationsAssembly("Web")));
            services.AddDefaultIdentity<IdentityUser>()
                .AddEntityFrameworkStores<ApplicationDbContext>();
            services.AddTransient<IUserService, UserService>();
            var serviceProvider = services.BuildServiceProvider();
            userService = serviceProvider.GetService<IUserService>();
        }

        [TestMethod]
        public async Task CreateUserTestMethod()
        {
            IdentityUser user = new IdentityUser();
            user.Email = "dozcent@mcdean.com";
            var res = await userService.SignUp(user);
            Assert.AreEqual(true, res.Succeeded);
        }
    }
}

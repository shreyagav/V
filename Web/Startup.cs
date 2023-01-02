using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
using Models;
using Models.Context;
using Services;
using Services.Data;
using Services.Helpers;
using Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddTransient<IUserStore<AspNetUser>, TRRUserStore>();
            services.AddTransient<IPasswordHasher<AspNetUser>, TRRPasswordHasher>();
            services.AddTransient<ICalendarEventService, CalendarEventService>();
            services.AddTransient<IListService, ListService>();
            services.AddTransient<IEventService, EventService>();
            services.AddTransient<IChapterService, ChapterService>();
            services.AddTransient<IStorageService, StorageService>();
            //services.AddTransient<IMailService, MailService>();
            services.AddTransient<IMailService, SMTPMailService>();
            services.AddTransient<IUserClaimsPrincipalFactory<AspNetUser>, TRRClaimsPrincipalFactory>();
            services.AddTransient<INotificationService, NotificationService>();
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                var connectionString = Configuration.GetConnectionString("DefaultConnection");
                options.UseSqlServer(connectionString);
                options.EnableDetailedErrors(true);
            }
                );
            services.AddIdentity<AspNetUser, AspNetRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
            services.AddControllers().AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);


            //var secretes = Configuration.Get<Secretes>();
            //services.AddAuthentication().AddFacebook(fbOptions=> {
            //    fbOptions.AppId = Configuration["Authentication:Facebook:AppId"];
            //    fbOptions.AppSecret = Configuration["Authentication:Facebook:AppSecret"];
            //});

            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            services.AddAntiforgery(options =>
            {
                options.HeaderName = "X-XSRF-TOKEN";
                options.Cookie.Name = "TRRAntiforgery";
                options.Cookie.HttpOnly = false;
            });
            services.ConfigureApplicationCookie(options =>
                {
                    options.Events.OnRedirectToLogin = context =>
                        {
                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            return Task.CompletedTask;
                        };
                });
        }

        void onPrepResp(StaticFileResponseContext ctx)
        {
            const int durationInSeconds = 10 * 60;
            ctx.Context.Response.Headers[HeaderNames.CacheControl] = "public,max-age=" + durationInSeconds;
        }
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseDeveloperExceptionPage();
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            //app.UseMvc(routes =>
            //{
            //    routes.MapRoute(
            //        name: "default",
            //        template: "{controller}/{action}/{id?}");
            //});
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    //spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Services;
using Services.Data;
using System;
using System.Collections.Generic;
using System.Text;
using Services.Interfaces;
using Models.Context;

namespace UnitTests
{
    [TestClass]
    public class NotificationTest
    {
        //private readonly INotificationService service;
        //public NotificationTest()
        //{
        //    var services = new ServiceCollection();
        //    services.AddDbContext<ApplicationDbContext>(options =>
        //        options.UseSqlServer(
        //            "Server=tcp:trr.database.windows.net,1433;Initial Catalog=trr-ors;Persist Security Info=False;User ID=trr_admin;Password=Pa$$w0rd;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;", b => b.MigrationsAssembly("Services")));
        //    services.AddTransient<INotificationService, NotificationService>();
        //    var serviceProvider = services.BuildServiceProvider();
        //    service = serviceProvider.GetService<INotificationService>();
        //}
        //[TestMethod]
        //public void CreateTest() {
        //    var n = new Notification()
        //    {
        //        Subject = "test",
        //        Body = "test",
        //        CreatedById = "0013f00d-2155-4efa-b309-a2ab9e8cf6b8",
        //        EventId = 998,
        //        NotificationRecepients = new List<NotificationRecepient>() { new NotificationRecepient() { UserId = "00264bbb-d0c7-488a-8f09-c31b626fab56" }, new NotificationRecepient() { UserId = "003373e1-f6ae-4687-a043-2535c4686b08" } },
        //        NotificationAttachments = new List<NotificationAttachment>() { new NotificationAttachment() { Name = "some.pdf" } }
        //    };
        //    try
        //    {
        //        service.CreateNotification(n);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex);
        //        if (ex.InnerException != null)
        //        {
        //            Console.WriteLine(ex.InnerException);
        //        }
        //    }
        //}
    }
}

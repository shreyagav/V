using Microsoft.EntityFrameworkCore;
using Models.Context;
using Services.Data;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _ctx;
        private readonly IMailService _mailService;
        public NotificationService(ApplicationDbContext context, IMailService mailService)
        {
            _ctx = context;
            _mailService = mailService;
        }
        public Guid CreateNotification(Notification notification)
        {
            notification.NotificationId = Guid.NewGuid();
            notification.Created = DateTime.Now;
            foreach(var r in notification.NotificationRecepients)
            {
                r.NotificationId = notification.NotificationId;
                r.NotificationRecepientId = Guid.NewGuid();
                r.HasError = false;
            }
            foreach(var a in notification.NotificationAttachments)
            {
                a.NotificationId = notification.NotificationId;
                a.NotificationAttachmentId = Guid.NewGuid();
            }
            _ctx.Add(notification);
            _ctx.SaveChanges();

            var createdNotification = _ctx.Notifications.Include(a => a.CreatedBy).Include(a => a.NotificationAttachments).FirstOrDefault(a => a.NotificationId == notification.NotificationId);
            var recs = _ctx.NotificationRecepients.Include(a => a.User).Where(a => a.NotificationId == notification.NotificationId);
            foreach(var r in recs)
            {
                try
                {
                    if (!string.IsNullOrWhiteSpace(r.User.Email))
                    {
                        _mailService.Send(
                            createdNotification.Subject,
                            createdNotification.Body, "",
                            (createdNotification.CreatedBy.Email, $"{createdNotification.CreatedBy.FirstName} {createdNotification.CreatedBy.LastName}"),
                            new[] { (r.User.Email, $"{r.User.FirstName} {r.User.LastName}") });
                        r.Sent = DateTime.Now;
                    }
                }
                catch (Exception e) {
                    r.Error = e.Message;
                    r.HasError = true;
                }
            }
            _ctx.SaveChanges();
            return notification.NotificationId;
        }

        public Notification[] GetEventNotifications(int eventId)
        {
            return _ctx.Notifications.Include(a=>a.CreatedBy).Include(a=>a.NotificationRecepients).Where(a => a.EventId == eventId).ToArray();
        }

        public Notification[] GetSiteNotifications(int? eventSiteId)
        {
            return _ctx.Notifications.Include(a => a.CreatedBy).Where(a => a.EventSiteId == eventSiteId).ToArray();
        }
    }
}

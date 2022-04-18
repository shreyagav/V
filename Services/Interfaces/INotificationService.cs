using Models.Context;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface INotificationService
    {
        Guid CreateNotification(Notification notification);
        Notification[] GetEventNotifications(int eventId);
        Notification[] GetSiteNotifications(int? eventSiteId);
    }
}

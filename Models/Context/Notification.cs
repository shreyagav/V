using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class Notification
    {
        public Notification()
        {
            NotificationAttachments = new HashSet<NotificationAttachment>();
            NotificationRecepients = new HashSet<NotificationRecepient>();
        }

        public Guid NotificationId { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public DateTime Created { get; set; }
        public string CreatedById { get; set; }
        public int? EventSiteId { get; set; }
        public int? EventId { get; set; }

        public virtual AspNetUser CreatedBy { get; set; }
        public virtual CalendarEvent Event { get; set; }
        public virtual EventSite EventSite { get; set; }
        public virtual ICollection<NotificationAttachment> NotificationAttachments { get; set; }
        public virtual ICollection<NotificationRecepient> NotificationRecepients { get; set; }
    }
}

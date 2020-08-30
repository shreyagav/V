using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class Notification
    {
        public Guid NotificationId { get; set; }
        public String Subject { get; set; }
        public String Body { get; set; }
        public DateTime Created { get; set; }
        public virtual TRRUser CreatedBy { get; set; }
        public string CreatedById { get; set; }
        public int? EventSiteId { get; set; }
        public EventSite EventSite { get; set; }
        public int EventId { get; set; }
        public CalendarEvent Event { get; set; }
        public ICollection<NotificationAttachment> NotificationAttachments { get; set; }
        public ICollection<NotificationRecepient> Recepients { get; set; }

    }
}

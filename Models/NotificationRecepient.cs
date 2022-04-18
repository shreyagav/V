using System;

namespace Models.Old
{
    public class NotificationRecepient
    {
        public Guid NotificationRecepientId { get; set; }
        public Guid NotificationId { get; set; }
        public String UserId { get; set; }
        public TRRUser User { get; set; }
        public Notification Notification { get; set; }
        public DateTime? Sent { get; set; }
        public bool HasError { get; set; }
        public string Error { get; set; }
    }
}
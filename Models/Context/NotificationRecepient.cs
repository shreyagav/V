using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class NotificationRecepient
    {
        public Guid NotificationId { get; set; }
        public string UserId { get; set; }
        public DateTime? Sent { get; set; }
        public bool HasError { get; set; }
        public string Error { get; set; }
        public Guid NotificationRecepientId { get; set; }

        public virtual Notification Notification { get; set; }
        public virtual AspNetUser User { get; set; }
    }
}

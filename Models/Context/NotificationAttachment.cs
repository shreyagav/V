using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class NotificationAttachment
    {
        public Guid NotificationAttachmentId { get; set; }
        public Guid NotificationId { get; set; }
        public int Size { get; set; }
        public string Name { get; set; }
        public DateTime? Uploaded { get; set; }

        public virtual Notification Notification { get; set; }
    }
}

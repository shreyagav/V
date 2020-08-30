using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class NotificationAttachment
    {
        public Guid NotificationAttachmentId { get; set; }
        public Guid NotificationId { get; set; }
        public Notification Notification { get; set; }
        public int Size { get; set; }
        public string Name { get; set; }
        public DateTime? Uploaded { get; set; }
        public byte[] AttachmentData { get; set; }
        public string AttachmentDataStr { get; set; }
    }
}

using System;

namespace Models
{
    public class UserEvent
    {
        public string UserId { get; set; }
        public TRRUser User { get; set; }
        public int EventId { get; set; }
        public CalendarEvent Event { get; set; }

        public DateTime Created { get; set; }
        public TRRUser CreatedBy { get; set; }
        public String CreatedById { get; set; }
        public bool? Attended { get; set; }
        public string Comment { get; set; }
        public int? OldUserId { get; set; }
        public int? OldEventId { get; set; }
    }
}

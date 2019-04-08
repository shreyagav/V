using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{

    public class CalendarEvent
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public CalendarEventType EventType { get; set; }
        public EventSite Site { get; set; }
        public int GroupId { get; set; }
        public DateTime Date { get; set; }
        public int StartTime { get; set; }
        public int EndTime { get; set; }
        public DateTime Created { get; set; }
        public string Color { get; set; }
        public decimal Fee { get; set; }
        public int MaxCapacity { get; set; }
        public int Attended { get; set; }
        public int OldEventTypeId { get; set; }
        public int OldEventSiteId { get; set; }
        public int OldId { get; set; }
        public int OldCreatedById { get; set; }
        public int OldModifiedById { get; set; }
        public DateTime? Deleted { get; set; }
        public DateTime? Canceled { get; set; }
        public DateTime? Updated { get; set; }
        public string Report { get; set; }
    }
}

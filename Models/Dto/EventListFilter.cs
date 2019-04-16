using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class EventListFilter
    {
        public string Name { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public string TimeFrom { get; set; }
        public string TimeTo { get; set; }
        public CalendarEventType EventType { get; set; }
        public EventStatus? Status { get; set; }
        public string Color { get; set; }
        public int[] Sites { get; set; }
    }
}

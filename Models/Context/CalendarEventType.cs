using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class CalendarEventType
    {
        public CalendarEventType()
        {
            CalendarEvents = new HashSet<CalendarEvent>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public int OldId { get; set; }
        public string Color { get; set; }
        public byte Order { get; set; }

        public virtual ICollection<CalendarEvent> CalendarEvents { get; set; }
    }
}

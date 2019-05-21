using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class Photo
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public CalendarEvent Event { get; set; }
        public string FileName { get; set; }
        public DateTime Uploaded { get; set; }
        public string Url { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class Photo
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string FileName { get; set; }
        public DateTime Uploaded { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Url { get; set; }

        public virtual CalendarEvent Event { get; set; }
    }
}

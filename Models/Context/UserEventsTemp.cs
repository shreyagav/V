using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class UserEventsTemp
    {
        public string UserId { get; set; }
        public int EventId { get; set; }
        public DateTime Created { get; set; }
        public string CreatedById { get; set; }
        public bool? Attended { get; set; }
        public string Comment { get; set; }
        public int? OldUserId { get; set; }
        public int? OldEventId { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class ImportUserEvent
    {
        public int UserId { get; set; }
        public int EventId { get; set; }
        public int CreatedById { get; set; }
        public bool? UserAttended { get; set; }
        public string Comment { get; set; }
        public DateTime Created { get; set; }
    }
}

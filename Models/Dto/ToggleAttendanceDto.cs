using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class ToggleAttendanceDto
    {
        public int EventId { get; set; }
        public string UserId { get; set; }
        public bool Attended { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class CalendarView
    {
        public string Day { get; set; }
        public EventView[] Events { get; set; } 
    }
}

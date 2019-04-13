using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class CalendarViewFilter
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int[] Sites { get; set; }
    }
}

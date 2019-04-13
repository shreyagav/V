using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class EventView
    {
        public int Id { get; set; }
        public int Hours { get; set; }
        public int Minutes { get; set; }
        public bool Am { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class MainEventDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int GroupId { get; set; }
        public int[] Sites { get; set; }
        public DateTime Date { get; set; }
        public string TimeFrom { get; set; }
        public string TimeTo { get; set; }
        public int Type { get; set; }
        public string Color { get; set; }
        public EventStatus Status { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class EventListFilter
    {
        public string Title { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public TimeDto TimeFrom { get; set; }
        public TimeDto TimeTo { get; set; }
        public int? TypeOfEvent { get; set; }
        public EventStatus? Status { get; set; }
        public int[] Chapters { get; set; }
    }
}

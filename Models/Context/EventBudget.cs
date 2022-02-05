using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class EventBudget
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Quantity { get; set; }
        public decimal Cost { get; set; }

        public virtual CalendarEvent Event { get; set; }
    }
}

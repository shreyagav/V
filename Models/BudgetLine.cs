using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class BudgetLine
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public CalendarEvent Event { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Quantity { get; set; }
        public decimal Cost { get; set; }
    }
}

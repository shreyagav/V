using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class CalendarEvent
    {
        public CalendarEvent()
        {
            EventBudgets = new HashSet<EventBudget>();
            Notifications = new HashSet<Notification>();
            Photos = new HashSet<Photo>();
            UserEvents = new HashSet<UserEvent>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int EventTypeId { get; set; }
        public int SiteId { get; set; }
        public int GroupId { get; set; }
        public DateTime Date { get; set; }
        public int StartTime { get; set; }
        public int EndTime { get; set; }
        public string CreatedById { get; set; }
        public DateTime Created { get; set; }
        public string ModifiedById { get; set; }
        public DateTime Modified { get; set; }
        public string Color { get; set; }
        public decimal Fee { get; set; }
        public int MaxCapacity { get; set; }
        public int Attended { get; set; }
        public int? OldEventTypeId { get; set; }
        public int? OldEventSiteId { get; set; }
        public int? OldId { get; set; }
        public int? OldCreatedById { get; set; }
        public int? OldModifiedById { get; set; }
        public DateTime? Deleted { get; set; }
        public DateTime? Canceled { get; set; }
        public string Report { get; set; }
        public int Status { get; set; }
        public int? OldEventCount { get; set; }
        public int? OldEventMultiOrder { get; set; }
        public int? OldEventRepeat { get; set; }
        public decimal ProjectedCost { get; set; }
        public string OldEventVisibility { get; set; }

        public virtual AspNetUser CreatedBy { get; set; }
        public virtual CalendarEventType EventType { get; set; }
        public virtual AspNetUser ModifiedBy { get; set; }
        public virtual EventSite Site { get; set; }
        public virtual ICollection<EventBudget> EventBudgets { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<UserEvent> UserEvents { get; set; }
    }
}

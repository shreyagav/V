using Models.Dto;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public enum EventStatus { New, Draft, Published, Closed, Deleted, Cancelled};
    public class CalendarEvent
    {
        public CalendarEvent() {
        }
        public CalendarEvent(EventMainDto newEvent)
        {
            Id = newEvent.Id;
            Map(newEvent);
        }

        public CalendarEvent Map(EventMainDto newEvent)
        {
            Name = newEvent.Name;
            Description = newEvent.Description;
            Color = newEvent.Color;
            StartTime = newEvent.TimeFrom.ToInt();
            EndTime = newEvent.TimeTo.ToInt();
            Date = newEvent.Date;
            SiteId = newEvent.Site;
            EventTypeId = newEvent.EventType;
            return this;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int EventTypeId { get; set; }
        public CalendarEventType EventType { get; set; }
        public int SiteId { get; set; }
        public EventSite Site { get; set; }
        public int GroupId { get; set; }
        public DateTime Date { get; set; }
        public int StartTime { get; set; }
        public int EndTime { get; set; }
        public TRRUser CreatedBy { get; set; }
        public DateTime Created { get; set; }
        public TRRUser ModifiedBy { get; set; }
        public DateTime Modified { get; set; }
        public string Color { get; set; }
        public decimal Fee { get; set; }
        public int MaxCapacity { get; set; }
        public int Attended { get; set; }
        public int OldEventTypeId { get; set; }
        public int OldEventSiteId { get; set; }
        public int OldId { get; set; }
        public int OldCreatedById { get; set; }
        public int OldModifiedById { get; set; }
        public DateTime? Deleted { get; set; }
        public DateTime? Canceled { get; set; }
        public string Report { get; set; }
        public EventStatus Status { get; set; }
        public int OldEventCount { get; set; }
        public int OldEventMultiOrder { get; set; }
        public int OldEventRepeat { get; set; }
        public decimal ProjectedCost { get; set; }
        public Char OldEventVisibility { get; set; }
        public ICollection<UserEvent> Events { get; set; }
        public ICollection<BudgetLine> Budget { get; set; }
    }
}

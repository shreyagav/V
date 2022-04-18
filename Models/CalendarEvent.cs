using Models.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Models.Context
{
    
    public partial class CalendarEvent
    {
        public CalendarEvent(EventMainDto newEvent)
        {
            Id = newEvent.Id<=0? 0 : newEvent.Id;
            Map(newEvent);
        }

        public CalendarEvent Map(EventMainDto newEvent)
        {
            Name = newEvent.Name;
            Description = newEvent.Description;
            StartTime = newEvent.TimeFrom.ToInt();
            EndTime = newEvent.TimeTo.ToInt();
            Date = newEvent.Date.Date;
            SiteId = newEvent.Site;
            EventTypeId = newEvent.EventType;
            
            Status = (int)Enum.Parse(typeof(EventStatus), Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(newEvent.EventStatus));
            ProjectedCost = newEvent.ProjectedCost;
            return this;
        }

    }
}

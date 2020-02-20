using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class TimeDto
    {
        public byte Hours { get; set; }
        public byte Minutes { get; set; }
        public bool Am { get; set; }

        public TimeDto() { }
        public TimeDto(int val) {
            Am = val < 1200;
            Hours = (byte)(val < 1200 ? val / 100 : (val / 100) - 12);
            if (Hours == 0 && val == 1200)
            {
                Hours = 12;
                Am = false;
            }
            Minutes = (byte)(val % 100);
        }
        public int ToInt() {
            int res = 0;
            if (Am) {
                res = Hours * 100 + Minutes;
            }
            else
            {
                res = (Hours + 12) * 100 + Minutes;
            }
            return res;
        }
        public override string ToString() {
            return $"{Hours}:{Minutes} {(Am?"AM":"PM")}";
        }
    }

    public class EventMainDto
    {
        public EventMainDto() { }
        public EventMainDto(CalendarEvent evt)
        {
            Id = evt.Id;
            Name = evt.Name;
            Description = evt.Description;
            EventType = evt.EventTypeId;
            Site = evt.SiteId;
            TimeFrom = new TimeDto(evt.StartTime);
            TimeTo = new TimeDto(evt.EndTime);
            Color = evt.EventType.Color;
            Date = evt.Date;
            EventStatus = evt.Status.ToString().ToLower();
            ProjectedCost = evt.ProjectedCost;
        }

        public int Id { get; set; }
        public String Name { get; set; }
        public String Description { get; set; }
        public int EventType { get; set; }
        public string EventStatus { get; set; }
        public int Site { get; set; }
        public TimeDto TimeFrom { get; set; }
        public TimeDto TimeTo { get; set; }
        public DateTime Date { get; set; }
        public string Color { get; set; }
        public decimal ProjectedCost { get; set; }
        public bool CurentUserAttends { get; set; }
    }
}

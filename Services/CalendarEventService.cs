using Microsoft.EntityFrameworkCore;
using Models;
using Models.Dto;
using Services.Data;
using Services.Helpers;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Services
{
    public class CalendarEventService : ICalendarEventService
    {
        private ApplicationDbContext _context;
        public CalendarEventService(ApplicationDbContext context)
        {
            _context = context;
        }

        private int ConvertTime(string timeStr)
        {
            return 0;
        }

        public EventListRow[] GetFilteredEvents(EventListFilter filter)
        {
            var events = _context.CalendarEvents.Where(evt =>
                 (filter.DateFrom.HasValue && evt.Date > filter.DateFrom.Value)
                 && (filter.DateTo.HasValue && evt.Date < filter.DateTo.Value)
                 && (string.IsNullOrEmpty(filter.Title) || evt.Name.Contains(filter.Title, StringComparison.OrdinalIgnoreCase))
                 && (filter.TimeFrom == null || evt.StartTime > filter.TimeFrom.ToInt())
                 && (filter.TimeTo == null || evt.EndTime > filter.TimeTo.ToInt())
                 && (filter.Chapters == null || filter.Chapters.Length == 0 || filter.Chapters.Contains(evt.Site.Id))
                 && (!filter.Status.HasValue || filter.Status.Value == evt.Status)
                 && (string.IsNullOrEmpty(filter.Color) || evt.Color == filter.Color)
            ).Include(evt => evt.Site).Include(evt => evt.EventType).Take(1000).Select(evt=>new EventListRow() {Name = evt.Name,Chapter=evt.Site.Name,Color=evt.Color,Date=evt.Date.ToString("d"),Id=evt.Id,Status=evt.Status,Time=$"{Converters.IntTimeToStr(evt.StartTime)} - {Converters.IntTimeToStr(evt.EndTime)}", Type=evt.EventType.Title }) .ToArray();
            return events;
        }

        public Contact AddContact(Contact contact)
        {
            var res = _context.Contacts.Add(contact);
            _context.SaveChanges();
            return res.Entity;
        }

        public CalendarEventType AddEventType(CalendarEventType evType)
        {
            var res = _context.CalendarEventTypes.Add(evType);
            _context.SaveChanges();
            return res.Entity;
        }

        public EventSite AddEventSite(EventSite site)
        {
            var res = _context.EventSites.Add(site);
            _context.SaveChanges();
            return res.Entity;
        }

        public Contact GetContactByEmail(string email)
        {
            return _context.Contacts.FirstOrDefault(a => a.Email == email);
        }

        public CalendarEvent AddEvent(CalendarEvent newEvent)
        {
            var res =_context.CalendarEvents.Add(newEvent);
            _context.SaveChanges();
            return res.Entity;
        }

        public EventSite GetEventSite(int id)
        {
            return _context.EventSites.FirstOrDefault(a => a.OldId == id);
        }

        public CalendarEventType[] AllEventTypes()
        {
            return _context.CalendarEventTypes.ToArray();
        }

        public TRRUser GetUserByOldId(int id)
        {
            return _context.Users.FirstOrDefault(a => a.OldId == id);
        }

        private EventView RawToView(CalendarEvent evt)
        {
            var res = new EventView();
            res.Id = evt.Id;
            res.Am = evt.StartTime < 1200;
            res.Hours = res.Am? evt.StartTime / 100 : (evt.StartTime / 100) -12;
            if (res.Hours == 0 && !res.Am)
                res.Hours = 12;
            res.Minutes = evt.StartTime % 100;
            res.Name = evt.Name;
            res.Color = evt.Color;
            return res;
        }

        public CalendarView[] GetMonthEvents(CalendarViewFilter filter)
        {
            DateTime start = new DateTime(filter.Year, filter.Month, 1);
            DateTime end = start.AddMonths(1);
            CalendarEvent[] events;
            if (filter.Sites != null && filter.Sites.Length > 0)
            {
                events = _context.CalendarEvents.Where(e => e.Date >= start && e.Date < end && filter.Sites.Contains(e.Site.Id)).OrderBy(a => a.Date).ThenBy(a => a.StartTime).ToArray();
            }
            else
            {
                events = _context.CalendarEvents.Where(e => e.Date >= start && e.Date < end).OrderBy(a => a.Date).ThenBy(a => a.StartTime).ToArray();
            }
            return (from e in events
                          group e by $"{e.Date.Month}-{e.Date.Day}" into ge
                          select new CalendarView (){ Day = ge.Key, Events = ge.Select(a=>RawToView(a)).ToArray() }).ToArray();

        }
    }
}

using Models;
using Models.Dto;
using Services.Data;
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

        public void AddContact(Contact contact)
        {
            _context.Contacts.Add(contact);
            _context.SaveChanges();
        }

        public void AddEventType(CalendarEventType evType)
        {
            _context.CalendarEventTypes.Add(evType);
            _context.SaveChanges();
        }

        public void AddEventSite(EventSite site)
        {
            _context.EventSites.Add(site);
            _context.SaveChanges();
        }

        public void CreateEvent(string name)
        {
            var cevent = _context.CalendarEvents.Add(new Models.CalendarEvent() { Name = name });
            _context.SaveChanges();

        }

        public Contact GetContactByEmail(string email)
        {
            return _context.Contacts.FirstOrDefault(a => a.Email == email);
        }

        public void AddEvent(CalendarEvent newEvent)
        {
            _context.CalendarEvents.Add(newEvent);
            _context.SaveChanges();
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
            res.Am = evt.StartTime < 1200;
            res.Hours = res.Am? evt.StartTime / 100 : (evt.StartTime / 100) -12;
            if (res.Hours == 0 && !res.Am)
                res.Hours = 12;
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

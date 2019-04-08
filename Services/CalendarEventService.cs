using Models;
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
    }
}

using Microsoft.EntityFrameworkCore;
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
    public class EventService : IEventService
    {
        private ApplicationDbContext _context;
        public EventService(ApplicationDbContext context)
        {
            _context = context;
        }

        public EventMainDto ChangeEvent(EventMainDto newEvent)
        {
            CalendarEvent temp;
            if (newEvent.Id == 0)
            {
                temp = new CalendarEvent(newEvent);
                temp.Site = _context.EventSites.First(s => s.Id == newEvent.Site);
                temp.Created = temp.Modified = DateTime.Now;
                temp.Status = EventStatus.Draft;
                var added = _context.CalendarEvents.Add(temp);
                newEvent.Id = added.Entity.Id;
            }
            else
            {
                temp = _context.CalendarEvents.First(e => e.Id == newEvent.Id);
                temp.Map(newEvent);
                temp.Modified = DateTime.Now;
                _context.Entry(temp).State = EntityState.Modified;
            }
            _context.SaveChanges();
            newEvent.Id = temp.Id;
            return newEvent;

        }

        public EventMainDto GetEvent(int id)
        {
            var evt = _context.CalendarEvents.First(e => e.Id == id);
            return new EventMainDto(evt);
        }
    }
}

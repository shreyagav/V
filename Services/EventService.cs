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

        private int tempMemberType() {
            return new Random().Next(1, 3);
        }

        public EventAttendeeDto[] GetEventAttendees(int eventId)
        {
            return _context.UserEvents
                .Where(ue => ue.EventId == eventId)
                .Include(e => e.User)
                .Select(u => new EventAttendeeDto()
                    {
                        Id = u.UserId,
                        FirstName = u.User.FirstName,
                        LastName = u.User.LastName,
                        Email = u.User.Email,
                        MemberTypeId = tempMemberType(),
                        Phone = u.User.PhoneNumber
                    })
                .ToArray();
        }
        public EventAttendeeDto[] RemoveEventAttendees(int eventId, EventAttendeeDto attendee)
        {
            var toRemove = _context.UserEvents.First(ue => ue.UserId == attendee.Id && ue.EventId == eventId);
            _context.UserEvents.Remove(toRemove);
            _context.SaveChanges();
            return GetEventAttendees(eventId);
        }

        public EventAttendeeDto[] GetSiteMembers(int eventId)
        {
            int siteId = _context.CalendarEvents.First(a => a.Id == eventId).SiteId;
            return _context.Users
                .Where(ue => ue.SiteId == siteId)
                .Select(u => new EventAttendeeDto()
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    MemberTypeId = tempMemberType(),
                    Phone = u.PhoneNumber
                })
                .ToArray();
        }
    }
}

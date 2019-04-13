using Models;
using Models.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface ICalendarEventService
    {
        void CreateEvent(string name);
        Contact GetContactByEmail(string email);
        void AddContact(Contact contact);
        void AddEventSite(EventSite site);
        void AddEventType(CalendarEventType evType);
        void AddEvent(CalendarEvent newType);
        EventSite GetEventSite(int id);
        CalendarEventType[] AllEventTypes();
        TRRUser GetUserByOldId(int id);
        CalendarView[] GetMonthEvents(CalendarViewFilter filter);
    }
}

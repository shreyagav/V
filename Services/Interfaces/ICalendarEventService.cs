using Models.Context;
using Models.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface ICalendarEventService
    {
        Contact GetContactByEmail(string email);
        Contact AddContact(Contact contact);
        EventSite AddEventSite(EventSite site);
        CalendarEventType AddEventType(CalendarEventType evType);
        CalendarEvent AddEvent(CalendarEvent newType);
        EventSite GetEventSite(int id);
        CalendarEventType[] AllEventTypes();
        AspNetUser GetUserByOldId(int id);
        CalendarView[] GetMonthEvents(CalendarViewFilter filter);
        EventListRow[] GetFilteredEvents(EventListFilter filter);
    }
}

using Models;
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
    }
}

﻿using Models.Dto;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IEventService
    {
        EventMainDto ChangeEvent(EventMainDto data);
        EventMainDto GetEvent(int id);
        EventAttendeeDto[] GetEventAttendees(int eventId);
        EventAttendeeDto[] RemoveEventAttendees(int eventId, EventAttendeeDto attendee);
        EventAttendeeDto[] GetSiteMembers(int eventId);
        Task<EventAttendeeDto[]> AddEventAttendees(int id, string[] ids, ClaimsPrincipal user);

    }
}

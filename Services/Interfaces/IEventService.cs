using Models.Context;
using Models.Dto;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IEventService
    {
        Task<EventMainDto> ChangeEvent(EventMainDto data, ClaimsPrincipal user);
        EventAttendeeDto[] GetEventAttendees(int eventId);
        EventAttendeeDto[] RemoveEventAttendees(int eventId, EventAttendeeDto attendee);
        EventAttendeeDto[] GetSiteMembers(int eventId);
        EventAttendeeDto[] GetSiteMembersOnly(int siteId);
        Task<EventAttendeeDto[]> AddEventAttendees(int id, string[] ids, ClaimsPrincipal user);
        EventBudget[] GetEventBudget(int eventId);
        EventBudget[] AddBudgetLines(int eventId, EventBudget[] lines);
        void AddPhotos(Photo[] arr);
        EventBudget[] DeleteBudgetLine(int eventId, EventBudget line);
        EventBudget[] UpdateBudgetLine(int eventId, EventBudget line);
        Photo[] GetEventPhotos(int id);
        Photo GetPhotoById(int id);
        Task<EventMainDto> GetEvent(int id, ClaimsPrincipal user);
        Task AddEventAttendees(int id, ClaimsPrincipal user);
        Task RemoveEventAttendees(int eventId, ClaimsPrincipal user);
        dynamic ToggleAttendance(ToggleAttendanceDto dto);
    }
}

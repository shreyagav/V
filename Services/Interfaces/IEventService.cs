using Models;
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
        EventMainDto ChangeEvent(EventMainDto data);
        EventMainDto GetEvent(int id);
        EventAttendeeDto[] GetEventAttendees(int eventId);
        EventAttendeeDto[] RemoveEventAttendees(int eventId, EventAttendeeDto attendee);
        EventAttendeeDto[] GetSiteMembers(int eventId);
        Task<EventAttendeeDto[]> AddEventAttendees(int id, string[] ids, ClaimsPrincipal user);
        BudgetLine[] GetEventBudget(int eventId);
        BudgetLine[] AddBudgetLines(int eventId, BudgetLine[] lines);
        void AddPhotos(Photo[] arr);
        BudgetLine[] DeleteBudgetLine(int eventId, BudgetLine line);
        BudgetLine[] UpdateBudgetLine(int eventId, BudgetLine line);
        Photo[] GetEventPhotos(int id);
        Photo GetPhotoById(int id);
    }
}

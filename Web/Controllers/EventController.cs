using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Dto;
using Services.Interfaces;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly IEventService _service;
        public EventController(IEventService service)
        {
            _service = service;
        }
        [HttpPost("[action]")]
        public EventMainDto ChangeEvent(EventMainDto evnt)
        {
            return _service.ChangeEvent(evnt);
        }
        [HttpGet("[action]/{id}")]
        public EventMainDto GetEventById(int id)
        {
            return _service.GetEvent(id);
        }
        [HttpGet("[action]/{id}")]
        public EventAttendeeDto[] GetEventAttendees(int id)
        {
            return _service.GetEventAttendees(id);
        }
        [HttpPost("[action]/{id}")]
        public EventAttendeeDto[] RemoveEventAttendees(int id, EventAttendeeDto attendee)
        {
            return _service.RemoveEventAttendees(id, attendee);
        }
        [HttpPost("[action]/{id}")]
        public async Task<EventAttendeeDto[]> AddEventAttendees(int id, string[] ids)
        {
            return await _service.AddEventAttendees(id, ids, User);
        }
        [HttpGet("[action]/{id}")]
        public EventAttendeeDto[] GetSiteMembers(int id)
        {
            return _service.GetSiteMembers(id);
        }
    }
}
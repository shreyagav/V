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
    }
}
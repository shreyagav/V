using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;
using Services.Interfaces;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListsController : ControllerBase
    {

        private readonly IListService _service;

        public ListsController(IListService service)
        {
            _service = service;
        }
        [HttpGet("[action]")]
        public CalendarEventType[] GetEventTypes()
        {
            return _service.EventTypes();
        }
    }
}
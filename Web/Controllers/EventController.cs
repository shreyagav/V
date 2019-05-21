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
        private readonly IStorageService _storageService;
        public EventController(IEventService service, IStorageService storageService)
        {
            _service = service;
            _storageService = storageService;
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
        [HttpGet("[action]/{id}")]
        public Photo[] GetEventPhotos(int id)
        {
            throw new NotImplementedException();
        }

        [HttpPost("[action]/{id}")]
        public async Task<Photo[]> UploadFile(int id, List<IFormFile> files)
        {
            List<Photo> photos = new List<Photo>(); 
            foreach (var f in files)
            {
                string url = await _storageService.SaveFile(Guid.NewGuid().ToString(), f.OpenReadStream());
                photos.Add(new Photo()
                {
                    EventId=id,
                    FileName=f.FileName,
                    Uploaded = DateTime.Now,
                    Url = url
                });
            }
            var arr = photos.ToArray();
            _service.AddPhotos(arr);
            return arr;
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

        [HttpGet("[action]/{id}")]
        public BudgetLine[] GetBudget(int id)
        {
            return _service.GetEventBudget(id);
        }
        [HttpPost("[action]/{id}")]
        public BudgetLine[] AddBudgetLines(int id, BudgetLine[] lines)
        {
            return _service.AddBudgetLines(id, lines);
        }
        [HttpPost("[action]/{id}")]
        public BudgetLine[] DeleteBudgetLine(int id, BudgetLine line)
        {
            return _service.DeleteBudgetLine(id, line);
        }
    }
}
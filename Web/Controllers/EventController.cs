using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
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
        public async Task<IActionResult> Photo(int id)
        {
            Photo p = _service.GetPhotoById(id);
            byte[] data = await _storageService.GetFile(Path.GetFileName(p.Url));
            return File(data, "application/octet-stream");
        }

        [HttpGet("[action]/{id}")]
        public Photo[] GetEventPhotos(int id)
        {
            var temp = _service.GetEventPhotos(id);
            foreach(var a in temp)
            {
                a.Url = $"/api/Event/Photo/{a.Id}";
            }
            return temp;
        }
        [HttpPost("[action]/{id}")]
        public async Task<Photo[]> UploadFile(int id, List<IFormFile> files)
        {
            List<Photo> photos = new List<Photo>(); 
            foreach (var f in files)
            {
                string url = await _storageService.SaveFile(Guid.NewGuid().ToString(), f.OpenReadStream());
                Image img = Image.FromStream(f.OpenReadStream());
                photos.Add(new Photo()
                {
                    EventId=id,
                    FileName=f.FileName,
                    Uploaded = DateTime.Now,
                    Width = img.Width,
                    Height = img.Height,
                    Url = url
                });
            }
            var arr = photos.ToArray();
            _service.AddPhotos(arr);
            foreach(var a in arr)
            {
                a.Url = $"/api/Event/Photo/{a.Id}";
            }
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
            return await _service.AddEventAttendees(id, ids.Distinct<string>().ToArray(), User);
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
        public BudgetLine[] AddBudgetLine(int id, BudgetLine line)
        {
            BudgetLine[] arr = new BudgetLine[] { line };
            return _service.AddBudgetLines(id, arr);
        }

        [HttpPost("[action]/{id}")]
        public BudgetLine[] UpdateBudgetLine(int id, BudgetLine line)
        {
            
            return _service.UpdateBudgetLine(id, line);
        }

        [HttpPost("[action]/{id}")]
        public BudgetLine[] DeleteBudgetLine(int id, BudgetLine line)
        {
            return _service.DeleteBudgetLine(id, line);
        }
    }
}
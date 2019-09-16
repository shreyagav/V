using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Dto;
using Services.Interfaces;

namespace Web.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class ChapterController : ControllerBase
    {
        private readonly IChapterService _service;
        public ChapterController(IChapterService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("[action]/{id}")]
        public EventSite GetById(int id)
        {
            return _service.Get(id);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("[action]")]
        public EventSite Save(EventSite site)
        {
            return _service.Set(site);
        }

        [HttpGet("[action]")]
        public SiteListItemView[] GetGrouppedChapters()
        {
            return _service.SiteListItemView();
        }
    }
}
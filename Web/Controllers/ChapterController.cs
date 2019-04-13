using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("[action]")]
        public SiteListItemView[] GetGrouppedChapters(int month, int year)
        {
            return _service.SiteListItemView();
        }
    }
}
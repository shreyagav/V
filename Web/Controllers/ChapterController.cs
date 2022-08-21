using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.Context;
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

        [AuthorizedRoles("Admin")]
        [HttpGet("[action]/{id:int}")]
        public EventSite GetById(int id)
        {
            return _service.Get(id);
        }
        [AuthorizedRoles("Admin")]
        [HttpPost("[action]")]
        public EventSite Save(EventSite site)
        {
            return _service.Set(site);
        }
        [AuthorizedRoles("Admin")]
        [HttpPost("[action]")]
        public dynamic Delete(EventSite site)
        {
            try
            {
                site.Deleted = true;
                _service.Set(site);
                return new { Ok = true };
            }
            catch (Exception ex)
            {
                return new { Error = ex.Message };
            }
        }
        [HttpGet("[action]")]
        public SiteListItemView[] GetGrouppedChapters()
        {
            return _service.SiteListItemView();
        }

        [HttpGet("[action]")]
        public Region[] AllRegions()
        {
            return _service.AllRegions();
        }

        [HttpGet("[action]/{id:int}")]
        public Region Region(int id)
        {
            return _service.GetRegion(id);
        }

        [HttpPost("[action]")]
        public Region SaveRegion(Region r)
        {
            return _service.SaveRegion(r);
        }

        [HttpPost("[action]")]
        public dynamic DeleteRegion(Region r)
        {
            _service.DeleteRegion(r);
            return new { Ok = true };
        }
    }
}
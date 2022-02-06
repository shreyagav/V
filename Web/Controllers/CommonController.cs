using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models.Context;
using Services.Interfaces;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : ControllerBase
    {
        INotificationService _service;
        UserManager<AspNetUser> _userManager;
        public CommonController(INotificationService service, UserManager<AspNetUser> userManager)
        {
            _service = service;
            _userManager = userManager;
        }
        [Authorize]
        [HttpGet("[action]/{eventId}")]
        public Notification[] EventNotification(int eventId)
        {
            return _service.GetEventNotifications(eventId);
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<Notification[]> AddNotification(Notification n)
        {
            var user = await _userManager.GetUserAsync(User);
            n.CreatedById = user.Id;
            _service.CreateNotification(n);
            if (n.EventId.HasValue)
            {
                return _service.GetEventNotifications(n.EventId.Value);
            }
            else if(n.EventSiteId != null)
            {
                return _service.GetSiteNotifications(n.EventSiteId);
            }
            else
            {
                return new Notification[0];
            }
            
        }
    }
}
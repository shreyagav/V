using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Dto;
using Services.Data;
using Services.Helpers;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<TRRUser> _userManager;
        private readonly ApplicationDbContext _ctx;
        public ProfileController(UserManager<TRRUser> userManager, ApplicationDbContext ctx)
        {
            _userManager = userManager;
            _ctx = ctx;
        }


        [HttpGet("[action]")]
        public async Task<UserProfileDto> Get()
        {
            var user = await _userManager.GetUserAsync(User);
            var result = new UserProfileDto(user);
            result.Events = _ctx.UserEvents.Include(a => a.Event).Include(a => a.Event.Site).Where(a => a.UserId == user.Id).Select(a => new EventListRow() { Name = a.Event.Name, Chapter = a.Event.Site.Name, Color = a.Event.Color, Date = a.Event.Date.ToString("d"), Id = a.Event.Id, Status = a.Event.Status, Time = $"{Converters.IntTimeToStr(a.Event.StartTime)} - {Converters.IntTimeToStr(a.Event.EndTime)}", Type = a.Event.EventType.Title }).ToArray();
            return result;
        }
        [HttpGet("[action]/{id}")]
        public async Task<UserProfileDto> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            var result = new UserProfileDto(user);
            result.Events = _ctx.UserEvents.Include(a => a.Event).Include(a=>a.Event.Site).Where(a => a.UserId == id).Select(a => new EventListRow() { Name = a.Event.Name, Chapter = a.Event.Site.Name, Color = a.Event.Color, Date = a.Event.Date.ToString("d"), Id = a.Event.Id, Status = a.Event.Status, Time = $"{Converters.IntTimeToStr(a.Event.StartTime)} - {Converters.IntTimeToStr(a.Event.EndTime)}", Type = a.Event.EventType.Title }).ToArray();
            return result;
        }

        [HttpPost("[action]")]
        public UserProfileDto[] GetFiltered(ProfileFilterDto filter)
        {
            var res = _ctx.Users.Include(a=>a.Site).Where(a =>
                (string.IsNullOrEmpty(filter.Name) || a.FirstName.Contains(filter.Name, StringComparison.OrdinalIgnoreCase)
                || a.LastName.Contains(filter.Name, StringComparison.OrdinalIgnoreCase)
                || a.Email.Contains(filter.Name, StringComparison.OrdinalIgnoreCase)
                || a.UserName.Contains(filter.Name, StringComparison.OrdinalIgnoreCase)
                )
                && ((filter.DateFrom.HasValue && a.DateOfBirth.HasValue && a.DateOfBirth.Value > filter.DateFrom.Value) || (!filter.DateFrom.HasValue && !a.DateOfBirth.HasValue))
                && ((filter.DateTo.HasValue && a.DateOfBirth.HasValue && a.DateOfBirth.Value < filter.DateTo.Value) || (!filter.DateTo.HasValue && !a.DateOfBirth.HasValue))
                && (!filter.Role.HasValue || a.OldType == filter.Role.Value)
                && (string.IsNullOrEmpty(filter.Zip) || (!string.IsNullOrEmpty(a.Zip) && a.Zip.Contains(filter.Zip, StringComparison.OrdinalIgnoreCase)))
                && (filter.Chapters == null || filter.Chapters.Length == 0 || filter.Chapters.Contains(a.SiteId.Value))
                )
                .Take(1000).Select(a => new UserProfileDto(a)).ToArray();
            return res;
        }

        [HttpPost("[action]")]
        public async Task<UserProfileDto> Set(UserProfileDto data)
        {
            var user = await _userManager.FindByIdAsync(data.Id);
            data.Map(user);
            await _userManager.UpdateAsync(user);
            return data;
        }
    }
}
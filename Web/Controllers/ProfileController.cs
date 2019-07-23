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
        [HttpGet("[action]/{id}")]
        public UserOptionDto[] GetUserOptions(string id)
        {
            return _ctx.UserOptions.Include(o => o.Option).Where(o => o.UserId == id).Select(o => new UserOptionDto { CategoryId = o.Option.OptionCategoryId, Description = o.Description, OptionId = o.OptionId }).ToArray();
        }

        [HttpPost("[action]/{id}")]
        public UserOptionDto[] DeleteUserOption(string id, UserOptionDto opt)
        {
            var temp = _ctx.UserOptions.FirstOrDefault(a => a.UserId == id && a.OptionId == opt.OptionId);
            _ctx.UserOptions.Remove(temp);
            _ctx.SaveChanges();
            return GetUserOptions(id);
        }

        [HttpPost("[action]/{id}")]
        public UserOptionDto[] AddUserOption(string id, UserOptionDto opt)
        {
            var temp = new UserOption()
            {
                Description = opt.Description,
                OptionId = opt.OptionId,
                UserId = id
            };
            _ctx.UserOptions.Add(temp);
            _ctx.SaveChanges();
            return GetUserOptions(id);
        }

        [HttpPost("[action]/{id}")]
        public UserOptionDto[] EditUserOption(string id, UserOptionDto opt)
        {
            var temp = _ctx.UserOptions.FirstOrDefault(a => a.UserId == id && a.OptionId == opt.OptionId);
            temp.Description = opt.Description;
            _ctx.SaveChanges();
            return GetUserOptions(id);
        }

        [HttpGet("[action]")]
        public OptionCategoryDto[] GetAllOptions()
        {
            var cat = _ctx.OptionCategories
                .Include(a=>a.Options)
                .Select(a=>new OptionCategoryDto {
                    CategoryId =a.Id,
                    CategoryName = a.Name,
                    Options =a.Options.Select(b=>new OptionDto {Id=b.Id,Name=b.Title,Description=b.Description}).ToArray()})
                .ToArray();
            return cat.Where(c=>c.Options.Length>0).ToArray();
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
            if(!string.IsNullOrEmpty(filter.Name))
                filter.Name = $"%{filter.Name}%";
            if (!string.IsNullOrEmpty(filter.Zip))
                filter.Zip = $"%{filter.Zip}%";

            var res = _ctx.Users.Include(a=>a.Site).Where(a =>
                (string.IsNullOrEmpty(filter.Name) || (EF.Functions.Like(a.FirstName,filter.Name)
                || EF.Functions.Like(a.LastName, filter.Name)
                || EF.Functions.Like(a.Email, filter.Name)
                || EF.Functions.Like(a.UserName, filter.Name)
                ))
                && (!filter.DateFrom.HasValue ||(a.DateOfBirth.HasValue && a.DateOfBirth.Value > filter.DateFrom.Value))
                && (!filter.DateTo.HasValue || (a.DateOfBirth.HasValue && a.DateOfBirth.Value < filter.DateTo.Value))
                && (!filter.Role.HasValue || a.OldType == filter.Role.Value)
                && (string.IsNullOrEmpty(filter.Zip) || (!string.IsNullOrEmpty(a.Zip) && EF.Functions.Like(a.Zip, filter.Zip)))
                && ((filter.Chapters == null || filter.Chapters.Length == 0) || filter.Chapters.Contains(a.SiteId.Value))
                )
                .Take(100).Select(a => new UserProfileDto(a)).ToArray();
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
﻿using System;
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
    public class SponsorDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Chapter { get; set; }
    }

    public class TRRInfoListsDto
    {
        public SponsorDto[] Sponsors { get; set; }
        public IdentityRole[] Roles { get; set; }
    }

    public class UserDiagnoseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<TRRUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _ctx;
        private IdentityRole[] roles;
        public ProfileController(UserManager<TRRUser> userManager, ApplicationDbContext ctx, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _ctx = ctx;
            _roleManager = roleManager;
            roles = _roleManager.Roles.ToArray();
        }

        [HttpGet("[action]")]
        public TRRInfoListsDto TRRInfoLists() {
            var result = new TRRInfoListsDto();
            result.Roles = _ctx.Roles.ToArray();
            result.Sponsors = _ctx.Users.Include(a => a.Site).Select(a => new SponsorDto() { Id = a.Id, Chapter = a.Site.Name, Name = $"{a.FirstName} {a.LastName}" }).ToArray();
            return result;
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


        [HttpGet("[action]/{id}")]
        public UserDiagnoseDto[] GetUserDiagnosis(string id)
        {
            return _ctx.UserDiagnoses.Where(o => o.UserId == id).Select(o => new UserDiagnoseDto { Name = o.Diagnosis.Description, Description = o.Note, Id=o.DiagnosisId }).ToArray();
        }

        [HttpPost("[action]/{id}")]
        public UserDiagnoseDto[] DeleteUserDiagnosis(string id, UserDiagnoseDto opt)
        {
            var temp = _ctx.UserDiagnoses.FirstOrDefault(a => a.UserId == id && a.DiagnosisId == opt.Id);
            _ctx.UserDiagnoses.Remove(temp);
            _ctx.SaveChanges();
            return GetUserDiagnosis(id);
        }

        [HttpPost("[action]/{id}")]
        public UserDiagnoseDto[] AddUserDiagnose(string id, UserDiagnoseDto opt)
        {
            var temp = new UserDiagnosis()
            {
                Note = opt.Description,
                DiagnosisId = opt.Id,
                UserId = id
            };
            _ctx.UserDiagnoses.Add(temp);
            _ctx.SaveChanges();
            return GetUserDiagnosis(id);
        }

        [HttpPost("[action]/{id}")]
        public UserOptionDto[] EditUserDiagnosis(string id, UserDiagnoseDto d)
        {
            var temp = _ctx.UserDiagnoses.FirstOrDefault(a => a.UserId == id && a.DiagnosisId == d.Id);
            temp.Note = d.Description;
            _ctx.SaveChanges();
            return GetUserOptions(id);
        }

        [HttpGet("[action]")]
        public Diagnosis[] GetAllDiagnosis()
        {
            return _ctx.Diagnoses
                .ToArray();
        }



        [HttpGet("[action]")]
        public async Task<UserProfileDto> Get()
        {
            var user = await _userManager.GetUserAsync(User);
            var result = await get(user);
            result.Events = _ctx.UserEvents.Include(a => a.Event).Include(a => a.Event.Site).Where(a => a.UserId == user.Id).Select(a => new EventListRow() { Name = a.Event.Name, Chapter = a.Event.Site.Name, Color = a.Event.EventType.Color, Date = a.Event.Date.ToString("d"), Id = a.Event.Id, Status = a.Event.Status, Time = $"{Converters.IntTimeToStr(a.Event.StartTime)} - {Converters.IntTimeToStr(a.Event.EndTime)}", Type = a.Event.EventType.Title }).ToArray();
            return result;
        }
        [HttpGet("[action]/{id}")]
        public async Task<UserProfileDto> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            var result = await get(user);
            result.Events = _ctx.UserEvents.Include(a => a.Event).Include(a=>a.Event.Site).Where(a => a.UserId == id).Select(a => new EventListRow() { Name = a.Event.Name, Chapter = a.Event.Site.Name, Color = a.Event.EventType.Color, Date = a.Event.Date.ToString("d"), Id = a.Event.Id, Status = a.Event.Status, Time = $"{Converters.IntTimeToStr(a.Event.StartTime)} - {Converters.IntTimeToStr(a.Event.EndTime)}", Type = a.Event.EventType.Title }).ToArray();
            return result;
        }

        private async Task<UserProfileDto> get(TRRUser user)
        {
            var result = new UserProfileDto(user);
            result.Roles = (await _userManager.GetRolesAsync(user)).Select(a => roles.First(b => b.Name == a).Id).ToArray();
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
                .Take(1000).Select(a => new UserProfileDto(a)).ToArray();
            return res;
        }

        [HttpPost("[action]")]
        public async Task<UserProfileDto> Set(UserProfileDto data)
        {
            var user = await _userManager.FindByIdAsync(data.Id);
            data.Map(user);
            await _userManager.UpdateAsync(user);
            var currentRoles = await _userManager.GetRolesAsync(user);
            var toRemoveIds = roles.Select(a => a.Id).Except(data.Roles);
            var names = roles.Where(a => toRemoveIds.Contains(a.Id)).Select(a=>a.Name).Intersect(currentRoles);
            var res = await _userManager.RemoveFromRolesAsync(user, names);
            var toAdd = roles.Where(a => data.Roles.Contains(a.Id)).Select(a => a.Name).Except(currentRoles);
            res = await _userManager.AddToRolesAsync(user, toAdd);
            return data;
        }
    }
}
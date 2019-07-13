using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Services.Data;

namespace Web.Controllers
{
    public class MemeberReportLine
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? Joined { get; set; }
        public string Phone { get; set; }
        public string Chapter { get; set; }
        public string Comments { get; set; }
        public string Address { get; set; }
        public string Medical { get; set; }
        public string Gender { get; set; }
        public string Type { get; set; }
        public bool Active { get; set; }
        public string[] Options { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _ctx;
        public ReportsController(ApplicationDbContext ctx)
        {
            _ctx = ctx;
        }

        [HttpGet("[action]")]
        public async Task<MemeberReportLine[]> Members()
        {
            var res = _ctx.Users.Include(a => a.Site).Include(a => a.Options).Include("Options.Option").Include("Options.Option.Category")
                .Select(a=>new MemeberReportLine() {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                    Email = a.Email,
                    DateOfBirth = a.DateOfBirth,
                    Joined=a.JoinDate,
                    Options = a.Options.Select(b=>$"{b.Option.Category.Name}-{b.Option.Title}").ToArray(),
                    Chapter = a.Site.Name,
                    Phone = a.PhoneNumber,
                    Comments = a.Comments,
                    Address = a.Address,
                    UserName = a.UserName,
                    Gender = a.Gender == 'F' ? "Female" : "Male",
                    Type = a.OldType.ToString()
                })
                .ToArray();
            //var temp = res.Where(a => a.Options.Count > 2).ToArray();
            return res;
        }
    }
}
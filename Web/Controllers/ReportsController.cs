using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Services;
using Services.Data;

namespace Web.Controllers
{
    public class DateRange
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
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

    public class PivotResult
    {
        public List<KeyValuePair<string, string>> Columns { get; set; }
        public DataTable Data { get; set; }
    }

    public class VeteransBySite
    {
        public string Name { get; set; }
        public int Unique { get; set; }
        public int Attendance { get; set; }
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
        [HttpGet("[action]/{search}")]
        public MemeberReportLine[] MembersWithSearch(string search) {
            return _ctx.Users.Include(a => a.Site).Include(a => a.Options).Include("Options.Option").Include("Options.Option.Category")
                .Where(a=>a.FirstName.Contains(search) || a.LastName.Contains(search) || a.Email.Contains(search))
                .Select(a => new MemeberReportLine()
                {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                    Email = a.Email,
                    DateOfBirth = a.DateOfBirth,
                    Joined = a.JoinDate,
                    Options = a.Options.Select(b => $"{b.Option.Category.Name}-{b.Option.Title}").ToArray(),
                    Chapter = a.Site.Name,
                    Phone = a.PhoneNumber,
                    Comments = a.Comments,
                    Address = a.Address,
                    UserName = a.UserName,
                    Gender = a.Gender == 'F' ? "Female" : "Male",
                    Type = a.OldType.ToString()
                })
                .ToArray();
        }
        [HttpGet("[action]")]
        public MemeberReportLine[] Members()
        {
            var res = _ctx.Users.Include(a => a.Site).Include(a => a.Options).Include("Options.Option").Include("Options.Option.Category").Where(a=>a.Active && !a.Deleted)
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
        [HttpGet("[action]")]
        public ActionResult MembersToExcel()
        {
            return File(ExcelService.GetExcel(Members()), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "MembersReport.xlsx");
        }

        [HttpPost("[action]")]
        public PivotResult EventsByType(DateRange range)
        {
            var columns = _ctx.CalendarEventTypes.Select(a=> new KeyValuePair<string, string>(a.Id.ToString(), a.Title)).ToList();
            columns.Insert(0, new KeyValuePair<string, string>("name", "Site Name"));
            columns.Insert(1, new KeyValuePair<string, string>("total", "All"));
            var data = ToPivotTable(_ctx.CalendarEvents.Include(a => a.Site).Where(a=>a.Date>=range.Start && a.Date<=range.End).ToArray(), item => item.EventTypeId, item => item.Site.Name, items => items.Any() ? items.Count() : 0);
            var result = new PivotResult() { Columns = columns, Data = data };
            return result;
        }

        [HttpPost("[action]")]
        public ActionResult EventsByTypeToExcel(DateRange range)
        {
            var res = EventsByType(range);
            Dictionary<string, string> cols = new Dictionary<string, string>();
            foreach (var c in res.Columns)
                cols.Add(c.Key, c.Value);
            return File(ExcelService.GetExcel(res.Data, cols), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "EventsByType.xlsx");
        }
        [HttpPost("[action]")]
        public dynamic[] VeteransBySite(DateRange range)
        {
            var ids = new int[] { 32, 37 };

            var siteVeterans = _ctx.Users.Include(a => a.Site).Include(a => a.Options).Where(a => a.Options.Any(b => ids.Contains(b.OptionId))).GroupBy(a => a.SiteId).Select(a => new { SiteId = a.Key, Count = a.Count() }).ToArray();
            var veteranAttendance = _ctx.Users
                .Include(a => a.Site)
                .Include(a => a.Options)
                .Include(a => a.Events)
                .Where(a => a.Options.Any(b => ids.Contains(b.OptionId)) && a.Events.Any(b => b.Attended.HasValue && b.Attended.Value && b.Event.Date>=range.Start && b.Event.Date<=range.End))
                .Select(a => new { a.SiteId, a.Events.Count }).ToArray();

            veteranAttendance = veteranAttendance.GroupBy(a=>a.SiteId).Select(a=>new { SiteId = a.Key, Count = a.Sum(b=>b.Count)}).ToArray();
            var sites = _ctx.EventSites.ToList();
            return sites.GroupJoin(siteVeterans, a => a.Id, b => b.SiteId, (a, b) => new { a.Id, a.Name, Count = b.Sum(c=>c.Count) }).GroupJoin(veteranAttendance, a=>a.Id,a=>a.SiteId, (a,b)=>new VeteransBySite() { Name = a.Name, Unique = a.Count, Attendance  = b.Sum(c=>c.Count)}).ToArray();
        }
        [HttpPost("[action]")]
        public ActionResult VeteransBySiteToExcel(DateRange range)
        {
            return File(ExcelService.GetExcel(VeteransBySite(range)), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "VeteransBySite.xlsx");
        }
        [HttpPost("[action]")]
        public dynamic[] VeteransAttandance(DateRange range)
        {
            var ids = new int[] { 32, 37 };

            //var siteVeterans = _ctx.Users.Include(a => a.Site).Include(a => a.Options).Where(a => a.Options.Any(b => ids.Contains(b.OptionId))).GroupBy(a => a.SiteId).Select(a => new { SiteId = a.Key, Count = a.Count() }).ToArray();
            var veteranAttendance = _ctx.Users
                .Include(a => a.Site)
                .Include(a => a.Options)
                .Include(a => a.Events)
                .Where(a => a.Options.Any(b => ids.Contains(b.OptionId)) && a.Events.Any(b => b.Attended.HasValue && b.Attended.Value))
                .Select(a => new VeteranAttendance() { Id= a.Id, FirstName= a.FirstName, LastName = a.LastName, Chapter = a.Site.Name, Address = a.Address, Zip = a.Zip, Attendance = a.Events.Where(b=> b.Event.Date >= range.Start && b.Event.Date <= range.End).Count() }).ToArray();
            return veteranAttendance;
        }
        [HttpPost("[action]")]
        public ActionResult VeteransAttandanceToExcel(DateRange range)
        {
            return File(ExcelService.GetExcel(VeteransAttandance(range)), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "VeteransAttandance.xlsx");
        }
        public static DataTable ToPivotTable<T, TColumn, TRow, TData>(
    IEnumerable<T> source,
    Func<T, TColumn> columnSelector,
    Expression<Func<T, TRow>> rowSelector,
    Func<IEnumerable<T>, TData> dataSelector)
        {
            DataTable table = new DataTable();
            var rowName = ((MemberExpression)rowSelector.Body).Member.Name;
            table.Columns.Add(new DataColumn(rowName));
            table.Columns.Add("Total",0.GetType());
            var columns = source.Select(columnSelector).Distinct();

            foreach (var column in columns)
                table.Columns.Add(new DataColumn(column.ToString(),0.GetType()));

            var rows = source.GroupBy(rowSelector.Compile())
                             .Select(rowGroup => new
                             {
                                 Key = rowGroup.Key,
                                 Total = rowGroup.Count(),
                                 Values = columns.GroupJoin(
                                     rowGroup,
                                     c => c,
                                     r => columnSelector(r),
                                     (c, columnGroup) => dataSelector(columnGroup))
                             });

            foreach (var row in rows)
            {
                var dataRow = table.NewRow();
                var items = row.Values.Cast<object>().ToList();
                items.Insert(0, row.Key);
                items.Insert(1, row.Total);
                dataRow.ItemArray = items.ToArray();
                table.Rows.Add(dataRow);
            }

            return table;
        }
    }

    internal class VeteranAttendance
    {
        public VeteranAttendance()
        {
        }

        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Chapter { get; set; }
        public string Address { get; set; }
        public string Zip { get; set; }
        public int Attendance { get; set; }
    }
}
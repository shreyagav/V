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
using Models.Context;
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
        public string EmergencyContactName { get; internal set; }
        public string EmergencyContactEmail { get; internal set; }
        public string EmergencyContactPhone { get; internal set; }
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
            return _ctx.AspNetUsers.Include(a => a.Site).Include(a => a.UserOptions).Include("Options.Option").Include("Options.Option.Category")
                .Where(a=>a.FirstName.Contains(search) || a.LastName.Contains(search) || a.Email.Contains(search))
                .Select(a => new MemeberReportLine()
                {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                    Email = a.Email,
                    DateOfBirth = a.DateOfBirth,
                    Joined = a.JoinDate,
                    Options = a.UserOptions.Select(b => $"{b.Option.OptionCategory.Name}-{b.Option.Title}").ToArray(),
                    Chapter = a.Site.Name,
                    Phone = a.PhoneNumber,
                    Comments = a.Comments,
                    Address = a.Address,
                    UserName = a.UserName,
                    Gender = a.Gender == "F" ? "Female" : "Male",
                    Type = a.OldType.ToString()
                }).OrderBy(a=>a.FirstName).ThenBy(a=>a.LastName)
                .ToArray();
        }

        [HttpGet("[action]")]
        public MemeberReportLine[] Members()
        {
            var res = _ctx.AspNetUsers.Include(a => a.Site).Include(a => a.UserOptions).Include(a=>a.EmergencyContact).Include("Options.Option").Include("Options.Option.Category").Where(a=>a.Active && !a.Deleted)
                .Select(a=>new MemeberReportLine() {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                    Email = a.Email,
                    DateOfBirth = a.DateOfBirth,
                    Joined=a.JoinDate,
                    Options = a.UserOptions.Select(b=>$"{b.Option.OptionCategory.Name}-{b.Option.Title}").ToArray(),
                    Chapter = a.Site.Name,
                    Phone = a.PhoneNumber,
                    Comments = a.Comments,
                    Address = a.Address,
                    UserName = a.UserName,
                    Gender = a.Gender == "F" ? "Female" : "Male",
                    Type = a.OldType.ToString(),
                    EmergencyContactName=a.EmergencyContact.Name,
                    EmergencyContactEmail = a.EmergencyContact.Email,
                    EmergencyContactPhone = a.EmergencyContact.Phone
                }).OrderBy(a => a.FirstName).ThenBy(a => a.LastName)
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
            var data = ToPivotTable(_ctx.CalendarEvents.Include(a => a.Site).Where(a=>a.Date>=range.Start && a.Date<=range.End && a.Status != (int)EventStatus.Deleted).ToArray(), item => item.EventTypeId, item => item.Site.Name, items => items.Any() ? items.Count() : 0);
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
        public PivotResult VeteransByEventType(DateRange range)
        {
            var columns = _ctx.CalendarEventTypes.Select(a => new KeyValuePair<string, string>(a.Id.ToString(), a.Title)).ToList();
            columns.Insert(0, new KeyValuePair<string, string>("name", "Veteran Name"));
            columns.Insert(1, new KeyValuePair<string, string>("total", "All"));
            var veterans = _ctx.Veterans();
            var veteransWithEvents = (from a in _ctx.EventSites
                                      join b in _ctx.CalendarEvents on a.Id equals b.SiteId
                                      join c in _ctx.UserEvents on b.Id equals c.EventId
                                      join d in veterans on c.UserId equals d.Id
                                      where b.Date >= range.Start && b.Date <= range.End && !a.Deleted && b.Status != (int)EventStatus.Deleted
                                      orderby d.FirstName,d.LastName
                                      select new { d.Id, Name = d.FirstName + " " + d.LastName, b.EventTypeId, Duration = ((double)(60 * b.EndTime / 100 + b.EndTime % 100 - 60 * b.StartTime / 100 + b.StartTime % 100)) / 60 }).ToArray();

            var data = ToPivotTable(veteransWithEvents, item => item.EventTypeId, item => item.Name, items => items.Any() ? items.Count() : 0);
            var result = new PivotResult() { Columns = columns, Data = data };
            return result;
        }
        [HttpPost("[action]")]
        public ActionResult VeteransByEventTypeToExcel(DateRange range)
        {
            var res = VeteransByEventType(range);
            Dictionary<string, string> cols = new Dictionary<string, string>();
            foreach (var c in res.Columns)
                cols.Add(c.Key, c.Value);
            return File(ExcelService.GetExcel(res.Data, cols), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "VeteransByEventType.xlsx");
        }
        [HttpPost("[action]")]
        public dynamic[] VeteransBySite(DateRange range)
        {
            var veterans = _ctx.Veterans();
            var veteransBySite = (from a in _ctx.EventSites
                                  join b in _ctx.CalendarEvents on a.Id equals b.SiteId
                                  join c in _ctx.UserEvents on b.Id equals c.EventId
                                  join d in veterans on c.UserId equals d.Id
                                  where b.Date >= range.Start && b.Date <= range.End && !a.Deleted && b.Status != (int)EventStatus.Deleted
                                  group c by a.Id into newGroup
                                  select new { SiteId = newGroup.Key, Count = newGroup.Count() }).ToArray();

            var uniqueVeteransBySiteFlat = (from a in _ctx.EventSites
                                            join b in _ctx.CalendarEvents on a.Id equals b.SiteId
                                            join c in _ctx.UserEvents on b.Id equals c.EventId
                                            join d in veterans.Distinct() on c.UserId equals d.Id
                                            where b.Date >= range.Start && b.Date <= range.End && !a.Deleted && b.Status != (int)EventStatus.Deleted
                                            select new { SiteId = a.Id, UserId = c.UserId }).Distinct().OrderBy(a=>a.SiteId).ToArray();
            var uniqueVeteransBySite = from a in uniqueVeteransBySiteFlat
                                       group a by a.SiteId into newGroup
                                       select new { SiteId = newGroup.Key, Count = newGroup.Count() };

            var result = (from a in veteransBySite
                          join b in uniqueVeteransBySite on a.SiteId equals b.SiteId
                          join c in _ctx.EventSites on a.SiteId equals c.Id
                          select new VeteransBySite (){ Name = c.Name, Unique = b.Count, Attendance = a.Count }).OrderBy(a => a.Name).ToArray();
            return result;
        }
        [HttpPost("[action]")]
        public ActionResult VeteransBySiteToExcel(DateRange range)
        {
            return File(ExcelService.GetExcel(VeteransBySite(range)), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "VeteransBySite.xlsx");
        }
        [HttpPost("[action]")]
        public dynamic[] VeteransAttandance(DateRange range)
        {
            var veterans = _ctx.Veterans();
            var veteransWithAttendance = (from a in _ctx.EventSites
                        join b in _ctx.CalendarEvents on a.Id equals b.SiteId
                        join c in _ctx.UserEvents on b.Id equals c.EventId
                        join d in veterans on c.UserId equals d.Id
                        where b.Date >= range.Start && b.Date <= range.End && !a.Deleted && b.Status != (int)EventStatus.Deleted
                        select new { User = d, a.Id}).ToArray().GroupBy(a => a.User).Select(a => new { User = a.Key, Count = a.Count() });
            var events = _ctx.EventSites.ToArray();

            var result =   from va in veteransWithAttendance
                          join site in events on va.User.SiteId equals site.Id
                          select new VeteranAttendance() { Id = va.User.Id, FirstName = va.User.FirstName, LastName = va.User.LastName, Chapter = site.Name, Address = va.User.Address, Zip = va.User.Zip, Attendance = va.Count };

            return result.OrderBy(a=>a.FirstName).ThenBy(a=>a.LastName).ToArray();
        }
        [HttpPost("[action]")]
        public ActionResult VeteransAttandanceToExcel(DateRange range)
        {
            return File(ExcelService.GetExcel( VeteransAttandance(range)), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "VeteransAttandance.xlsx");
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
using Microsoft.EntityFrameworkCore;
using Models;
using Services.Data;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class ImportService : IImportService
    {
        private ApplicationDbContext _context;

        public ApplicationDbContext GetContext() => _context;

        public ImportService(ApplicationDbContext context)=> _context = context;

        public OptionCategory[] GetAllCategories() => _context.OptionCategories.ToArray();
        public Diagnosis[] GetAllDiagnoses() => _context.Diagnoses.ToArray();
        public void AddRole(TRRRole role)
        {
            
        }
        public void ImportUserDiagnoses(UserDiagnosis[] diag)
        {
            _context.UserDiagnoses.AddRange(diag);
            _context.SaveChanges();
        }
        public void ImportOptionCategories(OptionCategory[] options)
        {
            _context.OptionCategories.AddRange(options);
            _context.SaveChanges();
        }

        public void ImportOptions(Option[] opts)
        {
            _context.Options.AddRange(opts);
            _context.SaveChanges();
        }

        public void ImportUserOptions(UserOption[] uopts)
        {
            _context.UserOptions.AddRange(uopts);
            _context.SaveChanges();
        }
        public void ImportSystemCodes(SystemCode[] codes)
        {
            _context.SystemCodes.AddRange(codes);
            _context.Diagnoses.AddRange(codes.Where(c => c.CodeType == "D").Select(d => new Diagnosis() { Description = d.Description, OldId = d.OldId }));
            _context.SaveChanges();
        }

        public Option[] GetAllOptions() => _context.Options.ToArray();

        public TRRUser[] GetAllUsers() => _context.Users.Where(a=>!a.Deleted).OrderBy(a=>a.FirstName).ThenBy(a=>a.LastName).ToArray();

        public void ImportEvent(CalendarEvent newEvent)
        {
            _context.CalendarEvents.Add(newEvent);
            _context.SaveChanges();
        }
        public void ImportEvents(IEnumerable<CalendarEvent> newEvents)
        {
             _context.CalendarEvents.AddRange(newEvents);
             _context.SaveChanges();
        }

        public string[] ImportUserEvents(IEnumerable<ImportUserEvent> list)
        {
            List<string> errors = new List<string>();
            List<UserEvent> userEvents = new List<UserEvent>();
            foreach (var usr in list)
            {
                try
                {
                    var user = _context.Users.FirstOrDefault(u => u.OldId == usr.UserId);
                    if (user == null) throw new Exception($"Event attendee couldn't be found userId={usr.UserId}");
                    var createdBy = _context.Users.FirstOrDefault(u => u.OldId == usr.CreatedById);
                    //if (createdBy == null) throw new Exception($"Author couldn't be found authorId={usr.CreatedById}");
                    var evt = _context.CalendarEvents.FirstOrDefault(e => e.OldId == usr.EventId);
                    if (evt == null) throw new Exception($"Event couldn't be found eventId={usr.EventId}");
                    var temp = new UserEvent()
                    {
                        UserId = user.Id,
                        EventId = evt.Id,
                        Attended = usr.UserAttended,
                        CreatedById = createdBy?.Id,
                        Comment = usr.Comment,
                        Created = usr.Created,
                        OldEventId = usr.EventId,
                        OldUserId = usr.UserId
                    };
                    //userEvents.Add(temp);
                    _context.UserEvents.Add(temp);
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    if (ex.InnerException != null)
                        Console.WriteLine(ex.InnerException.Message);
                    errors.Add(ex.Message);
                }
            }
            //_context.UserEvents.AddRange(userEvents.ToArray());
            //_context.SaveChanges();
            return errors.ToArray();
            //if(withUpdate)
        }

        public async Task ImportUsers(IEnumerable<TRRUser> newUsers)
        {
            try
            {
                _context.Users.AddRange(newUsers);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex.Message);
            }
        }
    }
}

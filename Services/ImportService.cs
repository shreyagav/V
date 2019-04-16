using Models;
using Services.Data;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Services
{
    public class ImportService : IImportService
    {
        private ApplicationDbContext _context;
        public ImportService(ApplicationDbContext context)
        {
            _context = context;
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
                    if (createdBy == null) throw new Exception($"Author couldn't be found authorId={usr.CreatedById}");
                    var evt = _context.CalendarEvents.FirstOrDefault(e => e.OldId == usr.EventId);
                    if (evt == null) throw new Exception($"Event couldn't be found eventId={usr.EventId}");
                    var temp = new UserEvent()
                    {
                        UserId = user.Id,
                        EventId = evt.Id,
                        Attended = usr.UserAttended,
                        CreatedBy = createdBy,
                        Comment = usr.Comment,
                        Created = usr.Created
                    };
                    userEvents.Add(temp);
                }
                catch (Exception ex)
                {
                    errors.Add(ex.Message);
                }
            }
            _context.UserEvents.AddRange(userEvents.ToArray());
            _context.SaveChanges();
            return errors.ToArray();
            //if(withUpdate)
        }

    }
}

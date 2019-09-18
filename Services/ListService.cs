using Models;
using Services.Data;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Services
{
    public class ListService : IListService
    {
        private readonly ApplicationDbContext _ctx;
        public ListService(ApplicationDbContext context)
        {
            _ctx = context;
        }

        public CalendarEventType[] EventTypes()
        {
            return _ctx.CalendarEventTypes.OrderBy(a=>a.Order).ToArray();
        }
    }
}

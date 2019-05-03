using Models.Dto;
using Services.Data;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services
{
    public class EventService : IEventService
    {
        private ApplicationDbContext _context;
        public EventService(ApplicationDbContext context)
        {
            _context = context;
        }

        public MainEventDto CreateEvent(MainEventDto data)
        {
            throw new NotImplementedException();
        }
    }
}

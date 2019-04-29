using Models.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    interface IEventService
    {
        MainEventDto CreateEvent(MainEventDto data);

    }
}

using Models.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface IEventService
    {
        EventMainDto ChangeEvent(EventMainDto data);
        EventMainDto GetEvent(int id);
    }
}

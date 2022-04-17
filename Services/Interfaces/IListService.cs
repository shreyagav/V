using Models.Context;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface IListService
    {
        CalendarEventType[] EventTypes();
    }
}

using Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    interface IImportService
    {
        string[] ImportUserEvents(IEnumerable<ImportUserEvent> list);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public enum EventStatus { Draft, Published, Canceled, Deleted };
    public enum TRRUserType { Veteran = 53, Civilian = 54, VeteranFamily = 55 };
    public enum Medical { Inpatient = 42, Outpatient = 43, VetCenter = 44, Other = 45, None = 46, Unknown = 94 };
}

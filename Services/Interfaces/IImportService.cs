using Models;
using Services.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IImportService
    {
        ApplicationDbContext GetContext();
        string[] ImportUserEvents(IEnumerable<ImportUserEvent> list);
        void ImportOptionCategories(OptionCategory[] options);
        OptionCategory[] GetAllCategories();
        void ImportOptions(Option[] opts);
        void ImportUserOptions(UserOption[] uopts);
        Option[] GetAllOptions();
        Diagnosis[] GetAllDiagnoses();
        TRRUser[] GetAllUsers();
        void ImportSystemCodes(SystemCode[] codes);
        void ImportUserDiagnoses(UserDiagnosis[] diag);
        void AddRole(TRRRole role);
        void ImportEvents(IEnumerable<CalendarEvent> newEvents);
        void ImportEvent(CalendarEvent newEvents);
        Task ImportUsers(IEnumerable<TRRUser> newUsers);
    }
}

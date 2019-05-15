using Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface IImportService
    {
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
    }
}

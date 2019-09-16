using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IMailService
    {
        Task Send(string subject, string plain, string html,
            (string Email, string Name) from,
            (string Email, string Name)[] to,
            (string Email, string Name)[] cc = null, (string Email, string Name)[] bcc = null);
    }
}

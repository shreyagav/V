using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IStorageService
    {
        Task<string> SaveFile(string name, Stream stream);
        Task<byte[]> GetFile(string name);
    }
}

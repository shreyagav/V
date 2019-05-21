using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.File;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class StorageService : IStorageService
    {
        private readonly IConfiguration _config;
        public StorageService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<string> SaveFile(string name, Stream stream)
        {
            var storageAccount = CloudStorageAccount.Parse(_config.GetConnectionString("StorageConnection"));
            CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
            CloudFileShare share = fileClient.GetShareReference("photos");
            await share.CreateIfNotExistsAsync();
            CloudFileDirectory rootDir = share.GetRootDirectoryReference();
            CloudFile file = rootDir.GetFileReference(name);
            await file.UploadFromStreamAsync(stream);
            return file.Uri.ToString();
        }
    }
}

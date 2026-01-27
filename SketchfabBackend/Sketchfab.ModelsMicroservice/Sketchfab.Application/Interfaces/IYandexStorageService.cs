using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Application.Interfaces
{
    public interface IYandexStorageService
    {   
        Task<Dictionary<string,string>>GetDownloadLinksAsync(List<string> modelNames);
        Task<string> GetDownloadLink(string modelName);
        Task<string> GetUploadLink(string modelName);
    }
}

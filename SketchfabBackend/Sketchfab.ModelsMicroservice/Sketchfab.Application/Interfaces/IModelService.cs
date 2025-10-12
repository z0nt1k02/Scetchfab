
using Microsoft.AspNetCore.Http;
using Sketchfab.Application.Dtos;

namespace Sketchfab.Application.Interfaces;
public interface IModelService
{
    Task<ShortModelDto> DownloadModel(Guid id);
    Task<string> UploadModel(string title, string modelName, string creatorId, string creatorName);   
    Task<List<ShortModelDto>> GetModels(int page, int pageSize);
}
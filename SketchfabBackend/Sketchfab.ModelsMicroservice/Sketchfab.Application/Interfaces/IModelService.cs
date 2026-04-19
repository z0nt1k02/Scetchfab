
using Microsoft.AspNetCore.Http;
using Sketchfab.Application.Dtos;

namespace Sketchfab.Application.Interfaces;
public interface IModelService
{
    Task<ShortModelDto?> DownloadModel(Guid id);
    Task<bool> UpdateViewerConfig(Guid id, string? viewerConfig);
    Task<string> UploadModel(string title, string modelName, string creatorId, string creatorName, string? viewerConfig = null);
    Task<List<ShortModelDto>> GetModels(int page, int pageSize);
}
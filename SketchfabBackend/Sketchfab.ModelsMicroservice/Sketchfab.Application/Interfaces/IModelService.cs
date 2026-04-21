
using Microsoft.AspNetCore.Http;
using Sketchfab.Application.Dtos;

namespace Sketchfab.Application.Interfaces;
public interface IModelService
{
    Task<ShortModelDto?> DownloadModel(Guid id);
    Task<bool> UpdateViewerConfig(Guid id, string? viewerConfig);
    Task<Dictionary<string, string>> UploadModel(string title, string modelName, string creatorId, string creatorName, string? viewerConfig = null, string? category = null, List<string>? tags = null);
    Task<List<ShortModelDto>> GetModels(int page, int pageSize, string? q = null, string? category = null, string? tag = null);
}
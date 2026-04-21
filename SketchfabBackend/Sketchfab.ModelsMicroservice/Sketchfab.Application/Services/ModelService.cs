using Sketchfab.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Sketchfab.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Http;
using System.Text.Json;
using System.Net.Http.Json;
using Sketchfab.Application.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace Sketchfab.Application.Services
{
    public class ModelService(IConfiguration configuration, ISketchfabDbContext context, IHttpClientFactory httpClientFactory, IYandexStorageService yandexStorageService) : IModelService
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly ISketchfabDbContext _context = context;
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly IYandexStorageService _yandexStorageService = yandexStorageService;

        public async Task<List<ShortModelDto>> GetModels(int page, int pageSize, string? q = null, string? category = null, string? tag = null)
        {
            var query = _context.Models.AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var needle = q.Trim().ToLower();
                query = query.Where(m => m.Title.ToLower().Contains(needle));
            }
            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(m => m.Category == category);
            }
            if (!string.IsNullOrWhiteSpace(tag))
            {
                query = query.Where(m => m.Tags.Contains(tag));
            }

            var modelsDb = await query
                .OrderBy(m => m.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var allNames = modelsDb.Select(m => m.ModelName)
                .Concat(modelsDb.Where(m => m.PreviewName != null).Select(m => m.PreviewName!))
                .Distinct()
                .ToList();

            var links = allNames.Count > 0
                ? await _yandexStorageService.GetDownloadLinksAsync(allNames)
                : new Dictionary<string, string>();

            var ids = modelsDb.Select(m => m.Id).ToList();
            var likeCounts = await _context.Likes
                .Where(l => ids.Contains(l.ModelId))
                .GroupBy(l => l.ModelId)
                .Select(g => new { ModelId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.ModelId, x => x.Count);
            var commentCounts = await _context.Comments
                .Where(c => ids.Contains(c.ModelId))
                .GroupBy(c => c.ModelId)
                .Select(g => new { ModelId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.ModelId, x => x.Count);

            var result = modelsDb.Select(m =>
            {
                var modelLink = links.GetValueOrDefault(m.ModelName);
                var previewLink = m.PreviewName != null ? links.GetValueOrDefault(m.PreviewName) : null;
                return new ShortModelDto(
                    m.Id.ToString(),
                    m.Title,
                    modelLink!,
                    m.CreatorName,
                    m.ModelName,
                    m.ViewerConfig,
                    previewLink,
                    m.Category,
                    m.Tags,
                    likeCounts.GetValueOrDefault(m.Id, 0),
                    commentCounts.GetValueOrDefault(m.Id, 0),
                    m.ViewCount,
                    m.DownloadCount);
            }).ToList();

            return result;
        }

        public async Task<ShortModelDto?> DownloadModel(Guid id)
        {
            var modelDb = await _context.Models.FindAsync(id);
            if (modelDb == null) return null;

            var names = new List<string> { modelDb.ModelName };
            if (modelDb.PreviewName != null) names.Add(modelDb.PreviewName);

            var links = await _yandexStorageService.GetDownloadLinksAsync(names);
            var modelUrl = links.GetValueOrDefault(modelDb.ModelName)
                ?? throw new Exception("Не удалось получить ссылку для загрузки");
            var previewUrl = modelDb.PreviewName != null ? links.GetValueOrDefault(modelDb.PreviewName) : null;

            var likeCount = await _context.Likes.CountAsync(l => l.ModelId == modelDb.Id);
            var commentCount = await _context.Comments.CountAsync(c => c.ModelId == modelDb.Id);

            return new ShortModelDto(
                modelDb.Id.ToString(),
                modelDb.Title,
                modelUrl,
                modelDb.CreatorName,
                modelDb.ModelName,
                modelDb.ViewerConfig,
                previewUrl,
                modelDb.Category,
                modelDb.Tags,
                likeCount,
                commentCount,
                modelDb.ViewCount,
                modelDb.DownloadCount);
        }

        public async Task<bool> UpdateViewerConfig(Guid id, string? viewerConfig)
        {
            var entity = await _context.Models.FindAsync(id);
            if (entity == null) return false;
            entity.ViewerConfig = viewerConfig;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Dictionary<string, string>> UploadModel(string title, string modelName, string creatorId, string creatorName, string? viewerConfig = null, string? category = null, List<string>? tags = null)
        {
            ModelEntity entity = ModelEntity.Create(title, modelName, Guid.Parse(creatorId), creatorName);
            entity.ViewerConfig = viewerConfig;
            entity.Category = category;
            entity.Tags = tags ?? new List<string>();

            var previewName = $"{entity.Id}_preview.png";
            entity.PreviewName = previewName;

            var modelUploadUrl = await _yandexStorageService.GetUploadLink(modelName);
            var previewUploadUrl = await _yandexStorageService.GetUploadLink(previewName);

            await _context.Models.AddAsync(entity);
            await _context.SaveChangesAsync();

            return new Dictionary<string, string>
            {
                ["model"] = modelUploadUrl,
                ["preview"] = previewUploadUrl,
                ["id"] = entity.Id.ToString()
            };
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Sketchfab.Application.Dtos;
using Sketchfab.Application.Interfaces;
using Sketchfab.Core.Entities;

namespace Sketchfab.Application.Services
{
    public class ImageAssetService(ISketchfabDbContext context, IYandexStorageService storage) : IImageAssetService
    {
        private readonly ISketchfabDbContext _context = context;
        private readonly IYandexStorageService _storage = storage;

        public async Task<CreateImageAssetResponse> Upload(
            string title,
            string fileName,
            string creatorId,
            string creatorName,
            string? category,
            List<string>? tags)
        {
            var entity = ImageAssetEntity.Create(title, fileName, Guid.Parse(creatorId), creatorName);
            entity.Category = category;
            entity.Tags = tags ?? new List<string>();

            var storageKey = $"{entity.Id}_{fileName}";
            entity.FileName = storageKey;

            var uploadUrl = await _storage.GetUploadLink(storageKey);

            await _context.ImageAssets.AddAsync(entity);
            await _context.SaveChangesAsync();

            return new CreateImageAssetResponse(entity.Id.ToString(), uploadUrl);
        }

        public async Task<List<ImageAssetDto>> GetAll(int page, int pageSize, string? q = null, string? category = null, string? tag = null)
        {
            var query = _context.ImageAssets.AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var needle = q.Trim().ToLower();
                query = query.Where(i => i.Title.ToLower().Contains(needle));
            }
            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(i => i.Category == category);
            }
            if (!string.IsNullOrWhiteSpace(tag))
            {
                query = query.Where(i => i.Tags.Contains(tag));
            }

            var items = await query
                .OrderByDescending(i => i.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            if (items.Count == 0) return new List<ImageAssetDto>();

            var names = items.Select(i => i.FileName).Distinct().ToList();
            var links = await _storage.GetDownloadLinksAsync(names);

            var ids = items.Select(i => i.Id).ToList();
            var likeCounts = await _context.ImageLikes
                .Where(l => ids.Contains(l.ImageId))
                .GroupBy(l => l.ImageId)
                .Select(g => new { ImageId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.ImageId, x => x.Count);
            var commentCounts = await _context.ImageComments
                .Where(c => ids.Contains(c.ImageId))
                .GroupBy(c => c.ImageId)
                .Select(g => new { ImageId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.ImageId, x => x.Count);

            return items.Select(i => new ImageAssetDto(
                i.Id.ToString(),
                i.Title,
                links.GetValueOrDefault(i.FileName) ?? string.Empty,
                i.FileName,
                i.CreatorName,
                i.Category,
                i.Tags,
                i.ViewCount,
                i.DownloadCount,
                likeCounts.GetValueOrDefault(i.Id, 0),
                commentCounts.GetValueOrDefault(i.Id, 0),
                i.CreatedAt)).ToList();
        }

        public async Task<ImageAssetDto?> Get(Guid id)
        {
            var entity = await _context.ImageAssets.FindAsync(id);
            if (entity == null) return null;

            var url = await _storage.GetDownloadLink(entity.FileName);
            var likeCount = await _context.ImageLikes.CountAsync(l => l.ImageId == entity.Id);
            var commentCount = await _context.ImageComments.CountAsync(c => c.ImageId == entity.Id);

            return new ImageAssetDto(
                entity.Id.ToString(),
                entity.Title,
                url,
                entity.FileName,
                entity.CreatorName,
                entity.Category,
                entity.Tags,
                entity.ViewCount,
                entity.DownloadCount,
                likeCount,
                commentCount,
                entity.CreatedAt);
        }

        public async Task<bool> IncrementView(Guid id)
        {
            var entity = await _context.ImageAssets.FindAsync(id);
            if (entity == null) return false;
            entity.ViewCount += 1;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IncrementDownload(Guid id)
        {
            var entity = await _context.ImageAssets.FindAsync(id);
            if (entity == null) return false;
            entity.DownloadCount += 1;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

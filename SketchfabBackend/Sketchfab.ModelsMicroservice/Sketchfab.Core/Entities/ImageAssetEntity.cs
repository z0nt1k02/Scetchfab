using System;
using System.Collections.Generic;

namespace Sketchfab.Core.Entities
{
    public class ImageAssetEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public Guid CreatorId { get; set; }
        public string CreatorName { get; set; } = string.Empty;
        public string? Category { get; set; }
        public List<string> Tags { get; set; } = new();
        public int ViewCount { get; set; }
        public int DownloadCount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public static ImageAssetEntity Create(string title, string fileName, Guid creatorId, string creatorName)
        {
            return new ImageAssetEntity
            {
                Id = Guid.NewGuid(),
                Title = title,
                FileName = fileName,
                CreatorId = creatorId,
                CreatorName = creatorName,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}

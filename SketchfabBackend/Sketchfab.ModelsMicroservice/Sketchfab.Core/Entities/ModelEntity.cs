using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Core.Entities
{
    public class ModelEntity
    {
        public ModelEntity(string title,string modelName,Guid creatorId,string creatorName)
        {
            Id = Guid.NewGuid();
            Title = title;
            ModelName = modelName;
            CreatorId = creatorId;
            CreatorName = creatorName;
        }
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ModelName { get; set; } = string.Empty;
        public Guid CreatorId { get; set; }
        public string CreatorName { get; set; } = string.Empty;
        public string? ViewerConfig { get; set; }
        public string? PreviewName { get; set; }
        public string? Category { get; set; }
        public List<string> Tags { get; set; } = new();
        public int ViewCount { get; set; }
        public int DownloadCount { get; set; }

        public static ModelEntity Create(string title, string modelName, Guid creatorId, string creatorName)
        {
            return new ModelEntity(title, modelName, creatorId, creatorName);
        }
    }
}

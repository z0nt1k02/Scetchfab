using System;

namespace Sketchfab.Core.Entities
{
    public class ImageLikeEntity
    {
        public Guid ImageId { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

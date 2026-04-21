using System;

namespace Sketchfab.Core.Entities
{
    public class LikeEntity
    {
        public Guid ModelId { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

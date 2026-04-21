using System;

namespace Sketchfab.Core.Entities
{
    public class ImageCommentEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ImageId { get; set; }
        public Guid UserId { get; set; }
        public string Nickname { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

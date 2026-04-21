using System;

namespace Sketchfab.Core.Entities
{
    public class CommentEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ModelId { get; set; }
        public Guid UserId { get; set; }
        public string Nickname { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

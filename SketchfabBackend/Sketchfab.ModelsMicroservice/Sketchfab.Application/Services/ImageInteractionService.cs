using Microsoft.EntityFrameworkCore;
using Sketchfab.Application.Dtos;
using Sketchfab.Application.Interfaces;
using Sketchfab.Core.Entities;

namespace Sketchfab.Application.Services
{
    public class ImageInteractionService(ISketchfabDbContext context) : IImageInteractionService
    {
        private readonly ISketchfabDbContext _context = context;

        public async Task<LikeStateDto?> GetLikeState(Guid imageId, Guid? userId)
        {
            var exists = await _context.ImageAssets.AnyAsync(i => i.Id == imageId);
            if (!exists) return null;

            var count = await _context.ImageLikes.CountAsync(l => l.ImageId == imageId);
            var liked = userId.HasValue &&
                await _context.ImageLikes.AnyAsync(l => l.ImageId == imageId && l.UserId == userId.Value);
            return new LikeStateDto(count, liked);
        }

        public async Task<LikeStateDto?> ToggleLike(Guid imageId, Guid userId)
        {
            var exists = await _context.ImageAssets.AnyAsync(i => i.Id == imageId);
            if (!exists) return null;

            var existing = await _context.ImageLikes.FirstOrDefaultAsync(l => l.ImageId == imageId && l.UserId == userId);
            bool liked;
            if (existing != null)
            {
                _context.ImageLikes.Remove(existing);
                liked = false;
            }
            else
            {
                await _context.ImageLikes.AddAsync(new ImageLikeEntity { ImageId = imageId, UserId = userId });
                liked = true;
            }
            await _context.SaveChangesAsync();

            var count = await _context.ImageLikes.CountAsync(l => l.ImageId == imageId);
            return new LikeStateDto(count, liked);
        }

        public async Task<List<CommentDto>> GetComments(Guid imageId)
        {
            var items = await _context.ImageComments
                .Where(c => c.ImageId == imageId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return items
                .Select(c => new CommentDto(c.Id.ToString(), c.ImageId.ToString(), c.UserId.ToString(), c.Nickname, c.Text, c.CreatedAt))
                .ToList();
        }

        public async Task<CommentDto?> AddComment(Guid imageId, Guid userId, string nickname, string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return null;
            var exists = await _context.ImageAssets.AnyAsync(i => i.Id == imageId);
            if (!exists) return null;

            var comment = new ImageCommentEntity
            {
                Id = Guid.NewGuid(),
                ImageId = imageId,
                UserId = userId,
                Nickname = nickname,
                Text = text.Trim(),
                CreatedAt = DateTime.UtcNow
            };
            await _context.ImageComments.AddAsync(comment);
            await _context.SaveChangesAsync();

            return new CommentDto(comment.Id.ToString(), comment.ImageId.ToString(), comment.UserId.ToString(), comment.Nickname, comment.Text, comment.CreatedAt);
        }

        public async Task<bool> DeleteComment(Guid commentId, Guid userId)
        {
            var comment = await _context.ImageComments.FirstOrDefaultAsync(c => c.Id == commentId && c.UserId == userId);
            if (comment == null) return false;
            _context.ImageComments.Remove(comment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Guid>> GetLikedImageIds(Guid userId)
        {
            return await _context.ImageLikes
                .Where(l => l.UserId == userId)
                .Select(l => l.ImageId)
                .ToListAsync();
        }
    }
}

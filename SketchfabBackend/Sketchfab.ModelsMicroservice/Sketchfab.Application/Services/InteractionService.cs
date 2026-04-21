using Microsoft.EntityFrameworkCore;
using Sketchfab.Application.Dtos;
using Sketchfab.Application.Interfaces;
using Sketchfab.Core.Entities;

namespace Sketchfab.Application.Services
{
    public class InteractionService(ISketchfabDbContext context) : IInteractionService
    {
        private readonly ISketchfabDbContext _context = context;

        public async Task<LikeStateDto?> GetLikeState(Guid modelId, Guid? userId)
        {
            var exists = await _context.Models.AnyAsync(m => m.Id == modelId);
            if (!exists) return null;

            var count = await _context.Likes.CountAsync(l => l.ModelId == modelId);
            var liked = userId.HasValue &&
                await _context.Likes.AnyAsync(l => l.ModelId == modelId && l.UserId == userId.Value);
            return new LikeStateDto(count, liked);
        }

        public async Task<LikeStateDto?> ToggleLike(Guid modelId, Guid userId)
        {
            var exists = await _context.Models.AnyAsync(m => m.Id == modelId);
            if (!exists) return null;

            var existing = await _context.Likes.FirstOrDefaultAsync(l => l.ModelId == modelId && l.UserId == userId);
            bool liked;
            if (existing != null)
            {
                _context.Likes.Remove(existing);
                liked = false;
            }
            else
            {
                await _context.Likes.AddAsync(new LikeEntity { ModelId = modelId, UserId = userId });
                liked = true;
            }
            await _context.SaveChangesAsync();

            var count = await _context.Likes.CountAsync(l => l.ModelId == modelId);
            return new LikeStateDto(count, liked);
        }

        public async Task<List<CommentDto>> GetComments(Guid modelId)
        {
            var items = await _context.Comments
                .Where(c => c.ModelId == modelId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return items
                .Select(c => new CommentDto(c.Id.ToString(), c.ModelId.ToString(), c.UserId.ToString(), c.Nickname, c.Text, c.CreatedAt))
                .ToList();
        }

        public async Task<CommentDto?> AddComment(Guid modelId, Guid userId, string nickname, string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return null;
            var exists = await _context.Models.AnyAsync(m => m.Id == modelId);
            if (!exists) return null;

            var comment = new CommentEntity
            {
                Id = Guid.NewGuid(),
                ModelId = modelId,
                UserId = userId,
                Nickname = nickname,
                Text = text.Trim(),
                CreatedAt = DateTime.UtcNow
            };
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();

            return new CommentDto(comment.Id.ToString(), comment.ModelId.ToString(), comment.UserId.ToString(), comment.Nickname, comment.Text, comment.CreatedAt);
        }

        public async Task<bool> DeleteComment(Guid commentId, Guid userId)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.UserId == userId);
            if (comment == null) return false;
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IncrementView(Guid modelId)
        {
            var model = await _context.Models.FindAsync(modelId);
            if (model == null) return false;
            model.ViewCount += 1;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IncrementDownload(Guid modelId)
        {
            var model = await _context.Models.FindAsync(modelId);
            if (model == null) return false;
            model.DownloadCount += 1;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Guid>> GetLikedModelIds(Guid userId)
        {
            return await _context.Likes
                .Where(l => l.UserId == userId)
                .Select(l => l.ModelId)
                .ToListAsync();
        }
    }
}

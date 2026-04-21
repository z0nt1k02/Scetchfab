using Sketchfab.Application.Dtos;

namespace Sketchfab.Application.Interfaces
{
    public interface IImageInteractionService
    {
        Task<LikeStateDto?> GetLikeState(Guid imageId, Guid? userId);
        Task<LikeStateDto?> ToggleLike(Guid imageId, Guid userId);

        Task<List<CommentDto>> GetComments(Guid imageId);
        Task<CommentDto?> AddComment(Guid imageId, Guid userId, string nickname, string text);
        Task<bool> DeleteComment(Guid commentId, Guid userId);

        Task<List<Guid>> GetLikedImageIds(Guid userId);
    }
}

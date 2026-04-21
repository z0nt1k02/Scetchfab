using Sketchfab.Application.Dtos;

namespace Sketchfab.Application.Interfaces
{
    public interface IInteractionService
    {
        Task<LikeStateDto?> GetLikeState(Guid modelId, Guid? userId);
        Task<LikeStateDto?> ToggleLike(Guid modelId, Guid userId);

        Task<List<CommentDto>> GetComments(Guid modelId);
        Task<CommentDto?> AddComment(Guid modelId, Guid userId, string nickname, string text);
        Task<bool> DeleteComment(Guid commentId, Guid userId);

        Task<bool> IncrementView(Guid modelId);
        Task<bool> IncrementDownload(Guid modelId);

        Task<List<Guid>> GetLikedModelIds(Guid userId);
    }
}

using Sketchfab.Application.Dtos;

namespace Sketchfab.Application.Interfaces
{
    public interface IImageAssetService
    {
        Task<CreateImageAssetResponse> Upload(
            string title,
            string fileName,
            string creatorId,
            string creatorName,
            string? category,
            List<string>? tags);

        Task<List<ImageAssetDto>> GetAll(int page, int pageSize, string? q = null, string? category = null, string? tag = null);

        Task<ImageAssetDto?> Get(Guid id);

        Task<bool> IncrementView(Guid id);
        Task<bool> IncrementDownload(Guid id);
    }
}

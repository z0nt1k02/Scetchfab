using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Application.Dtos
{
    public record class ShortModelDto(
        string id,
        string title,
        string fileUrl,
        string creatorName,
        string modelName,
        string? viewerConfig,
        string? previewUrl,
        string? category,
        List<string> tags,
        int likeCount,
        int commentCount,
        int viewCount,
        int downloadCount);
}

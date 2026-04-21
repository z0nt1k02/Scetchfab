using System;
using System.Collections.Generic;

namespace Sketchfab.Application.Dtos
{
    public record class ImageAssetDto(
        string id,
        string title,
        string fileUrl,
        string fileName,
        string creatorName,
        string? category,
        List<string> tags,
        int viewCount,
        int downloadCount,
        int likeCount,
        int commentCount,
        DateTime createdAt);

    public record class CreateImageAssetDto(
        string title,
        string fileName,
        string? category = null,
        List<string>? tags = null);

    public record class CreateImageAssetResponse(string id, string uploadUrl);
}

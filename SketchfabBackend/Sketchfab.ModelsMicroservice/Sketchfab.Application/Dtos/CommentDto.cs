using System;

namespace Sketchfab.Application.Dtos
{
    public record class CommentDto(
        string id,
        string modelId,
        string userId,
        string nickname,
        string text,
        DateTime createdAt);

    public record class CreateCommentDto(string userId, string nickname, string text);
}

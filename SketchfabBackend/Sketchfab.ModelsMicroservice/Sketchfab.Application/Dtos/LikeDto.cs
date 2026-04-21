namespace Sketchfab.Application.Dtos
{
    public record class LikeStateDto(int count, bool liked);

    public record class ToggleLikeDto(string userId);
}

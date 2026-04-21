using Microsoft.AspNetCore.Mvc;
using Sketchfab.Application.Dtos;
using Sketchfab.Application.Interfaces;

namespace Sketchfab.Api.Controllers
{
    [Route("api")]
    [ApiController]
    public class InteractionController : ControllerBase
    {
        private readonly IInteractionService _service;

        public InteractionController(IInteractionService service)
        {
            _service = service;
        }

        [HttpGet("models/{id}/likes")]
        public async Task<IActionResult> GetLikes(Guid id, [FromQuery] Guid? userId)
        {
            var state = await _service.GetLikeState(id, userId);
            if (state == null) return NotFound();
            return Ok(state);
        }

        [HttpPost("models/{id}/like")]
        public async Task<IActionResult> ToggleLike(Guid id, [FromBody] ToggleLikeDto dto)
        {
            if (!Guid.TryParse(dto.userId, out var userId)) return BadRequest("Invalid userId");
            var state = await _service.ToggleLike(id, userId);
            if (state == null) return NotFound();
            return Ok(state);
        }

        [HttpGet("models/{id}/comments")]
        public async Task<IActionResult> GetComments(Guid id)
        {
            var comments = await _service.GetComments(id);
            return Ok(comments);
        }

        [HttpPost("models/{id}/comments")]
        public async Task<IActionResult> AddComment(Guid id, [FromBody] CreateCommentDto dto)
        {
            if (!Guid.TryParse(dto.userId, out var userId)) return BadRequest("Invalid userId");
            if (string.IsNullOrWhiteSpace(dto.text)) return BadRequest("Text is required");
            var comment = await _service.AddComment(id, userId, dto.nickname, dto.text);
            if (comment == null) return NotFound();
            return Ok(comment);
        }

        [HttpDelete("comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(Guid commentId, [FromQuery] Guid userId)
        {
            var ok = await _service.DeleteComment(commentId, userId);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpPost("models/{id}/view")]
        public async Task<IActionResult> IncrementView(Guid id)
        {
            var ok = await _service.IncrementView(id);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpPost("models/{id}/download")]
        public async Task<IActionResult> IncrementDownload(Guid id)
        {
            var ok = await _service.IncrementDownload(id);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpGet("users/{userId}/liked")]
        public async Task<IActionResult> GetLikedModels(Guid userId)
        {
            var ids = await _service.GetLikedModelIds(userId);
            return Ok(ids.Select(x => x.ToString()));
        }
    }
}

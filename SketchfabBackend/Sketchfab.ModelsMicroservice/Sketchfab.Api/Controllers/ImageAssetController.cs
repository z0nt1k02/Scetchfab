using Microsoft.AspNetCore.Mvc;
using Sketchfab.Application.Dtos;
using Sketchfab.Application.Interfaces;

namespace Sketchfab.Api.Controllers
{
    [Route("api")]
    [ApiController]
    public class ImageAssetController : ControllerBase
    {
        private readonly IImageAssetService _service;

        public ImageAssetController(IImageAssetService service)
        {
            _service = service;
        }

        [HttpGet("images")]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] string? q = null, [FromQuery] string? category = null, [FromQuery] string? tag = null)
        {
            var res = await _service.GetAll(page, pageSize, q, category, tag);
            return Ok(res);
        }

        [HttpGet("images/{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            try
            {
                var res = await _service.Get(id);
                if (res == null) return NotFound();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("images")]
        public async Task<IActionResult> Create([FromBody] CreateImageAssetDto dto)
        {
            try
            {
                string creatorId = Guid.NewGuid().ToString();
                string creatorName = "Igor";
                var res = await _service.Upload(dto.title, dto.fileName, creatorId, creatorName, dto.category, dto.tags);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("images/{id}/view")]
        public async Task<IActionResult> IncrementView(Guid id)
        {
            var ok = await _service.IncrementView(id);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpPost("images/{id}/download")]
        public async Task<IActionResult> IncrementDownload(Guid id)
        {
            var ok = await _service.IncrementDownload(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }

    [Route("api")]
    [ApiController]
    public class ImageInteractionController : ControllerBase
    {
        private readonly IImageInteractionService _service;

        public ImageInteractionController(IImageInteractionService service)
        {
            _service = service;
        }

        [HttpGet("images/{id}/likes")]
        public async Task<IActionResult> GetLikes(Guid id, [FromQuery] Guid? userId)
        {
            var state = await _service.GetLikeState(id, userId);
            if (state == null) return NotFound();
            return Ok(state);
        }

        [HttpPost("images/{id}/like")]
        public async Task<IActionResult> ToggleLike(Guid id, [FromBody] ToggleLikeDto dto)
        {
            if (!Guid.TryParse(dto.userId, out var userId)) return BadRequest("Invalid userId");
            var state = await _service.ToggleLike(id, userId);
            if (state == null) return NotFound();
            return Ok(state);
        }

        [HttpGet("images/{id}/comments")]
        public async Task<IActionResult> GetComments(Guid id)
        {
            var comments = await _service.GetComments(id);
            return Ok(comments);
        }

        [HttpPost("images/{id}/comments")]
        public async Task<IActionResult> AddComment(Guid id, [FromBody] CreateCommentDto dto)
        {
            if (!Guid.TryParse(dto.userId, out var userId)) return BadRequest("Invalid userId");
            if (string.IsNullOrWhiteSpace(dto.text)) return BadRequest("Text is required");
            var comment = await _service.AddComment(id, userId, dto.nickname, dto.text);
            if (comment == null) return NotFound();
            return Ok(comment);
        }

        [HttpDelete("image-comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(Guid commentId, [FromQuery] Guid userId)
        {
            var ok = await _service.DeleteComment(commentId, userId);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpGet("users/{userId}/liked-images")]
        public async Task<IActionResult> GetLikedImages(Guid userId)
        {
            var ids = await _service.GetLikedImageIds(userId);
            return Ok(ids.Select(x => x.ToString()));
        }
    }
}

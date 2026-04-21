using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Sketchfab.Application.Dtos;
using Sketchfab.Application.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;



namespace Sketchfab.Api.Controllers
{
    [Route("api")]
    [ApiController]
    public class ModelController : ControllerBase
    {

        private readonly IModelService _modelService;

        public ModelController(IModelService modelService)
        {
            _modelService = modelService;
        }
        [HttpGet]
        [Route("models")]
        //[Authorize]
        public async Task<IActionResult> GetModels([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string? q, [FromQuery] string? category, [FromQuery] string? tag)
        {
            var res = await _modelService.GetModels(page, pageSize, q, category, tag);
            return Ok(res);
        }
        [HttpGet]
        [Route("models/{id}")]
        public async Task<IActionResult> GetModel(Guid id)
        {
            try
            {
                var res = await _modelService.DownloadModel(id);
                if (res == null) return NotFound();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("models/{id}/config")]
        public async Task<IActionResult> UpdateViewerConfig(Guid id, [FromBody] UpdateViewerConfigDto dto)
        {
            try
            {
                var ok = await _modelService.UpdateViewerConfig(id, dto.viewerConfig);
                if (!ok) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Route("models")]
        //[Authorize]
        public async Task<IActionResult> PostModel(CreateModelDto dto)
        {
            try
            {
                //string creatorId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.ToString();
                //string creatorName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)!.ToString();
                string id = Guid.NewGuid().ToString();
                string creatorName = "Igor";
                var res = await _modelService.UploadModel(dto.title, dto.modelName, id, creatorName, dto.viewerConfig, dto.category, dto.tags);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }


        private string GetMimeType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();

            return extension switch
            {
                ".glb" => "model/gltf-binary",
                ".gltf" => "model/gltf+json",
                ".fbx" => "application/octet-stream",
                ".obj" => "model/obj",
                ".stl" => "model/stl",
                ".3ds" => "application/octet-stream",
                _ => "application/octet-stream"
            };
        }
    }
}

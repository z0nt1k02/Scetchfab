using Microsoft.AspNetCore.Mvc;
using Sketchfab.Application.Interfaces;
using System.Threading.Tasks;



namespace Sketchfab.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModelController : ControllerBase
    {

        private readonly IModelService _modelService;

        public ModelController(IModelService modelService)
        {
            _modelService = modelService;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetModel(Guid id)
        {
            try
            {
                var (fileStream, filename, mimeType) = await _modelService.GetModel(id);
                return File(fileStream, mimeType, filename);

            }
            catch (NullReferenceException ex)
            {
                return NotFound($"Файл с таким названием не найден: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Route("postModel")]
        public async Task<IActionResult> PostModel([FromForm]IFormFile file)
        {
            const long maxFileSize = 20 * 1024 * 1024;
            try
            {
                if (file.Length > maxFileSize)
                {
                    return BadRequest("Файл слишком большой");
                }
                if (file.Length == 0 || file == null)
                {
                    return BadRequest("Файл не должен быть пустым");
                }
                
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (extension != ".fbx")
                {
                    return BadRequest("Только fbx файлы");                   
                }
                using (Stream stream = file.OpenReadStream())
                {
                    await _modelService.PostModel(stream, file.FileName);
                }

                return Ok("Файл успешно загружен");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
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

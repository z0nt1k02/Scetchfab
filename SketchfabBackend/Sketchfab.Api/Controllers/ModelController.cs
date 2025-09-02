using Microsoft.AspNetCore.Mvc;



namespace Sketchfab.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModelController : ControllerBase
    {
        private readonly IHostEnvironment _environment;

        public ModelController(IHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpGet]
        [Route("getmodel")]
        public IActionResult GetModel()
        {
            try
            {
                string filePath = "C:\\Diplom\\SketchfabBackend\\Sketchfab.Api\\StaticModels\\Round_Table.FBX";
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("Файл по такому пути не найден");
                }

                var mimeType = GetMimeType(filePath);
                var fileStream = System.IO.File.OpenRead(filePath);
                return File(fileStream, mimeType, "Round_Table.FBX");
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            
        }

        [HttpPost]
        [Route("postModel")]
        public async Task<IActionResult> PostModel([FromForm]IFormFile file)
        {
            try
            {
                if (file.Length == 0 || file == null)
                {
                    return BadRequest("Файл не должен быть пустым");
                }
                
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (extension != ".fbx")
                {
                    return BadRequest("Только fbx файлы");
                    
                }
                string filePath = $"C:\\Diplom\\SketchfabBackend\\Sketchfab.Api\\StaticModels\\{file.FileName}";
                using(var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
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

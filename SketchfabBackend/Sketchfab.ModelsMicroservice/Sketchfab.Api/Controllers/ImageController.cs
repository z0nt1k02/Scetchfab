using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Sketchfab.Application.Interfaces;

namespace Sketchfab.Api.Controllers
{
    [ApiController]
    [Route("api/model/preview-images")]
    public class ImageController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ISketchfabDbContext _context;
        private readonly IImageService _modelImageService;

        public ImageController(IConfiguration configuration, ISketchfabDbContext context,IImageService service)
        {
            _configuration = configuration;
            _context = context;
            _modelImageService = service;
        }

       
        [HttpGet]
        [Route("{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            return PhysicalFile($"C:\\SketchfabDatabase\\Images\\{fileName}", GetContentType(fileName));
        }
        [HttpGet]
        public async Task<IActionResult> GetImages()
        {
            try
            {
                var images = await _modelImageService.GetPreviewImagesURLs();
                return Ok(images);
            }
            catch (FileNotFoundException ex)
            {
                return StatusCode(500, $"Ошибка загрузки файлов {ex.Message}");
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        private string GetContentType(string fileName)
        {
            var fileExtension = Path.GetExtension(fileName).ToLowerInvariant();
            return fileExtension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream"
            };
        }
    }

}

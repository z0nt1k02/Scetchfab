using Microsoft.AspNetCore.Mvc;
using Sketchfab.Application.Interfaces;
using System.Threading.Tasks;



namespace Sketchfab.Api.Controllers
{
    [Route("api/model")]
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
        public async Task<IActionResult> PostModel([FromForm]IFormFile model, [FromForm] IFormFile modelImage,[FromForm]string title)
        {
            const long maxModelSize = 20 * 1024 * 1024;
            try
            {
                if (model.Length > maxModelSize)
                {
                    return BadRequest("Файл слишком большой");
                }
                if (model.Length == 0 || model == null)
                {
                    return BadRequest("Файл не должен быть пустым");
                }
                
                var extension = Path.GetExtension(model.FileName).ToLowerInvariant();
                if (extension != ".fbx")
                {
                    return BadRequest("Только fbx файлы");                   
                }
                await _modelService.PostModel(model, modelImage,title);

                return Ok("Файл успешно загружен");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"{ex.Message+ ex.StackTrace}");
            }


        }

        //[HttpGet]
        //[Route("models")]
        //public async Task <IActionResult> GetModelImage()
        //{
            
        //    //return PhysicalFile();
        //}

        private bool CheckFile(long maxSize,IFormFile file)
        {
            if (file.Length > maxSize)
                return false;
            if (file.Length == 0 || file is null)
                return false;
            return true;
        }

        

        
    }
}

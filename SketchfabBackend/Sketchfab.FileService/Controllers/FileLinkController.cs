using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sketchfab.FileService.Dtos;
using Sketchfab.FileService.Services;

namespace Sketchfab.FileService.Controllers
{
    [Route("api")]
    [ApiController]
    public class FileLinkController : ControllerBase
    {
        private readonly FileLinkService service;

        public FileLinkController(FileLinkService service)
        {
            this.service = service;
        }
        [HttpPost]
        [Route("downloadlinks")]
        public async Task<IActionResult> UploadLinks([FromBody]DownloadLinksRequest request)
        {
            try
            {
                var links = await service.GenerateDownloadLinks(request.modelNames);
                return Ok(links);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPost]
        [Route("uploadlink")]
        public async Task<IActionResult> UploadLink(FileDto dto)
        {
            try
            {
                var link = await service.GenerateUploadLink(dto.fileName);
                return Ok(link);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }            
        }

        [HttpPost]
        [Route("downloadlink")]
        public async Task<IActionResult> DownloadLink(FileDto dto)
        {
            try
            {
                var link = await service.GenerateDownloadLink(dto.fileName);
                return Ok(link);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

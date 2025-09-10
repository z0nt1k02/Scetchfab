using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Sketchfab.Application.Dtos;
using Sketchfab.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Application.Services
{
    public class ImageService : IImageService
    {
        private readonly ISketchfabDbContext _context;
        private readonly IConfiguration _configuration;

        public ImageService(ISketchfabDbContext context,IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<List<ModelImageDto>> GetPreviewImagesURLs()
        {
            var models = await _context.Models.OrderBy(m => m.Id).Take(10).ToListAsync();

            List<ModelImageDto> imagesDtos = new List<ModelImageDto>();

            foreach(var model in models)
            {
                string extension = Path.GetExtension(model.ImageName).ToLowerInvariant();
                string path = Path.Combine(_configuration["FilesPaths:ModelsImagesPath"]!,$"{model.Id.ToString()}{extension}");
                if (!File.Exists(path))
                {
                    throw new FileNotFoundException(path);
                }
                
                imagesDtos.Add(new ModelImageDto($"http://localhost:5105/api/model/preview-images/{model.Id}{extension}", model.Title)); 
            }
            return imagesDtos;
        }
    }
}

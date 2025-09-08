using Sketchfab.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Sketchfab.Core.Entities;
using Microsoft.AspNetCore.Http;

namespace Sketchfab.Application.Services
{
    public class ModelService : IModelService
    {
        private readonly IConfiguration _configuration;
        private readonly ISketchfabDbContext _context;
        public ModelService(IConfiguration configuration, ISketchfabDbContext context   )
        {
            _configuration = configuration;
            _context = context;
        }
        public async Task<(Stream, string, string)> GetModel(Guid id)
        {
            try
            {
                var model = await _context.Models.FindAsync(id);
                if(model is null)
                {
                    throw new NullReferenceException("Файл с таким id не найден");
                }
                var fileStream = new FileStream(
                    model.ModelPath,
                    FileMode.Open,
                    FileAccess.Read,
                    FileShare.Read,
                    bufferSize: 65536, 
                    useAsync: true);

                string mimeType = GetMimeType(model.ModelPath);

                
                return (fileStream, model.Name, mimeType);
            }catch(FileNotFoundException)
            {
                throw new FileNotFoundException($"Файл с таким именем не найден");
            }
                       
        }

        public async Task PostModel(IFormFile model, string fileName,IFormFile modelImage)
        {            
            Guid id = Guid.NewGuid();
            string modelPath;
            string modelImagePath;
            var paths = _configuration.GetSection("FilesPaths");

            using Stream stream = model.OpenReadStream();          
            modelPath = await SaveFile(stream, paths["ModelsPath"]!, $"{id.ToString()}.{Path.GetExtension(fileName).ToLowerInvariant()}");

            using Stream streamImage = modelImage.OpenReadStream();           
            modelImagePath = await SaveFile(streamImage, paths["ModelsImagesPath"]!, $"{id.ToString()}.{Path.GetExtension(modelImage.FileName).ToLowerInvariant()}");
                                  
            var modelEntity = new ModelEntity
            {
               Id = id,
               ModelPath = modelPath,
               ModelImagePath = modelImagePath,
               Name = fileName
            };

            _context.Models.Add(modelEntity);
            await _context.SaveChangesAsync();
        }

        private async Task<string> SaveFile(Stream file,string folderPath,string fileName)
        {
            string filePath = Path.Combine(folderPath, fileName);
            
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return filePath;
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

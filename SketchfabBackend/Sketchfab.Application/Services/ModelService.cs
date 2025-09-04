using Sketchfab.Application.Interfaces;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Application.Services
{
    public class ModelService : IModelService
    {
        public async Task<(Stream, string, string)> GetModel(string fileName)
        {

            string filePath = $"C:\\Diplom\\SketchfabBackend\\Sketchfab.Api\\StaticModels\\{fileName}";
            
            
            if (! File.Exists(filePath))
            {
                throw new FileNotFoundException("Файл с таким именем не найден");
            }

            var mimeType = GetMimeType(filePath);
            
            
            var fileStream = new FileStream(
                filePath,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read,
                bufferSize: 65536, 
                useAsync: true);

            return (fileStream, fileName, mimeType);
        }

        public async Task PostModel(Stream file, string fileName)
        {            
            string filePath = $"C:\\Diplom\\SketchfabBackend\\Sketchfab.Api\\StaticModels\\{fileName}";
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
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

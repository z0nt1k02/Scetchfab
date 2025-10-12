using Sketchfab.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Sketchfab.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Http;
using System.Text.Json;
using System.Net.Http.Json;
using Sketchfab.Application.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Sketchfab.Application.Services
{
    public class ModelService : IModelService
    {
        private readonly IConfiguration _configuration;
        private readonly ISketchfabDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        public ModelService(IConfiguration configuration, ISketchfabDbContext context,IHttpClientFactory httpClientFactory   )
        {
            _configuration = configuration;
            _context = context;
            _httpClientFactory = httpClientFactory;
        }
        public async Task<List<ShortModelDto>> GetModels(int page,int pageSize)
        {
            var models = await _context.Models
                .OrderBy(m => m.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var result = models.Select(m => new ShortModelDto(m.Title, m.ModelName, m.CreatorName)).ToList();
            return result;

        }
        public async Task<ShortModelDto> DownloadModel(Guid id)
        {
            ModelEntity model = _context.Models.Find(id) ?? throw new NullReferenceException("Модель не найдена");
            var client = _httpClientFactory.CreateClient();
            JsonContent content = JsonContent.Create(new { fileName = model.ModelName });

            var response = await client.PostAsync("http://localhost:5019/api/downloadlink", content);
            if (response.IsSuccessStatusCode)
            {
                string downloadUrl = await response.Content.ReadAsStringAsync();
                return new ShortModelDto(model.Title,downloadUrl,model.CreatorName);
            }
            else
            {
                throw new Exception("Не удалось получить ссылку для загрузки");
            }
        }

        public async Task<string> UploadModel(string title, string modelName, string creatorId,string creatorName)
        {
            Guid id = Guid.NewGuid();
            ModelEntity entity = ModelEntity.Create(title, modelName, Guid.Parse(creatorId), creatorName);
            var client = _httpClientFactory.CreateClient();
            
            JsonContent content = JsonContent.Create(new { fileName = modelName });
            
            var response = await client.PostAsync("http://localhost:5019/api/uploadlink",content);
            if (response.IsSuccessStatusCode)
            {
                string result = await response.Content.ReadAsStringAsync();
                await _context.Models.AddAsync(entity);
                await _context.SaveChangesAsync();
                return result;
            }
            else
            {
                throw new Exception("Не удалось получить ссылку для загрузки");
            }
        }
    }
}

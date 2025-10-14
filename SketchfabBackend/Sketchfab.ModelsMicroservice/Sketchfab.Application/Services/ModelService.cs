using Sketchfab.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Sketchfab.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Http;
using System.Text.Json;
using System.Net.Http.Json;
using Sketchfab.Application.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.AspNetCore.Mvc;

namespace Sketchfab.Application.Services
{
    public class ModelService(IConfiguration configuration, ISketchfabDbContext context, IHttpClientFactory httpClientFactory, IDistributedCache cache) : IModelService
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly ISketchfabDbContext _context = context;
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly IDistributedCache _cache = cache;

        public async Task<List<ShortModelDto>> GetModels(int page,int pageSize)
        {
            var models = _cache.GetAsync("models1page");
            if(models.Result != null)
            {
                var cachedModels = JsonSerializer.Deserialize<List<ShortModelDto>>(models.Result);
                if (cachedModels != null)
                {
                    return cachedModels;
                }
            }
            var modelsDb = await _context.Models
                .OrderBy(m => m.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var result = modelsDb.Select(m => new ShortModelDto(m.Id.ToString(),m.Title, m.ModelName, m.CreatorName)).ToList();
            //await _cache.SetAsync("models1page", result);
            await CreateCache(result);
            return result;

        }
        public async Task<ShortModelDto> DownloadModel(Guid id)
        {
            var model = await _cache.GetAsync(id.ToString());
            if(model != null)
            {
                var serializedModel = JsonSerializer.Deserialize<ShortModelDto>(model)!;
                return serializedModel;
            }
            ModelEntity modelDb = _context.Models.Find(id) ?? throw new NullReferenceException("Модель не найдена");
            var client = _httpClientFactory.CreateClient();
            JsonContent content = JsonContent.Create(new { fileName = modelDb.ModelName });

            var response = await client.PostAsync("http://localhost:5019/api/downloadlink", content);
            if (response.IsSuccessStatusCode)
            {
                string downloadUrl = await response.Content.ReadAsStringAsync();
                ShortModelDto dto = new ShortModelDto(modelDb.Id.ToString(), modelDb.Title, downloadUrl, modelDb.CreatorName);
                await CreateCache(dto);
                return dto;
            }
            else
            {
                throw new Exception("Не удалось получить ссылку для загрузки");
            }
        }

        public async Task<string> UploadModel(string title, string modelName, string creatorId,string creatorName)
        {
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

        private async Task CreateCache(List<ShortModelDto> dtos)
        {
            var resultJson = JsonSerializer.Serialize(dtos);
            await _cache.SetAsync("models1page", System.Text.Encoding.UTF8.GetBytes(resultJson), new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(20)
            });
        }
        private async Task CreateCache(ShortModelDto dto)
        {
            var resultJson = JsonSerializer.Serialize(dto);
            await _cache.SetAsync("models1page", System.Text.Encoding.UTF8.GetBytes(resultJson), new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30)
            });
        }
    }
}

using Sketchfab.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Sketchfab.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Http;
using System.Text.Json;
using System.Net.Http.Json;
using Sketchfab.Application.Dtos;
using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Caching.Distributed;
using Microsoft.AspNetCore.Mvc;

namespace Sketchfab.Application.Services
{
    public class ModelService(IConfiguration configuration, ISketchfabDbContext context, IHttpClientFactory httpClientFactory, /*IDistributedCache cache,*/ IYandexStorageService yandexStorageService) : IModelService
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly ISketchfabDbContext _context = context;
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        //private readonly IDistributedCache _cache = cache;
        private readonly IYandexStorageService _yandexStorageService = yandexStorageService;

        public async Task<List<ShortModelDto>> GetModels(int page,int pageSize)
        {
            //var models = await _cache.GetAsync("models1page");
            //if(models != null)
            //{
            //    var cachedModels = JsonSerializer.Deserialize<List<ShortModelDto>>(models);
            //    if (cachedModels != null)
            //    {
            //        return cachedModels;
            //    }
            //}
            var modelsDb = await _context.Models
                .OrderBy(m => m.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            Console.WriteLine();
            var links = await _yandexStorageService.GetDownloadLinksAsync(modelsDb.Select(m => m.ModelName).ToList());

            //Console.WriteLine(links["Yaroslavl.fbx"]);

            var result = modelsDb.Select(m =>
            {
                var modelLink = links.GetValueOrDefault(m.ModelName);
                return new ShortModelDto(m.Id.ToString(), m.Title, modelLink!, m.CreatorName, m.ModelName, m.ViewerConfig);
            }).ToList();

            return result;

        }
        public async Task<ShortModelDto?> DownloadModel(Guid id)
        {
            //var cached = await _cache.GetAsync(id.ToString());
            //if (cached != null)
            //{
            //    return JsonSerializer.Deserialize<ShortModelDto>(cached);
            //}
            var modelDb = await _context.Models.FindAsync(id);
            if (modelDb == null) return null;

            var client = _httpClientFactory.CreateClient();
            JsonContent content = JsonContent.Create(new { fileName = modelDb.ModelName });

            var response = await client.PostAsync("http://localhost:5019/api/downloadlink", content);
            if (response.IsSuccessStatusCode)
            {
                string downloadUrl = await response.Content.ReadAsStringAsync();
                ShortModelDto dto = new ShortModelDto(modelDb.Id.ToString(), modelDb.Title, downloadUrl, modelDb.CreatorName, modelDb.ModelName, modelDb.ViewerConfig);
                //await CreateCache(id, dto);
                return dto;
            }
            else
            {
                throw new Exception("Не удалось получить ссылку для загрузки");
            }
        }

        public async Task<bool> UpdateViewerConfig(Guid id, string? viewerConfig)
        {
            var entity = await _context.Models.FindAsync(id);
            if (entity == null) return false;
            entity.ViewerConfig = viewerConfig;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> UploadModel(string title, string modelName, string creatorId, string creatorName, string? viewerConfig = null)
        {
            ModelEntity entity = ModelEntity.Create(title, modelName, Guid.Parse(creatorId), creatorName);
            entity.ViewerConfig = viewerConfig;
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

        //private async Task CreateCache(List<ShortModelDto> dtos)
        //{
        //    var resultJson = JsonSerializer.Serialize(dtos);
        //    await _cache.SetAsync("models1page", System.Text.Encoding.UTF8.GetBytes(resultJson), new DistributedCacheEntryOptions
        //    {
        //        AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(20)
        //    });
        //}
        //private async Task CreateCache(Guid id, ShortModelDto dto)
        //{
        //    var resultJson = JsonSerializer.Serialize(dto);
        //    await _cache.SetAsync(id.ToString(), System.Text.Encoding.UTF8.GetBytes(resultJson), new DistributedCacheEntryOptions
        //    {
        //        AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30)
        //    });
        //}
    }
}

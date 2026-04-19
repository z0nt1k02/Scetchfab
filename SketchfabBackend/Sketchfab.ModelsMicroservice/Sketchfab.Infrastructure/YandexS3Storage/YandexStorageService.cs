using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Sketchfab.Application.Dtos;
using Sketchfab.Application.Interfaces;

namespace Sketchfab.Infrastructure.YandexS3Storage
{
    public class YandexStorageService(IHttpClientFactory httpClientFactory) : IYandexStorageService
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        
        public async Task<string> GetDownloadLink(string modelName)
        {
            var client = _httpClientFactory.CreateClient();
            JsonContent content = JsonContent.Create(new { fileName = modelName });

            var response = await client.PostAsync("http://localhost:5019/api/downloadlink", content);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                throw new Exception("Не удалось получить ссылку для загрузки");
            }
        }

        public async Task<Dictionary<string,string>> GetDownloadLinksAsync(List<string> modelNames)
        {
            var client = _httpClientFactory.CreateClient();
            JsonContent content = JsonContent.Create(new { modelNames = modelNames });

            var response = await client.PostAsync("http://localhost:5019/api/downloadlinks", content);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Не удалось получить ссылки для загрузки: " + response.StatusCode);
            }
            var result = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
            return result ?? new Dictionary<string, string>();
        }

        public async Task<string> GetUploadLink(string modelName)
        {
            var client = _httpClientFactory.CreateClient();

            JsonContent content = JsonContent.Create(new { fileName = modelName });

            var response = await client.PostAsync("http://localhost:5019/api/uploadlink", content);
            if (response.IsSuccessStatusCode)
            {
                string result = await response.Content.ReadAsStringAsync();
                return result;
            }
            else
            {
                throw new Exception("Не удалось получить ссылку для загрузки");
            }

        }
    }
}

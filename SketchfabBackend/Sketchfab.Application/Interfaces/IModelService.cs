
using Microsoft.AspNetCore.Http;

namespace Sketchfab.Application.Interfaces;
public interface IModelService
{
    Task<(Stream, string, string)> GetModel(Guid id);
    Task PostModel(IFormFile model, string fileName,IFormFile modelImage );   
}
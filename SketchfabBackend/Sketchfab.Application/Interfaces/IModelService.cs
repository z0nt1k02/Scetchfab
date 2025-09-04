


namespace Sketchfab.Application.Interfaces;
public interface IModelService
{
    Task<(Stream, string, string)> GetModel(string fileName);
    Task PostModel(Stream stream, string fileName);
    
}
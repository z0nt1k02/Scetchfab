namespace Sketchfab.FileService.Models
{
    public class FileModel
    {
        public Guid Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileLink { get; set; } = string.Empty;
        
    }
}

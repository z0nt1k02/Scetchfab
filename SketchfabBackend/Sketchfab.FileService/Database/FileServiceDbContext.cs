using Microsoft.EntityFrameworkCore;
using Sketchfab.FileService.Models;


namespace Sketchfab.FileService.Database
{
    public class FileServiceDbContext(DbContextOptions<FileServiceDbContext> options) : DbContext(options)
    {
        public DbSet<FileModel> Files { get; set; }        
    }
}

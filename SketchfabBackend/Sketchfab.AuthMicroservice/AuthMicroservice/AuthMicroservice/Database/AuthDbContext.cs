using AuthMicroservice.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthMicroservice.Database
{
    public class AuthDbContext(DbContextOptions<AuthDbContext> options) : DbContext(options)
    {
        public DbSet<UserEntity> Users { get; set; }
    }
}

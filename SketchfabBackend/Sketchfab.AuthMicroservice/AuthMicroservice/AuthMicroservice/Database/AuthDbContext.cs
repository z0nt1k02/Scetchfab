using AuthMicroservice.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthMicroservice.Database
{
    public class AuthDbContext : DbContext
    {
        public DbSet<UserEntity> Users { get; set; }
    }
}

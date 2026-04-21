using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sketchfab.Application.Interfaces;
using Sketchfab.Core.Entities;

namespace Sketchfab.Infrastructure.Database
{
    public class SketchfabDbContext : DbContext, ISketchfabDbContext
    {
        public DbSet<ModelEntity> Models { get; set; }
        public DbSet<LikeEntity> Likes { get; set; }
        public DbSet<CommentEntity> Comments { get; set; }
        public DbSet<ImageAssetEntity> ImageAssets { get; set; }
        public DbSet<ImageLikeEntity> ImageLikes { get; set; }
        public DbSet<ImageCommentEntity> ImageComments { get; set; }

        public SketchfabDbContext(DbContextOptions<SketchfabDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LikeEntity>(e =>
            {
                e.HasKey(l => new { l.ModelId, l.UserId });
                e.HasIndex(l => l.ModelId);
            });

            modelBuilder.Entity<CommentEntity>(e =>
            {
                e.HasKey(c => c.Id);
                e.HasIndex(c => c.ModelId);
                e.Property(c => c.Text).IsRequired();
                e.Property(c => c.Nickname).IsRequired();
            });

            modelBuilder.Entity<ImageAssetEntity>(e =>
            {
                e.HasKey(i => i.Id);
                e.Property(i => i.Title).IsRequired();
                e.Property(i => i.FileName).IsRequired();
                e.Property(i => i.Tags).HasColumnType("text[]");
                e.HasIndex(i => i.CreatorId);
                e.HasIndex(i => i.Category);
            });

            modelBuilder.Entity<ImageLikeEntity>(e =>
            {
                e.HasKey(l => new { l.ImageId, l.UserId });
                e.HasIndex(l => l.ImageId);
            });

            modelBuilder.Entity<ImageCommentEntity>(e =>
            {
                e.HasKey(c => c.Id);
                e.HasIndex(c => c.ImageId);
                e.Property(c => c.Text).IsRequired();
                e.Property(c => c.Nickname).IsRequired();
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}

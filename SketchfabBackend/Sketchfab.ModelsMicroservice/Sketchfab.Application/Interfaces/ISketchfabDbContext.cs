using Microsoft.EntityFrameworkCore;
using Sketchfab.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Application.Interfaces
{
    public interface ISketchfabDbContext
    {
        public DbSet<ModelEntity> Models { get; set; }
        public DbSet<LikeEntity> Likes { get; set; }
        public DbSet<CommentEntity> Comments { get; set; }
        public DbSet<ImageAssetEntity> ImageAssets { get; set; }
        public DbSet<ImageLikeEntity> ImageLikes { get; set; }
        public DbSet<ImageCommentEntity> ImageComments { get; set; }

        DbSet<T> Set<T>() where T : class;

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}

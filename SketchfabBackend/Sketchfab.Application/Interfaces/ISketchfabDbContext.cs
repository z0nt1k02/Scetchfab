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

        DbSet<T> Set<T>() where T : class;

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}

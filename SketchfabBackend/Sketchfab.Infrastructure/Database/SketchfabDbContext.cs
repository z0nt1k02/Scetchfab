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
        
        public SketchfabDbContext(DbContextOptions<SketchfabDbContext> options) : base(options)
        {

        }
    }
}

using Microsoft.Extensions.DependencyInjection;
using Sketchfab.Application.Interfaces;
using Sketchfab.Application.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Infrastructure
{
    public static class DIExtensions
    {
        public static void AddCustomService(this IServiceCollection services)
        {
            services.AddScoped<IModelService, ModelService>();
            services.AddScoped<IImageService, ImageService>();
        }
    }
}

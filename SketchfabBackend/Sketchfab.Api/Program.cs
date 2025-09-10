using Microsoft.EntityFrameworkCore;
using Sketchfab.Application.Interfaces;
using Sketchfab.Infrastructure;
using Sketchfab.Infrastructure.Database;

namespace Sketchfab.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var frontCorsName = "front";
            var builder = WebApplication.CreateBuilder(args);
            var services = builder.Services;
            services.AddCors(options =>
            {
                options.AddPolicy(frontCorsName, policy =>
                {
                    policy.WithOrigins(" http://localhost:5173");
                });
            });

            services.AddDbContext<ISketchfabDbContext, SketchfabDbContext>(options =>
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
            });
            // Add services to the container.
            services.AddCustomService();

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();
            app.UseCors(frontCorsName);

            app.UseAuthorization();

            
            app.MapControllers();

            app.Run();
        }
    }
}


using AuthMicroservice.Database;
using AuthMicroservice.Interfaces;
using AuthMicroservice.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
namespace AuthMicroservice
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var frontCorsName = "front";
            var builder = WebApplication.CreateBuilder(args);
            var services = builder.Services;
            var configuration = builder.Configuration;


            services.AddCors(options =>
            {
                options.AddPolicy(frontCorsName, policy =>
                {
                    policy.WithOrigins("http://localhost:5173");
                    policy.AllowAnyHeader();
                    policy.AllowAnyMethod();                    
                });
            });
            services.AddDbContext<AuthDbContext>(options =>
            {
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddSingleton<IPasswordHasher, PasswordHasher>();
            services.AddScoped<ITokenProvider, TokenProvider>();

            builder.Services.AddControllers();
            
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

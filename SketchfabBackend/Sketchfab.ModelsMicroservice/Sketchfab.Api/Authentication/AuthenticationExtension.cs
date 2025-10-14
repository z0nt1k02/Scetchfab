using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Sketchfab.Api.Authentication
{
    public static class AuthenticationExtension
    {
        public static void AddApiAuthentication(this IServiceCollection services,IConfiguration configuration)
        {
            var jwtOptions = configuration.GetSection("JwtOptions");
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = jwtOptions["Issuer"],
                    ValidAudience = jwtOptions["Audience"],
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions["Key"]!)),
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["token"];
                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = context =>
                    {
                        var token = context.Request.Cookies["token"];
                        Console.WriteLine($"Вход не был выполненен.Ваш токен: {token}");
                        // Детализация ошибки
                        if (context.Exception is SecurityTokenExpiredException)
                            Console.WriteLine("❌ Token EXPIRED");
                        else if (context.Exception is SecurityTokenInvalidAudienceException)
                            Console.WriteLine("❌ Invalid AUDIENCE");
                        else if (context.Exception is SecurityTokenInvalidIssuerException)
                            Console.WriteLine("❌ Invalid ISSUER");
                        else if (context.Exception is SecurityTokenInvalidSignatureException)
                            Console.WriteLine("❌ Invalid SIGNATURE");
                        else if (context.Exception is SecurityTokenNoExpirationException)
                            Console.WriteLine("❌ No EXPIRATION");
                        Console.WriteLine(context.Exception);
                        return Task.CompletedTask;
                    }
                    
                };
            });
            services.AddAuthorization();
        }
    }
}

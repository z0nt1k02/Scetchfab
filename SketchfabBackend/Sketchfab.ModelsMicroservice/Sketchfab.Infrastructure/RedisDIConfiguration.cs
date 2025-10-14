using Microsoft.Extensions.DependencyInjection;
using NRedisStack;
using NRedisStack.RedisStackCommands;
using StackExchange.Redis;

namespace Sketchfab.Infrastructure
{
    public static class RedisDIConfiguration
    {
        public static void AddRedisConnection(this IServiceCollection services)
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = "localhost:6379";
            });
        }
    }
}

using Amazon;
using Amazon.Runtime;
using Amazon.S3;

namespace Sketchfab.FileService
{
    public static class S3ServerConfiguration
    {
        public static void CreateServerConnection(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddSingleton<IAmazonS3>(ServiceProvider =>
            {
                string keyId = "YCAJE3gn6wDjpgxVZEpTs_6Ch";
                string secretKey = "YCN1C5d7UQnTa6PgGv_JrPS-j4YfWEgmv92RRLbu";
                string serviceUrl = "https://storage.yandexcloud.net";
                
                var settings = configuration.GetSection("ObjectStorageSettings");

                var credentials = new BasicAWSCredentials(keyId, secretKey);
                
                AmazonS3Config config = new AmazonS3Config
                {
                    ServiceURL = serviceUrl,
                    RegionEndpoint = RegionEndpoint.GetBySystemName("ru-central1")

                };

                AmazonS3Client client = new AmazonS3Client(credentials, config);
                
                return client;                                
            });

            
        }
    }
}

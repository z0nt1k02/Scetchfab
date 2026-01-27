using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Options;

namespace Sketchfab.FileService.Services
{
    public class FileLinkService
    {
        private readonly IAmazonS3 _s3client;
        private string bucketName = "sketchfabmodels";
        public FileLinkService(IAmazonS3 amazonS)
        {
            _s3client = amazonS;
        }

        public async Task<string> GenerateUploadLink(string fileName)
        {            
            var pressignedUrl = await _s3client.GetPreSignedURLAsync(new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(10)
            });
            return pressignedUrl;            
        }

        public async Task<string> GenerateDownloadLink(string fileName)
        {
            var pressignedUrl = await _s3client.GetPreSignedURLAsync(new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(10)
            });
            return pressignedUrl;
        }
        public async Task<Dictionary<string,string>> GenerateDownloadLinks(List<string> modelNames)
        {
            Dictionary<string, string> links = new Dictionary<string, string>();
            foreach(var modelName in modelNames)
            {
                try
                {
                    var pressignedUrl = await _s3client.GetPreSignedURLAsync(new GetPreSignedUrlRequest
                    {
                        BucketName = bucketName,
                        Key = modelName,
                        Verb = HttpVerb.GET,
                        Expires = DateTime.UtcNow.AddMinutes(10)
                    });
                    links.Add(modelName, pressignedUrl);
                }catch(Exception)
                {
                    links.Add(modelName, "Ошибка");        
                }               
            }
            return links;
        }
    }
}

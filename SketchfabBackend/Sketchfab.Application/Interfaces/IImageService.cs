using Sketchfab.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Application.Interfaces
{
    public interface IImageService
    {
        Task<List<ModelImageDto>> GetPreviewImagesURLs();        
    }
}

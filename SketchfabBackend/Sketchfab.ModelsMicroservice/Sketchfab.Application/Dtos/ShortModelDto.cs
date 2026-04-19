using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Application.Dtos
{
    public record class ShortModelDto(string id, string title, string fileUrl, string creatorName, string modelName, string? viewerConfig);
}

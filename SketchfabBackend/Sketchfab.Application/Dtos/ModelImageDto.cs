using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Application.Dtos
{
    public record class ModelImageDto(string url,string title);
    
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Core.Entities
{
    public class ModelEntity
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ModelName { get; set; } = string.Empty;
        public string ImageName { get; set; } = string.Empty;
    }
}

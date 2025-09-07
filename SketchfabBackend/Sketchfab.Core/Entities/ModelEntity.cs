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
        public string Name { get; set; } = string.Empty;
        public string ModelPath { get; set; } = string.Empty;
        public string ModelImagePath { get; set; } = string.Empty;
    }
}

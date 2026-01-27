using Sketchfab.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Application.Interfaces.Repositories
{
    public interface IModelRepository
    {
        List<ModelEntity> GetModels();
        ModelEntity GetModelById(Guid id);
        List<ModelEntity> GetModels(int page, int pageSize);
        
    }
}

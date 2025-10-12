using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sketchfab.Application.Interfaces
{
    public interface IRabbtiMqService
    {
        void SendMessage(object obj);
        void SendMessage(string message);
    }
}

using RabbitMQ.Client;
using Sketchfab.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Sketchfab.Application.Services
{
    public class RabbitMqService : IRabbtiMqService
    {
        public void SendMessage(object obj)
        {
            var message = JsonSerializer.Serialize(obj);
            SendMessage(message);
        }

        public async void SendMessage(string message)
        {
            var factory = new ConnectionFactory() { HostName = "localhost",Port=15672 };
            using (var connection = await factory.CreateConnectionAsync())
            using (var channel = await connection.CreateChannelAsync())
            {
                await channel.QueueDeclareAsync(queue: "MyQueue",
                               durable: false,
                               exclusive: false,
                               autoDelete: false,
                               arguments: null);

                var body = Encoding.UTF8.GetBytes(message);

                //await channel.BasicPublishAsync(exchange: "",
                //               routingKey: "MyQueue",
                //               basicProperties: null,
                //               body: body);
                //channel.BasicPublishAsync();
            
            }
        }
    }
}

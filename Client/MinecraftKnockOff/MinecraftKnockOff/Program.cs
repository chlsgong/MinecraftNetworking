using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace MinecraftKnockOff
{
    using Data = Dictionary<string, dynamic>;
    using EventHandler = Action<Dictionary<string, dynamic>>;

    class MainClass
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Starting client");

            // Initialize socket
            var wsClient = new WebSocketClient();

            // Two ways to register a new event

            // 1. Define the function as a lambda
            wsClient.RegisterEventHandler("foo", new EventHandler((data) =>
            {
                Console.WriteLine("bar");
                Console.WriteLine(data["type"]);
            }));

            // 2. Pass in an existing function
            wsClient.RegisterEventHandler("pos", new EventHandler(Print));

            wsClient.RegisterEventHandler("end", new EventHandler((data) =>
            {
                wsClient.Close();
            }));

            wsClient.RegisterEventHandler("id", new EventHandler((data) =>
            {
                string playerId = data["id"];
                Data clientData = new Data
                {
                    ["type"] = "pos",
                    ["playerId"] = playerId
                };
                wsClient.Send(JsonConvert.SerializeObject(clientData));
            }));

            // Open socket connection
            wsClient.Connect();

            Console.ReadKey(true);
        }

        public static void Print(Data data) {
            Console.WriteLine(data["type"]);
        }
    }
}

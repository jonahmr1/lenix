using System;
using CitizenFX.Core;
using static lenix_sdk.Server.Modules;

namespace lenix_sdk.Server {
	public class ServerMain : BaseScript {
		public ServerMain() {
			Debug.WriteLine("Hi from lenix_sdk.Server!");

			EventHandlers["defineCommand"] += new Action<string, string>((command, eventName) =>
			{
				DefineCommand(command, (source) =>
				{
					TriggerClientEvent(Players[source], eventName);
				});
			});
		}

		[Command("hello_server")]
		public void HelloServer() {
			Debug.WriteLine("Sure, hello.");
		}
	}
}
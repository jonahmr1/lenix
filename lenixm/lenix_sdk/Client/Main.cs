using System;
using CitizenFX.Core;
using static CitizenFX.Core.Native.API;
using System.Collections.Generic;

public class Main : BaseScript
{
  private readonly string ShowMenuEventName = "showMenu";
  private readonly string NuiCallbacksParameter = "RawCommand";
  public Main()
  {
    EventHandlers[ShowMenuEventName] += new Action(() =>
    {
      SendNuiMessage("{\"action\": \"showMenu\"}");
      SetNuiFocus(true, true);
    });

    TriggerServerEvent("defineCommand", "sdk", ShowMenuEventName);

    RegisterNuiCallback("execute", new Action<IDictionary<string, object>, CallbackDelegate>((data, callback) =>
    {
      string rawCommand = data[NuiCallbacksParameter].ToString();
      // TODO: figure a solution for the "Access denied for command ${this.rawCommand}"
      ExecuteCommand(rawCommand);
      callback("ok");
    }));

    RegisterNuiCallback("hideMenu", new Action<IDictionary<string, object>, CallbackDelegate>((data, callback) =>
    {
      SetNuiFocus(false, false);
      callback("ok");
    }));
  }
}
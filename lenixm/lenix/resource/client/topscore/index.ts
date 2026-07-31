import { triggerServerCallback } from "@overextended/ox_lib/client";

console.debug(await triggerServerCallback('lenix:server:topscore:getData', null))
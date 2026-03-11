import { world, system } from '@minecraft/server';
import { updatePlaytime, sendMessage } from '../runs/run';

world.afterEvents.playerSpawn.subscribe(({ player }) => {

    updatePlaytime(player.name, 'load');

    system.run(() => {

        const playtime = JSON.parse(world.getDynamicProperty('playtime'));
        const playerSave = playtime.player[player.name]
        const settings = playtime.settings
        const getReset = settings.reset

        if (playerSave.playtime === 0) {

            if (settings?.kick_operators === undefined || settings?.kick_operators === true) {

                if (player.commandPermissionLevel >= 1) {

                    sendMessage('playtime.events.SpawnLeave.opInfo', { name: player.name });
                    return;
                }
            }

            player.runCommand(`kick "${player.name}" §l§cPlaytime limit reached§r\n\n§6You have reached your daily playtime limit.\nCome back at §l${getReset.h}:${getReset.m}`);
        }
    })
})

world.afterEvents.playerLeave.subscribe(({ playerName }) => {

    updatePlaytime(playerName, 'save');
})

world.afterEvents.playerInputModeChange.subscribe(({ player }) => {

    system.run(() => {
        world.sendMessage(`${player.name}`);
    })
})
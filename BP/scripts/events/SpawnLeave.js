import { world, system } from '@minecraft/server';
import { updatePlaytime } from '../runs/run';

world.afterEvents.playerSpawn.subscribe(({ player }) => {

    updatePlaytime(player.name, 'load');

    system.run(() => {

        const playtime = JSON.parse(world.getDynamicProperty('playtime'));
        const playerSave = playtime.player[player.name]
        const getReset = playtime.settings.reset

        if (playerSave.playtime === 0) {

            player.runCommand(`kick "${player.name}" §l§cPlaytime limit reached§r\n\n§6You have reached your daily playtime limit.\nCome back at §l${getReset.h}:${getReset.m}`);
        }
    })
})

world.afterEvents.playerLeave.subscribe(({ playerName }) => {

    updatePlaytime(playerName, 'save');
})
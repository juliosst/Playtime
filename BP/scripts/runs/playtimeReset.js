import { world, system } from '@minecraft/server';
import { updatePlaytime } from './run';

let resetTimeout;

function resetPlayer() {

    system.run(() => {

        const playtime = JSON.parse(world.getDynamicProperty('playtime'));

        playtime.player = {}

        world.setDynamicProperty('playtime', JSON.stringify(playtime));

        for (const player of world.getPlayers()) {

            updatePlaytime(player.name, 'load');
        }
    })
}

export function playtimeReset() {

    if (resetTimeout) {
        system.clearRun(resetTimeout);
    }

    system.run(() => {

        const playtime = JSON.parse(world.getDynamicProperty('playtime'));
        const getClock = playtime.settings.clock
        const getReset = playtime.settings.reset

        const date = new Date();

        date.setHours(date.getHours() - getClock.h);
        date.setMinutes(date.getMinutes() - getClock.m);
        date.setSeconds(date.getSeconds() - getClock.s);

        const sec = date.getSeconds();
        const min = date.getMinutes();
        const hr = date.getHours();

        const time = date.getDate() + date.getMonth() * 30 + date.getFullYear() * 350

        playtime.start = time

        if (time !== playtime.start) {
            resetPlayer()
        }

        const reset = getReset.s + getReset.m * 60 + getReset.h * 3600
        const nowTime = sec + min * 60 + hr * 3600;

        const ticks = (reset - nowTime + 86400) % 86400; // Sind eigentlich keine ticks heißt aber trozdem so :)

        system.runTimeout(() => {

            system.runTimeout(() => {

                playtimeReset();
            }, 40)

            resetPlayer();

        }, ticks * 20);

        world.setDynamicProperty('playtime', JSON.stringify(playtime));
    })
}
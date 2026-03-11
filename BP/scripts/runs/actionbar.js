import { world, system } from '@minecraft/server';

let actionbar

export function runActionbar() {

    if (actionbar) {
        system.clearRun(actionbar);
    }

    system.run(() => {

        const playtime = JSON.parse(world.getDynamicProperty('playtime'));
        const getClock = playtime.settings.clock
        const sett = playtime.settings

        if (sett.actionbar) {

            actionbar = system.runInterval(() => {

                for (const player of world.getPlayers()) {

                    const playerSave = playtime.player[player.name]

                    const minus = Date.now() - playerSave.join
                    const onlineTime = playerSave.join ? (playerSave.playtime - minus) : playerSave.playtime

                    const gtime = Math.max(0, Math.floor(onlineTime / 1000))

                    const sec = Math.floor(gtime % 60)
                    const min = Math.floor((gtime % 3600) / 60)
                    const hr = Math.floor(gtime / 3600)

                    const clock = new Date();

                    clock.setHours(clock.getHours() - getClock.h);
                    clock.setMinutes(clock.getMinutes() - getClock.m);
                    clock.setSeconds(clock.getSeconds() - getClock.s);

                    player.runCommand(`titleraw @s actionbar {"rawtext":[{"translate":"playtime.runs.actionbar","with":["${hr}","${min}","${sec}","${clock.getHours()}","${clock.getMinutes()}","${clock.getSeconds()}"]}]}`);
                }

            }, 10);
        }
    });
}
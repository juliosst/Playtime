import { world, system } from '@minecraft/server';
import { sendMessage } from '../runs/run';

export function playtime(senders) {

    system.run(() => {

        const playtime = JSON.parse(world.getDynamicProperty('playtime'));
        const getClock = playtime.settings.clock
        const sender = senders.sourceEntity;

        const playerSave = playtime.player[sender.name]

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

        sendMessage('playtime.commands.playtime.reason', { name: sender.name, withs: [`${hr}`, `${min}`, `${sec}`, `${clock.getHours()}`, `${clock.getMinutes()}`, `${clock.getSeconds()}`] });
    });
}
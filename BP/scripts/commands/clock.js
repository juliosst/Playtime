import { world, system } from '@minecraft/server';
import { playtimeReset } from '../runs/playtimeReset';
import { runActionbar } from '../runs/actionbar';
import { sendMessage } from '../runs/run';

export function clock(senders, mod, h, m, s) {

    const sender = senders.sourceEntity

    system.run(() => {

        const playtime = JSON.parse(world.getDynamicProperty('playtime'));

        if (mod === 'time') {

            const getClock = playtime.settings.clock
            const clock = new Date();

            if (s === undefined) {
                getClock.s = 0
            } else {
                getClock.s = clock.getSeconds() - s
            }

            if (m === undefined) {
                getClock.m = 0
            } else {
                getClock.m = clock.getMinutes() - m
            }

            if (h === undefined) {
                getClock.h = 0
            } else {
                getClock.h = clock.getHours() - h
            }

            sendMessage('playtime.commands.clock.setTime', { name: sender.name, withs: [`${clock.getHours() - getClock.h}`, `${clock.getMinutes() - getClock.m}`, `${clock.getSeconds() - getClock.s}`] });
        }

        if (mod === 'reset') {

            const hr = Math.min(Math.max(0, (h ?? 0)), 23);
            const min = Math.min(Math.max(0, (m ?? 0)), 59);
            const sec = Math.min(Math.max(0, (s ?? 0)), 59);

            playtime.settings.reset = { s: sec, m: min, h: hr }

            sendMessage('playtime.commands.clock.setReset', { name: sender.name, withs: [`${hr}`, `${min}`, `${sec}`] });
        }

        world.setDynamicProperty('playtime', JSON.stringify(playtime));
    })

    if (mod !== 'time' && mod !== 'reset') {
        sendMessage('playtime.error.invalidOption', { name: sender.name, withs: [mod] });
    }

    runActionbar();
    playtimeReset();
}
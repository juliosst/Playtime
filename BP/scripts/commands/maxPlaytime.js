import { world, system } from '@minecraft/server';
import { sendMessage } from '../runs/run';

export function maxPlaytime(senders, s, m, h) {

    system.run(() => {

        const playtime = JSON.parse(world.getDynamicProperty('playtime'));
        const settings = playtime.settings
        const sender = senders.sourceEntity

        if (s === undefined && m === undefined && h === undefined) {

            const rTime = Math.floor(settings.maxPlaytime / 1000)

            const sec = Math.floor(rTime % 60)
            const min = Math.floor((rTime % 3600) / 60)
            const hr = Math.floor(rTime / 3600)

            sendMessage('playtime.commands.maxPlaytime.get', { name: sender.name, withs: [`${hr}`, `${min}`, `${sec}`] });

        } else {

            const time = (s ?? 0) + ((m ?? 0) * 60) + ((h ?? 0) * 3600)

            settings.maxPlaytime = (time * 1000)

            world.setDynamicProperty('playtime', JSON.stringify(playtime));

            const sec = Math.floor(time % 60)
            const min = Math.floor((time % 3600) / 60)
            const hr = Math.floor(time / 3600)

            sendMessage('playtime.commands.maxPlaytime.set', { name: sender.name, withs: [`${hr}`, `${min}`, `${sec}`] });
        }
    })
}
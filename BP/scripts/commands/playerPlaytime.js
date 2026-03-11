import { world, system } from '@minecraft/server';
import { sendMessage, updatePlaytime, getPlayerList } from '../runs/run';


export function playerPlaytime(senders, option, name, s = 0, m = 0, h = 0) {

    getPlayerList();

    system.run(() => {

        const playtime = JSON.parse(world.getDynamicProperty('playtime'));
        const sender = senders.sourceEntity

        playtime.player[name] ??= {}

        const playerSave = playtime.player[name]

        if (option !== 'get' && option !== 'set' && option !== 'reset') {
            sendMessage('playtime.error.invalidOption', { name: sender.name, withs: [option] });
            return;
        }

        if (option === 'get') {

            if (playerSave?.playtime === undefined) {

                sendMessage('playtime.error.notExist', { name: sender.name, withs: [name] });
            } else {

                const minus = Date.now() - playerSave.join
                const onlineTime = playerSave.join ? (playerSave.playtime - minus) : playerSave.playtime

                const gtime = Math.max(0, Math.floor(onlineTime / 1000))

                const sec = Math.floor(gtime % 60)
                const min = Math.floor((gtime % 3600) / 60)
                const hr = Math.floor(gtime / 3600)

                sendMessage('playtime.commands.playerPlaytime.remainingTime', { name: sender.name, withs: [`${hr}`, `${min}`, `${sec}`] });
            }
        }

        if (option === 'reset') {

            sendMessage('playtime.commands.playerPlaytime.reset', { name: sender.name, withs: [name] });
            delete playtime.player[name]
        }

        if (option === 'set') {

            const time = s + m * 60 + h * 3600

            playerSave.playtime = time * 1000

            if (getPlayerList(name)) {

                playerSave.join = Date.now();
            }

            const sec = Math.floor(time % 60)
            const min = Math.floor((time % 3600) / 60)
            const hr = Math.floor(time / 3600)

            sendMessage('playtime.commands.playerPlaytime.set', { name: sender.name, withs: [name, `${hr}`, `${min}`, `${sec}`] });
        }

        world.setDynamicProperty('playtime', JSON.stringify(playtime));

        if (option !== 'get') {

            if (getPlayerList(name)) {

                updatePlaytime(name, 'load');
            }
        }
    })
}
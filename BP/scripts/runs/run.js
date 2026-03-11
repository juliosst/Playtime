import { world, system } from '@minecraft/server';
import { playtimeReset } from './playtimeReset';
import { runActionbar } from './actionbar';
import { installSave } from './install';

import '../commands/registry';
import '../events/event';

playtimeReset();
installSave();

export let playerList = [];

export const timeout = {}, dmaxPlaytime = 7200000;
export const moduls = ['debug', 'kick_operators', 'reset_all', 'reset_settings', 'actionbar']

export function sendMessage(message, { withs = [], name } = {}) {

    system.run(() => {

        const msg = { translate: String(message), with: [...withs] }

        if (name === undefined) {

            world.sendMessage(msg);

        } else {

            for (const player of world.getPlayers().filter((p) => p.name === name)) {

                player.sendMessage(msg);
            }
        }
    })
}

export function getPlayerList(name) {

    if (name === undefined) {

        system.run(() => {

            playerList = world.getPlayers().map((p) => p.name);
        });

    } else {

        if (playerList.includes(name)) return true;
        if (!playerList.includes(name)) return false;
    }
}

function cMessageKick(name) {

    if (timeout[name]) {

        function clear(time) {

            if (timeout[name][time]) {

                system.clearRun(timeout[name][time])
            }
        }

        for (let a = 0; a <= 10; a++) {
            clear(a);
        }

        clear(60);
    }
}

export function messageKick(name) {

    cMessageKick(name);

    system.run(() => {

        const playtime = JSON.parse(world.getDynamicProperty('playtime'));
        const ps = playtime.player[name];

        timeout[name] = {}

        function msg(time) {

            const rPlaytime = ps.playtime - (Date.now() - ps.join);
            const ticks = (rPlaytime - (time * 1000)) / 50
            const getReset = playtime.settings.reset

            if (ticks > 0) {

                const setTime = timeout[name]

                setTime[time] = system.runTimeout(() => {

                    sendMessage('playtime.runs.run.timeRunningOut', { name, withs: [`${time}`] });

                    if (time === 0) {

                        for (const player of world.getPlayers().filter((r) => r.name === name)) {

                            player.runCommand(`kick "${player.name}" §l§cPlaytime limit reached§r\n\n§6You have reached your daily playtime limit.\nCome back at §l${getReset.h}:${getReset.m}`);
                        }
                    }
                }, ticks);
            }
        }

        for (let a = 0; a <= 10; a++) {
            msg(a);
        }

        msg(60);
    })
}

export function updatePlaytime(name, mode) {

    installSave();

    system.run(() => {

        const playtime = JSON.parse(world.getDynamicProperty('playtime'));
        const maxPlaytime = playtime.settings?.maxPlaytime ?? dmaxPlaytime;

        playtime.player[name] ??= {};

        const sett = playtime.settings
        const playerSave = playtime.player[name];
        const time = playerSave.playtime ?? maxPlaytime;
        const join = playerSave.join ? (Date.now() - playerSave.join) : 0;

        playerSave.playtime = Math.max(0, time - join);

        if (mode === 'load') {

            playerSave.join = Date.now();

            messageKick(name);

            if (sett.actionbar) {

                runActionbar();
            }
        }

        if (mode === 'save') {

            delete playerSave.join;
            cMessageKick(name);
        }

        world.setDynamicProperty('playtime', JSON.stringify(playtime));
    });
}

system.run(() => {

    const playtime = JSON.parse(world.getDynamicProperty('playtime'));

    if (playtime.settings.debug) {

        world.sendMessage(`§l§6Debug: §r§a${world.getDynamicProperty('playtime')}`);
    }

    for (const player of world.getPlayers()) {

        updatePlaytime(player.name, 'load');
    }
})
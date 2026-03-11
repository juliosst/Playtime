import { world, system } from '@minecraft/server';

import { sendMessage, moduls, updatePlaytime } from '../runs/run';
import { runActionbar } from '../runs/actionbar';
import { installSave } from '../runs/install';

let resetConfirm = {}
let timeout = {}

export function settings(senders, modul, boolean) {

    system.run(() => {

        let playtime = JSON.parse(world.getDynamicProperty('playtime'));
        const sender = senders.sourceEntity;

        if (!moduls.includes(modul)) {
            sendMessage('playtime.error.invalidOption', { name: sender.name, withs: [modul] });
            return;
        }

        if (modul !== 'reset_all' && modul !== 'reset_settings') {

            if (boolean === undefined) {

                const mode = playtime?.settings[modul] ?? 'default'

                sendMessage('playtime.commands.settings.status', { name: sender.name, withs: [modul, mode] });

            } else {

                playtime.settings[modul] = boolean

                world.setDynamicProperty('playtime', JSON.stringify(playtime));

                sendMessage('playtime.commands.settings.setStatus', { name: sender.name, withs: [modul, `${boolean}`] });
            }

        } else {

            if (!resetConfirm[sender.name]) {

                sendMessage('playtime.commands.settings.confirmReset', { name: sender.name, withs: [modul] });

                resetConfirm[sender.name] = true

                timeout[sender.name] = system.runTimeout(() => {

                    sendMessage('playtime.commands.settings.stopReset', { name: sender.name });
                    delete resetConfirm[sender.name]
                }, 600)

            } else if (resetConfirm[sender.name]) {

                sendMessage('playtime.commands.settings.successReset', { name: sender.name });

                system.clearRun(timeout[sender.name])
                delete resetConfirm[sender.name]

                if (modul === 'reset_settings') {
                    playtime.settings = {}
                }

                if (modul === 'reset_all') {

                    playtime = {}

                    for (const player of world.getPlayers()) {

                        updatePlaytime(player.name, 'load');
                    }
                }

                world.setDynamicProperty('playtime', JSON.stringify(playtime));
                installSave();
            }
        }

        runActionbar();
    })
}
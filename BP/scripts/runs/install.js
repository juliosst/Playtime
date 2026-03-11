import { world, system } from '@minecraft/server';
import { dmaxPlaytime } from '../runs/run';

export function installSave() {

    system.run(() => {

        if (!world.getDynamicProperty('playtime')) {
            world.setDynamicProperty('playtime', JSON.stringify({}))
        }

        let playtime = JSON.parse(world.getDynamicProperty('playtime'));

        playtime = {
            settings: playtime.settings ??= {},
            player: playtime.player ??= {},
            start: playtime.start ??= 0
        }

        playtime.settings.maxPlaytime ??= dmaxPlaytime
        playtime.settings.clock ??= {}
        playtime.settings.reset ??= {}

        playtime.settings.clock = {
            h: playtime.settings.clock.h ??= 0,
            m: playtime.settings.clock.m ??= 0,
            s: playtime.settings.clock.s ??= 0
        }

        playtime.settings.reset = {
            h: playtime.settings.reset.h ??= 0,
            m: playtime.settings.reset.m ??= 0,
            s: playtime.settings.reset.s ??= 0
        }

        world.setDynamicProperty('playtime', JSON.stringify(playtime));
    })
}
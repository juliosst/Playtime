import { system, CustomCommandParamType } from '@minecraft/server';

import { playerPlaytime } from './playerPlaytime';
import { maxPlaytime } from './maxPlaytime';
import { playtime } from './playtime';
import { settings } from './settings';
import { moduls } from '../runs/run';
import { clock } from './clock';

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {

    customCommandRegistry.registerEnum('time:modul', moduls);
    customCommandRegistry.registerEnum('time:clock-mod', ['reset', 'time']);
    customCommandRegistry.registerEnum('time:option', ['get', 'set', 'reset']);

    customCommandRegistry.registerCommand({
        name: 'time:settings',
        description: 'playtime.commands.registry.settings',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.Enum, name: 'time:modul' }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Boolean, name: 'activation' }
        ]
    }, settings);

    customCommandRegistry.registerCommand({
        name: 'time:max-playtime',
        description: 'playtime.commands.registry.max-playtime',
        permissionLevel: 1,
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: 'sec' },
            { type: CustomCommandParamType.Integer, name: 'min' },
            { type: CustomCommandParamType.Integer, name: 'hr' }
        ]
    }, maxPlaytime);

    customCommandRegistry.registerCommand({
        name: 'time:player-playtime',
        description: 'playtime.commands.registry.player-playtime',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.Enum, name: 'time:option' },
            { type: CustomCommandParamType.String, name: 'name' }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: 'sec' },
            { type: CustomCommandParamType.Integer, name: 'min' },
            { type: CustomCommandParamType.Integer, name: 'hr' }
        ]
    }, playerPlaytime);

    customCommandRegistry.registerCommand({
        name: 'time:clock',
        description: 'playtime.commands.registry.clock',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.Enum, name: 'time:clock-mod' }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: 'hr' },
            { type: CustomCommandParamType.Integer, name: 'min' },
            { type: CustomCommandParamType.Integer, name: 'sec' }
        ]
    }, clock);

    customCommandRegistry.registerCommand({
        name: 'time:playtime',
        description: 'playtime.commands.registry.playtime',
        permissionLevel: 0
    }, playtime)
})
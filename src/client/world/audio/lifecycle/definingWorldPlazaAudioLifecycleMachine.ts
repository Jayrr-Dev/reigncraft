/**
 * Coarse app-to-audio lifecycle statechart.
 *
 * Asset, voice, and music hot paths use specialized stores. This statechart
 * only models screen/session transitions where entry/exit ordering matters.
 *
 * @module components/world/audio/lifecycle/definingWorldPlazaAudioLifecycleMachine
 */

import type { DefiningStateMachineDefinition } from '@/lib/stateMachine/definingStateMachineTypes';

export const DEFINING_WORLD_PLAZA_AUDIO_LIFECYCLE_MACHINE_ID =
  'world-plaza.audio.lifecycle';

export const DEFINING_WORLD_PLAZA_AUDIO_LIFECYCLE_MACHINE: DefiningStateMachineDefinition =
  {
    id: DEFINING_WORLD_PLAZA_AUDIO_LIFECYCLE_MACHINE_ID,
    version: 1,
    initial: 'home',
    states: {
      home: {
        kind: 'atomic',
        onEnter: ['audio.releaseWorldScopes', 'audio.restoreVolumeAfterDeath'],
      },
      'boot.assets': { kind: 'atomic' },
      'boot.spawn': { kind: 'atomic' },
      'world.alive': { kind: 'atomic' },
      'world.dead': {
        kind: 'atomic',
        onEnter: ['audio.playDeathSfx', 'audio.fadeOutOnDeath'],
      },
      error: { kind: 'atomic' },
    },
    transitions: [
      { from: 'home', to: 'boot.assets', event: 'SESSION_STARTED' },
      { from: 'boot.assets', to: 'boot.spawn', event: 'ASSETS_READY' },
      { from: 'boot.spawn', to: 'world.alive', event: 'SPAWN_READY' },
      { from: 'world.alive', to: 'world.dead', event: 'PLAYER_DIED' },
      {
        from: 'world.dead',
        to: 'world.alive',
        event: 'PLAYER_RESPAWNED',
        actions: ['audio.fadeInOnRespawn'],
      },
      { from: 'boot.*', to: 'error', event: 'BOOT_FAILED', priority: 100 },
      { from: 'error', to: 'boot.assets', event: 'RETRY' },
      { from: '*', to: 'home', event: 'EXIT_HOME', priority: 200 },
    ],
  };

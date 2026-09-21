---
title: Character controllers
description: Use the character controller component in Hyperion Engine for player movement: movement and jump settings, input, and network prediction.
lede: The character controller handles walking, running and jumping, with collision against the world.
summary: Walking, running and jumping.
---

## Adding one

Add a `CharacterControllerComponent` to an entity. By default it's driven by keyboard input:

| Action | Key |
|---|---|
| Move | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> |
| Sprint | <kbd>Shift</kbd> |
| Jump | <kbd>Space</kbd> |

`isOnGround` is true while it's standing on something.

## Movement settings

| Setting | What it does |
|---|---|
| moveSpeed | Walking speed. Starts at 5. |
| sprintSpeed | Running speed. Starts at 7.5. |
| stepHeight | The tallest step it can walk straight up. |
| maxSlopeAngle | The steepest slope it can walk up, in degrees. Starts at 45. |

## Jump settings

| Setting | What it does |
|---|---|
| speed | Initial jump speed. |
| coyoteTime | Grace period for jumping after leaving a ledge. |
| bufferTime | How early before landing a jump press still counts. |

## In multiplayer

The local player's movement is predicted on the client, so input responds immediately. The server validates each move and corrects the client if they disagree. More in [replication](/docs/multiplayer/replication.html).

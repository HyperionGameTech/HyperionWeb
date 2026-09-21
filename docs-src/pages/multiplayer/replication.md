---
title: Replication & prediction
description: How replication works in Hyperion Engine: replicating entities, interpolation and dead reckoning, and client-side prediction for player movement.
lede: The server runs the authoritative game state and sends updates to clients, which interpolate and predict between them.
summary: How the server keeps clients in sync.
---

## Replicating an entity

Add the `Replicated` tag on the server:

```cpp
entity->AddTag<EntityTag::Replicated>();
```

The server assigns it a network ID and sends its transform (plus velocities, for physics bodies) to clients.

Clients only receive updates for entities within 50 units of them.

## Interpolation

Updates don't arrive every frame, so clients render slightly behind and interpolate between the last couple of updates. When updates are late, dead reckoning guesses where things are headed.

| CVar | What it does |
|---|---|
| Net.InterpolationEnabled | Turns interpolation on or off. |
| Net.InterpolationDelay | How far behind to stay, in seconds. Starts at 0.1. |
| Net.DeadReckoning | Turns dead reckoning on or off. |

## Client-side prediction

The local player's movement is predicted:

::: steps
1. The client applies the move immediately and sends it to the server.

2. The server replays the move and acknowledges the resulting position.

3. The client compares that with its prediction and corrects any difference.
:::

If the client and server end up too far apart (more than `Net.CorrectionThreshold`), the client smoothly corrects over `Net.CorrectionSmoothingTime`.

## Authority

The server has authority. So does a game that isn't connected to anything, like single player. On clients, replicated physics bodies are driven by server updates.

## Not yet supported

There are no RPCs yet, and you can't replicate individual properties. Replication currently covers whole entities and their transforms.

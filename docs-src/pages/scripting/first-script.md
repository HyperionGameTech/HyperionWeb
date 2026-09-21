---
title: Your first script
description: Create your first Strata script in the Hyperion editor, attach it to an entity, and learn the script lifecycle and live reload.
lede: Create a Strata script, attach it to an entity, and make the entity move.
summary: Attach a script to an entity and make it move.
---

## Create a script

::: steps
1. Select an entity in the **Scene** panel.

2. In the **Inspector**, find the **Script** section and hit **New**.

3. Choose **Strata** and give it a name.
:::

The editor adds a `ScriptComponent` to the entity for you, and saves the file to `Scripts/<Name>.strata` in your project. The new script looks like this:

```strata
import Engine;

Entity g_entity;

void OnAdded(const Entity entity)
{
    g_entity = entity;
}

void Update(float delta)
{
}

void Destroy()
{
}
```

## Lifecycle

| Function | When it's called |
|---|---|
| OnAdded | When play starts. Receives the entity the script is attached to. |
| Update | Every frame while the game is running. `delta` is the time since the last frame. |
| Destroy | When the entity goes away, or you stop playing. |

All three are optional. A missing one logs a warning once.

Each entity gets its own copy of the script's globals, so entities sharing a script don't share state.

## Moving the entity

Fill in `Update`:

```strata
void Update(float delta)
{
    g_entity.Translate(float3(0.0, delta, 0.0));
}
```

Press **Play** and the entity moves upward.

## Live reload

Saving the file recompiles it in the editor. Entities using the script get `Destroy`, the new code is loaded, and `OnAdded` runs again.

Globals are reset on reload.

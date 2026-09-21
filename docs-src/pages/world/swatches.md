---
title: Swatches
description: Use swatches in Hyperion Engine to keep variations of a world, like different times of day, each with its own baked lighting.
lede: Swatches are variations of a world, like *Noon* and *Dusk*, each with its own property overrides and baked lighting.
summary: Variations of a world, each with its own baked lighting.
---

## What's in a swatch

Every world starts out with a swatch called *Default*. Additional swatches can override entity properties, such as the sun angle or light colors. Anything that isn't overridden is shared.

Lightmaps and probes are baked per swatch, so each swatch has its own baked lighting rather than relying on realtime lighting when the time of day changes.

## In the editor

The active swatch is shown in the toolbar. Add a new swatch, make it active, then edit the scene. Changes you make while a swatch is active are saved as overrides for that swatch.

## From code

```cpp
world->GetOrCreateSwatch(NAME("Dusk"));
world->SetActiveSwatch(NAME("Dusk"));
```

Switching applies that swatch's overrides and swaps in its baked lighting. A world can have up to 64 swatches.

::: note
Properties tagged `NoSwatchOverride` can't be overridden, and are always shared across swatches.
:::

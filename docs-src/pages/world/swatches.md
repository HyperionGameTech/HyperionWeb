---
title: Swatches
description: Use swatches in Hyperion Engine to keep variations of a world, like different times of day, each with its own baked lighting.
lede: Variations of your world, with different sets for lighting (or other properties)
summary: Variations of your world, with different sets for lighting (or other properties)
---

## High level overview.

Every world starts out with a swatch called *Default*. Additional swatches can override entity properties, such as the sun angle or light colors. Anything that isn't overridden is shared.

Lightmaps and probes are baked per swatch, so each swatch has its own baked lighting rather than relying on realtime lighting when the time of day changes.

## In the editor

The active swatch is shown in the toolbar, next to :icon[roller]. Add one with **New Swatch...** in that menu and make it active.

With **Override Edits** on, changes you make are saved as overrides for the active swatch. With it off, they apply to the base as well.

::: note
Missing info on this page on how to dynamically set the World's active Swatch from scripts
:::
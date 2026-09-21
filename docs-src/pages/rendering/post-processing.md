---
title: Post-processing
description: Post-processing in Hyperion Engine - bloom, TAA, tonemapping, exposure, fog and clouds, and where to configure them.
lede: Effects applied to the scene
summary: Bloom, TAA, tonemapping, exposure and fog.
---

## Effects

| Effect | Notes |
|---|---|
| Bloom | Glow around bright areas. Tuned with `Rendering.BloomThreshold` and `Rendering.BloomIntensity`. |
| TAA | Smooths out jagged edges over a few frames. |
| Tonemapping | AgX, AgX Punchy, ACES, PBR Neutral or Reinhard. |
| Exposure and color | Exposure compensation, white balance, saturation and contrast. |
| Fog and clouds | Height fog, fog volumes and clouds. |

## Per-world settings

Tonemapping, exposure, color, fog and clouds are per-world settings, under **World Settings** in the :icon[settings-gear] gear menu.

## Toggles

The heavier effects can be toggled with [console variables](/docs/editor/console.html) or config file changes.

| CVar | Controls |
|---|---|
| Rendering.Bloom | Bloom |
| Rendering.TAA | TAA |
| Rendering.FogVolumes | Fog volumes |
| Rendering.Clouds | Clouds |

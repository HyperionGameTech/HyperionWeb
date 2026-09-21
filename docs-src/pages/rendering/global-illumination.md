---
title: Global illumination
description: Global illumination options in Hyperion Engine: baked lightmaps, SSGI, SSR, HBAO, ray-traced DDGI and reflections, and the console variables that toggle them.
lede: Global illumination is indirect light: light that bounces off surfaces. Hyperion supports several techniques, from fully baked to realtime ray traced.
summary: The GI options, and how to toggle them.
---

## Options

| What | What it does | Needs |
|---|---|---|
| Lightmaps | Baked bounce light for static geometry. See [baking](/docs/rendering/baking.html). | Anything |
| SSGI | Bounce light worked out from what's on screen. | Anything |
| SSR | Reflections from what's on screen. | Anything |
| HBAO | Soft shadows in corners and crevices. | Anything |
| DDGI | Realtime bounce light from ray-traced probes. | Ray tracing GPU |
| RT reflections | Ray-traced reflections, including things that are off screen. | Ray tracing GPU |

These can be combined. A typical setup is baked lightmaps and probes, with SSR and HBAO on top.

## Toggles

Each has a console variable. Toggle them from the [console](/docs/editor/console.html); defaults are set in `Config/EngineConfig.json`:

| CVar | Controls |
|---|---|
| Rendering.LightmapVolumes | Baked lightmaps |
| Rendering.SSGI | SSGI |
| Rendering.SSR | SSR |
| Rendering.HBAO | HBAO |
| Rendering.DDGI | DDGI |
| Rendering.RayTracing.RayTracedReflections | RT reflections |

DDGI and ray-traced reflections also have to be enabled per world, under **World Settings** in the gear menu.

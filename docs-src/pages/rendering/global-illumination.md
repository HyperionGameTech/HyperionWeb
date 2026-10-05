---
title: Global illumination
description: Global illumination options in Hyperion Engine: baked lightmaps, Glimmer realtime GI, SSR, HBAO, ray-traced DDGI and reflections, and the console variables that toggle them.
lede: Global illumination is indirect light: light that bounces off surfaces. Hyperion supports several techniques, from fully baked to realtime, with or without ray tracing hardware.
summary: The GI options, and how to toggle them.
---

## Options

| What | What it does | Needs HWRT? |
|---|---|:---:|
| Lightmaps | Baked bounce light for static geometry. See [baking](/docs/rendering/baking.html). | |
| Glimmer | Realtime bounce light and sky occlusion, traced in software. Desktop only. On by default. | |
| SSGI | Bounce light worked out from what's on screen. | |
| SSR | Reflections from what's on screen. | |
| HBAO | Soft shadows in corners and crevices. | |
| DDGI | Realtime bounce light from ray-traced probes. | ✓ |
| RT reflections | Ray-traced reflections, including things that are off screen. | ✓ |

These can be combined. A typical setup is baked lightmaps and probes, with SSR and HBAO on top.

## Glimmer

Glimmer is Hyperion's own realtime GI. It traces rays in compute shaders rather than with ray tracing hardware, and nothing needs baking: move the sun or a wall and the bounce light follows. It runs on desktop: Windows and macOS, on both Vulkan and DirectX 12.

- Near the camera it traces against the scene's meshes; terrain and the distance use a cheaper heightfield.
- Probes are placed around solid geometry, so light doesn't leak through walls.
- Lightmapped surfaces keep their lightmaps. Glimmer lights everything else.
- Sky reflections are dimmed where the sky is blocked, so interiors don't glow with sky color.

It's meant for large outdoor worlds, where baking isn't practical. Turn it off per world with **Glimmer GI** in **World Settings**, or scale it with `Rendering.Glimmer.Intensity`.

## Toggles

Each has a console variable. Toggle them from the [console](/docs/editor/console.html); defaults are set in `Config/EngineConfig.json`:

| CVar | Controls |
|---|---|
| Rendering.LightmapVolumes | Baked lightmaps |
| Rendering.Glimmer.Enabled | Glimmer |
| Rendering.SSGI | SSGI |
| Rendering.SSR | SSR |
| Rendering.HBAO | HBAO |
| Rendering.DDGI | DDGI |
| Rendering.RayTracing.RayTracedReflections | RT reflections |

Glimmer, DDGI and ray-traced reflections are also set per world, under **World Settings** in the :icon[settings-gear] gear menu. Glimmer and ray-traced reflections start on there; DDGI starts off.

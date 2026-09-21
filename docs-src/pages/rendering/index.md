---
title: Rendering & lighting
description: An overview of rendering in Hyperion Engine: Vulkan and DirectX 12, clustered shading, baked lightmaps, ray-traced GI and HLSL shaders.
lede: 
summary: Materials, baked lighting, GI, shaders and post-processing.
hero: /assets/editor-scene.jpg
hero_alt: A brick-walled room with a red sphere, coloured boxes and a pillar, in the Hyperion editor viewport
hero_crop: 717 232 1830 773
---

## Overview

- **Vulkan** is the main backend. DirectX 12 is available on Windows as an experimental backend.
- **Clustered deferred shading** supports large numbers of dynamic lights. Translucent materials use a forward clustered pass.
- **Baked lighting** comes from the lightmapper built into the editor, along with reflection and irradiance probes for moving objects.
- **Realtime GI & reflections**: In addition to our baked lighting, we *do* support realtime GI for HWRT-supported devices.
   (DDGI and ray traced reflections). For non-HWRT we have screen space reflections. _Screen space global illumination deprecatation is planned so it is not recommended to use_
- **Shaders** are written in HLSL, compiled with DXC, and reload live in the editor on save

## In this section

::: cards
children
:::

## TODO

::: soon
- Lights and shadows
:::

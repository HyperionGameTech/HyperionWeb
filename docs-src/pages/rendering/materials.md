---
title: Materials
description: Materials in Hyperion Engine: PBR parameters, texture slots, render buckets, and creating materials in the editor or in code.
lede: Materials define how a surface looks: color, roughness, metalness, normals and emission. Hyperion uses a standard PBR model.
summary: PBR parameters, texture slots and buckets.
---

## Making one

In the **Assets** panel, hit **New... › Material**, then open it to edit. Materials are saved as `.hmf` files in your project's `Materials/` folder.

## Parameters

| Parameter | What it does |
|---|---|
| Albedo | The base color. White by default. |
| Roughness | 0 == perfect mirror, 1 == completely rough surface. As with most things in life, the truth lies somewhere in between. |
| Metalness | How metallic the surface is, generally you want 0 or 1 for this |
| Emissive | A color and an intensity, for things that glow. _NOTE! This is not fully supported in the engine at this point, but lightmap baking will use this to treat a surface as somehting that emits light_ |
| Alpha threshold | Discards pixels for anything with alpha below this value |
| Transmission, IOR | For transparent materials like glass. IOR starts at 1.5. |
| UV scale | Scales how much the UV coordinates of your mesh repeat: if your textures are stretched across the surface, increase it; too much will cause visible tiling with your textures |
| Unlit | Skips lighting entirely |

## Textures

The main slots are **Diffuse**, **Normals**, **Roughness**, **Metalness**, **Ambient Occlusion** and **Parallax**.

For packed textures (roughness, metalness and AO in one image), you can reuse the _same texture_ in each slot and set which color/alpha channel each one reads for its specific value.

## Buckets

Each material goes into a bucket, which allows the renderer to decide which pass it is included in as well as other behaviour

- **Opaque**: solid surfaces. What you'll want to use, most of the time.
- **Translucent**: transparent surfaces, drawn in a separate forward pass.
- **Lightmapped**: set automatically when you [bake](/docs/rendering/baking.html).
- **Sky**: Rendered after all others. You likely will not need to use this manually unless you are adding a custom skybox system or something
- **Debug**: DebugDrawer stuff - like in editor gizmos, selection boxes, terrain painting cursor, etc.

## From code

```cpp
MaterialAttributes attributes;
attributes.shaderName = NAME("GeometryPass");

Handle<Material> material = MakeHandle<Material>(NAME("CrateMaterial"), attributes);
material->SetTexture(MaterialTextureKey::Diffuse, crateTexture);
InitObject(material);
```

---
title: Writing shaders
description: Write HLSL shaders for Hyperion Engine. registering shaders in Shaders.hmf, permutations, live reload and precompiling.
lede: Shaders are written in HLSL and compiled with DXC for every backend. The editor reloads them automatically when they change.
summary: HLSL, permutations and live reload.
---

## Adding a shader

Shaders live in `Source/Shaders/`. Write your `.hlsl` file, then register it in `Config/Shaders.hmf`:

```
ShaderDefinition "MyEffect" {
    VS = "MyEffect/MyEffect.hlsl"
    PS = "MyEffect/MyEffect.hlsl"
}
```

Paths are relative to `Source/Shaders/`. The keys are the stages:

| Key | Stage |
|---|---|
| VS | Vertex shader |
| PS | Pixel shader |
| CS | Compute shader |
| RGS, CHS, MS | Ray tracing: ray generation, closest hit, and miss |

## Permutations

Shader variants are declared at the top of the file:

```hlsl
PERMUTE(HBAO_ENABLED)
PERMUTE(LIGHT_TYPE, CLUSTERED, DIRECTIONAL, POINT, SPOT, AREA_RECT);
```

With just a name, it's an on/off variant. With a list of values, each variant defines one of them, such as `LIGHT_TYPE_POINT`:

```hlsl
#ifdef LIGHT_TYPE_DIRECTIONAL
    // directional light only
#endif
```

`STATIC(NAME, value)` sets a fixed define.

## Precompiling

Shipping builds use precompiled shaders. [Packaging](/docs/platforms/packaging.html) does this automatically. To run it yourself:

```shell
PrecompileShaders.exe --platform=windows
```

Add `--api=vulkan` or `--api=dx12` to pick a backend, or `--filter=MyEffect` to limit it to matching shaders.

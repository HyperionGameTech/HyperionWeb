---
title: C# samples
description: Sample C# scripts for Hyperion Engine, starting with a custom component that's added to an entity and updated every frame.
lede: Example C# scripts, with notes on the parts of the API each one uses.
summary: Example C# scripts, starting with a custom component.
---

::: note
C# scripts currently only run in editor builds.
:::

## Running a sample

::: steps
1. Select an entity in the **Scene** panel.

2. In the **Inspector**, find the **Script** section, hit **New** and choose **C#**. The editor saves the script as `Scripts/<Name>.cs` in your project.

3. Replace the contents of the file with the sample and save. The editor recompiles C# scripts when they change, the same as Strata scripts.
:::

The script project the editor generates allows `unsafe` code, which the samples use.

## Health component

Defines a `Health` component, adds it to the script's entity, and drains it over time, logging the value every frame.

```csharp
using Hyperion;
using System;
using System.Runtime.InteropServices;

[StructLayout(LayoutKind.Sequential)]
public struct Health : IComponent
{
    public float Current;
    public float Max;

    public void Dispose()
    {
    }

    public static Class Class => Class.GetClass(typeof(Health));

    public unsafe IntPtr NativeAddress
    {
        get
        {
            fixed (Health* pThis = &this)
            {
                return (IntPtr)pThis;
            }
        }
    }
}

public class NewScript : Script
{
    private Entity? entity;

    public override void OnAdded(Entity entity)
    {
        this.entity = entity;

        ComponentRegistry.RegisterComponent<Health>();

        Health health = new Health { Current = 100, Max = 100 };
        entity.AddComponent<Health>(ref health);
    }

    public override void Update(float deltaTime)
    {
        if (this.entity == null)
        {
            return;
        }

        ref Health health = ref this.entity.GetComponent<Health>();
        health.Current -= deltaTime;

        Logger.Log(LogLevel.Info, $"Entity health: {health.Current}");
    }

    public override void Destroy()
    {
        this.entity = null;
    }
}
```

### The component

- Components are structs that implement `IComponent`. They have to be blittable, meaning the struct has the same layout in managed and native memory. That's why `Health` uses `[StructLayout(LayoutKind.Sequential)]` and only has plain `float` fields. Registering a struct that isn't blittable throws an exception.
- `IComponent` requires a static `Class` property, which returns the type's reflection info, and `NativeAddress`, which returns a pointer to the struct's data.
- `IComponent` extends `IDisposable`. `Dispose` is where a component releases anything it owns. `Health` doesn't own anything, so it's empty.

### The script

- Scripts subclass `Script` and override `OnAdded`, `Update` and `Destroy`. They're called at the same points as in Strata; see the [lifecycle](/docs/scripting/first-script.html#lifecycle).
- `ComponentRegistry.RegisterComponent<Health>()` registers the struct as a component type. By default the component is saved with the scene and shown in the editor. Pass `ComponentFlags` to change that.
- `AddComponent<Health>(ref health)` adds the component to the entity.
- `GetComponent<Health>()` returns a `ref` to the entity's component, so `health.Current -= deltaTime` changes it directly. There's no need to write it back.
- `Logger.Log(LogLevel.Info, ...)` writes to the log, which shows up in the editor's console.
- `Script` also has `World`, `Scene` and `Entity` properties. The base `OnAdded` is what sets `Entity`, so call `base.OnAdded(entity)` in your override if you want to use that property instead of your own field.

::: note
`RegisterComponent` throws if the type is already registered. This sample registers `Health` in `OnAdded`, which works while only one entity uses the script. If several do, register the component once, for example behind a static flag.
:::

---
title: Samples
description: Sample scripts for Hyperion Engine in Strata and C#.
lede: Example scripts to copy into your project.
summary: Example scripts to copy into your project.
---

To try one, create a script in the sample's language (**Inspector › Script › New**), paste the sample in, and save.

## Health component

A custom component that drains over time. C# only.

::: tabs
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
:::

| Call | What it does |
|---|---|
| `RegisterComponent<Health>()` | Registers the struct as a component type |
| `AddComponent(ref health)` | Adds it to the entity |
| `GetComponent<Health>()` | Returns a `ref`, so changes apply directly |

Component structs must be blittable: plain fields, sequential layout.

::: note
`RegisterComponent` throws if the type is already registered, so if several entities use this script, register it once.
:::

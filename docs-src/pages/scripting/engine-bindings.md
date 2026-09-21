---
title: Calling engine code
description: How Hyperion Engine types and methods are exposed to Strata and C# scripts through CodeGen, and how to expose your own C++ classes.
lede: Scripts call into the engine through bindings that CodeGen generates from reflected C++ types, for both Strata and C#.
summary: How engine types show up in Strata and C#, and how to expose your own.
---

## The engine API

In Strata, `import Engine;` pulls in the generated bindings: handles for engine types, their methods, plus structs and enums. They're written to `Data/Scripts/Strata/Engine.strata` when you build, which is the quickest way to see what's available.

In C#, `using Hyperion;` brings in the engine's C# classes. Their methods come from extension methods that CodeGen writes to `Source/Generated/CSharp/`.

## Calling methods

Methods are called with dot syntax. Methods from parent types work too, so an `Entity` can do anything a `Node` can:

::: tabs
```strata
float3 position = g_entity.GetWorldTranslation();
g_entity.Translate(float3(1.0, 0.0, 0.0));
```

```csharp
Vec3f position = Entity.GetWorldTranslation();
Entity.Translate(new Vec3f(1.0f, 0.0f, 0.0f));
```
:::

## Exposing your own C++

Anything reflected is exposed by default. That's `HYP_CLASS`, `HYP_STRUCT` and `HYP_ENUM` types, and `HYP_METHOD` methods:

```cpp
HYP_CLASS()
class Door : public Entity
{
    HYP_OBJECT_BODY(Door);

public:
    HYP_METHOD()
    void Open();

    HYP_METHOD(Property = "Locked")
    bool IsLocked() const;

    HYP_METHOD(Property = "Locked")
    void SetLocked(bool locked);
};
```

The next CodeGen run generates roughly this for each language:

::: tabs
```strata
handle Door extends Entity;

impl Door
{
    extern void Open(Door self);
    extern bool IsLocked(Door self);
    extern void SetLocked(Door self, bool locked);

    property bool Locked { get = Door_IsLocked; set = Door_SetLocked; }
}
```

```csharp
public static class DoorExtensions
{
    public static void Open(this Door obj) { ... }
    public static bool IsLocked(this Door obj) { ... }
    public static void SetLocked(this Door obj, bool locked) { ... }
}
```
:::

In Strata, a getter and setter that share a `Property` name become a property. In C# they stay as methods.

For C#, CodeGen only writes the extension methods. The `Door` class itself is declared by hand, with a `[ClassBinding]` attribute naming the C++ class, like the engine's classes in `Source/Engine/DotNET/Runtime/`:

```csharp
[ClassBinding(Name = "Door")]
public class Door : Entity
{
}
```

## Hiding things from scripts

To keep a type or method out of scripts, add `NoScriptBindings`:

```cpp
HYP_METHOD(NoScriptBindings)
void InternalOnly();
```

To expose a type or method to one language only, use `OnlyLanguages` with `"strata"` or `"csharp"`:

```cpp
HYP_METHOD(OnlyLanguages = "csharp")
void ForCSharpOnly();
```

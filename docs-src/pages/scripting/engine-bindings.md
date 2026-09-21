---
title: Calling engine code
description: How Hyperion Engine types and methods are exposed to Strata scripts through CodeGen, and how to expose your own C++ classes.
lede: Scripts call into the engine through bindings that CodeGen generates from reflected C++ types.
summary: How engine types show up in Strata, and how to expose your own.
---

## import Engine

Every script starts with `import Engine;`. That pulls in the generated bindings: handles for engine types, their methods, plus structs and enums.

They live in `Data/Scripts/Strata/Engine.strata` once you've built. It's the quickest way to see what's available.

## Methods

Engine objects are handles, and methods are called with dot syntax. Methods from parent types work too, so an `Entity` can do anything a `Node` can:

```strata
float3 position = g_entity.GetWorldTranslation();
g_entity.Translate(float3(1.0, 0.0, 0.0));
```

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

The next CodeGen run generates roughly this on the Strata side:

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

A getter and setter that share a `Property` name turn into a Strata property.

## Hiding things from scripts

To keep a type or method out of scripts, add `NoScriptBindings`:

```cpp
HYP_METHOD(NoScriptBindings)
void InternalOnly();
```

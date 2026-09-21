---
title: Scripting
description: Writing gameplay code for Hyperion Engine in the Strata scripting language, and exposing C++ types to scripts.
lede: Gameplay code in Hyperion is written in Strata, a statically typed, compiled language that recompiles live when you save.
summary: Gameplay code in Strata, and exposing your C++ to it.
---

## Strata

It has no garbage collector, ref counting or manual memory management, and scripts reload without restarting the editor.

The [Strata overview](/strata.html) covers the syntax: functions, control flow, enums, boxes and optionals.

## Exposing C++ to scripts

Engine types show up in scripts through reflection. Mark up a class with the reflection macros, and CodeGen generates the bindings:

```cpp
HYP_CLASS()
class Camera : public ObjectBase
{
    HYP_OBJECT_BODY(Camera);
public:
    HYP_METHOD(Property = "FOV")
    float GetFOV() const;

    HYP_METHOD(Property = "FOV")
    void SetFOV(float v);
};
```

## In this section

::: cards
children
:::

## C#

The editor can also create C# scripts. They currently only run in editor builds. See the [C# samples](/docs/scripting/csharp-samples.html) for how they're put together.

## TODO

::: soon
- Shipping builds (ahead-of-time compiled scripts)
:::

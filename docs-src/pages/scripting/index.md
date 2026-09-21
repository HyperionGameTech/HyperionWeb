---
title: Scripting
description: Writing gameplay scripts for Hyperion Engine in Strata or C#, and exposing C++ types to them.
lede: Gameplay scripts can be written in Strata or C#
summary: Gameplay scripts in Strata or C#, and exposing C++ to them.
---

Each script picks its language when you create it, and a project can use both languages - you aren't boxed into just one

## What is Strata?

You probably haven't heard of Strata - because it's a new project aimed at creating a simple, C-type language meant for scripting (separate from Hyperion).

Strata is statically typed and compiled, with no garbage collector, ref counting or manual memory management - the [Strata overview](/strata.html) covers the syntax

## Exposing C++ to scripts

Engine types show up in both languages through reflection. Add a class in C++ with reflection macros, and Hyperion's CodeGenTool generates binding code so you can use it in scripts.

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

## TODO

::: soon
- Shipping builds (ahead-of-time compiled scripts)
:::

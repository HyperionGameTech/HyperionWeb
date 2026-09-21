---
title: Scripting
description: Writing gameplay scripts for Hyperion Engine in Strata or C#, and exposing C++ types to them.
lede: Gameplay scripts can be written in Strata or C#. Both attach to entities the same way, share the same lifecycle, and recompile when you save.
summary: Gameplay scripts in Strata or C#, and exposing C++ to them.
---

## Strata and C#

| | Strata | C# |
|---|---|---|
| Files | `Scripts/<Name>.strata` | `Scripts/<Name>.cs` |
| Compiled with | LLVM, just-in-time in the editor | .NET |
| Memory | No garbage collector or ref counting | .NET garbage collector |
| Engine API | `import Engine;` | `using Hyperion;` |
| Live reload | On save | On save |
| Outside the editor | Needs ahead-of-time compilation, which isn't hooked up yet | .NET is only enabled in editor builds by default, set by `HYP_DOTNET_ONLY_FOR_EDITOR` in `Source/CMakeLists.txt` |

Each script picks its language when you create it, and a project can use both. Code samples in these docs have a tab for each language, and the one you pick is remembered.

## Strata

Strata is Hyperion's own scripting language. It's statically typed and compiled, with no garbage collector, ref counting or manual memory management. The [Strata overview](/strata.html) covers the syntax.

## C#

C# scripts are classes that subclass `Script`. They can also define their own component types; see the [samples](/docs/scripting/samples.html).

## Exposing C++ to scripts

Engine types show up in both languages through reflection. Mark up a class with the reflection macros, and CodeGen generates the bindings:

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

[Calling engine code](/docs/scripting/engine-bindings.html) covers what each language gets.

## In this section

::: cards
children
:::

## TODO

::: soon
- Shipping builds (ahead-of-time compiled scripts)
:::

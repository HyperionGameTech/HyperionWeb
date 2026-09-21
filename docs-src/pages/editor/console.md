---
title: Console & CVars
description: Use the Hyperion editor console to change console variables (CVars) at runtime and run commandlets.
lede: The console lets you change engine settings and run tasks while the engine is running.
summary: Change engine settings and run tasks at runtime.
---

# Console variables (CVars)

CVars are global settings you can change on the fly. Most of them start out with values from `Config/EngineConfig.json`, and can be changed from the editor's console.

Type the name, then the value. Names aren't case sensitive, and you can use the full name or just the last part:

```
ssgi 1
Rendering.SSGI false
```

Bools take `true` / `false` (or `1` / `0`), numbers and strings work as well

::: note
There's no full list yet. To find them all, search the codebase for the regex `^CVar<([A-Za-z_]+)>`.
:::

# Commandlets

Commandlets are self-contained tasks, like precompiling shaders, building lighting, baking textures, etc... 
Even our "Cache server" is a standalone commandlet application.


How to run a commandlet:
- **From the console, in editor or in game**: type its name, then any arguments.
- **From the command line**: pass `--exec` to an engine executable, followed by the name and arguments, like `hyperion-sample.exe --exec MyCommandlet arg1 arg2`.
- **As their own program**: some special standalone commandlets, like `PrecompileShaders`, are also built into their own executables.

::: note
To find every commandlet, search for `: public CommandletBase`.
:::

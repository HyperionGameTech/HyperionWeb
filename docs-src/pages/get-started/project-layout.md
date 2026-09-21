---
title: Finding your way around
description: A quick tour of the Hyperion Engine repository: where the source, config, content, tools and build output live.
lede: What's in each folder of the engine repo.
summary: What lives where in the repo.
---

## The top level

| Folder | What's in it |
|---|---|
| Source | All the C++, plus shaders. |
| Config | Engine and runtime settings (`EngineConfig.json`, `GlobalConfig.json`), and the list of shaders to compile. |
| Content | Assets for the engine, the editor and the game. |
| External | Third-party code: Git submodules and prebuilt libraries. |
| Tools | Build scripts, CodeGen and other tools. |
| Documentation | Markdown docs that live alongside the code. |
| Build, Binaries | Where your build output goes. Not checked in. |

## Inside Source

| Folder | What's in it |
|---|---|
| Core | The base library: containers, memory, reflection and so on. Keeps its dependencies to a minimum. |
| Engine | The main engine library: rendering, scenes, physics, networking, scripting and so on. |
| Editor | The editor. |
| Shaders | HLSL shaders, compiled with DXC. |
| Commandlets | Standalone tasks, like precompiling shaders or cooking assets. |
| Sample | The sample app's entry point. |
| Generated | CodeGen output. Don't edit by hand. |

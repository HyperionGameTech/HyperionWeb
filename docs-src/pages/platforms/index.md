---
title: Platforms
description: Platforms supported by Hyperion Engine: Windows, macOS, Android, iOS, Steam Deck, and plans for Linux.
lede: Where Hyperion runs today, and where it's headed.
summary: Supported platforms, packaging and platform notes.
---

## Where it runs

| Platform | Status |
|---|---|
| Windows (x64, ARM64) | Yes, runtime and editor. |
| macOS | Yes, runtime and editor. |
| Android | Supported, but not stable yet. |
| iOS | Supported, but not stable yet. |
| Steam Deck | Yes, through Proton. Input and resolution handling still need work. |
| Linux | *Planned* |

Linux is planned, but not in active development. [Contributions](/docs/contributing/) are welcome on this front (as well as anywhere else)

## In this section

::: cards
children
:::


## Steam Deck

There's no native Linux build yet, so on the Deck you run the Windows build through Proton. Controller input and resolution handling still need work here

## Per-platform settings

Each platform can have its own config, like `Config/EngineConfig.Android.json`. If a platform file exists it *replaces* the regular one, rather than merging with it, so it needs every setting.

The mobile configs, for example, turn off ray tracing, DDGI, SSGI and TAA.

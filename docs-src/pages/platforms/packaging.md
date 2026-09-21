---
title: Packaging a build
description: Package a Hyperion Engine project into a standalone shipping build: build, precompile shaders, cook content and copy it all into one folder.
lede: Packaging turns your project into a standalone build you can distribute.
summary: Build a standalone copy of your game to distribute.
---

## What packaging does

The packaging scripts:

- Make a **shipping** build: optimized, no editor, no debug checks.
- **Precompile shaders** for the target platform.
- **Cook** your project's content into a compact cache.
- Copy the executable, content and config into one folder.

## Packaging on Windows

::: steps
1. Build **Release** first. Packaging uses the shader and cooking tools from the Release build.

   ```shell
   build.bat Release
   ```

2. Run the packaging script from the root of the repo:

   ```shell
   Tools\Scripts\PackageBuildWindows.bat
   ```

3. When it asks, type your project's folder name (the one under `Projects/`).
:::

Your build lands in `PackagedBuilds/Windows/Build_<date>_<time>/`. The game executable is `hyperion-sample.exe`.

::: note
The Windows package includes Steam's test app files (app ID 480) so Steam features work while you're developing. Swap in your own app ID before you ship.
:::

## Other platforms

There are matching scripts for macOS, iOS and Android in `Tools/Scripts/`. Android has its own page: [Android](/docs/platforms/android.html). The macOS and iOS scripts are still a work in progress.

## About shipping builds

To make a shipping build without packaging it:

```shell
build.bat Shipping
```

It goes into `Binaries/<Platform>/Shipping/`, without the editor, tests or commandlets.

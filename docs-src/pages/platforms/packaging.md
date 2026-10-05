---
title: Packaging a build
description: Package a Hyperion Engine project into a standalone build: from the editor with Package Game, or as a shipping build with the packaging scripts.
lede: Packaging turns your project into a standalone build you can distribute.
summary: Build a standalone copy of your game to distribute.
---

## What packaging does

- **Cooks** your project's content, and the engine's, into a compact cache.
- Includes **compiled shaders**, so the game doesn't need shader source.
- Copies the executable, content and config into one folder that runs by itself.

There are two ways to do it: from the editor, or with the packaging scripts in the engine repo.

## From the editor

This packages the game you built with [Build Game](/docs/editor/build-game.html), so do that first.

::: steps
1. Choose :icon[package] **Build › Package Game...** in the toolbar.

2. Pick a folder to put the package in.
:::

The editor saves your project and will begin packaging your game.

![The Packaging Game progress box](/assets/docs-package-progress.png)

When it's done, your file browser will open at the output directory.

Example structure:
```
MyGame/
  MyGame.exe
  MyGameGame.dll
  hyperion.dll
  Cache/
  Content/
  Config/
```

Run `MyGame.exe` to start your game.

![The packaged game running in its own window](/assets/docs-packaged-game.jpg)

| Folder | What's in it |
|---|---|
| Cache | Cooked asset data and compiled shaders |
| Content | Asset manifests, for your project and for the engine (`Content/Engine`) |
| Config | Engine settings, and the game's launch arguments in `GlobalConfig.json` |

The game starts in the world you had open when you packaged it, in single player. Both are set in `Config/GlobalConfig.json`.

### Multiplayer

The packaged game hosts and joins games with the same flags as the [built one](/docs/editor/build-game.html#run-it):

```shell
MyGame --server # start a standalone server
MyGame --singleplayer=false --host=127.0.0.1 # connect to a server
```


## With the packaging scripts

The scripts in the engine repo make a **shipping** build (optimized, no editor, no debug checks) and package the sample game with your project's content.

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

### Other platforms

There are matching scripts for macOS, iOS and Android in `Tools/Scripts/`. Android has its own page: [Android](/docs/platforms/android.html). The macOS and iOS scripts are still a work in progress.

## About shipping builds

To make a shipping build without packaging it:

```shell
build.bat Shipping
```

It goes into `Binaries/<Platform>/Shipping/`, without the editor, tests or commandlets.

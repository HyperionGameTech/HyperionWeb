---
title: Building your game
variant: C#
variant_of: editor/build-game
description: Generate a C# game project from the Hyperion editor, open it in Visual Studio, write a Game class, build it, and play it in the editor.
lede: Write your game's code in C#, with a Visual Studio solution the editor generates for you.
summary: Generate a C# project, edit it in Visual Studio, and play it in the editor.
---

## Generate the project

Save your project first, then choose :icon[package] **Build › Generate Game Project...**

![The Generate Game Project window, with C# selected](/assets/docs-generate-game-project.png)

A project's sources can be written in either C# or C++. This page covers C#; switch to C++ at the top of the page.

::: note

To switch after selection, use **Build › Change Language...**.
You can only change this when there are no changed files after generating the project.

:::

**Generate** adds these to your project folder:

```
Projects/MyGame/
  MyGame.hypproject
  MyGame.slnx
  Source/
    MyGame.csproj
    MyGameGame.cs
    Program.cs
    Hyperion.Local.props
```

## Your Game class

The generated class overrides three hooks from `Game`:

| Method | When it's called |
|---|---|
| OnLaunch | Once, after the startup world has loaded. |
| OnUpdate | Every frame, with the time since the last frame. |
| OnShutdown | When the game shuts down, before the world is torn down. |

::: note
The editor finds your class by name. Keep it named after your project with `Game` on the end (`MyGameGame` for `MyGame.hypproject`).
:::

![MyGameGame.cs open in Visual Studio](/assets/docs-csharp-visual-studio.png)

## Build

Build from either place:

- In Visual Studio, **Build › Build Solution** (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>).
- In the editor, **Build › Build Game**. Compiler output goes to the [Console](/docs/editor/console.html).

Both need the .NET 10 SDK. The result lands in your project's `Binaries` folder, next to a copy of the engine:

```
Projects/MyGame/
  Binaries/Windows/
    MyGame.exe
    MyGame.dll
    hyperion.dll
    Config/
```

`MyGame.exe` runs the game on its own, loading content straight from the project folder. It takes the same command line as a C++ game; see [Run it](/docs/editor/build-game.html#run-it).

## Play it in the editor

Press :icon[play] **Play**. The editor loads `MyGame.dll` and runs your `Game` class in [play-in-editor](/docs/editor/play-in-editor.html).

![The example running in the editor: cubes circling the player](/assets/docs-csharp-play.jpg)

There's no hot reload for the game project. The editor keeps using the build it first loaded, so after rebuilding, restart the editor to see your changes.

## Package

**Build › Package Game** works the same as for C++. The build includes the .NET runtime, so the packaged game runs on a machine without .NET installed. See [Packaging a build](/docs/platforms/packaging.html).

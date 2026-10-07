---
title: Building your game
variant: C++
description: Generate a C++ game project from the Hyperion editor, build it, and run your game as its own executable, in single player or multiplayer.
lede: Give your project its own C++ code, and build it into a game you can run outside the editor.
summary: Generate a C++ or C# project, build it, and run your game outside the editor.
---

## The Build menu

:icon[package] **Build**, near the right end of the toolbar, has everything on this page.

![The Build menu, open in the editor toolbar](/assets/docs-build-menu.png)

| Item | What it does |
|---|---|
| Generate Game Project... | Adds a C# or C++ project to your project folder. Once it exists, this becomes **Open C# Project Folder** or **Open C++ Project Folder**. |
| Build Game | Compiles that project into a game executable. |
| Package Game | Makes a standalone copy of the game to share. See [Packaging a build](/docs/platforms/packaging.html). |

This page covers C++; switch to C# at the top of the page.

::: note
Building from the editor is Windows-only for now.
:::

## Generate the C++ project

Save your project first, then choose **Build › Generate Game Project...** and pick **C++**. The editor adds a `Source` folder to your project and opens it (or opens it in Visual Studio, if **Open in Visual Studio** is ticked):

```
Projects/MyGame/
  MyGame.hypproject
  Source/
    CMakeLists.txt
    Game/
      MyGameGame.hpp
      MyGameGame.cpp
    Launcher/
      main.cpp
```

The names come from your `.hypproject` file's name. These files are yours to edit, and the editor won't overwrite them.

| File | What's in it |
|---|---|
| Game/MyGameGame.hpp, .cpp | Your `Game` class. This is where your game's code goes. |
| Launcher/main.cpp | The executable's entry point. It starts the engine and creates your `Game`. |
| CMakeLists.txt | Builds the two above against the engine. Every `.cpp` and `.hpp` under `Game/` is picked up automatically. |

## Your Game class

The generated class overrides a few hooks from `Game`:

```cpp
void MyGameGame::OnLaunch()
{
    Game::OnLaunch();

    HYP_LOG(Game, Info, "MyGameGame launched");

    StartSimulating();
}

void MyGameGame::OnUpdate(float delta)
{
    Game::OnUpdate(delta);
}
```

| Function | When it's called |
|---|---|
| OnLaunch | Once, after the startup world has loaded. |
| OnUpdate | Every frame, with the time since the last frame. |
| OnInputEvent | For each input event. Returns `true` if something handled it. |
| BeforeConnectingToServer | When the game starts as a client, before it has joined a server. |
| BeforeContentLoaded, AfterContentLoaded | Either side of loading the startup world. |

The last three drive a plain status screen (`ShowStatus` and `HideStatus` in the same file), so the window says "Loading...", "Connecting to..." or why it couldn't connect instead of sitting black. Swap it for your own loading and connect screens.

::: note
CodeGenTool doesn't run on game code yet, so `HYP_CLASS()` and friends aren't available here. The generated `.cpp` registers the class by hand; leave that block at the bottom of the file in place.
:::

## Build

Choose **Build › Build Game**. Compiler output goes to the [Console](/docs/editor/console.html), and you'll get a message box if the build fails.

The build needs Visual Studio, or the Visual Studio Build Tools, with:

- The **Desktop development with C++** workload.
- **C++ Clang tools for Windows**. Not needed if you built the editor yourself with MSVC.
- **C++ CMake tools for Windows**.

If something's missing, the editor tells you what and offers to install the Build Tools for you.

The result lands in your project's `Binaries` folder:

```
Projects/MyGame/
  Binaries/Windows/
    MyGame.exe
    MyGameGame.dll
    hyperion.dll
    Config/
  Build/Windows/
    Build.bat
```

`MyGameGame.dll` holds your game's code, and `MyGame.exe` is the launcher that loads it. The engine's own libraries and config are copied in next to them. `Build.bat` runs the same build outside the editor.

## Run it

Run `MyGame.exe`. It loads your project's content straight from the project folder, so there's nothing to cook: save in the editor, and the next run has your changes.

By default the game starts in single player. The same executable also hosts and joins multiplayer games:

| Command | What it does |
|---|---|
| `MyGame` | Single player |
| `MyGame --server` | A headless dedicated server |
| `MyGame --singleplayer=false --host=127.0.0.1` | Joins the server at that address |

The single player default comes from `Binaries/Windows/Config/GlobalConfig.json`; anything you pass on the command line overrides it. More in [Running a server](/docs/multiplayer/server.html).

## In the editor

Once the game is built, the editor loads `MyGameGame.dll` when it opens your project, and [play-in-editor](/docs/editor/play-in-editor.html) runs your `Game` class.

:::note
There's no hot reload for C++. You can rebuild while the project is open, but the editor keeps using the build it loaded until you restart it.
:::

::: note
A project that's been saved with your `Game` class needs its built game to open. If the editor reports that the game module isn't built, run `Build/Windows/Build.bat` in the project folder, then open the project again.
:::

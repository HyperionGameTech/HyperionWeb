---
title: Build the engine
description: Install the prerequisites and build Hyperion Engine and its editor on Windows or macOS.
lede: Installing prerequisites and getting the build going
summary: Prerequisites and build commands.
---

## What you'll need

On every platform:

- **CMake** 3.10 or newer.
- **Vulkan SDK**. Vulkan is our main rendering backend. On Apple platforms it comes with MoltenVK, which translates Vulkan to Metal for us.
- **.NET SDK**, with `dotnet` on your PATH. The editor UI is built with Avalonia on .NET 10, so the editor needs it.

Per platform:

| Platform | You'll also need |
|---|---|
| Windows | Visual Studio 2026 (MSVC, or the Clang that ships with it), and [vcpkg](https://github.com/microsoft/vcpkg) with the `VCPKG_ROOT` environment variable pointing at it. |
| macOS | `brew install molten-vk`, or run `Tools/Scripts/InstallDependenciesMac.sh`. |
| Android | The Android NDK (we test with NDK 29), and Ninja on your PATH. |

## Build it

From the root of the repo:

### Windows

```shell
build.bat Release
```

To build with Clang instead of MSVC: `build.bat Release Clang`

### macOS

```shell
./build.sh Release
```

To generate an Xcode project: `./build.sh Xcode Release`

::: note
The script asks if you want to regenerate the CMake project first, and moves on without it after 3 seconds. Answer yes if you've added or removed source files.
:::

Use **Release** (or RelWithDebInfo) on Windows. Debug builds work, but run very slowly.

## CodeGen

CodeGen is a build tool that reads the engine's headers and generates the reflection, serialization and scripting bindings. It runs automatically when CMake configures, so you don't normally run it yourself.

Its output goes into `Source/Generated/`. Don't edit those files by hand; they're overwritten on every run.

## Run it

Build output goes to `Binaries/<Platform>/<Config>/`, for example `Binaries/Windows/Release/` or `Binaries/Mac/Release/`. The main executables are:

- `Hyperion.Editor` (`.exe` on Windows), the editor.
- `hyperion-sample` (`.exe` on Windows), the sample game.

## Troubleshooting

- **"VCPKG_ROOT not set"**: Windows builds need it. Point it at your vcpkg install, then open a new terminal.
- **CMake fails with CodeGen errors**: run `Tools/Scripts/BuildCodeGen.bat` (or `.sh`) on its own to see what actually went wrong.
- **Metal API validation errors on macOS**: turn off "Metal API Validation" in your Xcode scheme, under the Options tab. Rendering goes through MoltenVK, which the validator reports false errors for.

The full [Compiling the Engine]({{engineRepo}}/blob/dev/Documentation/CompilingTheEngine.md) guide in the repo covers Android, optional dependencies and IDE setup.

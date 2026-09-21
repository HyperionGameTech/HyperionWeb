---
title: iOS
description: Build Hyperion Engine for iOS with Xcode and MoltenVK.
lede: Hyperion runs on iPhone and iPad through MoltenVK. Like Android, support isn't stable yet.
summary: Build for iPhone and iPad through Xcode.
---

## What you'll need

- A Mac with **Xcode**.
- The **Vulkan SDK**, with `VULKAN_SDK` set. It comes with MoltenVK, which we link for iOS.
- A device on iOS 14 or newer.

## Build it

From the root of the repo, generate an Xcode project:

```shell
./Tools/Scripts/BuildHyperion.sh IOS Xcode Release regenerate
```

Open it in Xcode, pick your team under **Signing** (we leave signing off by default), and run it on your device.

## Notes

- There's no editor on iOS.
- iOS uses `Config/EngineConfig.IOS.json`, which turns off the same rendering features as Android and targets 30 FPS.

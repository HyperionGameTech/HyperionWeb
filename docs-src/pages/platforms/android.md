---
title: Android
description: Build Hyperion Engine for Android: requirements, building the native libraries, packaging content and making an APK with Gradle.
lede: Hyperion runs on Android phones and tablets. Support works, but isn't stable yet.
summary: Building and installing on Android devices.
---

## What you'll need

- The **Android NDK**. We test with NDK 29. Point `ANDROID_NDK_HOME` at it.
- **Ninja**, on your PATH or installed with Visual Studio or the Android SDK.
- The **Android SDK** and **Java 17**, for Gradle. Android Studio installs both.

We build for 64-bit ARM (`arm64-v8a`), and you'll need Android 9 (API 28) or newer.

## Build it

::: steps
1. Build the engine for Android. The libraries end up in `Binaries/Android/Release/`.

   ```shell
   build.bat Android Release
   ```

2. Package it with your project's content:

   ```shell
   Tools\Scripts\PackageBuildAndroid.bat --cook --project MyGame
   ```

   Without `--cook`, only engine content is included.

3. Build and install the APK with Gradle, from `Source/PlatformSpecific/Android/`:

   ```shell
   gradlew.bat installDebug
   ```

   You can also open that folder in Android Studio and run it from there.
:::

## Settings

Android uses `Config/EngineConfig.Android.json` instead of the regular config with platform-specific overrides for targeting lower end devices than the typical desktop experience
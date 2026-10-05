---
title: Running a server
description: Run a Hyperion Engine dedicated server from the command line and connect clients to it.
lede: Starting a dedicated server
summary: Starting a dedicated server
---

## Start a server

The game executable runs as a server with `--server`:

```shell
hyperion-sample --server --gameport=9192
```

It runs headless (no window), and reads console commands from its terminal. Leave off `--gameport` and it uses the `Net.GameServerPort` CVar, which defaults to 9192.

## Connect a client

Run the game executable with `--host` and `--autoconnect=true` cli args to automatically connect to a host at that address. If you don't pass `autoconnect` or pass it as `false`, a prompt screen will be shown that will allow your to change it before connecting or select Single Player instead (NOTE: to be changed - will automatically connect if --host is passed)

```shell
hyperion-sample --host=127.0.0.1 --autoconnect=true --gameport=9192
```

## Your own game

A game [built from the editor](/docs/editor/build-game.html) takes the same flags. It starts in single player by default, unless `--singleplayer=false` is passed.

For example:

```shell
MyGame --server # start standalone a server
MyGame --singleplayer=false --host=127.0.0.1 # connect to a server
```

## From the editor

The editor can start a local server and connect to it for play-in-editor with networking. See [play-in-editor](/docs/editor/play-in-editor.html) for info

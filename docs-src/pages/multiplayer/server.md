---
title: Running a server
description: Run a Hyperion Engine dedicated server from the command line and connect clients to it.
lede: Starting a dedicated server, and connecting clients to it.
summary: Starting a dedicated server and connecting clients.
---

## Start a server

The game executable runs as a server with `--server`:

```shell
hyperion-sample --server --gameport=9192
```

It runs headless (no window), and reads console commands from its terminal. Leave off `--gameport` and it uses the `Net.GameServerPort` CVar, which defaults to 9192.

## Connect a client

```shell
hyperion-sample --host=127.0.0.1 --gameport=9192
```

It connects on startup. Pass `--singleplayer` to skip connecting.

The sample game also has a connect screen, with a box for the host address and buttons to **Connect** or **Play Single Player**.

## From the editor

The editor can start a local server and connect to it for you. See [play-in-editor](/docs/editor/play-in-editor.html).

## Under the hood

Networking uses a custom UDP transport, with reliable and unreliable channels.

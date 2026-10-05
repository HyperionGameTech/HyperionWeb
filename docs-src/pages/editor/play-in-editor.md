---
title: Play-in-editor
description: Play your game inside the Hyperion editor, including as a client or dedicated server for multiplayer testing.
lede: Run your game inside the editor, without making a separate build.
summary: Run the game in the editor, standalone or networked.
---

## Play, pause, stop

The :icon[play] **Play**, :icon[debug-pause] **Pause** and :icon[debug-stop] **Stop** buttons are at the right end of the toolbar.

Play saves your project first, and Stop restores that saved state, so changes made while playing are discarded.

**Ghost Mode** (in the :icon[settings-gear] gear menu) gives you a free camera while playing. Move it with <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>, <kbd>Space</kbd> and <kbd>Ctrl</kbd>.

## Network modes

Pick a mode from the :icon[chevron-down] arrow next to **Play**. The option you select will be saved as the default play mode for next time.

| Mode | Play button action |
|---|---|
| Standalone | The game runs in the editor in single player |
| Play As Client | The editor connects to the server at **Host**:**Port**. If the host is this machine (`127.0.0.1`, `localhost` or `::1`) and **Auto-launch local server** is on, the editor first starts a headless server running your saved project. Otherwise the server must already be running separately. |
| Play As Dedicated Server | The editor hosts the game on **Port**. It has no player of its own; players spawn for clients that connect. |

**Stop** disconnects or stops hosting, and shuts down an auto-launched server

:::note
Nothing is replicated unless the game's world has the `IsReplicated` flag (on by default).
But it is something to look into if you're having issues in this area. On your filesystem, open your project's Worlds/MainWorld.hmf file and look for that flag.
:::

### Network Settings

Open **Network Settings...** from the same menu.

| Setting | Default | Used for |
|---|---|---|
| Host | `127.0.0.1` | The server Play As Client connects to |
| Port | `9192` | The game server port, in both networked modes |
| Cache Server Port | `8081` | Serves your saved project to the auto-launched server and to extra clients |
| Auto-launch local server | On | Starting a server for Play As Client when Host is this machine |

### More players

The editor is one client. To add more, run the game against the same server, syncing content from the editor's cache server:

```shell
hyperion-sample --host=127.0.0.1 --gameport=9192 --cacheserver=http://127.0.0.1:8081
```

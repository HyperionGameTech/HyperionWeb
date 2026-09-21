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

The :icon[chevron-down] arrow next to **Play** picks how you play:

| Mode | What it does |
|---|---|
| Standalone | Single player. No networking. |
| Play As Client | Connects to a server. If the host is your own machine and auto-launch is on, the editor starts a local server in the background. |
| Play As Dedicated Server | The editor itself is the server. |

Host, port and the auto-launch option live under **Network Settings...**. The defaults are `127.0.0.1` on port `9192`.

::: note
The editor runs one client at a time. To test with more players, start extra clients yourself. See [running a server](/docs/multiplayer/server.html).
:::

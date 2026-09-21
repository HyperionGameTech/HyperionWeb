---
title: A tour of the editor
description: A quick tour of the Hyperion editor: the Scene, Inspector, Viewport, Assets and Console panels, the toolbar, viewport controls and shortcuts.
lede: The editor's panels, toolbar, viewport controls and shortcuts.
summary: The panels, the toolbar, and getting around the viewport.
---

## The panels

| Panel | What it's for |
|---|---|
| Scene | Everything in your scene, as a tree. The dropdown at the top switches between scenes, or adds a new one. |
| Inspector | All about whatever you've got selected: its components, tags, layers, script and properties. |
| Viewport | The 3D view, in the middle of the window. |
| Assets | Your project's content. Search it, **Import** things, or make something with **New...**. |
| Console | Logs, plus a spot to type commands. See [Console & CVars](/docs/editor/console.html). |

Asset editors open as panels on the right. To restore the default layout, use **Layout › Reset Layout** in the gear menu.

## The toolbar

There's no menu bar. Everything lives in the toolbar, roughly left to right:

- **New Project**, **Open** and **Save**.
- Undo, redo, copy and paste.
- **Add**, for putting new things in your scene: lights, probes, volumes and more.
- **Bake**, for [baking lighting](/docs/rendering/baking.html).
- **Translate**, **Rotate** and **Scale**, to pick what the gizmo does, plus grid snapping.
- The gear menu, with **World Settings**, stats and layout options.
- **Play**, **Pause** and **Stop**. More in [play-in-editor](/docs/editor/play-in-editor.html).

## Viewport controls

| Action | Input |
|---|---|
| Look around | Left-drag |
| Pan along the ground | Right-drag |
| Pan up, down and sideways | Left + right drag, or <kbd>Alt</kbd> + drag |
| Fly | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> |
| Let go of the mouse | <kbd>Esc</kbd> |

On a trackpad, hold <kbd>Ctrl</kbd> in place of the right mouse button. Camera speed and mouse sensitivity are set with the `Editor.Camera.MovementSpeed` and `Editor.Camera.MouseSensitivity` CVars.

## Shortcuts

| Action | Shortcut |
|---|---|
| Save project | <kbd>Ctrl</kbd> + <kbd>S</kbd> |
| Save project as | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> |
| Undo | <kbd>Ctrl</kbd> + <kbd>Z</kbd> |
| Redo | <kbd>Ctrl</kbd> + <kbd>Y</kbd>, or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> |
| Copy, paste | <kbd>Ctrl</kbd> + <kbd>C</kbd>, <kbd>Ctrl</kbd> + <kbd>V</kbd> |
| Select all | <kbd>Ctrl</kbd> + <kbd>A</kbd> |
| Delete | <kbd>Delete</kbd> |

---
title: Working with projects
description: Create, open and save projects in the Hyperion editor, and see what goes inside a project folder.
lede: A project holds your game's scenes, assets, scripts and settings in one folder.
summary: Making, opening and saving projects, and what's inside.
---

## New projects

The editor opens with a new, unsaved project containing a main scene, a sun, and a player with a camera.

Use :icon[save] **Save** (<kbd>Ctrl</kbd> + <kbd>S</kbd>) and pick a folder to keep it. Until the first save, it lives in a temporary folder.

## Opening a project

Use :icon[folder-opened] **Open** in the toolbar and pick a `.hypproject` file.

## What's inside

```
Projects/MyGame/
  MyGame.hypproject
  Scenes/
  Worlds/
  Materials/
  Meshes/
  Prefabs/
  Scripts/
  Textures/
```

The `.hypproject` file is the project itself, and the folders hold your assets, sorted by type. Assets are saved as `.hmf` files, a readable text format, with larger binary data in `.blob` files next to them.

## Saving

There's no separate "save scene". Saving the project saves everything that's changed, scenes included. The editor camera position is saved with the project too.

Close with unsaved changes, and the editor will ask whether to save, discard, or cancel.

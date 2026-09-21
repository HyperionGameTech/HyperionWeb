---
title: World streaming
description: How world streaming works in Hyperion Engine: the world grid, streaming cells, and placing scenes on the grid.
lede: Stream content into the world dynamically
summary: Stream content into the world dynamically
---

## How it works

Every world has a **world grid**, made up of one or more **layers**. Each layer is a grid of **streaming cells**.

Cells within range of the player's camera are loaded (and cells out of range are unloaded).

## Putting a scene on the grid

Each scene has a **streaming centroid**: the grid cell it belongs to. Set it in the scene's properties in the editor, and when the scene is added to the world, it lands on the built-in scenes layer at that spot.

## Layer settings

Each layer has these settings:

| Setting | What it does |
|---|---|
| cellSize | How big each cell is. Defaults to 32. |
| maxDistance | How far out from the camera's cell to load, counted in cells. Defaults to 1. |
| infinite | Whether the grid goes on forever. Useful for infinite terrain generation |
| range | The cells the grid covers when it isn't infinite. |

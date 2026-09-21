---
title: World streaming
description: How world streaming works in Hyperion Engine: the world grid, streaming cells, and placing scenes on the grid.
lede: Hyperion splits your world into a grid of cells, and streams scenes in and out as the camera moves.
summary: Loading and unloading parts of the world by distance.
---

## How it works

Every world has a **world grid**, made up of one or more **layers**. Each layer is a grid of **streaming cells**.

Cameras register a streaming volume with the streaming manager. Cells within range of a camera are loaded, and cells out of range are unloaded.

## Putting a scene on the grid

Each scene has a **streaming centroid**: the grid cell it belongs to. Set it in the scene's properties in the editor, and when the scene is added to the world, it lands on the built-in scenes layer at that spot.

Scenes are streamed by default, so setting the centroid is usually all that's needed.

## Layer settings

Each layer has these settings:

| Setting | What it does |
|---|---|
| cellSize | How big each cell is. Defaults to 32. |
| maxDistance | How far out from the camera's cell to load, counted in cells. Defaults to 1. |
| infinite | Whether the grid goes on forever. On by default. |
| range | The cells the grid covers when it isn't infinite. |

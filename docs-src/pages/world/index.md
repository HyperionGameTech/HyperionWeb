---
title: Scenes & worlds
description: How a Hyperion Engine game is put together: worlds, scenes, nodes, entities, components, systems and world streaming.
lede: How a Hyperion game is put together: worlds hold scenes, scenes hold nodes and entities, and systems process them.
summary: Worlds, scenes, entities, components and systems.
---

## The big picture

A **world** is your whole game. It holds one or more **scenes**, which you can think of as levels or regions. Each scene is a tree of **nodes**. **Entities** are nodes with **components** attached, and **systems** process those components every frame.

Scenes can also be assigned to cells on a grid and streamed in and out as the player moves around.

The [glossary](/docs/get-started/glossary.html) defines each of these terms.

## In this section

::: cards
children
:::

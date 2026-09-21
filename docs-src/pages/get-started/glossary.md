---
title: Glossary
description: Definitions of the terms used throughout the engine and docs
lede:
summary: Definitions of common engine terms.
---

## Core types

Object
:   Anything built on Hyperion's object system. It gets reflection, ref counting, serialization and a unique ID. Those IDs only last for the current run, so don't save them anywhere.

Class
:   Runtime info about a type: its name, fields, methods and parents. Mark a class with `HYP_CLASS()` and CodeGen takes care of the rest.

Handle
:   A strong reference to an object. When the last handle goes away, so does the object. Make one with `MakeHandle<T>()`. `WeakHandle` is the non-owning version.

## Scenes and what's in them

World
:   The top of the tree. It holds your scenes, plus world-wide things like physics and audio.

Scene
:   A level, or a region of your world. It's a tree of nodes, with an octree on the side for fast spatial queries.

Node
:   Something with a position, rotation and scale that can have children. Children move with their parent.

Entity
:   A node you can attach components to. Most things in your game will be entities.

Component
:   A chunk of data attached to an entity, like a mesh or a transform. Components describe what an entity *is*.

System
:   Code that runs over every entity with a certain set of components, in parallel. Components are the data; systems are the logic.

Subsystem
:   Like a system, but for the whole world rather than any one scene. It gets an `Update()` call every frame.

Camera, Light
:   Entities that view the scene and light it.

View
:   What a camera sees: the slice of your scene that gets rendered. You can have a few at once, like one for the main camera and one for shadows.

Swatch
:   A saved look for your world, like *Noon* or *Dusk*. Each swatch can have its own baked lighting.

## Rendering

Render proxy
:   Rendering runs on its own thread. Scene objects hand their data over through render proxies: the game thread writes, the render thread reads.

Render group
:   Objects that render the same way, batched together for instancing and culling. Think of it as roughly one graphics pipeline.

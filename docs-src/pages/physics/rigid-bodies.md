---
title: Rigid bodies
description: Add rigid bodies to entities in Hyperion Engine, set up physics materials and collision shapes, and how physics works in multiplayer.
lede: Rigid bodies allow physics simulation to be applied to your Entities
summary: Rigid bodies, physics materials and collision shapes.
---

## Giving physics to Entities

### In editor:
Add a`RigidBodyComponent` in the editor by seleting the entity in the scene hierarchy, clicking 'Add' > 'Rigid Body Component' under the 'Components' header.


### In code (C++):
```cpp
PhysicsMaterial material;
material.mass = 10.0f;

crate->AddComponent<RigidBodyComponent>(RigidBodyComponent {
    .physicsMaterial = material
});
```

::: note
Mass defaults to 0, which makes the body static: other bodies collide with it, but it doesn't move. Set a mass above 0 to make it dynamic.
:::

## Physics material

| Property | What it does |
|---|---|
| mass | Mass of the body, 0 == static, immovable |
| friction | Surface friction |
| restitution | Bounciness |

To give a body a starting velocity, set `initialVelocity` or `initialAngularVelocity` on the component

## Shapes

The shape defines the collision volume. Make one with **Assets › New... › Physics Shape**, and assign it to the component's collision shape. You can pick from:

- **Box**, **Sphere**, **Capsule** and **Plane**.
- **Convex hull**, wrapped around a mesh.
- **Compound**, a mesh decomposed into convex pieces. Use this for complex geometry.
- **Height field**, for terrain.

If no shape is set, a box fitted to the entity's bounds is used.

## In multiplayer

The server is the authority, and simulates physics for the world, which the clients predict + sync with.

Clients get replicated bodies' positions and velocities from the server, and interpolate between updates. More in [replication](/docs/multiplayer/replication.html).

---
title: Entities & components
description: Create entities in Hyperion Engine, add and remove components, move them around, and declare your own component types.
lede: Entities are the objects in your scenes. Components hold their data, such as meshes, physics bodies and scripts.
summary: Creating entities, adding components, and moving them.
---

## Making an entity

An entity is a node you can attach components to, so it lives in the scene tree like any other node. Make one, then add it to your scene:

```cpp
Handle<Entity> crate = MakeHandle<Entity>();
crate->SetName(NAME("Crate"));

scene->GetRoot()->AddChild(crate);
```

Once it's in a scene, it automatically gets a `TransformComponent`, a `BoundingBoxComponent` and a `VisibilityStateComponent`.

## Adding components

Components are plain structs:

```cpp
MeshComponent meshComponent;
meshComponent.mesh = crateMesh;
meshComponent.material = crateMaterial;

crate->AddComponent<MeshComponent>(meshComponent);
crate->SetLocalBounds(crateMesh->GetAABB());
```

The last line sets the entity's bounds, which culling uses. The other component methods:

- `GetComponent<T>()` returns a reference. The component must exist.
- `TryGetComponent<T>()` returns a pointer, or `nullptr` if it's missing.
- `HasComponent<T>()` checks for one.
- `RemoveComponent<T>()` removes it.

An entity can only have one of each component type. Adding a second will trip an assert.

## Transforms

Entities are nodes, so they've got a transform. The `Local` setters are relative to the parent, the `World` ones aren't:

```cpp
crate->SetLocalTranslation(Vec3f(0.0f, 2.0f, 0.0f));
crate->SetWorldScale(Vec3f(2.0f, 2.0f, 2.0f));
crate->Translate(Vec3f(1.0f, 0.0f, 0.0f)); // relative to where it is now
```

To look a node up by name: `scene->FindNodeByName("Crate"_sh)`.

## Built-in components

Common ones:

| Component | What it's for |
|---|---|
| MeshComponent | The mesh, material and skeleton to draw. |
| TransformComponent | Position, rotation and scale. |
| RigidBodyComponent | Makes it a physics body. |
| CharacterControllerComponent | Player-style movement: walking, jumping and collision. |
| ScriptComponent | Attaches a script. See [your first script](/docs/scripting/first-script.html). |
| AnimationComponent | Animation playback. |
| AudioComponent | Plays sounds from the entity's position. |

## Making your own

Declare a struct with `HYP_STRUCT(Component)`, and mark up the fields you want saved and shown in the editor:

```cpp
HYP_STRUCT(Component, Label = "Health Component")
struct HealthComponent
{
    HYP_STRUCT_BODY(HealthComponent);

    HYP_FIELD(Property = "Health", Serialize, Editor)
    float health = 100.0f;
};
```

Then include the generated file in your `.cpp`:

```cpp
#include <HealthComponent.generated.inl>
```

Re-run CodeGen (reconfiguring CMake runs it) to register the component. To process it every frame, write a [system](/docs/world/systems.html).

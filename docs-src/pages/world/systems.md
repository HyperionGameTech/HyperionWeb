---
title: Writing a system
description: Write a custom system in Hyperion Engine to process entities by component every frame, and add world-wide subsystems.
lede: Components hold the data. Systems are the code that does something with it, every frame, for every entity that has the right components.
summary: Code that runs over your components every frame.
---

## The basics

Subclass `SystemBase`, list the components you care about, and implement `Process`. This one regenerates health on anything with a `HealthComponent`:

```cpp
HYP_CLASS(NoScriptBindings, Serialize = false)
class RegenSystem final : public SystemBase
{
    HYP_OBJECT_BODY(RegenSystem);

public:
    void Process(float delta, Span<Handle<Scene>> scenes) override;

private:
    SystemComponentDescriptors GetComponentDescriptors() const override
    {
        return {
            ComponentDescriptor<HealthComponent, ComponentAccess::READ_WRITE> {}
        };
    }
};
```

The implementation:

```cpp
void RegenSystem::Process(float delta, Span<Handle<Scene>> scenes)
{
    if (!GetWorld()->GetGameState().IsSimulating())
    {
        return;
    }

    for (Scene* scene : scenes)
    {
        for (auto [entity, healthComponent] : scene->GetEntityManager()->GetEntitySet<HealthComponent>().GetScopedView(GetComponentInfos()))
        {
            if (healthComponent.health < 100.0f)
            {
                healthComponent.health += 5.0f * delta;
            }
        }
    }
}
```

The `IsSimulating()` check skips processing while editing, so it only runs during play.

## Component access

Systems can run in parallel. Saying which components you only `READ` and which you `WRITE` lets the engine work out what's safe to run at the same time. Only ask for `WRITE` access where you need it.

## Adding it to the world

Systems live on the world, not on a scene, and run over every scene in it:

```cpp
GetWorld()->AddSystemT<RegenSystem>();
```

## Subsystems

For world-wide logic that isn't tied to entities, like a day/night clock or a matchmaking queue, use a subsystem. Subclass `Subsystem`, fill in `OnAddedToWorld()`, `OnRemovedFromWorld()` and `Update(float delta)`, then:

```cpp
GetWorld()->AddSubsystem<MySubsystem>();
```

A world has at most one of each subsystem type. Retrieve it with `GetSubsystem<MySubsystem>()`.

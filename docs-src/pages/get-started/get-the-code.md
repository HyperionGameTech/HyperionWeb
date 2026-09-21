---
title: Get the code
description: Clone the Hyperion Engine repository from GitHub, including its Git submodules.
lede: 
summary: Clone the repo (and its submodules).
---

## Clone the repo

Hyperion pulls in a few libraries as Git submodules (Jolt, zlib, xatlas, the Strata compiler and a couple more), so clone with `--recursive`:

```shell
git clone --recursive https://github.com/HyperionGameTech/HyperionEngine.git
```

You'll land on the `dev` branch, which is where all the day-to-day work happens.

## If you cloned without --recursive

Run this from the repo root:

```shell
git submodule update --init --recursive
```

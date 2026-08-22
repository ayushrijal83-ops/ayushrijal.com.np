---
title: AgroVision Nepal
summary: A Flask agriculture simulator that identifies crops from a photograph by mapping a general-purpose ImageNet classifier onto five crops grown in Nepal.
date: 2026-07-23
updated: 2026-07-23
verified: true
draft: false
featured: false
status: paused
kind: Simulator
role: Sole developer
stack:
  - Python
  - Flask
  - TensorFlow
  - MobileNetV2
  - Pillow
  - NumPy
  - Flask-SQLAlchemy
roadmap:
  - Weather API integration
  - Real-time soil analysis
  - Crop disease detection
  - Fertilizer recommendation
  - Farmer authentication
  - Cloud database
tags:
  - ai
  - computer-vision
  - agriculture
repo: https://github.com/ayushrijal83-ops/Agriculture_simulator
---

## What it is

A web application that takes a photograph of a plant and tells you which of
five crops grown in Nepal it is most likely to be — rice, wheat, maize, potato
or tomato — alongside a growth simulation, a dashboard and a page of
agricultural funding information.

## How it actually works

This is the part worth being precise about, because the honest description is
more interesting than the impressive one.

There is **no crop model**. The classifier is MobileNetV2 with stock ImageNet
weights — a general-purpose image network that has never seen a
crop-specific dataset. What the project adds is the layer on top:

1. The image is resized to 224×224 and run through MobileNetV2, keeping the
   **top ten** ImageNet predictions rather than just the first.
2. A **plant gate** decides whether the photograph is of a plant at all: at
   least one of those ten labels has to carry a botanical keyword with a
   probability of 0.10 or better. Fail it, and the result is `Unknown`.
3. A **label map** translates ImageNet vocabulary into the five crops —
   `corn`, `corncob` and `ear` all become maize; `mashed_potato` becomes
   potato — accumulating probability across every matching label and ranking
   the crops by the total.
4. Each identified crop is paired with its binomial name.

So it is a transfer problem solved without training: a general classifier
aimed at a narrow domain by curating its vocabulary. That works because the
five target crops all have close ImageNet neighbours, and it is exactly why it
would not extend to a sixth crop that ImageNet has never seen.

## What I would fix

The reported confidence figure is the model's probability for its **top
ImageNet label**, not its confidence in the crop that was finally chosen.
Those are different numbers, and showing the first while labelling it as the
second overstates what the system knows. There is also a fallback that
suggests rice, maize and wheat when nothing maps — reasonable as a default,
but it means the interface can look confident about an image it made no
determination on.

## Status

Paused. The repository was written in a single stretch and has not been
returned to. It runs locally; it is not deployed.

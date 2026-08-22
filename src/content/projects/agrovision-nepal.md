---
title: AgroVision Nepal
summary: A Flask agriculture simulator that identifies crops from a photograph by mapping a general-purpose ImageNet classifier onto five crops grown in Nepal, then scores whether your soil and this week's weather suit the result.
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
  - Werkzeug
  - Requests
roadmap:
  - Crop disease detection
  - Fertilizer recommendation
  - Soil analysis from sensors rather than a form
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
or tomato — then scores how well your conditions suit growing it. Around that
sit a growth simulation, a dashboard, farmer accounts and a page of
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

## The suitability check

Two POST routes sit behind the identification, and both are more conventional
than the classifier and more useful than it:

- **`/soil-check`** scores a soil type and a nitrogen level, entered on a form,
  against the crop's requirements in `crop_data.json` — fifty points for each
  match, and a sentence of advice per band. It is a rules comparison, not an
  analysis: there is no sensor anywhere in this project, and the roadmap item
  it does not satisfy is the *real-time* one.
- **`/weather-check`** calls OpenWeatherMap for a named city in Nepal and
  combines the live temperature with the soil and nutrient answers into a
  weighted score — weather 40%, soil 30%, nutrients 20% — banded into Good,
  Moderate or Risk.

Accounts are real too: registration and login with Werkzeug password hashing,
and every route above refuses an anonymous request.

## What I would fix

The reported confidence figure is the model's probability for its **top
ImageNet label**, not its confidence in the crop that was finally chosen.
Those are different numbers, and showing the first while labelling it as the
second overstates what the system knows. There is also a fallback that
suggests rice, maize and wheat when nothing maps — reasonable as a default,
but it means the interface can look confident about an image it made no
determination on.

There is also a defect I did not find until writing this page: the
OpenWeatherMap key is a string literal in `app.py`, in a public repository,
under a comment that says `Hackathon: hardcode key`. It needs revoking and
moving into the environment. It is recorded here rather than quietly patched
because the same habit is the reason this site's own GitHub token never leaves
a runner.

## Status

Paused. The repository was written in a single stretch and has not been
returned to. It runs locally; it is not deployed.

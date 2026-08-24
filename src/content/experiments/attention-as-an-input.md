---
title: Attention as an input
summary: Estimating whether the user is actually looking at the machine, and using it to change how the machine answers — with no measurement of whether that helped.
date: 2026-08-09
verified: true
draft: false
outcome: inconclusive
hypothesis: An assistant that can tell whether it is being attended to should answer differently when it is not — shorter, or not at all.
apparatus:
  - MediaPipe Face Detection
  - MediaPipe Face Mesh
  - OpenCV
result: Not measured. The state machine works and the style hint changes; whether either improves the interaction was never tested, so this experiment is recorded as inconclusive rather than as a success.
notebook: https://github.com/ayushrijal83-ops/jarvis_assistant
tags:
  - computer-vision
  - interaction
  - honest-negative
---

## What it computes

`vision.py` runs two MediaPipe graphs on the same frame. **Face Detection**
gives presence — is anyone there — with a confidence floor of 0.3 and a
one-second timeout before the state flips to `FACE LOST`. **Face Mesh** gives
a landmark set, from which the module derives a crude pitch estimate: the nose
tip's y-position relative to the eye line, normalised by the distance between
the eye corners so it does not change when you lean closer to the camera.

From those two it maintains a state — face present, face lost, looking down,
distracted — and emits it as an event.

## What it does with it

`emotion_engine.py` consumes that state. It is 599 bytes and its own docstring
says **"NO ML, NO threads, NO side effects"**, which is the right way to
describe it: a lookup from vision state to a style hint. `DISTRACTED`,
`LOOKING DOWN` and `FACE LOST` return `short`, and the assistant answers more
briefly.

It is named the emotion engine and it does not detect emotion. I am leaving
the name in this record because the file is honest about it in a way the
filename is not, and that gap is worth seeing.

## Why this is filed as inconclusive

The mechanism works. Presence is detected, the pitch estimate tracks, the
state changes, the hint changes, the answers get shorter.

Whether any of that makes the assistant **better** was never measured. There
is no A/B, no timing, no record of whether shorter answers while looking away
are actually more useful than full ones. The honest outcome for an experiment
whose result was never observed is not "succeeded" — it is this.

The pitch estimate is also a proxy and should be read as one. Nose-below-eyes
is not gaze; it is head pose, and someone can look at a screen with their head
down. Calling it attention is a simplification I would want to justify with
data before I built anything else on top of it.

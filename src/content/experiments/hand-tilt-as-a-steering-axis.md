---
title: Hand tilt as a steering axis
summary: Turning 21 hand landmarks into one continuous steering value, and finding out that the whole problem is smoothing.
date: 2026-08-09
verified: true
draft: false
outcome: succeeded
hypothesis: A racing game can be steered with a bare hand if the landmark stream is reduced to a single continuous axis rather than classified into discrete gestures.
apparatus:
  - MediaPipe Hands
  - OpenCV
  - pynput
  - 1280×720 capture, 320×240 inference
result: Playable. No frame-rate, latency or false-trigger rate was measured — the thresholds were set by playing the game, not by instrumentation.
notebook: https://github.com/ayushrijal83-ops/beach_buggy_ai
tags:
  - computer-vision
  - gesture
  - interaction
---

## The reduction

MediaPipe returns 21 landmarks per hand. The temptation is to classify them —
train something, or write a decision tree over finger positions, and emit
`left` or `right`. `gesture_control.py` does something much smaller.

Steering is the **x-distance between landmark 0 (the wrist) and landmark 9
(the middle-finger knuckle)**. One subtraction. Tilt the hand and that
difference changes sign and magnitude; hold it level and it sits near zero.
Twenty-one landmarks reduce to one float, and the float is already continuous,
already signed, and already means what you want it to mean.

Braking and acceleration are counted rather than measured: a fist is three or
more fingertips below their knuckles, an open hand is three or more above.
Counting is enough because those two states are far apart.

## Where the difficulty actually was

Not in the detection. In the **noise**.

A raw landmark stream jitters, and a jittering steering axis crossing a
threshold produces a stream of key presses that makes the car undriveable. The
fix is one line — an exponential moving average with `SMOOTHING_FACTOR = 0.3`,
so each frame is 30% new reading and 70% history — and then the thresholds
matter: `±0.02`, which is deliberately tiny, with detection confidence at 0.7
and tracking at 0.5.

Those four numbers are the project. They were found by playing the game, and
they are the reason the file's docstring says "ultra-sensitive": at ±0.02 the
system responds to a wrist movement you would not describe as a gesture.

One more thing that turned out to matter: frames are captured at 1280×720 and
**downscaled to 320×240 before inference**. The landmarks are normalised
coordinates, so nothing downstream notices, and the pipeline gets its frame
budget back.

## What the filter taught

That a good input device is mostly a filter. The recognition was library work;
the smoothing constant and the two thresholds were the engineering, and no
tutorial has them in it, because they belong to this camera, this hand and
this game.

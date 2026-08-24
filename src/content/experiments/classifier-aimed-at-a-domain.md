---
title: Aiming a general classifier at five crops
summary: Whether a stock ImageNet network can be pointed at a narrow domain by curating its vocabulary instead of training it on that domain.
date: 2026-07-23
verified: true
draft: false
outcome: succeeded
hypothesis: A general-purpose image classifier can be made to identify five specific crops without any crop-specific training, if the mapping from its vocabulary to the target classes is done carefully enough.
apparatus:
  - MobileNetV2
  - ImageNet weights
  - TensorFlow 2.15
  - Pillow
  - NumPy
result: Works for the five target crops. No accuracy figure was measured — the project has no labelled test set, so there is no number to report.
notebook: https://github.com/ayushrijal83-ops/Agriculture_simulator
tags:
  - computer-vision
  - transfer
  - no-training
---

## The setup

`agrovision/ai_crop.py` loads MobileNetV2 with stock ImageNet weights. Nothing
is trained, fine-tuned or frozen-and-retrained. The network has never seen a
crop dataset. What the project adds is three layers of judgement on top of its
output:

1. The image is resized to 224×224 and classified, keeping the **top ten**
   ImageNet predictions rather than the first.
2. A **plant gate** decides whether the photograph is of a plant at all: at
   least one of those ten labels must contain a botanical keyword — `plant`,
   `leaf`, `corn`, `tomato`, and fourteen others — at a probability of 0.10 or
   better. Fail it and the answer is `Unknown`.
3. A **label map** translates ImageNet vocabulary into the five target crops.
   `corn`, `corncob` and `ear` all accumulate onto maize; `mashed_potato` onto
   potato. Probability is summed across every matching label, and the crops are
   ranked by that total.

## Why it works, and exactly how far

It works because all five crops have close ImageNet neighbours. It would not
extend to a sixth crop that ImageNet has never seen, and no amount of care in
the label map would rescue that — the information is not in the network. That
is the actual finding: **the ceiling here is the vocabulary, not the code.**

## The defect I would fix first

The confidence figure the interface reports is the model's probability for its
**top ImageNet label**, not its confidence in the crop that was finally chosen.
Those are different numbers, and showing the first while labelling it as the
second overstates what the system knows. There is also a fallback that
suggests rice, maize and wheat when nothing maps — a reasonable default that
makes the interface look confident about an image it made no determination on.

Both are the same mistake in two places: a number is displayed because one was
available, not because it answered the question being asked.

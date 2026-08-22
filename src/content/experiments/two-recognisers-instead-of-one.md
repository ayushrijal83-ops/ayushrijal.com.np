---
title: Two speech recognisers instead of one
summary: Running a small always-on recogniser alongside a large per-command one, because the wake word and the command are not the same problem.
date: 2026-08-09
verified: true
draft: false
outcome: succeeded
hypothesis: A single speech recogniser cannot be both cheap enough to run continuously and accurate enough to transcribe a command, so the two jobs should be given to two different models.
apparatus:
  - Vosk (vosk-model-en-us-0.22)
  - faster-whisper (small)
  - sounddevice
  - 16 kHz mono capture
result: Both recognisers run on one machine and one microphone. Latency and word error rate were not measured — no figure is reported for either.
notebook: https://github.com/ayushrijal83-ops/jarvis_assistant
tags:
  - voice
  - local
  - architecture
---

## The problem

An always-listening assistant has two speech jobs that pull in opposite
directions. The wake word must be recognised **continuously**, on every frame
of audio, forever — so it has to be cheap. The command must be transcribed
**accurately**, once, after the wake word — so it can afford to be expensive.

One model cannot be both. A model small enough to run all day gets the command
wrong; a model good enough for the command cannot run all day.

## What Jarvis does

`voice.py` runs both, each on the job it suits.

**Vosk** holds the microphone continuously through a `KaldiRecognizer` at 16
kHz mono. It listens for `jarvis`, and — this is the part I did not expect to
need — it keeps listening *while the assistant is speaking*, for the cancel
phrases in `CANCEL_PHRASES`. That is barge-in: the speaker loop calls
`engine.stop()` mid-utterance when it hears one. An assistant you cannot
interrupt is one you end up talking over.

**faster-whisper** is loaded lazily, the first time a command is actually
needed, and records a short clip bounded by three limits in `config.py` rather
than by a fixed duration: a 3-second minimum, a 4-second maximum, and a stop
after 450 ms of silence below an energy threshold of 400. The thresholds are
there because a microphone is a physical device and this one needed tuning.

## What I learned

That the interesting decision was not which recogniser to use. It was noticing
that "listen for the wake word" and "transcribe the command" are two problems
wearing one name, and that once they are separated each has an easy answer.

The barge-in path is the piece I would keep in anything I build next. It costs
one extra recogniser running during playback and it is the difference between
a demo and something usable.

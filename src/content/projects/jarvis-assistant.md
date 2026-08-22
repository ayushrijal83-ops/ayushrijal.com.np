---
title: Jarvis Assistant
summary: An offline-first desktop assistant that hears, sees and acts — local wake word, local transcription, local LLM, and hand-gesture control, with nothing sent to a cloud API.
date: 2026-08-09
updated: 2026-08-09
verified: true
draft: false
featured: true
status: active
kind: Desktop assistant
role: Sole developer
stack:
  - Python
  - Vosk
  - faster-whisper
  - Ollama
  - pyttsx3
  - OpenCV
  - MediaPipe
  - PyAutoGUI
  - Tkinter
tags:
  - ai
  - computer-vision
  - voice
repo: https://github.com/ayushrijal83-ops/jarvis_assistant
---

## What it is

A desktop assistant for Windows that runs its whole pipeline locally: an
always-listening wake word, speech-to-text, a language model, speech synthesis,
webcam vision and hand-gesture recognition — assembled into one program with a
Tkinter heads-up display.

The constraint that shapes it is that **no cloud API is involved**. Every stage
that would normally be an HTTP call to somebody else's service is a local
component instead.

## How it works

Each capability is a separate component, and the interesting part is that they
are all substitutions for a hosted service:

| Stage | Runs locally as |
|---|---|
| Wake word | Vosk, listening continuously |
| Speech to text | faster-whisper |
| Language model | Ollama, self-hosted, Mistral by default |
| Speech synthesis | pyttsx3 |
| Vision | OpenCV with MediaPipe — face presence, gaze and gesture |
| Desktop control | PyAutoGUI |

Voice and vision are the two largest modules in the repository — roughly 25 KB
and 10 KB of Python — with gesture recognition split across a recogniser and a
separate control layer that maps a recognised gesture onto an action. The
interface is its own 23 KB module.

The vision module does more than the table admits: MediaPipe's face detector
gives presence, its face mesh gives a nose-and-eye-line estimate of where the
head is pointing, and the two together decide whether the user is actually
attending to the machine before it acts. That is the part I would keep if I
rebuilt it.

Desktop control is deliberately fenced. Launchable applications come from a
whitelist, keystrokes from an allow-list, typing is capped at 120 characters,
input is rate-limited, and `alt`+`F4` is classified as risky and asks for
confirmation. PyAutoGUI's own fail-safe is left on. An assistant that can
drive the keyboard is a program that can destroy your work by mishearing one
syllable, and none of those limits are decorative.

There is also a game mode: gesture recognition is bound to a set of per-game
control profiles, so a hand becomes the input device for a racing game.

## Why I built it

Because the interesting question is not whether an assistant can be built, but
how much of one can be built without renting any of it. Every component here is
a local answer to something that is normally a subscription and an API key, and
assembling them is where you find out what that actually costs in latency,
accuracy and complexity.

## What I learned

That the integration is the project. Any one of these components is a
well-documented library on its own; making them share a machine — a microphone,
a camera, a CPU and a single interface — is the part with no tutorial.

## A note on the two repositories

There are two Jarvis repositories on the account. This record points at
`jarvis_assistant`, which contains the implementation. The other,
`Jarvis-AI-Assistant`, contains documentation scaffolding — a MkDocs site, a
changelog, a citation file — and no source code at all. Linking the one with
the code in it seemed more useful than linking the one with the better name.

## Status

Active development. It runs on the machine it was built on. It is not packaged
for distribution and has not been tested on other hardware.

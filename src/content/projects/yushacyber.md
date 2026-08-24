---
title: YushaCyber
summary: A cybersecurity learning platform built as a Flask application — roadmaps, labs, a CTF arena, an AI mentor and a browser terminal, wired together as fourteen registered blueprints.
date: 2026-07-05
updated: 2026-08-15
verified: true
draft: false
featured: true
status: active
kind: Platform
role: Sole developer
stack:
  - Python
  - Flask
  - Flask-SQLAlchemy
  - Flask-Login
  - Flask-WTF
  - Flask-Migrate
  - Alembic
  - Jinja
  - Docker
tags:
  - cybersecurity
  - education
  - flask
repo: https://github.com/ayushrijal83-ops/YushaCyber
---

## What it is

A learning platform for cybersecurity, built as a single Flask application and
organised into fourteen registered blueprints — authentication, dashboard,
roadmap, CTF, labs, resources, profiles, leaderboard, admin, analytics,
community, AI endpoints, an in-browser terminal and a missions interface.

It is the largest thing in this archive by some distance: around 3.4 MB of
Python, plus the templates, stylesheets and client JavaScript that go with it.

## Why I built it

I wanted the thing I was learning from to be the thing I was building. Working
through security material and building the platform that teaches it are the
same activity done twice, and doing both meant every topic had to be understood
well enough to turn into an exercise someone else could complete.

## How it works

The application factory registers each area of the platform as its own
blueprint under its own URL prefix, so a feature is a directory rather than
another branch in a growing file. Models sit behind SQLAlchemy with Alembic
migrations, sessions are handled by Flask-Login, and the whole app is
containerised with a Dockerfile and a Compose file.

Two decisions in it are security decisions rather than convenience ones, which
matters for a platform about security:

- **CSRF protection is global**, via Flask-WTF, rather than applied per form.
- **Rendered markdown is sanitised** with `bleach`, against an explicit
  tag-and-attribute allow-list, before it reaches a page. Lesson content and
  CTF challenge descriptions are markdown, so the lesson viewer is an
  injection surface.

## What is actually built

Four things worth naming precisely, because they are the parts most easily
overstated:

- **Progression is real.** A user row carries `xp` and `level`; challenges and
  mission objectives carry an `xp_reward`; an achievement engine reads those
  totals and a leaderboard ranks them.
- **The CTF arena has a schema behind it** — challenge categories, challenges,
  per-user solves and staged hints — rather than a page of static puzzles.
- **The AI mentor is a client, not a model.** "CyberMentor" is a chat endpoint
  in front of a provider interface with OpenAI and Anthropic implementations
  and a mock. It needs a key in the environment; without one the feature
  reports itself unavailable. Nothing about it runs locally, and nothing about
  it is trained here.
- **The browser terminal and the missions UI are their own blueprints**, added
  after the platform's first shape and registered alongside the rest.

## What I learned

That the tests are where a platform like this actually gets built. The
repository carries 48 test files, and the largest of them are the ones covering
the lab content itself — SQL injection, XSS, CSRF, file-upload security,
Wireshark, nmap, network reconnaissance, forensics, SOC workflow. Writing a
test for a lab forces the lab to have a correct answer, which forces the topic
to be understood rather than paraphrased.

## Status

Active development. It runs locally and in Docker; it is not deployed, and it
has no users to speak of. Nothing here should be read as a live service.

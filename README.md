# Project Noor

**A spiritual place without borders.**

Project Noor is an early-stage exploration of a calm, shared digital environment inspired by the immediate, atmospheric user experience of Sansa, thoughtfully adapted for Muslim users.

The product idea is simple: enter, be present, find peace, and leave whenever you want.

## Product direction

Project Noor aims to combine two experiences:

- **Personal quiet:** a space for reflection, remembrance, and calm without pressure to interact.
- **Shared presence:** the possibility of seeing other people in the same environment without requiring conversation.

The experience should feel meaningful even when a visitor is alone.

## Experience principles

- Atmosphere before interface.
- Immediate entry; no account required for the first prototype.
- No compulsory chat, likes, feeds, rankings, or competitive mechanics.
- Calm, accessible, mobile-first interaction.
- Respect for Islamic practice and the diversity of Muslim traditions.
- Privacy by design; religious activity must never become an advertising or profiling signal.

**Sansa is the permanent product benchmark for Noor.** Every major UX and technical decision must be compared against its strengths: immediate browser entry, intuitive avatar movement, simple gestures, atmospheric spaces, quiet shared presence, and a minimal interface. Noor must adapt these principles to an Islamic context rather than copy Buddhist symbols, rituals, assets, or content. Public reporting confirms that Sansa was created with ChatGPT Codex using vibe coding; its exact framework and backend architecture have not been publicly established. We will not pretend otherwise.

## First milestone

Build a lightweight, single-user browser-based 3D environment and test it on Android before introducing multiplayer or complex features.

The first prototype will focus on:
- A peaceful courtyard with a mosque-inspired architectural landmark.
- A quiet garden and a restrained use of water, greenery, and light.
- Simple touch controls designed for phones.
- Reliable loading and readable performance on mid-range Android devices.

## Documentation

- [Product Requirements Document](docs/PRD.md)
- [Roadmap](docs/ROADMAP.md)
- [3D Engine Decision](docs/ENGINE-DECISION.md)
- [Technical Specification — Prototype 01](docs/TECHNICAL-SPEC-PROTOTYPE-01.md)
- [Android Preview Workflow](docs/ANDROID-PREVIEW-WORKFLOW.md)
- [Approved Visual Direction — Arabian Architecture](docs/VISUAL-DIRECTION.md)

## Important religious boundary

Project Noor is a digital environment for reflection and community. It does **not** replace salah or any physical, ritual obligation. Quranic text, recitations, translations, and religious explanations must be properly sourced and reviewed by qualified people before publication.

## Current status

**Stage:** single-user browser prototype running in Codespaces and opened on Android. Tap-to-move, camera orbit, pinch zoom, a procedural articulated avatar, and a basic walk cycle are implemented. The Sansa-inspired mobile action layer now adds a greeting gesture and pause control. The latest pull-request build and type-check passed; the post-merge main-branch workflow is running.  
**Stack:** Three.js + TypeScript + Vite. This is Noor's current implementation, not a claim about Sansa's undisclosed stack.  
**Next step:** replace the geometric blockout with properly licensed, optimized 3D assets and move toward a more convincing environment and rigged avatar; then validate Android performance.

This repository is an evolving product workspace. Scope and implementation choices may change after testing with real users.

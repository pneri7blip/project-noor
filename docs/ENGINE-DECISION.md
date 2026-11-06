# Technical Decision — 3D Engine for Prototype 01

**Status:** Selected for the first implementation; subject to device testing  
**Date:** 2026-11-06

## Decision

Use **Three.js + TypeScript + Vite** for Prototype 01.

## Why this fits the current milestone

The first milestone is a small, single-user courtyard. Its critical requirements are a lightweight browser scene, tap-to-move, one-finger camera orbit, two-finger pinch zoom, and predictable Android touch behavior. It does not require physics, multiplayer, a complex character controller, a visual scene editor, or advanced authoring tools.

Three.js provides the rendering foundation, scene graph, cameras, lights, materials, animation loop, and asset loaders while allowing the product's interaction model to remain custom and deliberately minimal.

Babylon.js is a credible alternative and provides more integrated engine features, including touch-capable cameras, animation systems, audio, physics, character-controller tooling, inspectors, and asset import/export. Those capabilities may become valuable if Noor grows into a more simulation-heavy environment. They are not currently required to validate the courtyard experience.

## Performance caveat

No engine is declared the performance winner. A published October 2026 benchmark compares engine draw-call costs on a Pixel 8 Pro using synthetic box scenes; it is useful as a reference but does not predict performance for Noor's geometry, materials, touch interactions, or the user's Motorola moto g71 5G.

The actual acceptance decision must be based on measurements on the target phone in its real browser. The current prototype disables real-time shadows, caps device pixel ratio, uses simple geometry, and keeps the first scene intentionally small.

## Sansa reference

Public reporting confirms that Sansa's creator used OpenAI Codex and a natural-language/vibe-coding workflow. The available public sources do not establish Sansa's 3D engine, language, framework, or repository workflow. This decision therefore copies observed interaction principles, not an unverified technical stack.

## Reconsider Babylon.js if

- The project needs a robust character controller, collision system, or navigation tools.
- Animation retargeting and a larger imported character pipeline become central.
- Audio, physics, and scene inspection would otherwise require substantial custom infrastructure.
- A measured prototype shows a meaningful implementation or runtime advantage on target devices.

## Validation required

- Build the project with the declared package versions.
- Open the built HTTPS preview on the Motorola moto g71 5G.
- Test tap-to-move, drag-to-orbit, pinch-to-zoom, and gesture transitions.
- Record load time, approximate frame rate, memory/runtime errors, and portrait/landscape behavior.
- Revisit the engine decision only if evidence shows a real problem.

## Sources

- Three.js WebGLRenderer documentation: https://threejs.org/docs/pages/WebGLRenderer
- Babylon.js engine specifications: https://www.babylonjs.com/specifications/
- October 2026 comparative synthetic benchmark (Pixel 8 Pro): https://www.webkkk.net/mvaligursky/web-engines-compare
- Public Sansa reporting and UX research are recorded in the project research notes; no unverified claim about Sansa's engine is made here.

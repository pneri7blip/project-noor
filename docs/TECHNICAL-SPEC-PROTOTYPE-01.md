# Technical Specification — Prototype 01

**Status:** Proposed implementation specification  
**Stage:** Single-user Android-first 3D prototype  
**Repository:** `pneri7blip/project-noor`  
**Decision rule:** implement the smallest scene that can validate the Sansa-inspired mobile interaction model. Do not build multiplayer, accounts, or monetization in this prototype.

## 1. Objective

Deliver a browser-based 3D courtyard that opens on Android without registration. A first-time visitor must be able to explore it using the same three mobile gestures observed directly in Sansa:

1. Tap the ground to move the avatar.
2. Drag one finger to rotate the camera.
3. Pinch with two fingers to zoom in or out.

There must be no on-screen joystick.

This prototype validates navigation, mobile performance, and atmosphere. It is not yet the complete Noor product.

## 2. Proposed frontend stack

| Layer | Proposed choice | Reason |
|---|---|---|
| Language | TypeScript | Explicit types and easier maintenance of AI-generated code |
| 3D rendering | Three.js | Flexible browser-native 3D rendering and control over the Sansa-like UX |
| Build tool | Vite | Lightweight development/build workflow |
| 3D asset format | glTF/GLB when real assets are introduced | Common web 3D interchange format |
| Source control | Existing private GitHub repository | Version history and backup; not the development environment itself |

**Important:** Three.js is a proposed choice for Noor, not a claim about Sansa's internal technology. Validate it on the target Android phone before treating the choice as final.

## 3. Explicitly deferred

Do not add these in Prototype 01:

- Colyseus, WebSockets, multiplayer rooms, or synchronized avatars.
- Login, user profiles, database, analytics, or tracking.
- Payments, donations, subscriptions, advertising.
- Chat, voice, friends, or social feeds.
- Quran text, recitations, religious instruction, or ritual simulations.
- Complex avatar customization, physics simulation, or pathfinding.
- Large asset libraries or multiple explorable buildings.

Colyseus remains a candidate for a later shared-presence phase, not a dependency of the first scene.

## 4. Scene scope

### Required scene elements

- One outdoor courtyard with a clear, walkable ground plane.
- One modest mosque-inspired architectural landmark as the visual focal point.
- A small garden zone with a few trees or planters.
- Restrained environmental details; no crowded decoration.
- One simple placeholder avatar, preferably a lightweight animated humanoid if a suitable licensed asset is available. Otherwise use a clearly temporary primitive avatar.
- A clear starting position and visible destination area.

Use simple geometry and placeholder materials first. Do not spend time producing final architecture or sourcing elaborate assets before movement works.

### Visual direction

- Calm, respectful, spacious, and recognizably Islamic in architectural language without copying Sansa's assets or exact design.
- Natural daylight, restrained materials, greenery, and optional subtle water.
- No game HUD, scores, quests, badges, leaderboards, or combat/game mechanics.
- The scene must remain visually coherent when empty.

## 5. Mobile controls

### Tap to move

- Raycast the tap position onto the walkable ground.
- Move the avatar toward that point.
- Ignore taps on interface controls and non-walkable objects.
- Use a short gesture threshold to distinguish a tap from a camera drag.
- Stop at the destination; no pathfinding is required in this prototype.
- Do not display a joystick.

### Drag to rotate

- A one-finger drag rotates the third-person camera around the avatar.
- A drag must not also trigger movement.
- Keep camera sensitivity moderate and avoid sudden jumps.

### Pinch to zoom

- Two-finger pinch adjusts camera distance.
- Clamp zoom to sensible minimum and maximum distances.
- Pinch must not move the avatar or rotate the camera unexpectedly.

### Desktop fallback

- Mouse click on ground moves the avatar.
- Mouse drag rotates the camera.
- Mouse wheel zooms.
- Keyboard WASD may be included for development convenience, but it must not complicate the mobile interaction model.

## 6. Camera and movement

- Use a third-person camera that keeps the avatar and its surroundings visible.
- Camera follows the avatar smoothly.
- Prevent the camera from going below the ground or inside major architecture.
- Keep movement speed calm and consistent.
- Avoid exaggerated acceleration, jumping, running, or game-like motion.
- Do not add collision/pathfinding complexity unless a basic test exposes a real problem.

## 7. Performance and resilience

Target device for first validation: the user's Motorola moto g71 5G running an Android browser.

Acceptance goals:
- Scene loads in a normal mobile browser without account creation.
- No persistent console/runtime errors.
- Aim for a stable 30 FPS or better on the target device; record actual results rather than claiming performance without testing.
- Keep geometry, texture sizes, draw calls, and lighting modest.
- Prefer baked/simple lighting over many real-time shadow-casting lights.
- Avoid unnecessarily large downloads.
- Show a simple loading state and a recoverable error message if WebGL is unavailable.
- Test portrait and landscape orientations; prioritize portrait usability while keeping the scene usable in landscape.

Do not claim that a device passes performance acceptance until it has been tested on that device.

## 8. Accessibility and user experience

- No mandatory tutorial. A brief, dismissible hint may say: “Tap to move · Drag to look · Pinch to zoom”.
- Controls must not cover the main architectural focal point.
- No audio autoplay. If ambient audio is added, it must be user-controlled and off by default.
- Respect reduced-motion preferences where practical.
- Do not imply that entering the virtual mosque performs or replaces salah.

## 9. Build sequence

Implement in small, testable increments:

1. **Scene shell:** Vite + TypeScript + Three.js, responsive canvas, loading/error handling.
2. **Environment blockout:** ground, courtyard boundaries, simple mosque landmark, garden placeholders.
3. **Avatar and tap movement:** one avatar moves to a tapped ground position.
4. **Camera gestures:** one-finger drag rotates; two-finger pinch zooms; gesture conflicts are resolved.
5. **Desktop fallback:** mouse controls and optional keyboard movement.
6. **Android validation:** test on the actual moto g71 5G; fix touch conflicts, loading, and performance.
7. **Visual polish:** improve materials, lighting, foliage, and avatar only after the interaction and performance baseline works.

Each increment should be committed separately with a clear message and tested before adding the next one.

## 10. Acceptance checklist

Prototype 01 is ready for review when all are true:

- [ ] Opens from a shareable HTTPS URL in Android Chrome or the user's chosen browser.
- [ ] No registration or installation required.
- [ ] Courtyard and mosque-inspired landmark are visible.
- [ ] Avatar is visible at the starting point.
- [ ] Tap on walkable ground moves the avatar.
- [ ] One-finger drag rotates the camera without moving the avatar.
- [ ] Two-finger pinch zooms without moving the avatar.
- [ ] No virtual joystick appears.
- [ ] Interface remains usable in portrait and landscape.
- [ ] No persistent runtime errors.
- [ ] Performance has been measured on the target phone and results recorded.
- [ ] Empty-scene experience feels calm and coherent.

## 11. Open decisions after Prototype 01

Only after testing should we decide:

- Whether Three.js remains the right framework or Babylon.js should be benchmarked.
- Which hosting/static deployment provider to use.
- Which avatar and environment assets to license or create.
- Whether the scene needs a more advanced movement/collision system.
- When to add audio and the first spiritual interactions.
- When to introduce a multiplayer server such as Colyseus.

## 12. Development constraints

The project owner currently works from an Android phone and is a beginner in programming. The development workflow must therefore minimize local setup, terminal commands, and manual code editing. Prefer an AI-assisted workflow with small, reviewable changes and clear instructions for testing from the phone.

Do not assume access to a desktop computer, a paid cloud coding plan, or a particular Codex interface. Confirm the actual available development environment before asking the owner to create accounts, install tools, or run commands.

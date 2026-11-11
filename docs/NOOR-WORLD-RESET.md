# Project Noor — clean-slate world rebuild

Status: approved direction; implementation branch `noor/rebuild-world-from-zero`.

## Non-negotiable boundary

Keep the existing interaction layer in `src/main.ts`:
- the current articulated avatar and its walk cycle;
- the lower-left joystick;
- one-finger camera look on the free screen area;
- two-finger pinch zoom and two-finger camera look;
- the existing greeting, pause and camera-reset actions;
- the current Android touch behaviour and responsive layout.

These controls are considered approved. Do not redesign, remap, simplify or replace them during the environment rebuild.

## Remove from the new world

The new default world must not load or depend on:
- `src/scene/asset-mosque-environment.ts` or the external Desert Mosque GLB;
- `src/scene/architecture.ts` and its previous procedural courtyard;
- `src/scene/asset-hall.ts` and the previous prayer-hall asset.

Do not use the previous scene as a base, template, or source of geometry. It may remain in Git history until the new world is verified, but it must not be part of the new runtime.

## New visual direction

Create one coherent, original mosque complex from a clean scene:
- monumental ivory-white marble architecture with subtle, non-repeating stone veining;
- a legible central axis from courtyard to monumental entrance and deep prayer hall;
- elegant pointed and horseshoe arches with convincing depth, layered reveals and carved capitals;
- a large central dome and smaller secondary domes, proportioned as one architectural composition;
- slender minarets integrated into the overall silhouette;
- restrained gold/brass accents, dark teal glazing and finely patterned geometric screens;
- a broad, calm courtyard with polished pale stone, planted edges and reflecting water;
- a prayer hall with green carpet, repeated columns/arcades, a deep mihrab, suspended chandeliers and a richly detailed ceiling;
- physically coherent daylight, ambient occlusion/shadows where performant, and warm interior light.

The reference is the level of refinement and atmosphere in the photographs previously selected together, especially the Sheikh Zayed Grand Mosque. The design must be original; do not claim to reproduce that building.

## Quality and engineering rules

1. Build the exterior and interior as a single architectural language, not as disconnected props.
2. Prefer reusable parametric geometry, instancing and generated tileable textures over hundreds of heavyweight individual meshes.
3. Use real depth and silhouette for arches, cornices, capitals, screens and ornament; avoid flat decorative stickers.
4. Keep the scene navigable at human scale and preserve the avatar spawn point and movement bounds deliberately.
5. Test on mobile GPU budgets: draw calls, texture memory, triangle count and loading time matter.
6. Avoid external runtime asset dependencies unless their licence, CORS, file size and mobile performance are verified.
7. Do not change the approved controls to compensate for world-layout problems. Adapt the world to the existing navigation.

## Acceptance criteria

- The default published route opens the new world; no query-string preview or old-scene fallback.
- The avatar can walk from the courtyard through the main entrance into the prayer hall.
- The camera and touch controls behave exactly as before.
- Exterior, threshold, prayer hall and mihrab read as one complete environment.
- No desert-sandstone placeholder, low-poly/game-like finish, or old GLB remains in the runtime.
- Mobile performance and loading are checked before replacing the public default.

## Delivery sequence

1. Isolate and freeze the approved interaction layer.
2. Build the new architectural blockout and verify walkable continuity.
3. Replace blockout surfaces with marble, glazing, carpet and metal materials.
4. Add architectural detail, lighting and interior focal points.
5. Run a production build and inspect the published Android experience.
6. Only then remove obsolete scene modules and make the new world the default.

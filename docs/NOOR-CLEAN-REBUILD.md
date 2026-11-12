# Project Noor — clean-slate 3D world rebuild

Status: active rebuild direction. This branch starts from `main`, not from the rejected procedural mosque attempt.

## Absolute scope boundary

### Preserve without redesign
The existing interaction and avatar layer in `src/main.ts` is the approved baseline:
- articulated avatar, walk cycle, idle breathing and greeting gesture;
- joystick movement and current movement feel;
- one-finger camera look on the free screen area;
- two-finger pinch zoom and camera look;
- pause, greeting and camera-reset actions;
- current responsive layout and Android touch behaviour.

Do not change control mappings, avatar proportions/rig, movement speed, camera feel or UI unless a concrete compatibility bug prevents the new world from working.

### Replace completely
Rebuild the 3D environment from an empty scene. Do not reuse or patch the previous procedural mosque, courtyard, arches, columns, domes, minarets, materials, textures, lighting or layout. The rejected scene is not a template.

## Visual brief — photograph-led, not generic

The two user-selected reference photographs define the visual direction:
- monumental, richly articulated Islamic architecture;
- refined pointed arches and deep architectural reveals;
- pale ivory / warm white stone with blush, champagne and restrained gold accents;
- elaborate carved capitals, ornamental screens and geometric detailing;
- richly patterned floral prayer carpets;
- large central dome with a detailed inner surface and clerestory light;
- elegant chandeliers and layered warm illumination;
- a calm, contemplative atmosphere with convincing scale and symmetry.

These references guide quality, palette and spatial character. The design must remain an original environment, not a copy of a named real mosque. Do not substitute a generic low-poly game aesthetic, bare primitive cylinders, floating decorative discs or flat sticker-like ornaments.

## Spatial plan

Build one connected, navigable environment in this order:
1. A composed arrival courtyard and clear approach axis.
2. A monumental entrance threshold with believable wall thickness and layered arch reveals.
3. A grand prayer hall with repeated architectural bays, real column-to-arch connections and richly detailed ceiling.
4. A visually dominant central dome, readable from inside the hall.
5. A deep qibla wall and mihrab as the interior focal point.

Keep the avatar spawn point, floor level and walkable route compatible with the preserved movement code. Build the environment around the avatar and camera, not the other way around.

## Technical sequence and gates

1. Freeze and compare the interaction layer against `main`; record its baseline before editing.
2. Remove the old world from the new branch's runtime and establish a truly empty scene with correct scale, floor and camera framing.
3. Create a greybox with correct proportions and uninterrupted walkability; no decorative detailing yet.
4. Replace the greybox with custom architectural geometry: thick walls, pointed arches with depth, connected columns/capitals, dome/drum and coherent roof structure.
5. Add high-quality procedural materials and ornament; prioritize large readable surfaces before small details.
6. Tune daylight, interior bounce and warm practical lighting.
7. Build and inspect on Android; profile frame rate, draw calls, texture memory and load time.
8. Only after visual and mobile acceptance, propose merging. Never modify `main` or publish by default during iteration.

## Acceptance criteria

- The new world is recognizably aligned with the user's reference photographs in architecture, palette, richness and atmosphere.
- The mosque reads as one coherent building, not a collection of disconnected primitives.
- No floating, unsupported decorative elements; columns, capitals, arches, walls and roof have believable structural relationships.
- Avatar can walk continuously from courtyard through entrance into prayer hall.
- Avatar, joystick, camera look, pinch zoom, greeting, pause and reset retain their previous behaviour.
- The result is inspected on the user's Android device before any merge or public replacement.
- Mobile performance remains acceptable; detail must be optimized rather than achieved through uncontrolled mesh count.

## Explicit non-goals

- Do not spend time polishing the rejected scene.
- Do not change the avatar or UX to hide architectural problems.
- Do not claim a visual result is complete based only on a successful build.
- Do not merge or deploy without a verified Android review.

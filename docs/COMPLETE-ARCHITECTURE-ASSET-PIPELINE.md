# Noor — Complete Architecture Asset Pipeline

## Decision

The next visual milestone is a complete, navigable mosque environment, not incremental decoration of the current procedural blockout.

The approved visual target is a contemporary monumental mosque in the visual family of the Sheikh Zayed Grand Mosque references reviewed for Noor:
- warm ivory/white marble with believable veining and polished but restrained reflections
- monumental arcades, tall columns, layered pointed arches and elegant domes
- green prayer carpet, a legible qibla wall and mihrab
- ornate but restrained geometric detailing, chandeliers and filtered daylight
- a coherent exterior-to-interior architectural language

Do not substitute a low-poly game-kit aesthetic or a generic sandstone desert scene.

## Asset acquisition findings (11 November 2026)

1. **3DAssets.dev — Desert Mosque and Madrasa Courtyard**  
   https://3dassets.dev/packs/desert-mosque-and-madrasa-courtyard  
   CC0 pack, 60 GLB assets, 8.2 MB total, 344,188 reported triangles, one assembled starter scene. Useful as a modular/technical reference and for individual architectural pieces. It is AI-assisted and uses a desert/sandstone palette, so it is not approved as Noor's final hero environment without visual inspection and substantial art-direction work.

2. **Innerscene — Mosque with dome and minarets**  
   https://www.innerscene.com/tools/library/3d-parts/mosque-with-dome-and-minarets-73f6b573  
   CC0 GLB, 13.7 MB, reported footprint 33.8 × 38.2 m and height 54.7 m. It is an Ottoman-style exterior shell; the source explicitly says it has no interior rooms. It may be useful as an exterior candidate, but cannot by itself satisfy the complete exterior/interior milestone.

3. **Existing Noor prayer hall assets**  
   `src/scene/asset-hall.ts` already loads licensed GLB architectural pieces and builds a complete procedural prayer hall around them. This remains a useful interior prototype, but its current geometry/materials are not yet at the approved photographic quality.

## Acceptance criteria for the next complete environment

- One coherent architectural design, not unrelated assets placed together.
- Exterior approach, courtyard, facade, prayer hall, qibla wall and mihrab are all navigable in one continuous scene.
- Materials use PBR maps where available: base color, normal, roughness and ambient occlusion; marble must not be represented only by a flat color or procedural line texture.
- Correct real-world scale and sensible door/column/avatar proportions.
- Every asset has a recorded source, exact licence and attribution obligations before it enters the repository.
- Prefer GLB/glTF, shared materials, instancing and compressed textures; avoid runtime shadow costs on mid-range Android.
- Keep the current joystick, independent camera drag and pinch zoom unchanged.
- Target mobile loading and rendering first; split or stream distant sections if one monolithic asset is too heavy.

## Integration strategy

1. Acquire/inspect a complete hero architecture asset or a coherent modular architectural set with a true interior and exterior.
2. Verify its visual quality, topology, materials, scale, licence and mobile weight before adoption.
3. Build a dedicated loader/scene group so the existing camera, avatar and touch controls remain untouched.
4. Replace the current architectural blockout as one coordinated milestone, retaining the old scene behind a development fallback until the new scene passes build and Android checks.
5. Tune daylight, exposure, marble, green carpet and gold details as one art-direction pass.

## Explicit non-goals

- No sequence of isolated cosmetic commits (one column, one lamp, one arch).
- No claims of photorealism based only on a successful TypeScript build.
- No paid model generation or paid asset purchase without explicit budget approval.
- No copying a named mosque exactly; use the approved references as an aesthetic benchmark, not as a claim of architectural reproduction.

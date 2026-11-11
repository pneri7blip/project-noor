# Project Noor — Arabian Architectural Visual Direction

**Status:** Approved product direction  
**Applies to:** Every environment, asset-selection decision, material pass, lighting pass, and future scene expansion.

## North star

The visual target is the photographic quality and architectural language of the monumental Arab mosque environments previously selected with the project owner. The Sheikh Zayed Grand Mosque is an important reference for material quality, scale, symmetry, and refinement, but Noor must develop its own coherent identity rather than reproduce one building.

This is not a generic fantasy mosque, a game level, a low-poly scene, or a stylized desert village. The target is a believable, spacious, serene architectural environment.

## Exterior language

- Monumental but balanced proportions; generous courtyards and long sightlines.
- Warm-white and ivory marble, with subtle natural veining and realistic surface response.
- Repeated elegant columns, layered pointed or horseshoe-inspired arches, finely detailed capitals and cornices.
- Domes and rooflines with restrained gilded accents and carefully resolved silhouettes.
- Geometric Islamic ornament integrated into architecture; no invented Quranic text or pseudo-Arabic calligraphy.
- Reflective pools, pale stone paving, gardens and palms where composition supports them.
- Clear natural daylight, soft shadows, warm highlights and atmospheric depth.

## Interior language

- A large, calm prayer hall with strong architectural rhythm and a clear qibla axis.
- Deep, rich green carpet with subtle prayer-row patterning.
- Ivory marble or pale stone columns, detailed arches, ornamental ceiling coffers and refined gold/brass accents.
- Large chandeliers with believable scale and warm light.
- Tall windows or openings that create natural light gradients.
- A dignified mihrab as the visual focal point, with geometric ornament rather than unreviewed religious text.
- High ceilings and a sense of quiet, spaciousness; avoid visual clutter.

## Materials and rendering quality

Prioritize physically plausible materials over adding more objects:
- Marble: restrained roughness variation, subtle veining, correct scale, no plastic gloss.
- Metal: muted brass/gold, controlled highlights, never bright yellow paint.
- Carpet: woven/fabric response and visible but understated pattern.
- Glass and water: reflections kept subtle and performance-conscious.
- Stone joints, bevels, capitals, trim and layered profiles should create real depth rather than flat decorative lines.

Use high-quality licensed assets or carefully built modular geometry. Do not use a recognisable asset with unclear rights. Optimize meshes, textures and draw calls for Android.

## Atmosphere

The emotional target is serenity, dignity, welcome, and awe through proportion and light—not spectacle. The environment should feel beautiful and meaningful even when the visitor is alone. Avoid crowds, game HUDs, fantasy effects, neon, excessive gold, and aggressive audio.

## Mobile and experience constraints

- The environment must remain genuinely navigable in real-time 3D on Android.
- Preserve the approved gesture contract: one finger held and dragged steers the avatar continuously; releasing the finger stops movement immediately. Two fingers control camera orbit/pan and pinch zoom. No virtual joystick.
- Preserve the avatar, camera follow, and existing bottom action menu while improving the environment.
- Keep loading, frame rate, texture memory, and draw calls appropriate for a mid-range Android phone.
- Do not claim visual fidelity or device performance until verified in a running build on the target device.

## Quality gate for every visual change

Before accepting a new environment pass, check:
1. Does it look like a believable Arab architectural space rather than a generic game asset?
2. Are the proportions, material response, light, and detail consistent with the photographic references?
3. Does it preserve a calm, respectful atmosphere?
4. Does it run smoothly on Android?
5. Are asset provenance and licenses documented?

If a change improves detail but harms mobile performance or the overall photographic direction, it is not an improvement.

# Product Roadmap — Project Noor

**Status:** Initial working roadmap  
**Guiding rule:** validate the smallest meaningful experience before adding complexity.

## Phase 0 — Foundation

**Goal:** establish a clear product direction and a testable scope.

- [x] Create the private GitHub repository for documentation and version history.
- [x] Draft the initial product vision and principles.
- [x] Define the first prototype scope.
- [x] Build and open the initial Three.js + TypeScript + Vite prototype on the target Android phone.
- [ ] Define the Android test-device and browser baseline.
- [ ] Establish an initial visual direction.

**Exit criteria:** the first prototype can be built without unresolved product-scope questions.

## Phase 1 — Single-user 3D courtyard

**Goal:** create the first meaningful experience, optimized for Android.

- [x] Add the first lightweight browser-based 3D scene to the repository (build verification pending).
- [ ] Refine the peaceful courtyard and mosque-inspired landmark beyond the current geometric blockout.
- [ ] Improve the garden, greenery, water, and lighting; current elements are placeholders.
- [x] Implement and test initial tap movement, camera orbit, and pinch zoom on Android.
- [x] Add initial mouse fallback and camera reset control in source.
- [ ] Optimize loading, memory use, and frame rate.
- [x] Open the prototype in a real mobile browser on the target Android phone; detailed performance testing remains pending.

**Exit criteria:**
- A visitor can open the experience and move around without an account.
- Controls are understandable and comfortable on Android.
- The scene loads reliably and feels calm even when empty.

## Phase 2 — Quiet presence

**Goal:** add a small number of purposeful interactions without gamification.

Candidate features:
- [ ] A place to sit or pause.
- [ ] User-controlled ambient audio.
- [ ] A simple, non-competitive dhikr/tasbih counter.
- [ ] Optional Quran recitation only after rights, sourcing, and qualified review.

**Exit criteria:** each interaction improves the experience without adding pressure, clutter, or religious ambiguity.

## Phase 3 — Shared presence

**Goal:** test whether other visitors make the environment more valuable.

Candidate features:
- [ ] Anonymous, temporary visitor presence.
- [ ] Simple avatars and movement.
- [ ] A restrained Salam interaction.
- [ ] Reporting, blocking, moderation, and safety controls before open communication.
- [ ] Privacy and minor-protection review.

**Exit criteria:** shared presence works safely and remains optional. Chat is not a prerequisite.

## Phase 4 — Community and partnerships

**Goal:** explore durable community value and a sustainable operating model.

Candidate features:
- [ ] Moderated talks and educational gatherings.
- [ ] Partnerships with mosques, educators, and qualified religious advisors.
- [ ] Transparent voluntary donations.
- [ ] Carefully evaluated organizational offerings.
- [ ] Legal, privacy, accessibility, moderation, and operational readiness.

**Exit criteria:** evidence of repeat use, trusted partners, a responsible governance model, and a credible operating budget.

## What we will not build first

- Native mobile applications.
- Accounts and social profiles.
- Chat or direct messages.
- Multiplayer infrastructure.
- Payments or subscriptions.
- A large collection of rooms.
- Complex avatar customization.

These features add cost and risk before the core experience has been validated.

## Immediate next actions

1. [x] Select Three.js + TypeScript + Vite for Prototype 01; see [engine decision](ENGINE-DECISION.md).
2. [x] Add the first procedural courtyard, landmark, garden, placeholder avatar, and touch interaction implementation.
3. [ ] Confirm the production build using the added GitHub Actions workflow and resolve any compiler/runtime issues.
4. [ ] Publish a shareable HTTPS preview without making the private source repository public.
5. [ ] Test on the actual Android device and record performance and usability observations.
6. [ ] Iterate before adding religious content or social features.

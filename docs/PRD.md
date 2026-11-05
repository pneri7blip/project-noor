# Product Requirements Document — Project Noor

**Status:** Initial draft  
**Stage:** Concept validation and prototype  
**Product principle:** Atmosphere before interface.

## 1. Product vision

Project Noor is a calm, shared digital environment designed to offer Muslim users a place for quiet presence, reflection, and—eventually—community.

The intended experience is immediate and low-pressure:

> Enter. Be present. Find peace. Leave whenever you want.

The product takes inspiration from the immediacy and atmospheric user experience of Sansa. This is a UX reference, not a plan to copy its brand, assets, code, or proprietary content.

## 2. The problem to explore

Many digital religious experiences are primarily content libraries, social feeds, utilities, or scheduled services. Project Noor explores a different proposition: a place users can enter and inhabit, even briefly, without being asked to consume content or interact socially.

This is a hypothesis to validate—not an established market finding.

## 3. Target experience

A hybrid of:

- **Individual sanctuary:** a quiet environment for personal reflection and remembrance.
- **Shared environment:** other visitors may be present, creating a sense of community without requiring conversation.

The environment should remain useful and emotionally coherent when empty.

## 4. Core experience principles

1. **Immediate access:** the first prototype should open without registration.
2. **Atmosphere first:** visual design, sound, space, and pacing matter more than menus.
3. **No social pressure:** no compulsory chat, direct messages, likes, feeds, follower counts, or rankings.
4. **Quiet by default:** audio is user-controlled; no unexpected loud sounds.
5. **Mobile first:** Android touch interaction and performance are primary acceptance criteria.
6. **Respectful design:** avoid turning worship or remembrance into a game.
7. **Privacy by design:** collect as little data as possible and never sell or use religious activity for advertising or profiling.
8. **Religious integrity:** clearly distinguish a digital environment from Islamic ritual obligations.

## 5. Candidate spaces

These are concepts, not commitments for the first prototype.

### 5.1 Main Mosque
A central architectural landmark and orientation point. It should be respectful and visually calm, without implying that entering a virtual building performs or replaces salah.

### 5.2 Quiet Garden
A contemplative outdoor space with greenery, water, shade, and places to pause.

### 5.3 Quran Hall
A possible future space for carefully sourced Quran text and user-controlled recitation audio. Content requires appropriate rights, attribution, and qualified review.

### 5.4 Community Hall
A possible future space for moderated educational gatherings, talks, or community events with trusted partners.

## 6. MVP scope: first 3D prototype

The first milestone is deliberately smaller than the full product.

### Must have
- A browser-based 3D courtyard.
- A distinctive mosque-inspired architectural landmark.
- A small garden area and restrained environmental details.
- A clear starting position and simple movement.
- Touch controls that work comfortably on Android.
- Desktop mouse/keyboard support for development and testing.
- A way to pause or remain still.
- A lightweight scene that loads reliably on a mobile connection.

### Should have
- Subtle ambient environment sound, off by default or clearly user-controlled.
- A simple visual indication of how to move.
- A responsive layout that avoids controls covering important parts of the scene.

### Not in the first prototype
- Accounts or profiles.
- Multiplayer or persistent avatars.
- Chat, voice, or direct messages.
- Payments, donations, subscriptions, or advertising.
- Quran content or religious instruction.
- Events, classes, or booking.
- Complex avatar customization.
- Native app-store release.

## 7. Later interaction candidates

Only after the environment itself has been validated:

- Anonymous presence of other visitors.
- A simple Salam interaction.
- Sitting or pausing.
- A non-competitive tasbih/dhikr counter, without streaks, scores, leaderboards, or pressure.
- User-controlled Quran recitation, subject to rights and qualified review.
- Moderated educational events with trusted religious partners.

## 8. Religious integrity and governance

- The product must never state or imply that virtual prayer replaces salah.
- Religious content must be sourced, attributed, and reviewed by qualified scholars or advisors.
- Avoid presenting one interpretation as universal where legitimate differences exist.
- Consult people from relevant Muslim communities during design and validation.
- Do not use sacred text or religious symbols as decorative game mechanics.
- Obtain permissions for recitations, translations, and other copyrighted material.

## 9. Safety and privacy

Before adding social features:
- Define reporting, blocking, moderation, and escalation procedures.
- Establish age-appropriate safeguards and protections for minors.
- Avoid exposing a person's religious activity or attendance history.
- Minimize personal data collection and define retention periods.
- Do not sell religious or behavioral data.
- Do not place ads in sacred or contemplative spaces.

## 10. UX and accessibility

- Mobile-first, portrait-friendly interaction.
- Large, reachable touch targets.
- Simple movement with forgiving controls.
- Respect reduced-motion and sound preferences where feasible.
- Avoid visual clutter, flashing effects, and unnecessary notifications.
- Ensure text contrast and legibility.
- Test on real Android devices, not only desktop emulation.

## 11. Technical direction

Initial direction: a lightweight web-based 3D experience, evaluated for mobile browser performance.

The first prototype should prioritize:
- Small download size and fast time-to-first-scene.
- Efficient geometry, textures, and lighting.
- Stable frame rate on mid-range Android hardware.
- Touch controls and responsive camera behavior.
- Simple deployment and iteration.

A single-user prototype comes before multiplayer infrastructure. The specific 3D framework and hosting setup should be selected based on prototype performance and development speed, not assumed in advance.

## 12. MVP acceptance criteria

The first prototype is acceptable when:
- It opens in a current Android mobile browser.
- The initial scene loads without requiring an account.
- A first-time visitor can understand how to move without lengthy instructions.
- Movement and camera controls are usable with touch.
- The scene remains stable and reasonably smooth on the target test device.
- The environment feels calm and coherent even with no other users.
- No feature suggests that virtual activity replaces religious obligations.

## 13. Validation questions

The prototype should help answer:
1. Do users understand the experience immediately?
2. Does the environment feel peaceful rather than like a conventional game?
3. Would users return voluntarily, and what would bring them back?
4. Is shared presence valuable without chat?
5. Which spaces or interactions are genuinely useful?
6. What concerns do users and qualified religious advisors raise?

## 14. Business model hypotheses

No monetization is part of the first prototype. Potential future models to validate include:
- Voluntary donations.
- Optional cosmetic personalization that does not affect spiritual access.
- Partnerships with mosques and Muslim organizations.
- Sponsored or hosted educational events with transparent governance.

Core spiritual access should remain available without payment. No advertising based on religious behavior or activity.

## 15. Open decisions

- Final product name and brand identity.
- Initial community and geographic focus.
- 3D framework and hosting architecture.
- Visual direction and architectural review.
- Religious advisory process and content governance.
- User research and validation method.
- Accessibility and device-support baseline.

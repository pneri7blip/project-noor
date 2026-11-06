# Android Development and Preview Workflow

**Purpose:** run and preview the existing Project Noor codebase from an Android phone without a local computer.

## Recommended first route: Replit cloud workspace

Replit documents a workflow for opening an existing GitHub repository in a cloud sandbox and running it with Agent. Its mobile app is designed for building and previewing web apps from a phone.

This is a development/preview route, not a replacement for the private GitHub repository.

### One-time setup (account authorization required)

1. Install/open the official Replit app on Android or visit https://replit.com/mobile.
2. Sign in to Replit.
3. In Replit, open **Repos** and connect the GitHub account that can read the private repository.
4. Select the existing repository: https://github.com/pneri7blip/project-noor
5. Ask Replit Agent to **run the existing repository in a cloud sandbox only**. Do not ask it to create a replacement project or modify source files.

Suggested instruction:

> Run this existing repository in a Replit cloud sandbox so I can preview it on my Android phone. Repository: https://github.com/pneri7blip/project-noor. Do not create a new app, do not replace the project, and do not edit or commit any source files. Install dependencies and run the existing Vite app. Tell me the preview URL and any build/runtime errors.

6. Open the preview URL on the phone and test the courtyard.

### What to test

- Does the page load without a blank screen?
- Is the courtyard, mosque-inspired landmark, garden, and avatar visible?
- Tap a clear area of ground: does the avatar move?
- Drag one finger: does the camera rotate without moving the avatar?
- Pinch with two fingers: does the camera zoom?
- Rotate the phone between portrait and landscape.
- Try the Reset view control.

The current avatar and environment are blockout placeholders. Visual polish is not the acceptance test yet; interaction and reliable loading come first.

## Source-of-truth rule

GitHub remains the canonical source repository. Do not accept unreviewed Agent rewrites or a second, disconnected Noor project. If Replit proposes code changes, stop before accepting them and review the proposed diff first.

## Alternative deployment route

Cloudflare Pages supports Git-based deployments from GitHub and creates preview deployments for commits and branches. It is a good candidate for a stable shareable HTTPS preview after the first build is verified. Connecting Cloudflare to the private GitHub repository requires the owner's explicit account authorization and repository access grant; this setup has not been performed.

## Current limitation

The first prototype source has been committed, and a GitHub Actions build workflow has been added. The build has not yet been independently confirmed as successful. Do not treat a saved source file or a queued workflow as proof that the app compiles or runs on the target phone.

## Official references

- Replit mobile: https://replit.com/products/mobile
- Replit: run an existing repository: https://replit.com/help/answers/how-do-i-get-my-existing-repository-running-in-replit
- Replit: troubleshooting repository selection: https://replit.com/help/answers/why-cant-agent-find-my-repository-or-why-does-it-create-a-new-app
- Cloudflare Pages Git integration: https://developers.cloudflare.com/pages/configuration/git-integration/

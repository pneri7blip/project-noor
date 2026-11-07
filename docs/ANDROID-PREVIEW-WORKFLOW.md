# Android Development and Preview Workflow

**Purpose:** run and preview Project Noor from an Android phone without a local computer.

## Recommended route: GitHub Codespaces

GitHub Codespaces is the development workspace for this repository. Replit is **not required** and must not be used as part of the current workflow.

### Open the project

1. Open the private repository: https://github.com/pneri7blip/project-noor
2. Select **Code → Codespaces**.
3. Open the existing Codespace for the `main` branch. Create one only if none exists.
4. Wait for the editor to finish loading.

### Start the preview

Open the integrated terminal and run:

```bash
npm run dev -- --host 0.0.0.0
```

Vite serves the app on port **5173**. Codespaces normally detects and forwards this port. Open the forwarded port in the browser to view the prototype.

If the **Ports** panel is not visible in the mobile layout:
- Open the Codespaces menu and choose **View → Open View…**, then search for **Ports**; or
- Use the preview/browser link that Codespaces displays when it detects port 5173.

The Ports panel is a convenience, not a requirement once the preview is already open in the phone browser. Keep the Codespace running while testing.

### What to test

- Does the page load without a blank screen?
- Is the courtyard, mosque-inspired landmark, garden, and avatar visible?
- Tap a clear area of ground: does the avatar move?
- Drag one finger: does the camera rotate without moving the avatar?
- Pinch with two fingers: does the camera zoom?
- Rotate the phone between portrait and landscape.
- Try the Reset view control.

The current avatar and environment are early blockout placeholders. Visual polish is still in progress.

## Source-of-truth rule

GitHub remains the canonical source repository. Do not create a second, disconnected Noor project or accept unreviewed AI rewrites. Changes made directly to GitHub may need to be pulled into an already-open Codespace before they appear there.

## Future preview hosting

A stable shareable HTTPS preview can be considered after the build is verified. Any hosting connection that needs access to the private GitHub repository requires the owner's explicit authorization.

## Current limitation

A working preview has been opened on the target Android phone, but the production build and mobile performance have not yet been independently verified. Do not treat a saved source file or a queued workflow as proof that the app compiles or performs well.


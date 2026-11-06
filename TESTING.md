# Geometry and ligament update validation — 2026-09-15

The 54-pose test passes for all 18 added ligament bands (90 fibre strips), including finite bone/ribbon vertices and both footprint edges of every strip following their joint-bound coordinates within 0.000002 model units. Existing tendon tracking and joint checks still pass. Local module and cache assets exist. JavaScript syntax checks pass.

No new browser or real-device test was performed for this update. Earlier browser checks below apply to the previous version only. WebGL appearance, gold-band visibility in all views, new UI handlers, physical iOS performance and service-worker upgrade behavior still require browser/device checks. Endpoint tests do not establish anatomically precise insertions, collision-free tissue geometry, or biomechanical validity.

# Actual validation, 2026-09-13

## Automated source-level checks: passed

`npm test`: 54 pose combinations across the entire supported rectangle: flexion -25 through +15 in 5-degree increments, tilt -10 through +15 in 5-degree increments. All 9 tendon groups (15 routes) produced finite mesh vertices. Bound endpoints matched their moving attachment anchors within 1.1e-14 model units. Explicit joint hierarchy and fixed leg checks passed. A deliberately failed optional model loader preserved its fallback mesh. All referenced HTML and offline-shell asset paths existed.

This confirms internal geometric consistency, not anatomical correctness, collision-free wrapping, or real device performance. The route-clearance heuristic is not validated contact mechanics.

## Browser UI checks: passed in cloud Chromium, compatibility renderer

The available Chromium browser could not create a WebGL context. The app therefore displayed its labeled Canvas 2D compatibility renderer, using the same Three.js scene, geometry, joints, raycaster and OrbitControls. Primary WebGL rendering was NOT verified here.

Checked: mesh click picked the tibia and updated its detail panel; initial model rendering; structure search; list selection and selected description; individual hide/show; isolation checkbox; focus selected; reset camera; all six camera presets; full-range slider endpoint controls; bone opacity; labels with leader lines; playback and pause. Inspected a medial view at maximum plantarflexion and inversion. No detached tendon endpoints were found in the mathematical sweep; complex wrapping remains approximate.

Checked a 390 x 844 CSS-pixel iframe harness in desktop Chromium: initial layout, separate Anatomy/3D/Movement panels, search and selected description across panels. This is a responsive layout check, NOT iOS or device emulation. The local server provides this harness at /__qa/phone; it is not a production route.

The browser orbit-drag command completed. The subsequent wheel-zoom action timed out in the browser transport, so wheel zoom was not verified. Two-finger touch and right-drag panning were not verified.

## Not performed

- Physical iPhone/iPad testing or actual Safari/WebKit execution.
- Real one/two-finger gestures, pinch/pan gesture arbitration, landscape cutouts, iOS text zoom or VoiceOver.
- Primary WebGL renderer lighting, transparency and performance on a GPU.
- Home Screen installation, service-worker caching/offline relaunch (preview is HTTP on a non-localhost hostname), private-host authentication offline behaviour, Safari cache eviction.
- Forced WebGL context interruption/restoration on a real device.
- Anatomist review, scan comparison, exhaustive surface collision checking, force/strain/injury-risk validation.

## Real-device acceptance checklist

Open the HTTPS app in Safari, confirm the model is visible and no compatibility status is shown if WebGL2 works. Orbit with one finger, zoom and pan with two fingers; ensure these gestures do not move sliders. Tap a bone and a tendon. Scroll Anatomy and Movement panels without moving the camera. Hide/show layers and individual structures, reduce opacity, isolate with and without bone context, try all camera presets and focus.

Test all four corner poses (-25/-10, -25/+15, +15/-10, +15/+15), then neutral and playback. Rotate the phone portrait/landscape and check safe areas, sliders, panels and labels. Add to Home Screen, open once online, then test in airplane mode. Background and reopen the app; verify it resumes correctly. A biomechanical/anatomical specialist must separately review shapes, attachment locations and tendon routing before use as a precise teaching atlas.

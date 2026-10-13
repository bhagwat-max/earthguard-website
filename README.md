# EarthGuard Premium — version 2.1.0

A complete visual upgrade of the existing EarthGuard website. Cobalt, charcoal,
self-hosted Inter typography, real category photographs and a live dimensional
hero replace the original CSS-only sculpture.

## Run locally (Windows PowerShell)

```powershell
npm.cmd run check
npm.cmd run dev
```

Open http://localhost:3000. Press Ctrl+C to stop. Node.js is required. No install,
build step, CDN, API key or external animation script is required.

## Update your existing repository

Extract `earthguard-advanced-mobile.zip` in Downloads. It contains `earthguard-site`.
Copy those files into the repository you already cloned. Keep its `.git` folder.

```powershell
cd C:\Users\vishvas\Downloads
Copy-Item -Path ".\earthguard-advanced-mobile\earthguard-site\*" -Destination ".\earthguard-website-update" -Recurse -Force
cd .\earthguard-website-update
npm.cmd run check
git status
git add index.html styles.css app.js scene.js advanced-scenes.js server.cjs package.json README.md vercel.json .gitignore assets
git commit -m "Add mobile 3D scenes and animated connections"
git push
```

This updates https://github.com/bhagwat-max/earthguard-website. A connected
Vercel Git deployment should then start automatically.

## Deploy directly to your existing Vercel project

From `earthguard-website-update`:

```powershell
npx.cmd vercel login
npx.cmd vercel link
npx.cmd vercel --prod
```

In `vercel link`, select your account/team, choose the existing project and select
`earthguard-site` (verify it is the project hosting your current domain). Avoid
creating a second project. If already linked, only the last command is needed.
Framework preset: Other. Build command: empty. Output directory: `.`.

## How the mobile animation works

`scene.js` projects original 3D geometry into a 2D canvas. It needs no WebGL and
uses no CSS 3D animation. The electrode floats, the layers turn, current traces
orbit and a light travels along the spine. Motion starts automatically on touch
screens and keeps working if GSAP is blocked. Mouse movement only adds a small
optional desktop camera offset; it does not start the animation.

Resolution is capped (1.5 device-pixel ratio on touch, 2 on desktop). Animation
runs at approximately 30 FPS on touch / 60 on desktop when the browser permits,
and pauses offscreen or when the tab is hidden. These are rate caps, not promises
of physical-device performance.

Version 2.1.0 starts hero and section animation automatically on mobile, including
phones that report Reduce Motion, as requested for this site. Pause remains
available. An in-app-browser watchdog activates a 25 FPS timeout loop only if
requestAnimationFrame stops advancing while the hero is visible. Native rAF
recovery stops the fallback. Asset URLs are versioned to bypass stale scripts.

`app.js` uses self-hosted GSAP and ScrollTrigger for entrance and section motion.
Native scrolling is preserved. Content and interactions remain usable without
GSAP. The mobile quick-contact bar appears after the hero so it cannot cover
the scene controls. Fonts, libraries and product images are all included.

## Interactions

- Accessible mobile menu with focus handling, Escape and background inertness.
- Category filters and visible category counts.
- Product-specific enquiry dialogs with call/Instagram routes.
- Native FAQ accordions and a copyable material-enquiry checklist.
- Reading progress and safe-area spacing on phones.
- Portrait/landscape dialog sizing and reduced-motion support.

There is no backend or form submission. The checklist is copied locally;
enquiries go through your phone or Instagram. Canvas and generated conductor/SPD
illustrations are brand/category visuals, not technical system designs.

## Validation

Chromium checks passed at widths 320, 360, 390, 430, 540, 768, 820, 1024 and
1440 pixels with no horizontal page overflow or ordinary content outside the
viewport. Desktop/mobile renders were visually inspected. JavaScript checks
and local asset references passed.

Android/Instagram user-agent + touch emulation passed three configurations:
normal motion; reduced motion with manual Play; GSAP/ScrollTrigger blocked.
Canvas pixel output and elapsed animation time changed in each playback test.
Pause/resume, menu, filters, product context, portrait/landscape dialogs, FAQ,
checklist feedback and content visibility passed without JavaScript errors.
This is browser emulation, not a physical Instagram or Safari device test.

## Libraries and fonts

- GSAP 3.15.0 and ScrollTrigger: self-hosted minified distributions, original
  copyright/license headers preserved. https://gsap.com/standard-license/
- Inter variable Latin font: self-hosted via Fontsource. OFL license included
  in `assets/vendor/INTER-LICENSE.txt`.

## Image sources (retained from the original project)

Photos illustrate material categories. Final products and pricing are confirmed
with the quotation. Supplier-photo permissions were not independently verified.

- Earth rods: https://www.socomepower.com/Copper-Bonded-Earth-Rod-ERT-pd44090666.html
- Clamp: https://www.escoelektrik.com/cubuk-klemensi-c-tipi
- Air terminal: https://www.indonetwork.co.id/product/air-terminal-stainless-steel-air-rod-stainless-steel-3534734
- Solar image, Soren H: https://unsplash.com/photos/a-large-array-of-solar-panels-on-the-roof-of-a-building-Db7Kt-7sulY


## New dimensional experiences in 2.1.0

- An automatic exploded connection illustration assembles an electrode, clamp
  and conductor. Touch tabs highlight each part and update the material enquiry
  details. Hold assembled / Resume assembly controls the demonstration.
- A rotating rooftop concept connects air-terminal, conductor and electrode
  categories with a moving visual trace. Touch tabs identify each category.
- A fine animated line connects the three enquiry-process steps horizontally
  on desktop and vertically on phones.
- Each larger illustration has its own Pause / Play button.

`advanced-scenes.js` contains the new renderers and a shared activity coordinator.
It uses viewport geometry rather than relying on IntersectionObserver support.
Only one dimensional scene draws continuously at a time. Offscreen scenes keep
one rendered frame and retain their animation state. The working hero renderer
is preserved, with only an activity gate added for scene coordination.

All new 3D-looking scenes are original geometry projected to Canvas 2D. They
require no WebGL, external CDN, mouse hover, API key or build step. Self-hosted
GSAP still handles section entrances. Automatic playback remains enabled on
phones reporting Reduce Motion, as requested; Pause is available. Both animation
engines include the timeout fallback used in the confirmed working mobile patch.

The connection and rooftop scenes are concept illustrations, not engineering
models or installation instructions. Components are illustrative, and the blue
trace is a navigation cue rather than an electrical or lightning simulation.

## Additional validation

Passed touch emulation at nine widths from 320 to 1440 pixels with no horizontal
page overflow. Inspected the complete desktop/mobile layouts and both new scene
renders. Verified changing canvas pixel output and animation time in all four
animated areas (hero, connection, rooftop, process), including Reduce Motion
and deliberately stalled requestAnimationFrame with the GSAP files blocked.
Verified only the active scene advances, offscreen clocks stop, pause/resume,
component selections, assembly hold/resume and rooftop category selections.
The original menu, product filters, enquiry dialogs, FAQ and copy-checklist
interactions were regression-tested. No JavaScript errors were observed.
Physical Instagram/Safari devices were not tested in this environment.

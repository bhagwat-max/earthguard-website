# EarthGuard website

Mobile-first static website for EarthGuard Earthing Solutions, Ahmedabad.

## Vercel deployment

1. Extract this folder, create a GitHub repository, and upload its contents.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Select **Other** as the framework preset. Leave the build command empty and set the output directory to `.`. Deploy.

Alternative: with the Vercel CLI installed, run `vercel` inside this folder, then `vercel --prod` once the preview is approved. Sign in to your own Vercel account when prompted.

## Local preview

Run `npm.cmd run dev` in PowerShell (or `npm run dev` on macOS/Linux), then visit http://localhost:3000. Node.js is required; there are no dependencies to install.

## Contents

- `index.html`: sections, copy, enquiry dialogs and metadata.
- `styles.css`: responsive design, CSS 3D sculpture, animated orbits, product illustrations, desktop hover effects, reduced-motion support.
- `app.js`: menu, product filters, enquiry selection, dialogs, scroll reveal and pointer interactions.
- `server.cjs`: dependency-free local preview that works on Windows, macOS and Linux.
- `assets/`: self-hosted vector logo assets and optimized real photographs.
- `vercel.json`: static hosting headers.

There are no runtime dependencies, no payment system and no backend. Enquiries go to `tel:+919664763492` or `https://www.instagram.com/earthguard.earthing/`. Product enquiry buttons preserve the selected category in the contact dialog. The website does not submit or save enquiry data.

Logo palette: cobalt `#0755F5`, charcoal `#101820`, white. Product imagery is illustrative of categories; final products are quoted against the buyer’s specifications. No manufacturer affiliation, certification, stock levels or completed-project claims are made.

## Image sources

- Earth rods: Socome, https://www.socomepower.com/Copper-Bonded-Earth-Rod-ERT-pd44090666.html
- Grounding clamp: Esco Elektrik, https://www.escoelektrik.com/cubuk-klemensi-c-tipi
- Air terminal: Sinar Utama Grounding / Indonetwork, https://www.indonetwork.co.id/product/air-terminal-stainless-steel-air-rod-stainless-steel-3534734
- Solar rooftop: Soren H / Unsplash, https://unsplash.com/photos/a-large-array-of-solar-panels-on-the-roof-of-a-building-Db7Kt-7sulY

Publicly retrieved product photos are included as requested. Supplier product-photo reuse rights were not verified. Replace them with your own supplier-authorized catalogue images for the production launch. Solar photo sourced from Unsplash. Conductor/SPD visuals and all 3D elements are original CSS illustrations.

## Mobile fixes in version 1.0.1

- Centred responsive sculpture scaling without clipping on small phones.
- Transform-based floating/particle animations for broader mobile browser support.
- Automatic animation on touch screens; pointer tilt remains available on desktop.
- Offscreen animation suspension and lighter mobile shadows/blur for scrolling.
- Flexible headings and contact rows across phone and tablet widths.
- Safe-area spacing for the bottom contact bar and scrollable enquiry dialogs.
- Scroll reveals with safe observer initialization; reduced-motion preferences are respected.

## Replace your existing project and push

Extract this ZIP. Copy the **contents inside `earthguard-site`** into your existing
EarthGuard Git repository folder, replacing the matching files. Keep the existing
`.git` directory. Do not create a nested `earthguard-site/earthguard-site` folder.

Open a PowerShell terminal in that existing repository folder:

```powershell
npm.cmd run check
npm.cmd run dev
```

Preview http://localhost:3000. Press Ctrl+C to stop the preview, then:

```powershell
git status
git add index.html styles.css app.js server.cjs package.json README.md vercel.json assets
git commit -m "Fix mobile layout and animation performance"
git push
```

Your existing Vercel project will redeploy if it is connected to this repository
and branch. No new Vercel project is needed. The live site is not changed by
extracting or previewing the ZIP.

## Validation

Passed Chromium touch emulation at viewport widths 320, 360, 390, 430, 540,
768, 820, 1024 and 1440 pixels, with no document horizontal overflow or
nondecorative content outside the viewport. Inspected the full mobile render.
Passed automatic animation progression, pause/resume, mobile menu, product
filters, enquiry context, portrait and landscape dialog fit, scroll reveals,
reduced-motion rendering and JavaScript error checks. JavaScript syntax checks
passed. Real iPhone/Safari and physical-device frame rates were not measured.

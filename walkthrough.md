# Walkthrough - Edplit Warm Brutalist Redesign

I have successfully transformed the Edplit website into a "Warm Brutalist" experience.

## Changes Created

### 1. The Design System (CSS)
I redefined the core CSS variables in `styles.css` to match the warm, organic palette.
- **Palette**: Sand (`#e6e0d4`) background with Charcoal (`#1f1c1a`) text and Deep Rust (`#c2410c`) accents.
- **Typography**: Switched to a combination of **Syne** (for eccentric, massive headlines) and **Space Grotesk** (for functional, brutalist body text).
- **Brutalist Tokens**: Removed all `border-radius` (set to 0px) and replaced soft shadows with hard, 6px toggle-switches.

### 2. The "Singularity" Motion (JS + CSS)
I implemented a dramatic entrance sequence in `script.js` using GSAP timelines.
- **Deconstruction**: The "EDPLIT" text explodes and deconstructs with a blur filter.
- **The Opening**: An overlay (`.singularity-overlay`) creates a circular wipe effect to reveal the site.
- **Entrance**: The hero title and subtitles crash in from off-screen with heavy easing.

### 3. Component Updates
- **Buttons**: Converted to rectangular, thick-bordered elements with "hard" drop shadows on hover.
- **Cards**: Removed rounded corners and added a magnetic hover effect (`script.js`) that pulls the element slightly towards the cursor.

## Verification Results

### Visual check
- The site loads with the "Singularity" animation.
- All text uses the new font families.
- Buttons and cards obey the new brutalist rules (square, hard outlines).

### Browser Console
- No critical errors found during load.
- GSAP and ScrollTrigger loaded correctly from CDN.

## Next Steps
- Replace placeholder images with high-res assets that match the specific "sand/warm" vibe.
- Consider purchasing the actual premium fonts if *Syne* is only a placeholder.

# Implementation Plan - Edplit Warm Brutalist Overhaul

# Goal Description
Transform the existing Edplit website into a "Warm Brutalist" experience as defined in the PRD. This involves a complete visual redesign using organic tones, exotic typography, and a "dramatic singularity" motion effect.

## User Review Required
> [!IMPORTANT]
> **Font Selection**: Since I cannot purchase premium fonts, I will mock up the design using **Syne** (for the exotic/odd headlines) and **Space Grotesk** (for the brutalist body) from Google Fonts/Open Source. The user can swap these for the actual paid licenses later.
> **Tech Stack**: Remaining on Vanilla HTML/CSS/JS for now.

## Proposed Changes

### Design System (CSS Variables)
#### [MODIFY] [styles.css](file:///C:/Users/Stabiloboss/.gemini/antigravity/scratch/edplit-updated/styles.css)
- Define the new color palette: Sand, Deep Rust, Warm Grey, Soft Black.
- Set up typography tokens (Font families, massive sizes).
- Define "Brutalist" utility classes (borders, sharp edges).

### HTML Structure
#### [MODIFY] [index.html](file:///C:/Users/Stabiloboss/.gemini/antigravity/scratch/edplit-updated/index.html)
- Deconstruct rigid containers to allow for "rule-breaking" layouts.
- Be ready to add a `full-screen-overlay` for the "Singularity" motion event.
- Import GSAP via CDN.

### Logic & Motion
#### [MODIFY] [script.js](file:///C:/Users/Stabiloboss/.gemini/antigravity/scratch/edplit-updated/script.js)
- Initialize GSAP.
- Implement the "Smooth Damping" scroll effect (using lenient `scroll-behavior` or a lightweight library like Lenis if needed, but starting with CSS/JS hybrid).
- **The Singularity**: Build a dramatic entrance animation (e.g., text explosion or overlay wipe) on page load.

## Verification Plan

### Automated Tests
- None for visual design.

### Manual Verification
- Open `index.html` in browser.
- Verify the "Warm Brutalist" vibe (colors, heavy borders).
- Check the "Singularity" animation on refresh.
- Ensure responsiveness is maintained (brutalism can be tricky on mobile).

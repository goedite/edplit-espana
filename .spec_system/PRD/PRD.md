# Edplit Frontend Design PRD

## 1. Executive Summary
**Project Name:** Edplit
**Vision:** To create a digital experience that defies conventional web design tropes through a "Warm Brutalist" aesthetic. The interface will balance raw, structural boldness with inviting warmth, utilizing exotic typography and a singular, high-drama motion event to create a memorable brand imprint.

## 2. Design Philosophy: Warm Brutalism
Traditional Brutalism is cold, industrial, and raw. **Warm Brutalism** retains the structural honesty and boldness but creates an inviting atmosphere through color and texture.

### 2.1 Core Pillars
*   **Rule Breaking:** Grid systems may be exposed or intentionally broken. Elements may overlap or float in unconventional whitespace.
*   **Raw & Refined:** A mix of "raw" UI elements (heavy borders, system fonts, unpolished containers) contrasted with "refined" elements (high-resolution imagery, delicate serif accents).
*   **Warmth:** Rejection of #000000 and #FFFFFF. Usage of organic tones—terracotta, clay, sandstone, deep moss, and burnt sienna.

## 3. Visual Identity

### 3.1 Color Palette
*   **Backgrounds:** Sand, Off-white (Cream), Warm Grey.
*   **Accents:** Deep Rust, International Orange (toned down), Digital Lavender.
*   **Contrast:** Soft Black (Charcoal/Dark Brown) instead of true black.

### 3.2 Typography strategy
**Constraint:** Must use a **Premium / Exotic Paid Font**.  
*   **Primary (Headlines):** A typeface that feels experimental, editorial, or "odd." 
    *   *Reference Vibes:* *GT Alpina* (Grilli Type), *Editorial New* (Pangram Pangram), or something more experimental like *Whyte Inktrap* or a customized serif.
    *   *Usage:* Massive scaling, tight leading, intentional overlapping.
*   **Secondary (Body):** A clean, brutalist monospace or grotesque sans-serif for high readability (e.g., *Suisse Int'l Mono* or *Helvetica Now*).

### 3.3 UI Elements
*   **Buttons:** Sharp edges, heavy borders (2px-3px), hover states that shift color dramatically but instantly (no fade).
*   **Layout:** Masonry or asymmetric grids. "Anti-design" alignment where appropriate.

## 4. Motion Design

### 4.1 Global Motion (The "Subtle")
*   **Philosophy:** "Invisible" friction. Things should feel heavy but move smoothly.
*   **Interactions:** 
    *   Scroll: Smooth damping, but no elasticity.
    *   Hover: Micro-shifts in position (x/y translation) rather than opacity fades.
    *   Parallax: Very subtle depth layers between text and images.

### 4.2 The "Dramatic Singularity" (The Exception)
**Concept:** One single point in the user journey must break the subtlety rule with explosive, cinematic drama.
**The Moment:** The **Initial Page Load / Splash Screen** OR **The Primary Action (e.g., "Submit Inquiry")**.
*   **Description:** A full-screen takeover. Potentially a 3D distortion effect, a sudden inversion of all colors, or a typography explosion where the letters of "Edplit" deconstruct and reassemble.
*   **Technical:** WebGL (Three.js/R3F) shader distortion or a complex SVG morphing sequence. It should feel "dangerous" and loud compared to the rest of the site.

## 5. Technical Requirements
*   **Framework:** Existing Vanilla HTML/CSS/JS (Migration to Vite/React recommended if complexity grows).
*   **Styling:** Update `styles.css` to manage the brutalist token system.
*   **Animation Library:** GSAP (GreenSock) for the complex choreography.
*   **Font Licensing:** Budget allocated for premium font licensing (approx. $300-$1000 range depending on foundry).

## 6. Success Metrics
*   **User Impression:** "I have never seen a site look like this."
*   **Performance:** 95+ Lighthouse score despite heavy aesthetics.
*   **Brand Alignment:** Perception of Edplit as a cutting-edge, avant-garde entity.

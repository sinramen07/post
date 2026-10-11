---
name: Scribe & Parchment
colors:
  surface: '#fff9ec'
  surface-dim: '#e0dac8'
  surface-bright: '#fff9ec'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3e1'
  surface-container: '#f4eddb'
  surface-container-high: '#efe8d6'
  surface-container-highest: '#e9e2d0'
  on-surface: '#1e1c11'
  on-surface-variant: '#504440'
  inverse-surface: '#333024'
  inverse-on-surface: '#f7f0de'
  outline: '#827470'
  outline-variant: '#d3c3be'
  surface-tint: '#74584e'
  primary: '#090100'
  on-primary: '#ffffff'
  primary-container: '#2c1810'
  on-primary-container: '#9e7e73'
  inverse-primary: '#e3bfb2'
  secondary: '#7b5800'
  on-secondary: '#ffffff'
  secondary-container: '#fdc34d'
  on-secondary-container: '#715000'
  tertiary: '#0a0100'
  on-tertiary: '#ffffff'
  tertiary-container: '#3c0c00'
  on-tertiary-container: '#c07055'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#e3bfb2'
  on-primary-fixed: '#2a170f'
  on-primary-fixed-variant: '#5a4137'
  secondary-fixed: '#ffdea6'
  secondary-fixed-dim: '#f7bd48'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#74341d'
  background: '#fff9ec'
  on-background: '#1e1c11'
  surface-variant: '#e9e2d0'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 34px
  title-lg:
    fontFamily: EB Garamond
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: EB Garamond
    fontSize: 17px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Literata
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Literata
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Literata
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Space Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-sm: 0.75rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system fuses the disciplined architectural mechanics of Google Material Design 3 with the tactile, deliberate romance of classical print, archival stationery, and fountain pen manuscripts. It addresses knowledge workers, researchers, journal keepers, and productivity purists who seek digital tools stripped of clinical tech neon, favoring instead a grounded, tangible sense of permanence and craft.

The aesthetic philosophy bridges **Material 3 Token Rigor** with **Tactile / Archival Skeuomorphism**:
- Surface planes model parchment, weathered vellum, and heavy-stock rag paper.
- Line work, typographic hierarchy, and iconography honor iron-gall ink and brass instrument detailing.
- Ephemeral interactions evoke physical desktop elements: semitransparent washi tape, oxidized brass pins, and hand-pressed wax seals, while adhering strictly to contemporary responsive ergonomics and accessible design token structures.

## Colors

The palette establishes an authentic, antique scriptorium atmosphere using warm organic pigments and deep carbon-iron ink values.

### Color Roles & Rationale
- **Primary (`#2c1810` - Deep Walnut Ink):** Represents fluid fountain pen ink. Used for high-emphasis typography, primary container borders, actionable ink stamps, and active states.
- **Secondary (`#b8860b` - Aged Brass / Burnished Gold):** Evokes vintage metal fasteners, pen nibs, and wax seals. Applied to primary CTAs, highlight badges, and focus rings.
- **Tertiary (`#8c462e` - Terra Cotta / Sealing Wax):** Used for archival urgency, delete/alert confirmations, and categorical distinctions across post-it note stacks.
- **Neutral (`#f5eedc` - Weathered Parchment):** The foundation canvas mimicking aged ivory rag paper. Neutral tonal layers grade smoothly into warm sepia shadows rather than cold sterile greys.

### Tonal Surface Hierarchy (Material 3 Adaptive Surfaces)
- **Surface Canvas (Base):** `#f4ece1`
- **Surface Container Lowest:** `#fbf8f2` (Fresh bleached parchment)
- **Surface Container Low:** `#f7f1e5` (Standard note background)
- **Surface Container High:** `#ede1ce` (Darker craft-paper card stock)
- **Surface Container Highest:** `#e2d4be` (Densely stacked desk trays)
- **On-Surface Ink:** `#1a110b` (Max-contrast gall ink text)
- **On-Surface Variant:** `#5c4d44` (Diluted sepia draft text)

## Typography

The typographic system contrasts classical literary proportion with utilitarian clerk notation:
- **Headlines (`EB Garamond`):** Channels 16th-century humanist editorial craft. Generous x-height with chiseled serifs; delivers dignified authority to hero headers and milestone titles.
- **Body Text (`Literata`):** Designed for extended reading endurance on screens, featuring organic strokes, warm serifs, and high contrast against tinted parchment containers.
- **Labels & System Indices (`Space Mono`):** Evokes mechanical archival ledger notation, library card catalog stamping, and metadata categorization (#tags, timestamps, badge counts).

## Layout & Spacing

Layouts adhere to an adaptive desktop desk-mat model structured around a 12-column responsive grid on desktop and 4 columns on mobile.

- **Desktop (>= 1024px):** A central journal workbench spanning up to 1280px with `margin-lg` (3rem) safety framing. Post-it cards arrange dynamically into 3- or 4-column cork/desk boards using `gutter-lg` (2rem).
- **Tablet (600px - 1023px):** 8-column layout. Forms and sticky boards divide into side-by-side or dual-column cascades with `gutter` (1.25rem).
- **Mobile (< 600px):** 4-column flow. Padding compresses to `margin-sm` (1rem). Notes collapse to a single linear stack with gentle offset rotations (±1.5deg) normalized to avoid horizontal clipping.
- **Spacing Rhythm:** Built on an 8pt modular grid. All content containers, ink-wells, and post-it memo pads use strict multiples of 4px and 8px to maintain harmony across varied paper cutouts.

## Elevation & Depth

Material 3 elevation tiers are expressed through warm sepia shadows and physical paper-layering rather than synthetic neutral blurs:

- **Shadow Chemistry:** Shadows use a warm walnut base (`rgba(44, 24, 16, 0.08)` to `rgba(44, 24, 16, 0.22)`) combined with an ambient golden penumbra (`rgba(184, 134, 11, 0.05)`), replicating room lamplight falling onto heavy desktop stock.
- **Level 0 (Desk Surface):** Flat canvas (`#f4ece1`) with subtle textured grain noise overlay (2% opacity).
- **Level 1 (Docked Paper / Input Tray):** `box-shadow: 0 1px 3px rgba(44, 24, 16, 0.07), 0 1px 2px rgba(44, 24, 16, 0.12);` Thin organic border of `1px solid rgba(44, 24, 16, 0.12)`.
- **Level 2 (Post-It Cards & Sticky Slips):** `box-shadow: 0 4px 12px -2px rgba(44, 24, 16, 0.14), 0 2px 4px -1px rgba(44, 24, 16, 0.08);` Subtle uneven tilt (e.g., `transform: rotate(-0.75deg)` or `+1deg`).
- **Level 3 (Modal Ledger / Floating Toolbars):** `box-shadow: 0 10px 24px -4px rgba(44, 24, 16, 0.18), 0 4px 8px -2px rgba(44, 24, 16, 0.10);` Crisp deckle-edge micro-border.
- **Physical Accents:**
  - **Washi Tape:** Semitransparent warm ivory strip (`rgba(247, 241, 229, 0.72)`) centered at the top edge of cards with fibrous rough horizontal bounds and a 1px glass highlight.
  - **Brass Tack/Pin:** Radial brass gradient (`#c69214` to `#7a5207`) with a sharp bottom-right drop shadow creating metallic protrusion.

## Shapes

The design system employs a roundedness token scale of `2` (8px base radius, 16px for cards and containers, 24px for large dialogs) softened to evoke hand-cut rag paper sheets rather than cold geometric fillets.

- **Sheets & Post-It Cards:** 16px radius (`rounded-lg`) prevents digital harshness while preserving the silhouette of rectangular memo pads.
- **Buttons & Control Pills:** 8px radius for standard inputs and buttons; categorical chips use fully rounded pill-capsules for physical seal aesthetics.
- **Tape & Hardware:** Sharp rectangular cut edges (`roundedness: 0` or `1px`) for tape strips to imitate torn adhesive rolls.

## Components

### Buttons
- **Filled Primary Button:** Aged brass background (`#b8860b`) with deep walnut typography (`#1a110b`), bordered by an antique metallic stroke (`1px solid #946908`). Hover triggers a warm golden glow and slight lift (`translateY(-1px)`).
- **Tonal / Secondary Button:** Warm ivory parchment fill (`#fbf8f2`) with walnut ink text (`#2c1810`) and a `1.5px` border styled like an inked letterpress indentation.
- **Text Button:** Monospaced label (`Space Mono`) with an animated walnut underline mimicking a ruled fountain pen stroke.

### Post-it Memo Cards
- **Base Surface:** Tinted vintage paper stock variants:
  - *Classic Parchment:* `#fdf6e2`
  - *Dusty Rose Slip:* `#faeade`
  - *Weathered Sage:* `#e8f0e4`
  - *Bleached Manila:* `#f6f0df`
- **Taping Mechanism:** Decorative pseudo-element centered at `top: -10px` mimicking frosted translucent masking tape (`rgba(255, 255, 255, 0.65)` with fiber texture and box shadow).
- **Card Header:** Categorical stamp pill on the left, antique brass dot menu icon or pin head on the right.
- **Card Body:** `Literata` body copy with `lineHeight: 24px`, simulating hand-ruled writing lines.

### Input Fields & Textareas
- **Text Entry (Ink Field):** Parchment-toned background (`#fbf8f2`) surrounded by a vintage 1.5px ink border (`rgba(44, 24, 16, 0.25)`).
- **Focus State:** Border hardens to pure Walnut Ink (`#2c1810`) accompanied by an outer aged brass ring (`0 0 0 3px rgba(184, 134, 11, 0.2)`).
- **Placeholder Text:** Faded sepia iron-gall script (`rgba(92, 77, 68, 0.55)`).

### Chips & Category Badges
- **Pill Tags:** `Space Mono` font, uppercase lettering. Encased in a weathered craft-board capsule (`#ede1ce`) with a miniature leading `#` glyph styled in brass gold. Active filter tags invert to solid walnut ink with ivory text.

### Checkboxes & Radio Controls
- **Checkboxes:** Square 18px box with 3px softened corners. Unchecked: thin sepia border with hollow paper center. Checked: solid walnut ink fill containing an authentic quill-stroke check mark in parchment ivory.
- **Radio Buttons:** Concentric circular seals featuring an aged brass central dot.

### Specialized Journal Components
- **Wax Seal Action Trigger:** Circular floating action button (FAB) styled in deep terracotta (`#8c462e`) embossed with a monogram or quill glyph, sporting a dense, heavy Level 3 physical drop shadow.
- **Ruled Paper Toggle:** Switch component resembling an antique toggle switch with burnished brass casing and an ivory porcelain knob.
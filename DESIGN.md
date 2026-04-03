# Design System Document

## 1. Overview & Creative North Star: "The Urban Cartographer"
This design system moves beyond a simple utility app to become a sophisticated editorial guide for the city of Cádiz. Our Creative North Star is **"The Urban Cartographer"**—a vision that blends the precision of architectural blueprints with the airy, coastal atmosphere of Andalusia. 

While the initial brief called for flat borders and rigid lines, this system evolves those requirements into a **High-End Editorial** experience. We achieve this through "Breathable Precision": using generous white space, intentional asymmetry in layouts, and a "Tonal Layering" approach that replaces harsh outlines with soft, structural depth. The result is a digital environment that feels curated, premium, and inherently connected to the environment it seeks to protect.

---

## 2. Colors: Tonal Depth & The No-Line Rule
We utilize a palette inspired by sustainable materials—glass, paper, and organic waste—reimagined through a professional, systematic lens.

### Color Logic
- **Primary (`#006D3E` / Container `#2ECC7D`):** Represents Glass. Use this for the most critical actions and successful states.
- **Secondary (`#005FAD` / Container `#499DFE`):** Represents Paper. Use for informational wayfinding and navigation.
- **Tertiary (`#835500` / Container `#F2A320`):** Represents Containers/Favorites. Use for high-attention alerts or personal saved locations.
- **Neutral Header (`#2D2D2D`):** Provides the "Architectural Anchor" for the experience, grounding the airy layout.

### The "No-Line" Rule
To achieve a premium editorial feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely through:
1.  **Background Shifts:** Place a `surface-container-low` card on a `surface` background.
2.  **Negative Space:** Use the spacing scale to create clear mental groupings without physical lines.
3.  **Tonal Transitions:** Define the edge of a search bar by shifting from `surface-container-lowest` to `surface-variant`.

### Signature Textures & Glassmorphism
To elevate the "flat" aesthetic, use **Glassmorphism** for floating map overlays and navigation bars. 
*   **Token Usage:** `surface-container-lowest` at 85% opacity with a `20px` backdrop-blur. 
*   **CTAs:** While maintaining a flat feel, apply a subtle 5% vertical tint shift (e.g., `primary` to `primary-container`) on buttons to provide a "tactile soul" that pure flat colors lack.

---

## 3. Typography: Editorial Authority
The typography system creates a clear dialogue between bold, structural headers and legible, functional body copy.

*   **Display & Headlines (Plus Jakarta Sans):** These are our "Architectural Marks." They should be used with tight letter-spacing (-0.02em) to create a high-end, heavy-set look that commands attention.
*   **Body & Labels (Be Vietnam Pro / DM Sans equivalent):** These are our "Service Marks." They provide the neutral, clear information needed for utility.
*   **Hierarchy as Identity:** Use `display-md` for screen titles in Spanish (e.g., **"Encuentra tu punto"**) to create an editorial impact that feels like a modern magazine spread rather than a standard mobile app.

---

## 4. Elevation & Depth: The Layering Principle
We reject traditional drop shadows in favor of **Tonal Layering**. Depth is achieved by "stacking" surface tiers to mimic the physical layering of fine paper or glass.

- **The Stacking Order:** 
    - **Level 0 (Base):** `surface` (#F8F9FA)
    - **Level 1 (Sections):** `surface-container-low` 
    - **Level 2 (Interactive Cards):** `surface-container-lowest` (#FFFFFF)
- **Ambient Shadows:** Only use shadows for "Floating Action Buttons" (FAB) or critical overlays. These must be **extra-diffused**: `0px 12px 32px rgba(25, 28, 29, 0.06)`. The shadow is a tint of the `on-surface` color, never pure black.
- **The Ghost Border:** If a boundary is required for accessibility (e.g., an input field), use the `outline-variant` token at **15% opacity**. This creates a "Ghost Border" that guides the eye without cluttering the minimalist aesthetic.

---

## 5. Components

### Buttons
- **Primary:** High-contrast `primary` background with `on-primary` text. Radius: `lg` (0.5rem). No shadow.
- **Secondary:** `secondary-container` background. Provides a softer alternative for secondary actions like "Ver Mapa."
- **Tertiary (Ghost):** No background. Use `primary` text weight 700.

### Cards (Puntos de Reciclaje)
**Never use divider lines.** Separate the location name from the distance using vertical padding (`1.5rem`).
- **Style:** `surface-container-lowest` background, `lg` corner radius, and a "Ghost Border" if placed on a white background.
- **Interaction:** On tap, the card should scale slightly (98%) rather than changing color.

### Chips (Filtros)
- **Selection Chips:** Use `secondary-container` when active to denote the "Paper" or "Glass" category.
- **Shape:** Use the `full` roundedness scale (capsule shape) to contrast against the `lg` (8px) radius of cards.

### Input Fields (Buscador)
- **Style:** Background `surface-container-low`, no border.
- **Focus State:** A 2px `primary` "Ghost Border" (20% opacity) appears to signify activity without a "heavy" transition.

### Contextual Components: "The Cádiz Pulse"
- **Distance Indicator:** A small, circular badge using `tertiary-container` to highlight how close the user is to a recycling point.
- **Capacity Meter:** A thin horizontal bar using `surface-variant` as a track and `primary` as the progress, indicating if a container is full.

---

## 6. Do's and Don'ts

### Do
- **Do** use Spanish terminology that feels local and welcoming (e.g., "Tu impacto en Cádiz" instead of "Estadísticas").
- **Do** lean into asymmetry. For example, a "Search" bar that is slightly offset or a header that uses wide left margins.
- **Do** prioritize "Active White Space." If a screen feels crowded, increase the spacing—do not add a divider.

### Don't
- **Don't** use 100% opaque, high-contrast borders. It breaks the "Urban Cartographer" aesthetic and makes the UI look dated.
- **Don't** use standard Material Design blue for links. Use our `secondary` (Blue accent) to maintain the "Paper" metaphor.
- **Don't** use default system icons. Use custom, thin-stroke (1.5px) icons that match the `outline` color token.

---
**Director's Note:** Every pixel should feel like an intentional choice. If a component doesn't serve the "Minimalist and Clean" objective, strip it back until only the essence remains. We are not just building an app; we are designing a cleaner future for Cádiz.
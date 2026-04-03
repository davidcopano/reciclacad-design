## Design Context

### Users
Ciudadanos de Cádiz con un rango amplio de edad y nivel tecnológico. Usan la app en **dos contextos** distintos y de igual peso:
- **En la calle, móvil en mano**: necesitan encontrar el punto más cercano de forma rápida y clara, sin fricción.
- **En casa o la oficina, desktop**: planifican sus rutas de reciclaje con calma, explorando el mapa con detalle.

La interfaz debe funcionar fluidamente en ambos contextos, priorizando la legibilidad y los objetivos de la tarea sobre la ornamentación.

### Brand Personality

**Tres palabras**: *Cívico · Preciso · Respirable*

Voz: local, cercana, nunca corporativa. Habla como la ciudad, no como una institución.
Tono emocional: **orgullo cívico** — "estoy haciendo algo por mi ciudad". El usuario debe sentirse parte activa de un Cádiz más sostenible, no como si estuviera cumpliendo una obligación.

### Aesthetic Direction

**North Star: "The Urban Cartographer"** — la precisión de un plano arquitectónico con la ligereza aireada del litoral andaluz.

- Estilo visual: editorial de alta factura, minimalista y contenido. "Breathable Precision".
- Profundidad por capas tonales, nunca con sombras duras ni bordes 1px sólidos (**The No-Line Rule**).
- Glassmorphism para overlays flotantes: `surface-container-lowest` al 85% opacidad + `backdrop-blur-xl`.
- Asimetría intencional en layouts para evitar la rigidez de una grid estándar.
- Modo claro **y** oscuro requeridos.
- Sin referencias externas concretas; debe sentirse único y local.

### Tech Stack
- HTML + Tailwind CSS v3 (CDN con `forms` y `container-queries`)
- Google Fonts: **Plus Jakarta Sans** (headlines), **Be Vietnam Pro** (body/labels), **DM Sans** (UI labels)
- **Material Symbols Outlined** — variaciones: `FILL 0`, `wght 400`, trazo fino alineado con el token `outline`
- Sin frameworks JS; diseño estático/HTML puro

### Color System

Paleta Material You completa definida en `tailwind.config`. Semántica de colores:

| Rol | Color Base | Container | Metáfora |
|-----|-----------|-----------|----------|
| Primary | `#006D3E` | `#2ECC7D` | Vidrio / Acciones principales |
| Secondary | `#005FAD` | `#499DFE` | Papel / Navegación y wayfinding |
| Tertiary | `#835500` | `#F2A320` | Envases / Favoritos y alertas |
| Neutral header | `#2D2D2D` | — | Ancla arquitectónica |
| Surface base | `#F8F9FA` | — | Lienzo aireado |

### Typography

- **Display/Headlines** (`Plus Jakarta Sans`, bold 700–800): `letter-spacing: -0.02em`. Máximo impacto editorial.
- **Body/Labels** (`Be Vietnam Pro`): neutral, claro, funcional.
- **UI Labels** (`DM Sans`): componentes interactivos (chips, nav items, botones).
- Titulos de pantalla en español con voz local ("Encuentra tu punto", no "Buscar").

### Spacing & Shape

- Espacio activo en blanco: ante la duda, más espacio, nunca un divider.
- Radios: `DEFAULT` 2px · `lg` 4px · `xl` 8px · `full` 12px (capsule).
- Cards: `xl` radius. Chips: `full` radius. Contraste shape intencional.

### Elevation Model

| Nivel | Token | Uso |
|-------|-------|-----|
| 0 – Base | `surface` | Fondo de página |
| 1 – Secciones | `surface-container-low` | Barras laterales, fondos de sección |
| 2 – Cards | `surface-container-lowest` (#FFF) | Cards interactivas |
| Flotante | Glass + blur | Overlays de mapa, FAB |

Sombras solo para FAB y overlays críticos: `0px 12px 32px rgba(25, 28, 29, 0.06)`.

### Accessibility
- Objetivo **WCAG AA**.
- Ghost Border para campos de input: `outline-variant` al 15% opacidad.
- Asegurar ratios de contraste de texto en modo oscuro.
- Soporte para `prefers-reduced-motion` en animaciones.

### Design Principles

1. **Orgullo local primero** — Cada decisión de diseño debe reforzar el vínculo emocional del usuario con su ciudad. Usa lenguaje local (`"Tu Cádiz más limpio"`), no genérico.
2. **La jerarquía es información** — El tamaño, el peso y el color deben guiar la mirada hacia la acción más importante sin que el usuario tenga que buscarla.
3. **Respirar es diseñar** — El espacio en blanco no está vacío; está de guardia. Nunca comprimas un layout para añadir más contenido; elimina lo superfluo.
4. **Capas, no líneas** — La profundidad se comunica mediante desplazamientos tonales y glass. Una línea 1px sólida es siempre un fallo de diseño en este sistema.
5. **Funciona en las dos velocidades** — Debe ser igualmente eficaz para el usuario en la calle (gestos, texto grande, acción rápida) y para quien planifica en escritorio (densidad de información, exploración).

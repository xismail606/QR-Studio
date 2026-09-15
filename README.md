<!-- ===================== HEADER ===================== -->
<div align="center">
  <img
    src="https://capsule-render.vercel.app/api?type=waving&color=gradient&text=QR%20Studio&height=140&section=header"
    alt="QR Studio Header"
    width="100%"
  />
</div>
# QR Studio

<div align="center">

![QR Studio Banner](public/favicon.svg)

### Precision Parametric QR Code Studio for Production Design

A fast, client-side parametric QR code design studio. Craft tailored matrix styles, custom finder patterns, embedded brand marks, and export production-ready vector assets directly in the browser with zero server roundtrips.

[![Astro](https://img.shields.io/badge/Astro-4.16-bc52ee?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Pure JavaScript](https://img.shields.io/badge/Language-JavaScript-f7df1e?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Studio](https://qr-studio.x606.workers.dev) · [Report an Issue](https://github.com/xismail606/QR-Studio/issues) · [Created by x606](https://github.com/xismail606)

</div>

---

## Highlights

- **Client-Side QR Processing**: QR generation, rasterization, and vector drawing run in the browser without an application backend or QR-generation API.
- **Parametric Geometry Engine**: Complete control over overall silhouette (square or circular QR), module patterns, corner eye frame styles, and inner pupils.
- **Advanced Gradients & Colors**: Linear and radial matrix gradients, custom angles, independent eye-frame and eye-center gradients, and background corner rounding.
- **Brand Mark & Logo Embedding**: Upload PNG, JPEG, or WebP logos with custom scale, internal padding, border radius, and automatic error correction compensation.
- **24 Visual Frame Modes**: Contextual frames including `badge-bottom`, `scan-me`, `speech-bubble`, `camera-pill`, `tooltip-pointer`, `delivery-scooter`, `coffee-cup`, and more.
- **Real-Time Scannability Scoring**: Continuous contrast ratio assessment and ISO/IEC 18004 error correction calibration (L: 7%, M: 15%, Q: 25%, H: 30%).
- **Multi-Format Vector & Raster Export**: Direct export to scalable SVG, PNG up to 2048px, WebP, JPEG, clipboard image copy, and JSON configuration copy.
- **Bilingual English & Arabic (RTL)**: Integrated language toggle with full right-to-left layout adaptation and Cairo typography.
- **Responsive Studio UI**: Adaptive viewport switching (`Controls`, `Preview`, or `Both`) for phones, tablets, iPads, and large desktop screens.

---

## Feature Overview

### 1. Data Content Types

The current MVP supports these payload types:

- **URL / Link**: Standard HTTP/HTTPS addresses
- **Plain Text**: Formatted or raw text messages

The content registry is intentionally structured so additional QR payload types can be added later.

### 2. Geometry & Style Options

- **Silhouettes**: Square, Circle
- **Data Matrix Modules**: Rounded, Dots, Classy, Classy Soft, Square, Pill Round (extra-rounded)
- **Corner Eye Frames**: Square, Rounded, Circle, Squircle, Dotted, Classy, Classy Soft
- **Corner Eye Pupils**: Square, Rounded, Circle, Dot, Classy, Classy Soft
- **Quiet Zone**: Parametric margin slider (0 to 32px)
- **Corner Radius**: Smooth background corner rounding

### 3. Visual Call-to-Action Frames

Contextual frames designed for physical retail, events, packaging, and digital signage:

- `none`, `scan-me`, `badge-bottom`, `simple`, `rounded`, `modern`, `tooltip-pointer`, `speech-bubble`, `camera-pill`, `arrow-cursive`, `cursive`, `envelope`, `phone`, `ribbon`, `chef-hat`, `delivery-scooter`, `coffee-cup`, `gift-box`, `coffee-takeout`, `energy-burst`, `shopping-bag`, `top-label`, `bottom-label`.

---

## Tech Stack

| Layer             | Technology                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| **Framework**     | [Astro 4](https://astro.build/) (Static Site Generation & Islands Architecture)                 |
| **UI Components** | [React 18](https://react.dev/) (Interactive Parametric Editor)                                  |
| **Styling**       | [Tailwind CSS 3](https://tailwindcss.com/) with curated CSS variables and dark/light tokens     |
| **QR Engine**     | [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) (Canvas & SVG vector pipeline) |
| **Icons**         | [Lucide React](https://lucide.dev/) & [Phosphor Icons](https://phosphoricons.com/)              |
| **Testing**       | [Vitest](https://vitest.dev/) (Unit test suite for content encoding and readability algorithms) |

---

## Learning & AI-Assisted Development

This project was built as a hands-on project to improve practical skills in AI-assisted software development and agentic AI workflows. The goal was to use AI tools as engineering collaborators while still validating the resulting code, interface behavior, accessibility, localization, and tests.

Tools and references used during development included:

- Codex
- OpenCode
- OpenRouter
- Hermes Agent
- Antigravity
- Local models served through [Ollama](https://ollama.com/)
- Spec Kit
- Testing-focused skills
- [Guard Skills](https://github.com/amElnagdy/guard-skills)
- [UI/UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [Refero](https://styles.refero.design/)
- [21st.dev](https://21st.dev/)

These tools supported the development workflow; they are not runtime dependencies of the deployed QR Studio application.

---

## Getting Started

### Prerequisites

- Node.js `v18.17.0` or higher
- npm, pnpm, or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/xismail606/QR-Studio.git
   cd QR-Studio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

---

## Available Scripts

| Command           | Action                                            |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Starts local Astro dev server on `localhost:4321` |
| `npm run build`   | Builds static production bundle into `dist/`      |
| `npm run preview` | Previews the production build locally             |
| `npm run test`    | Runs the test suite via Vitest                    |

---

## Project Structure

```text
QR Studio/
├── public/                  # Static web assets, favicon, and icons
├── src/
│   ├── components/
│   │   ├── astro/           # Static marketing and structural components
│   │   │   ├── CTA.astro
│   │   │   ├── ExportFormats.astro
│   │   │   ├── Features.astro
│   │   │   ├── Footer.astro         # Curated footer with CyberSec & QR Studio hubs
│   │   │   ├── Hero.astro
│   │   │   ├── HowItWorks.astro
│   │   │   ├── Navbar.astro         # Sticky header with theme & language toggles
│   │   │   └── Templates.astro
│   │   └── react/           # Interactive stateful UI components
│   │       ├── editor/      # QREditor, QRPreview, and responsive viewports
│   │       ├── panels/      # Content, Style, Colors, Logo, Frame, Text, Export panels
│   │       └── ui/          # ThemeToggle, LanguageToggle, controls, indicators
│   ├── hooks/               # React hooks (useQRConfig, undo/redo state machine)
│   ├── layouts/
│   │   └── BaseLayout.astro # Base HTML shell, metadata, theme & RTL scripts
│   ├── lib/
│   │   ├── export/          # PNG, WebP, SVG generators & clipboard utilities
│   │   ├── i18n/            # Translations dictionary (EN & AR) and language helpers
│   │   ├── presets/         # Curated design presets & randomization algorithms
│   │   ├── qr/              # Adapter layer, content encoders, readability audits
│   │   └── storage/         # LocalStorage persistence for saved designs
│   ├── pages/
│   │   ├── index.astro      # Marketing landing page
│   │   └── generator.astro  # Full-screen parametric studio application
│   ├── styles/
│   │   └── global.css       # Design tokens, color schemes, and Arabic typography
│   └── types/
│       └── qr.js            # Default configurations, schema structures & constants
├── astro.config.mjs         # Astro integrations & Vite build settings
├── jsconfig.json            # Path aliases (@/* -> src/*)
├── tailwind.config.mjs      # Tailwind theme extensions & design tokens
└── vitest.config.js         # Vitest unit test configuration
```

---

## Privacy & Security

QR Studio adheres to a strict client-side first architecture:

- **No QR Backend**: The content you encode is processed locally in the browser and is not sent to a QR-generation API or application server.
- **No Cloud Storage**: Saved designs and history stay strictly within your browser's `localStorage`.
- **No Third-Party Analytics**: Zero tracking scripts, cookies, or telemetry.

---

## Author & Community

Crafted with care by [x606](https://github.com/xismail606) — Developer & Cybersecurity Enthusiast.

- GitHub: [@xismail606](https://github.com/xismail606)
- Security & OSINT Arsenal: [CyberSec](https://cybersec.x606.me/)

---

## License

This project is licensed under the [MIT License](LICENSE).

<!-- ===================== FOOTER ===================== -->
<div align="center">
  <img 
    src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=110&section=footer"
    alt="GitHub Footer"
    width="100%"
  />
</div>

# DLane

Web-based worship presentation tool, inspired by EasyWorship and ProPresenter.

> **Status**: Functional prototype · 100% client-side (no external dependencies)

---

## Features

- **Resource management** — Songs, Scriptures, Media, Presentations and Themes
- **Slide view** — Lyrics automatically split into slides (double line break)
- **Live output** — Simulates a projector with black screen and clear support
- **Real-time customization** — Font size, text color, background color, fade effects and verse numbering
- **Search** — Real-time filtering on the resource table
- **Full CRUD** — Add, edit and delete resources
- **Local persistence** — Data automatically saved in the browser (`localStorage`)
- **Keyboard navigation** — ↑↓ arrows to navigate slides, Enter to send live

---

## How to use

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox).
2. Browse through the tabs (Songs, Scriptures, Media, Presentations, Themes).
3. Click an item on the table to view its slides in the preview panel.
4. Use the keyboard arrows or click on thumbnails to navigate between slides.
5. Click **Go Live** to send the current slide to the projection screen.
6. Adjust appearance (font, color, fade) in the live customization panel.
7. Add/edit/delete items using the buttons on the table toolbar.

---

## Project Structure

```
DLane/
├── index.html    # Complete UI (HTML + layout)
├── style.css     # Styles (dark theme, animations, responsiveness)
├── script.js     # Application logic (state, events, CRUD)
└── README.md     # Documentation
```

---

## Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Language     | JavaScript (ES6+)       |
| Markup       | HTML5                   |
| Styling      | CSS3                    |
| Dependencies | **Zero**                |
| Persistence  | `localStorage`          |
| Build        | None (just open in browser) |

---

## Possible evolutions

- Code modularization into multiple files
- Framework migration (React/Vue/Svelte)
- Backend API for cross-device synchronization
- Data export/import support
- Full custom themes

# Drone_Guide_UPC
Hexsoon EDU 450 — Drone Build Guide (UPC)

## Structure

- `index.html` — page shell: head, topbar, sidebar container, hero, footer. Loads `css/style.css` and `js/main.js`.
- `css/style.css` — all styling.
- `js/main.js` — theme toggle, mobile menu, scrollspy, and the loader that builds the sidebar nav and injects the content sections at runtime.
- `sections.json` — ordered list of content sections: `{ id, file, num, label, group }`. Controls both the sidebar nav and the order sections appear on the page.
- `sections/*.html` — one file per content section (its full `<section id="...">…</section>` markup, including the leading `<hr class="divider">`).

## Adding a new section

1. Create `sections/your-id.html` containing:
   ```html
   <hr class="divider">
   <section id="your-id">
     ...
   </section>
   ```
2. Add one entry to `sections.json` at the position you want it to appear, e.g.:
   ```json
   { "id": "your-id", "file": "your-id.html", "num": "11", "label": "Your section title", "group": "Project journal" }
   ```
   `group` controls which nav heading it's grouped under in the sidebar — reuse an existing group name, or introduce a new one and it gets its own heading automatically.

That's it — no need to touch `index.html` or the nav markup by hand.

## Local preview

Sections are loaded with `fetch()`, which browsers block on `file://` pages. Serve the folder locally instead:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## photos & videos

https://drive.google.com/drive/u/1/folders/1AfR62JqnCPMy463S75JzRaY1EfB--n7H

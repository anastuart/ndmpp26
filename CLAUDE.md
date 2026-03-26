# CLAUDE.md — Clinical Toolkit (ndmpp26)

## What this project is
A static multi-page reference site for MPP students. It contains therapeutic question stems, clinical frameworks, and worksheets. No build tools, no server — pure HTML/CSS/JS deployed via GitHub Pages.

---

## How to add a new page

### Step 1 — Create the HTML file
- Put it in the right folder: `stems/`, `worksheets/`, or `frameworks/`
- Files are **HTML fragments** — no `<html>`, `<head>`, or `<body>` tags. Start directly with the content divs.
- Use lowercase, hyphenated filenames: `my-new-page.html`

### Step 2 — Register it in nav.js
Add one line to the appropriate section in `nav.js`:
```js
{ id: 'my-new-page', title: 'My New Page', path: 'stems/my-new-page.html' },
```
The `id` should match the filename (without `.html`). That's it — the sidebar and routing update automatically.

---

## Page structure (copy this pattern for a new stems page)

```html
<!-- Page header -->
<div class="page-header">
  <div class="page-header-inner">
    <div class="page-label">Question Stems</div>
    <h1 class="page-title">Page <em>Title</em></h1>
    <p class="page-desc">One sentence describing what these stems are for.</p>
  </div>
</div>

<!-- Optional filter bar — omit if not needed -->
<div class="filter-bar">
  <span class="filter-label">Filter:</span>
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="tag-name">Tag Label</button>
</div>

<div class="page-body">

  <!-- One category-card per group of stems -->
  <div class="category-card" data-cats="tag-name">
    <div class="cat-header">
      <div class="cat-dot" style="background:var(--accent)"></div>
      <div>
        <div class="cat-title">Card Title</div>
        <div class="cat-desc">Short description of this group of stems</div>
      </div>
    </div>
    <div class="stems-grid">
      <div class="stem-item"><span class="stem-num">01</span><span class="stem-text">Stem text goes here.</span><button class="copy-btn">copy</button></div>
      <div class="stem-item"><span class="stem-num">02</span><span class="stem-text">Another stem.</span><button class="copy-btn">copy</button></div>
    </div>
    <div class="tag-row"><span class="tag">Tag One</span><span class="tag">Tag Two</span></div>
  </div>

</div>

<!-- Required: empty state message for search -->
<p class="empty-state">No stems match your search.</p>
```

---

## Accent colours (for `cat-dot`)
Use these in order across cards on a page:
- `var(--accent)` — terracotta
- `var(--accent2)` — sage
- `var(--accent3)` — purple
- `var(--accent4)` — ochre
- `var(--accent5)` — blue
- `var(--accent6)` — tan

---

## Key files — don't modify unless specifically asked
| File | Role |
|---|---|
| `shell.js` | Handles all interactivity (routing, search, copy, notes). Don't touch. |
| `style.css` | Shared design system. Don't add inline styles to new pages. |
| `index.html` | App shell. Don't touch. |
| `nav.js` | Page registry. **Edit this to add/remove pages.** |

---

## Sections in nav.js
- **Question Stems** → `stems/` folder
- **Formulation Frameworks** → `frameworks/` folder *(in progress — commented out)*
- **Worksheets & Resources** → `worksheets/` folder

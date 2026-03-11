# Clinical Toolkit — MPP Reference

A multi-page clinical reference site for your MPP degree. Host it free on GitHub Pages and share with classmates via a single link.

## File structure

```
index.html                          ← App shell (don't edit)
style.css                           ← Shared styles (don't edit)
shell.js                            ← Sidebar/routing logic (don't edit)
nav.js                              ← ✏️ Page registry — edit this when adding pages
stems/
  reflections-of-meaning.html       ← ✏️ Content page
  abc-framework.html                ← ✏️ Content page
frameworks/                         ← Your formulation framework pages go here
worksheets/                         ← Your worksheet/resource pages go here
```

## How to add a new page (weekly workflow)

### Step 1: Create the HTML file

Copy an existing page (like `stems/reflections-of-meaning.html`) and edit the content. Each page is a standalone HTML fragment — no `<head>` or `<body>` tags needed. Just use the same component classes:

- `page-header` — the title area at the top
- `category-card` — a group of stems with a coloured dot, title, and tags
- `stem-item` — an individual stem with copy button
- `letter-card` — an ABC-style card with a big letter icon
- `info-card` — an introductory explanation box
- `dark-banner` — a dark callout for key theory notes

### Step 2: Register it in nav.js

Open `nav.js` and add one line to the right section:

```js
{ id: 'my-new-page', title: 'My Page Title', path: 'stems/my-new-page.html' },
```

That's it. The sidebar updates automatically.

## How to host on GitHub Pages

1. Create a new GitHub repository
2. Upload all these files (keeping the folder structure)
3. Go to **Settings → Pages → Source** and select "Deploy from a branch" / "main" / "/ (root)"
4. Your site will be live at `https://yourusername.github.io/repo-name/`
5. Share that link with classmates

## How to update

Push changes to the `main` branch and GitHub Pages will redeploy within a minute or two. You can edit files directly on GitHub's web interface if you don't want to use Git locally.

## Available component patterns

### Stem card with filters
```html
<div class="category-card" data-cats="meaning emotion">
  <div class="cat-header">
    <div class="cat-dot" style="background:var(--accent)"></div>
    <div>
      <div class="cat-title">Card Title</div>
      <div class="cat-desc">Short description</div>
    </div>
  </div>
  <div class="stems-grid">
    <div class="stem-item">
      <span class="stem-num">01</span>
      <span class="stem-text">Your question stem here</span>
      <button class="copy-btn">copy</button>
    </div>
  </div>
  <div class="tag-row">
    <span class="tag">Tag1</span>
    <span class="tag">Tag2</span>
  </div>
</div>
```

### Letter card (ABC style)
```html
<div class="letter-card">
  <div class="letter-card-header">
    <div class="letter-icon c-accent">A</div>
    <div>
      <div class="letter-card-title">Title</div>
      <div class="letter-card-subtitle">Subtitle</div>
    </div>
  </div>
  <div class="letter-card-theory"><strong>Purpose:</strong> Explanation here.</div>
  <div class="stems-grid">
    <!-- stem-items here -->
  </div>
</div>
```

### Available accent colours
- `var(--accent)` — warm terracotta
- `var(--accent2)` — sage green
- `var(--accent3)` — muted purple
- `var(--accent4)` — warm ochre
- `var(--accent5)` — steel blue
- `var(--accent6)` — warm tan

For letter-icon colours: `c-accent`, `c-accent2`, `c-accent3`, `c-accent4`, `c-accent5`, `c-accent6`, `c-rose`

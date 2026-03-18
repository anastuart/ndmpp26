// ┌─────────────────────────────────────────────┐
// │  SHELL — Sidebar, routing, search, copy     │
// │  You should never need to edit this file.    │
// └─────────────────────────────────────────────┘

(function () {
  const sidebarNav = document.getElementById('sidebarNav');
  const contentScroll = document.getElementById('contentScroll');
  const breadcrumb = document.getElementById('breadcrumb');
  const searchInput = document.getElementById('pageSearch');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('sidebarOverlay');

  let currentSection = '';

  // ── Build sidebar from NAV config ──
  function buildNav() {
    sidebarNav.innerHTML = '';
    NAV.forEach(group => {
      group.pages.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
      if (!group.pages.length) return;
      const sec = document.createElement('div');
      sec.className = 'nav-section';
      sec.innerHTML = `
        <div class="nav-section-label"><span class="chevron">▾</span> ${group.section}</div>
        <div class="nav-items"></div>`;
      const items = sec.querySelector('.nav-items');
      group.pages.forEach(page => {
        const a = document.createElement('a');
        a.className = 'nav-item';
        a.textContent = page.title;
        a.href = '#' + page.id;
        a.dataset.page = page.id;
        a.addEventListener('click', e => {
          e.preventDefault();
          navigate(page.id);
        });
        items.appendChild(a);
      });
      sec.querySelector('.nav-section-label').addEventListener('click', () => {
        sec.classList.toggle('collapsed');
      });
      sidebarNav.appendChild(sec);
    });
  }

  // ── Find page config by id ──
  function findPage(id) {
    for (const group of NAV) {
      for (const page of group.pages) {
        if (page.id === id) return { ...page, section: group.section };
      }
    }
    return null;
  }

  // ── Navigate ──
  async function navigate(pageId) {
    const page = findPage(pageId);
    if (!page) return;
    currentSection = page.section;

    // Active state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Breadcrumb
    breadcrumb.innerHTML = `${page.section} / <span>${page.title}</span>`;

    // Load content
    try {
      const resp = await fetch(page.path);
      if (!resp.ok) throw new Error('Page not found');
      const html = await resp.text();
      contentScroll.innerHTML = html;
    } catch (err) {
      contentScroll.innerHTML = `
        <div class="empty-page">
          <div class="empty-page-icon">⚠</div>
          <h3>Page not found</h3>
          <p>Could not load <code>${page.path}</code>. Make sure the file exists.</p>
        </div>`;
    }

    contentScroll.scrollTop = 0;
    if (searchInput) searchInput.value = '';
    bindInteractions();
    closeMobile();
    history.replaceState(null, '', '#' + pageId);
  }

  // ── Bind copy, highlight, filter interactions on loaded page ──
  function bindInteractions() {
    // Copy + highlight on stem items
    contentScroll.querySelectorAll('.stem-item').forEach(item => {
      item.addEventListener('click', e => {
        if (!e.target.classList.contains('copy-btn')) item.classList.toggle('highlighted');
      });
      const btn = item.querySelector('.copy-btn');
      if (btn) {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const text = item.querySelector('.stem-text').textContent;
          navigator.clipboard.writeText(text).then(() => {
            btn.textContent = '✓ copied';
            btn.classList.add('copied');
            setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 1800);
          });
        });
      }
    });

    // Notes bar on category & letter cards
    const pageId = window.location.hash.slice(1) || 'unknown';
    contentScroll.querySelectorAll('.category-card, .letter-card').forEach((card, i) => {
      if (card.querySelector('.card-notes')) return; // already injected
      const key = `notes:${pageId}:${i}`;
      const saved = localStorage.getItem(key) || '';

      const wrapper = document.createElement('div');
      wrapper.className = 'card-notes open' + (saved ? ' has-content' : '');
      wrapper.innerHTML = `
        <div class="card-notes-toggle">
          <span class="notes-chevron">▸</span>
          <span>Notes</span>
          <span class="notes-dot"></span>
        </div>
        <div class="card-notes-body">
          <textarea placeholder="Add your notes here…">${saved.replace(/</g, '&lt;')}</textarea>
        </div>`;

      const toggle = wrapper.querySelector('.card-notes-toggle');
      const textarea = wrapper.querySelector('textarea');

      toggle.addEventListener('click', () => wrapper.classList.toggle('open'));

      textarea.addEventListener('input', () => {
        const val = textarea.value.trim();
        localStorage.setItem(key, textarea.value);
        wrapper.classList.toggle('has-content', val.length > 0);
      });

      card.appendChild(wrapper);
    });

    // Filter buttons
    contentScroll.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        contentScroll.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applySearch();
      });
    });
  }

  // ── Search + Filter ──
  function applySearch() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const filterBtn = contentScroll.querySelector('.filter-btn.active');
    const filter = filterBtn ? filterBtn.dataset.filter : 'all';
    let anyVisible = false;

    // Category cards (with data-cats)
    contentScroll.querySelectorAll('.category-card').forEach(cat => {
      const cats = cat.dataset.cats || '';
      if (filter !== 'all' && !cats.includes(filter)) { cat.classList.add('hidden'); return; }
      let hit = false;
      cat.querySelectorAll('.stem-item').forEach(s => {
        const match = !query || s.querySelector('.stem-text').textContent.toLowerCase().includes(query);
        s.style.display = match ? '' : 'none';
        if (match) hit = true;
      });
      if (hit) { cat.classList.remove('hidden'); anyVisible = true; }
      else { cat.classList.add('hidden'); }
    });

    // Letter cards (ABC style, no data-cats)
    contentScroll.querySelectorAll('.letter-card').forEach(card => {
      if (!query) { card.style.display = ''; anyVisible = true; return; }
      let hit = false;
      card.querySelectorAll('.stem-item').forEach(s => {
        const match = s.querySelector('.stem-text').textContent.toLowerCase().includes(query);
        s.style.display = match ? '' : 'none';
        if (match) hit = true;
      });
      card.style.display = hit ? '' : 'none';
      if (hit) anyVisible = true;
    });

    const emptyEl = contentScroll.querySelector('.empty-state');
    if (emptyEl) emptyEl.style.display = anyVisible ? 'none' : 'block';
  }

  if (searchInput) searchInput.addEventListener('input', applySearch);

  // ── Mobile sidebar ──
  function closeMobile() { sidebar.classList.remove('open'); }
  if (menuToggle) menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  if (overlay) overlay.addEventListener('click', closeMobile);

  // ── Init ──
  buildNav();
  const hash = window.location.hash.slice(1);
  const startPage = findPage(hash) || findPage(NAV[0]?.pages[0]?.id);
  if (startPage) navigate(startPage.id);

})();

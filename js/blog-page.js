(function () {
  const GRID = document.getElementById("posts-grid");
  const SEARCH = document.getElementById("search");
  const TAG = document.getElementById("tag");

  // HERO
  const HERO = {
    wrap: document.getElementById("blog-hero"),
    title: document.getElementById("hero-title"),
    sub: document.getElementById("hero-sub"),
    cover: document.getElementById("hero-cover"),
    date: document.getElementById("hero-date"),
    read: document.getElementById("hero-read"),
    author: document.getElementById("hero-author"),
    link: document.getElementById("hero-link"),
  };

  // POST VIEW
  const VIEW = {
    wrap: document.getElementById("post-view"),
    title: document.getElementById("post-title"),
    sub: document.getElementById("post-sub"),
    cover: document.getElementById("post-cover"),
    alt: document.getElementById("post-alt"),
    date: document.getElementById("post-date"),
    read: document.getElementById("post-read"),
    author: document.getElementById("post-author"),
    tags: document.getElementById("post-tags"),
    content: document.getElementById("post-content"),
  };

  const PAG = {
    prev: document.getElementById("prev"),
    next: document.getElementById("next"),
    label: document.getElementById("page"),
  };

  const state = {
    all: [],
    filtered: [],
    page: 1,
    pageSize: 6,
  };

  const slugFromURL = new URLSearchParams(location.search).get("post");

  function fmtDate(iso) {
    const d = new Date(iso);
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  }

  function renderHero(post) {
    if (!post) return;
    HERO.title.textContent = post.title;
    HERO.sub.textContent = post.subtitle || post.excerpt || "";
    HERO.cover.src = post.cover || "assets/blog/placeholder-hero.jpg";
    HERO.cover.alt = post.alt || post.title;
    HERO.date.textContent = fmtDate(post.date);
    HERO.read.textContent = post.readTime ? `${post.readTime} min` : "";
    HERO.author.textContent = post.author ? `por ${post.author}` : "";
    HERO.link.href = `blog.html?post=${post.slug}`;
  }

  function renderTagsSelect() {
    const set = new Set();
    state.all.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    TAG.innerHTML =
      `<option value="">Todas as tags</option>` +
      Array.from(set)
        .sort((a, b) => a.localeCompare(b, "pt-BR"))
        .map((t) => `<option value="${t}">${t}</option>`)
        .join("");
  }

  function applyFilters() {
    const q = (SEARCH?.value || "").toLowerCase().trim();
    const tag = TAG?.value || "";
    let list = [...state.all];

    if (tag) list = list.filter((p) => (p.tags || []).includes(tag));
    if (q) {
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.subtitle || "").toLowerCase().includes(q) ||
          (p.excerpt || "").toLowerCase().includes(q) ||
          (p.contentHtml || "").toLowerCase().includes(q)
      );
    }
    state.filtered = list;
    state.page = 1;
    renderGrid();
  }

  function renderGrid() {
    if (!GRID) return;
    GRID.setAttribute("aria-busy", "true");
    GRID.innerHTML = "";

    // paginação
    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;
    const items = state.filtered.slice(start, end);

    if (items.length === 0) {
      GRID.innerHTML = `<p class="muted">Nenhum post encontrado.</p>`;
      renderPagination();
      GRID.setAttribute("aria-busy", "false");
      return;
    }

    const frag = document.createDocumentFragment();
    items.forEach((p) => {
      const card = document.createElement("article");
      card.className = "post-card";
      card.innerHTML = `
        <img src="${p.cover || "assets/blog/placeholder.jpg"}" alt="${
        p.alt || p.title
      }">
        <div class="post-body">
          <div class="post-meta-row">
            <time>${fmtDate(p.date)}</time>
            ${p.readTime ? `<span>${p.readTime} min</span>` : ""}
          </div>
          <h3 class="post-title">${p.title}</h3>
          <p class="post-excerpt">${p.excerpt || p.subtitle || ""}</p>
          <div class="tags">${(p.tags || [])
            .map((t) => `<span class="tag">${t}</span>`)
            .join("")}</div>
        </div>
      <div class="blog-footer">
        <a class="btn btn-outline" href="blog.html?post=${p.slug}">Ler mais →</a>
        ${p.author ? `<small class="muted">Por ${p.author}</small>` : "<span></span>"}
      </div>
      `;
      frag.appendChild(card);
    });

    GRID.appendChild(frag);
    renderPagination();
    GRID.setAttribute("aria-busy", "false");
  }

  function renderPagination() {
    const total = state.filtered.length;
    const pages = Math.max(1, Math.ceil(total / state.pageSize));
    PAG.prev.disabled = state.page <= 1;
    PAG.next.disabled = state.page >= pages;
    PAG.label.textContent = `${state.page}/${pages}`;
  }

  function renderPostView(post) {
    if (!post) return;
    VIEW.title.textContent = post.title;
    VIEW.sub.textContent = post.subtitle || post.excerpt || "";
    VIEW.cover.src = post.cover || "assets/blog/placeholder-hero.jpg";
    VIEW.cover.alt = post.alt || post.title;
    VIEW.alt.textContent = post.alt || "";
    VIEW.date.textContent = fmtDate(post.date);
    VIEW.read.textContent = post.readTime ? `${post.readTime} min` : "";
    VIEW.author.textContent = post.author ? `por ${post.author}` : "";
    VIEW.tags.innerHTML = (post.tags || [])
      .map((t) => `<span class="tag">${t}</span>`)
      .join("");
    VIEW.content.innerHTML = post.contentHtml || "<p>Conteúdo em breve.</p>";
    VIEW.wrap.hidden = false;

    document.querySelector(".blog-hero").style.display = "none";
    document.querySelector(".blog-list").style.display = "none";

    setTimeout(
      () => VIEW.wrap.scrollIntoView({ behavior: "smooth", block: "start" }),
      0
    );
  }

  function attachEvents() {
    SEARCH?.addEventListener("input", debounce(applyFilters, 250));
    TAG?.addEventListener("change", applyFilters);
    PAG.prev?.addEventListener("click", () => {
      state.page--;
      renderGrid();
    });
    PAG.next?.addEventListener("click", () => {
      state.page++;
      renderGrid();
    });
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), ms);
    };
  }

  async function init() {
    try {
      const res = await fetch("data/blog.json", { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao carregar blog.json");
      const data = await res.json();

      state.all = (data.posts || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      state.filtered = [...state.all];

      
      const heroPost = state.all[0];
      renderHero(heroPost);

      renderTagsSelect();
      renderGrid();
      attachEvents();

     
      if (slugFromURL) {
        const p = state.all.find((x) => x.slug === slugFromURL);
        if (p) renderPostView(p);
      }
    } catch (e) {
      if (GRID)
        GRID.innerHTML = `<p class="muted">Não foi possível carregar o blog agora.</p>`;
      console.error(e);
    }
  }

  init();
})();

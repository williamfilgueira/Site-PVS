(function () {
  const GRID_ID = "produtos-grid";
  const JSON_URL = "data/produtos.json";

  const grid = document.getElementById(GRID_ID);
  if (!grid) return;

  const truncate = (txt, len = 140) =>
    txt.length > len ? txt.slice(0, len - 1).trimEnd() + "…" : txt;

  const renderTags = (tags = []) =>
    tags
      .slice(0, 3) // até 3 tags no card
      .map((t) => `<span class="tag" aria-label="tag">${t}</span>`)
      .join("");

  const pageFor = (slug) => `${slug}.html`;

  const onImgError = (ev) => {
    ev.currentTarget.alt = ev.currentTarget.alt || "Imagem do produto";
    ev.currentTarget.decoding = "async";
    ev.currentTarget.src = "assets/placeholder-produto.png"; 
  };

  const makeCard = (p) => {
    const href = pageFor(p.slug);
    const desc = truncate(p.descricao || "");
    const tags = renderTags(p.tags);

    return `
      <article class="product-card" id="${p.id}">
        <a class="product-card__link" href="${href}" aria-label="Ver ${p.titulo}">
          <div class="product-card__media">
            <img src="${p.imagem}"
                 alt="${p.titulo}"
                 loading="lazy"
                 width="480"
                 height="320"
                 onerror="this.onerror=null; this.src='assets/placeholder-produto.png';" />
          </div>
          <div class="product-card__body">
            <h2 class="product-card__title">${p.titulo}</h2>
            <p class="product-card__desc">${desc}</p>
            <div class="product-card__tags">${tags}</div>
            <span class="product-card__cta" aria-hidden="true">Ver detalhes →</span>
          </div>
        </a>
      </article>
    `;
  };

  fetch(JSON_URL, { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error("Falha ao carregar produtos.json");
      return r.json();
    })
    .then((lista) => {
      if (!Array.isArray(lista)) throw new Error("JSON inválido");
      grid.innerHTML = lista.map(makeCard).join("");
    })
    .catch((err) => {
      console.error(err);
      grid.innerHTML = `
        <div class="alert error">
          Não foi possível carregar os produtos agora. Tente novamente mais tarde.
        </div>`;
    });
})();

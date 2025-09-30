const GRID = document.getElementById("cards");
const DATA_URL = "data/produtos.json";

function slugify(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function renderSkeletons(qtd = 6) {
  if (!GRID) return;
  GRID.innerHTML = Array.from({ length: qtd })
    .map(
      () => `
    <article class="card is-loading" aria-busy="true">
      <figure class="card-media skeleton"></figure>
      <div class="card-copy">
        <div class="skeleton line lg"></div>
        <div class="skeleton line"></div>
        <div class="skeleton line short"></div>
      </div>
    </article>
  `
    )
    .join("");
}

function cardTemplate(p) {
  const tags = (p.tags || [])
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");
  const slug = p.slug ? String(p.slug) : slugify(p.titulo);
  const href = `produto.html?slug=${encodeURIComponent(slug)}`;

  return `
    <article class="card">
      <a class="card-link-cover" href="${href}" aria-label="Ver detalhes de ${
    p.titulo
  }"></a>
      <figure class="card-media">
        <img src="${p.imagem}" alt="${p.titulo}" loading="lazy"
             onerror="this.onerror=null;this.src='assets/produtos/_fallback.png';" />
      </figure>
      <div class="card-copy">
        <h3>${p.titulo}</h3>
        <p>${p.descricao ?? ""}</p>
        ${tags ? `<div class="tags">${tags}</div>` : ""}
        <a href="${href}" class="card-link">Ver detalhes</a>
      </div>
    </article>
  `;
}

async function init() {
   if (!GRID) {
    console.debug("[produtos.js] #cards não encontrado: ignorando render nesta página.");
    return;
  }
  try {
    renderSkeletons();
    const res = await fetch(DATA_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Erro ao carregar ${DATA_URL}`);
    const produtos = await res.json();

    if (!Array.isArray(produtos) || produtos.length === 0) {
      GRID.innerHTML = `<p style="grid-column:1/-1">Nenhum produto cadastrado no momento.</p>`;
      return;
    }

    GRID.innerHTML = produtos.map(cardTemplate).join("");
  } catch (e) {
    console.error(e);
    if (GRID) {
      GRID.innerHTML = `
        <div class="alert" role="status">
          Não foi possível carregar os produtos agora. Tente novamente mais tarde.
        </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", init);
console.log("Página de produtos carregada.");

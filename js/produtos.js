const GRID = document.getElementById("cards");
const DATA_URL = "data/produtos.json";

// skeletons (efeito carregando)
function renderSkeletons(qtd = 6) {
  GRID.innerHTML = Array.from({ length: qtd }).map(() => `
    <article class="card is-loading" aria-busy="true">
      <figure class="card-media skeleton"></figure>
      <div class="card-copy">
        <div class="skeleton line lg"></div>
        <div class="skeleton line"></div>
        <div class="skeleton line short"></div>
      </div>
    </article>
  `).join("");
}

// card HTML
function cardTemplate(p) {
  const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join("");
  return `
    <article class="card">
      <figure class="card-media">
        <img src="${p.imagem}" alt="${p.titulo}" loading="lazy"
             onerror="this.onerror=null;this.src='assets/produtos/_fallback.jpg';" />
      </figure>
      <div class="card-copy">
        <h3>${p.titulo}</h3>
        <p>${p.descricao}</p>
        ${tags ? `<div class="tags">${tags}</div>` : ""}
        <a href="#" class="card-link" aria-label="Ver detalhes de ${p.titulo}">Ver detalhes</a>
      </div>
    </article>
  `;
}

// init
async function init() {
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
    GRID.innerHTML = `
      <div class="alert" role="status">
        Não foi possível carregar os produtos agora. Tente novamente mais tarde.
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", init);
console.log("Dados de produtos carregados com sucesso.");

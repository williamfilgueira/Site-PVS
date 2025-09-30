const DATA_URL = "data/produtos.json";

function slugify(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function specsTable(especificacoes) {
  if (!especificacoes) return "";
  if (
    Array.isArray(especificacoes?.linhas) &&
    Array.isArray(especificacoes?.cabecalhos)
  ) {
    const thead = `<thead><tr>${especificacoes.cabecalhos
      .map((h) => `<th>${h}</th>`)
      .join("")}</tr></thead>`;
    const tbody = `<tbody>${especificacoes.linhas
      .map((l) => `<tr>${l.map((c) => `<td>${c}</td>`).join("")}</tr>`)
      .join("")}</tbody>`;
    return `<table class="specs">${thead}${tbody}</table>`;
  }
  if (Array.isArray(especificacoes) && especificacoes.length) {
    const headers = Object.keys(especificacoes[0]);
    const thead = `<thead><tr>${headers
      .map((h) => `<th>${h}</th>`)
      .join("")}</tr></thead>`;
    const tbody = `<tbody>${especificacoes
      .map(
        (row) =>
          `<tr>${headers.map((h) => `<td>${row[h] ?? ""}</td>`).join("")}</tr>`
      )
      .join("")}</tbody>`;
    return `<table class="specs">${thead}${tbody}</table>`;
  }
  if (typeof especificacoes === "object") {
    const rows = Object.entries(especificacoes)
      .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
      .join("");
    return `<table class="specs"><tbody>${rows}</tbody></table>`;
  }
  return "";
}

async function initProduto() {
  const slugParam = getParam("slug");
  const $wrap = document.getElementById("produtoWrap");
  const $media = document.getElementById("produtoMedia");
  const $title = document.getElementById("produtoTitulo");
  const $desc = document.getElementById("produtoDesc");
  const $tags = document.getElementById("produtoTags");
  const $crumb = document.getElementById("crumbAtual");
  const $specsSec = document.getElementById("specsSec");
  const $specsWrap = document.getElementById("specsWrap");

  if (!slugParam) {
    $title.textContent = "Produto não encontrado";
    $desc.textContent = "Faltou o parâmetro ?slug= na URL.";
    $wrap?.setAttribute("aria-busy", "false");
    return;
  }

  try {
    const res = await fetch(DATA_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error("Falha ao carregar dados");
    const itens = await res.json();

    const produto = itens.find(
      (p) => (p.slug ?? slugify(p.titulo)) === slugParam
    );

    if (!produto) {
      $title.textContent = "Produto não encontrado";
      $desc.textContent = "Verifique o link ou volte para a lista de produtos.";
      $wrap?.setAttribute("aria-busy", "false");
      return;
    }

    $title.textContent = produto.titulo;
    $crumb.textContent = produto.titulo;
    $desc.textContent = produto.descricao ?? "";

    const img = document.createElement("img");
    img.alt = produto.titulo;
    img.loading = "lazy";
    img.src = produto.imagem || "assets/produtos/_fallback.png";
    img.onerror = () => {
      img.src = "assets/produtos/_fallback.png";
    };
    $media.innerHTML = "";
    $media.appendChild(img);

    $tags.innerHTML = (produto.tags || [])
      .map((t) => `<span class="tag">${t}</span>`)
      .join("");

    const tableHtml = specsTable(produto.especificacoes || produto.specs);
    if (tableHtml) {
      $specsWrap.innerHTML = tableHtml;
      $specsSec.style.display = "";

      const modalBody = document.getElementById("specsModalBody");
      modalBody.innerHTML = `<div id="specsModalTableWrap">${tableHtml}</div>`;

      const modal = document.getElementById("specsModal");
      const btnOpen = document.getElementById("openSpecs");
      const btnClose = document.getElementById("closeSpecs");
      const btnClose2 = document.getElementById("closeSpecs2");
      const backdrop = modal.querySelector("[data-close]");

      const open = () => {
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.documentElement.style.overflow = "hidden";
        btnClose.focus();
      };
      const close = () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.documentElement.style.overflow = "";
        btnOpen.focus();
      };

      btnOpen?.addEventListener("click", open);
      btnClose?.addEventListener("click", close);
      btnClose2?.addEventListener("click", close);
      backdrop?.addEventListener("click", close);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) close();
      });
    }
  } catch (err) {
    console.error(err);
    $title.textContent = "Ocorreu um erro ao carregar este produto.";
    $desc.textContent = "Tente novamente mais tarde.";
  } finally {
    $wrap?.setAttribute("aria-busy", "false");
  }
}

document.addEventListener("DOMContentLoaded", initProduto);

(function () {
  const btn = document.querySelector(".hamburger");
  const menu = document.getElementById("site-menu");

  if (!btn || !menu) return;

  const backdrop = document.createElement("div");
  backdrop.className = "mobile-backdrop";
  document.body.appendChild(backdrop);

  function openMenu() {
    btn.classList.add("is-active");
    btn.setAttribute("aria-expanded", "true");
    menu.classList.add("is-open");
    document.body.classList.add("menu-open");
    backdrop.classList.add("show");
  }

  function closeMenu() {
    btn.classList.remove("is-active");
    btn.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    backdrop.classList.remove("show");
  }

  function toggleMenu() {
    if (menu.classList.contains("is-open")) closeMenu();
    else openMenu();
  }

  btn.addEventListener("click", toggleMenu);
  backdrop.addEventListener("click", closeMenu);

  menu.addEventListener("click", (e) => {
    const target = e.target;
    if (target.tagName === "A") closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
  });
})();

(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || typeof ScrollReveal === "undefined") return;

  const sr = ScrollReveal({
    origin: "bottom",
    distance: "40px",
    duration: 800,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    opacity: 0,
    reset: true,
    cleanup: true,
    viewOffset: { top: 80, right: 0, bottom: 0, left: 0 } 
  });

  // = HERO =====
  sr.reveal(".hero-title", { delay: 80 });
  sr.reveal(".hero-sub", { delay: 160 });
  sr.reveal(".hero-cta .btn", { delay: 240, interval: 120 });
  sr.reveal(".hero-metrics li", { delay: 320, interval: 80 });
  sr.reveal(".hero-down", { delay: 500, distance: "20px" });

  // ==SOBRE =====
  sr.reveal(".section-about .about-copy h2", { delay: 80 });
  sr.reveal(".section-about .about-copy p", { delay: 140, interval: 120 });
  sr.reveal(".section-about .feat", { delay: 240, interval: 100 });
  sr.reveal(".section-about .about-media img", { delay: 200 });
  sr.reveal(".section-about .about-stats .stat", { delay: 280, interval: 120 });

  // ===== PRODUTOS =====
  sr.reveal(".section-products .products-head > *", { delay: 80, interval: 120 });
  sr.reveal(".section-products .product-card", { delay: 160, interval: 140, viewFactor: 0.2 });
  sr.reveal(".section-products .more-products", { delay: 200 });

  // ===== DIFERENCIAIS =
  sr.reveal(".section-diffs .diffs-head > *", { delay: 80, interval: 120 });
  sr.reveal(".section-diffs .diff-card", { delay: 160, interval: 100 });
  sr.reveal(".section-diffs .diff-cta h3", { delay: 120 });
  sr.reveal(".section-diffs .diff-cta p", { delay: 180 });
  sr.reveal(".section-diffs .diff-bullets li", { delay: 240, interval: 80 });
  sr.reveal(".section-diffs .diff-cta .btn", { delay: 360 });

  // ===== BLOG =====
  sr.reveal(".section-blog-promo .promo-media", { delay: 80 });
  sr.reveal(".section-blog-promo .promo-copy > *", { delay: 140, interval: 100 });

  // ===== CONTATO =====
  sr.reveal(".section-contact .contact-head > *", { delay: 80, interval: 120 });
  sr.reveal(".section-contact .contact-cta", { delay: 160 });
  sr.reveal(".section-contact .cta-actions .btn", { delay: 220, interval: 100 });
  sr.reveal(".section-contact .contact-map", { delay: 260 });
  sr.reveal(".section-contact .info-card", { delay: 200, interval: 100 });

  // ===== FOOTER ===
  sr.reveal(".site-footer .footer-brand", { delay: 80 });
  sr.reveal(".site-footer .footer-col", { delay: 140, interval: 120 });
  sr.reveal(".footer-bottom", { delay: 220 });

  // =====  WhatsApp =====
  sr.reveal(".whats-fab", { delay: 200, distance: "20px" });

  
})();

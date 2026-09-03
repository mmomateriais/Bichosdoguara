/* =====================================================================
   BICHOS DO GUARÁ — main.js
   Mobile nav toggle · scroll reveals (IntersectionObserver) · footer year
   Deliberately light: no scroll-jacking, no pinned sections — the
   layout doesn't need it and it keeps the site fast and robust.
   ===================================================================== */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav toggle ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("is-open");
    navToggle && navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
  }
  document.querySelectorAll('.nav__links a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ---------- Scroll reveals ---------- */
  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  if (prefersReduced) {
    revealItems.forEach((el) => el.classList.add("is-in"));
  } else {
    const groups = document.querySelectorAll("[data-reveal-group]");
    const grouped = new Set();
    groups.forEach((group) => {
      const kids = Array.from(group.querySelectorAll("[data-reveal]"));
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          kids.forEach((k, i) => setTimeout(() => k.classList.add("is-in"), i * 90));
          io.unobserve(group);
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
      io.observe(group);
      kids.forEach((k) => grouped.add(k));
    });

    const ungrouped = revealItems.filter((el) => !grouped.has(el));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    ungrouped.forEach((el) => io.observe(el));
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

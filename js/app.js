(() => {
  const C = window.TTM || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- links from config ---------- */
  $$("[data-reviews]").forEach(a => (a.href = C.reviews || C.maps));
  $$("[data-directions]").forEach(a => (a.href = C.maps));
  $$("[data-facebook]").forEach(a => (a.href = C.facebook));
  $$("[data-wa-direct]").forEach(a => (a.href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent("Hello Tiny Tot, I'd like to ask about admissions.")}`));

  /* ---------- nav hides on scroll down, dock appears after the hero ---------- */
  const nav = $("[data-nav]");
  const hero = $(".hero");
  const dock = $("[data-dock]");
  const toys = $$("[data-float]");
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    const y = scrollY;
    const heroH = hero.offsetHeight;
    const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (y > 240 && goingDown) nav.classList.add("is-hidden");
    else if (goingUp || y < 240) nav.classList.remove("is-hidden");
    dock && dock.classList.toggle("is-up", y > heroH * 0.6);
    // gentle parallax on the floating toys while the hero is on screen
    if (!reduce && y < heroH * 1.2) toys.forEach(t => t.style.setProperty("--py", (y * parseFloat(t.dataset.float)).toFixed(1) + "px"));
    lastY = y; ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* current section in nav */
  const navLinks = $$(".nav-links a");
  const secObs = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["about", "learning", "year", "teachers", "visit"].forEach(id => { const el = document.getElementById(id); el && secObs.observe(el); });

  /* ---------- menu sheet ---------- */
  const sheet = $("[data-sheet]");
  const openBtn = $("[data-menu-open]");
  let lastFocus = null;
  const openSheet = () => {
    lastFocus = document.activeElement;
    sheet.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add("is-open")));
    openBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("[data-menu-close]").focus(), 50);
  };
  const closeSheet = () => {
    sheet.classList.remove("is-open");
    openBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    const done = () => { if (!sheet.classList.contains("is-open")) sheet.hidden = true; };
    reduce ? done() : setTimeout(done, 430);
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  };
  openBtn.addEventListener("click", openSheet);
  $("[data-menu-close]").addEventListener("click", closeSheet);
  sheet.addEventListener("click", e => { if (e.target === sheet) closeSheet(); });
  $$("a", sheet).forEach(a => a.addEventListener("click", closeSheet));
  addEventListener("keydown", e => { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });
  addEventListener("resize", () => { if (innerWidth > 1020 && !sheet.hidden) closeSheet(); });

  /* ---------- hero ---------- */
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("is-in")));
  const hv = $("[data-hero-video]");
  const hp = $("[data-hero-pause]");
  const setPaused = p => { hp.classList.toggle("is-paused", p); hp.setAttribute("aria-label", p ? "Play background video" : "Pause background video"); };
  if (reduce) { hv.removeAttribute("autoplay"); hv.pause(); setPaused(true); }
  hp.addEventListener("click", () => {
    if (hv.paused) { hv.play().catch(() => {}); setPaused(false); }
    else { hv.pause(); setPaused(true); }
  });
  new IntersectionObserver(([e]) => {
    if (hp.classList.contains("is-paused")) return;
    e.isIntersecting ? hv.play().catch(() => {}) : hv.pause();
  }).observe($(".hero-frame"));

  /* ---------- reveals (classes are added by JS so the page works without it) ---------- */
  const reveal = (els, margin = "0px 0px -10% 0px") => {
    els.forEach(el => el.classList.add("is-pending"));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.remove("is-pending"); io.unobserve(e.target);
      // drop the stagger delay once revealed so hover and press feedback is instant
      setTimeout(() => e.target.classList.add("is-done"), 1300);
    }), { rootMargin: margin });
    els.forEach(el => io.observe(el));
  };
  const polas = $$(".pola");
  polas.forEach((p, i) => p.style.setProperty("--i", i % 6));
  if (!reduce) { reveal($$("[data-reveal]")); reveal(polas, "0px 0px -6% 0px"); }
  else polas.forEach(p => p.classList.add("is-done"));

  /* ---------- learning cards: arrows scroll by one card ---------- */
  const track = $("[data-cards]");
  const arrows = $$("[data-car]");
  const step = () => { const c = $(".card", track); return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 20) : 320; };
  arrows.forEach(b => b.addEventListener("click", () => track.scrollBy({ left: step() * +b.dataset.car, behavior: reduce ? "auto" : "smooth" })));
  const syncArrows = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    arrows[0].disabled = track.scrollLeft <= 2;
    arrows[1].disabled = track.scrollLeft >= max;
  };
  track.addEventListener("scroll", () => requestAnimationFrame(syncArrows), { passive: true });
  addEventListener("resize", syncArrows);
  syncArrows();

  /* ---------- review stamp carousel ---------- */
  const slides = $$(".stamp-slides .slide");
  const count = $("[data-rev-count]");
  let cur = 0;
  const show = i => {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-on", k === cur));
    count.textContent = `${cur + 1} / ${slides.length}`;
  };
  $$("[data-rev]").forEach(b => b.addEventListener("click", () => show(cur + +b.dataset.rev)));

  /* ---------- film dialog ---------- */
  const film = $("[data-film]");
  const fv = $("[data-film-video]");
  let heroWasPlaying = false;
  $$("[data-film-open]").forEach(b => b.addEventListener("click", () => {
    heroWasPlaying = !hv.paused;
    if (typeof film.showModal === "function") film.showModal(); else film.setAttribute("open", "");
    hv.pause();
    fv.play().catch(() => {});
  }));
  const closeFilm = () => { fv.pause(); film.open && film.close ? film.close() : film.removeAttribute("open"); };
  $("[data-film-close]").addEventListener("click", closeFilm);
  film.addEventListener("click", e => { if (e.target === film) closeFilm(); });
  film.addEventListener("close", () => { fv.pause(); if (heroWasPlaying) hv.play().catch(() => {}); });

  /* ---------- map (loads Google only on request) ---------- */
  const mapBtn = $("[data-map-load]");
  mapBtn && mapBtn.addEventListener("click", () => {
    const f = document.createElement("iframe");
    f.src = C.mapEmbed; f.title = "Map of Tiny Tot Montessori, Gonapinuwala"; f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    $("[data-map]").appendChild(f);
    mapBtn.remove();
  });

  /* ---------- confetti in the crest colours ---------- */
  const cv = $("[data-confetti]");
  const burst = (x, y) => {
    if (reduce || !cv.getContext) return;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = ["#D9147A", "#FFC93C", "#5FA82A", "#2F8FD8", "#FF8FC4", "#ffffff"];
    const parts = Array.from({ length: 150 }, () => {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25;
      const v = 7 + Math.random() * 11;
      return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 6 + Math.random() * 7, h: 8 + Math.random() * 10, r: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.4, c: cols[(Math.random() * cols.length) | 0], round: Math.random() < 0.3 };
    });
    const t0 = performance.now();
    const tick = now => {
      const t = now - t0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(p => {
        p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.32; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - 1700) / 700);
        ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, 6.3); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 2);
        ctx.restore();
      });
      if (t < 2400) requestAnimationFrame(tick); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- admission pass → WhatsApp / email ---------- */
  const form = $("[data-enrol]");
  const status = $("[data-status]");
  const claimBtn = $("[data-claim]");
  const compose = () => {
    const d = new FormData(form);
    const g = k => (d.get(k) || "").toString().trim();
    const lines = [
      "Hello Tiny Tot Montessori,",
      "",
      `I'm ${g("parent")} and I'd like to claim a seat${g("child") ? ` for ${g("child")}` : " for my child"}${g("age") ? ` (${g("age")})` : ""}.`,
      "Could we arrange a visit?",
      `My phone: ${g("phone")}`,
      g("message") ? `\n${g("message")}` : ""
    ].filter(l => l !== "");
    return lines.join("\n");
  };
  const validate = () => {
    let ok = true;
    ["parent", "phone"].forEach(n => {
      const el = form.elements[n];
      const bad = !el.value.trim() || (n === "phone" && el.value.replace(/\D/g, "").length < 9);
      el.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad && ok) { el.focus(); ok = false; }
    });
    status.className = "form-status";
    if (!ok) { status.textContent = "Please add your name and a phone number we can call back."; status.classList.add("is-error"); }
    return ok;
  };
  const celebrate = () => {
    form.classList.remove("is-claimed");
    void form.offsetWidth; // restart the stamp if they claim twice
    form.classList.add("is-claimed");
    $(".claim-txt", claimBtn).textContent = "Seat requested ✓";
    const r = claimBtn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2);
  };
  form.addEventListener("input", e => { if (e.target.getAttribute("aria-invalid") === "true") e.target.setAttribute("aria-invalid", "false"); });
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validate()) return;
    celebrate();
    const url = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(compose())}`;
    // open the tab inside the click so pop-up blockers allow it, then let the stamp land on this page
    const w = window.open(url, "_blank");
    if (w) w.opener = null; else setTimeout(() => (location.href = url), reduce ? 0 : 900);
    status.textContent = "Lovely! WhatsApp is opening with your message. Press send there and we’ll call you back.";
    status.classList.add("is-ok");
  });
  $("[data-mail]").addEventListener("click", e => {
    e.preventDefault();
    if (!validate()) return;
    celebrate();
    const url = `mailto:${C.email}?subject=${encodeURIComponent("Claiming a seat at Tiny Tot")}&body=${encodeURIComponent(compose())}`;
    setTimeout(() => (location.href = url), reduce ? 0 : 900);
    status.textContent = "Lovely! Your email app is opening with the message.";
    status.className = "form-status is-ok";
  });
})();

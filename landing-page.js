(function () {
  "use strict";

  /* CONTATOS: altere aqui */
  var CSB_WHATSAPP_NUMBER = "5513974182734";
  var CSB_INSTAGRAM_URL = ""; // ex.: "https://www.instagram.com/seuperfil/" (vazio = ícone escondido)

  /* MENSAGENS DO WHATSAPP: uma por botão (atributo data-csb-msg) */
  var CSB_MESSAGES = {
    geral: "Olá! Gostaria de solicitar um orçamento.",
    landing: "Olá! Gostaria de mais informações sobre Landing Page.",
    site: "Olá! Gostaria de mais informações sobre site institucional.",
    ecommerce: "Olá! Gostaria de mais informações sobre loja virtual.",
    redesign: "Olá! Gostaria de mais informações sobre redesign de site.",
    desconto: "Olá! Gostaria de saber mais sobre a condição especial para o primeiro projeto."
  };

  var CSB_CAROUSEL_SPEED = 38;

  var root = document.getElementById("csb-site");
  if (!root || root.getAttribute("data-csb-ready")) return;
  root.setAttribute("data-csb-ready", "1");
  root.classList.add("csb-js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || root).querySelectorAll(sel)); }
  function $(sel) { return root.querySelector(sel); }

  var phone = String(CSB_WHATSAPP_NUMBER).replace(/\D/g, "");
  $all("[data-csb-msg]").forEach(function (a) {
    if (!phone) return;
    var msg = CSB_MESSAGES[a.getAttribute("data-csb-msg")] || CSB_MESSAGES.geral;
    a.href = "https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(msg);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });
  $all("[data-csb-instagram]").forEach(function (a) {
    if (!CSB_INSTAGRAM_URL) return;
    a.href = CSB_INSTAGRAM_URL;
    a.hidden = false;
  });
  $all("[data-csb-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var header = $(".csb-header");
  var nav = $(".csb-nav");
  var burger = $(".csb-burger");
  var floatBtn = $(".csb-float");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  burger.addEventListener("click", function () {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      burger.focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 960) setMenu(false);
  });

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.pageYOffset;
      header.classList.toggle("is-scrolled", y > 12);
      floatBtn.classList.toggle("is-visible", y > window.innerHeight * 0.6);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  $all('a[href^="#csb-"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = root.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  var navLinks = $all(".csb-nav__link");
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (l) {
        l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navLinks.forEach(function (l) {
    var s = root.querySelector(l.getAttribute("href"));
    if (s) sectionObserver.observe(s);
  });

  var reveals = $all(".csb-reveal");
  reveals.forEach(function (el) {
    var siblings = $all(":scope > .csb-reveal", el.parentNode);
    var i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--csb-delay", Math.min(i * 0.08, 0.4) + "s");
  });
  if (reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  var hero = $(".csb-hero");
  var layers = $all("[data-csb-depth]");
  if (finePointer && !reduceMotion) {
    var raf = 0, mx = 0, my = 0;
    var applyParallax = function () {
      raf = 0;
      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute("data-csb-depth"));
        el.style.translate = (mx * d).toFixed(1) + "px " + (my * d).toFixed(1) + "px";
      });
    };
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = window.requestAnimationFrame(applyParallax);
    });
    hero.addEventListener("pointerleave", function () {
      mx = 0; my = 0;
      if (!raf) raf = window.requestAnimationFrame(applyParallax);
    });
    layers.forEach(function (el) { el.style.transition = "translate .6s cubic-bezier(.2,.7,.2,1)"; });
  }

  var carousel = $(".csb-carousel");
  var vp = $(".csb-carousel__viewport");
  var track = $(".csb-carousel__track");
  var originals = $all(".csb-work", track);

  originals.forEach(function (li) {
    var clone = li.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("data-csb-clone", "");
    $all("img", clone).forEach(function (img) { img.alt = ""; });
    track.appendChild(clone);
  });

  var half = 0, pos = 0, last = 0, anim = null;
  var hover = false, focus = false, touching = false, visible = true, holdUntil = 0;

  function measure() {
    half = track.querySelector("[data-csb-clone]").offsetLeft - originals[0].offsetLeft;
  }
  function step() {
    return originals[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
  }
  function setScroll(x) {
    vp.scrollLeft = x;
    pos = x;
  }
  function wrap() {
    if (vp.scrollLeft >= half) setScroll(vp.scrollLeft - half);
    else if (vp.scrollLeft <= 0) setScroll(vp.scrollLeft + half);
  }
  function paused() {
    return reduceMotion || hover || focus || touching || !visible || Date.now() < holdUntil;
  }

  function tick(t) {
    var dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;
    if (anim) {
      var p = anim.dur ? Math.min(1, (t - anim.t0) / anim.dur) : 1;
      pos = anim.from + (anim.to - anim.from) * (1 - Math.pow(1 - p, 3));
      vp.scrollLeft = pos;
      if (p >= 1) {
        anim = null;
        if (pos >= half) setScroll(pos - half);
      }
    } else if (!paused() && half > 0) {
      pos += CSB_CAROUSEL_SPEED * dt;
      if (pos >= half) pos -= half;
      vp.scrollLeft = pos;
    }
    window.requestAnimationFrame(tick);
  }

  vp.addEventListener("scroll", function () {
    if (anim || Math.abs(vp.scrollLeft - pos) < 2) return;
    pos = vp.scrollLeft;
    wrap();
  }, { passive: true });

  carousel.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hover = true; });
  carousel.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") { hover = false; pos = vp.scrollLeft; } });
  carousel.addEventListener("focusin", function () { focus = true; });
  carousel.addEventListener("focusout", function () { focus = false; pos = vp.scrollLeft; });
  vp.addEventListener("touchstart", function () { touching = true; }, { passive: true });
  vp.addEventListener("touchend", function () {
    touching = false;
    holdUntil = Date.now() + 2500;
  }, { passive: true });

  var dragging = false, moved = false, startX = 0, startScroll = 0;
  vp.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    startScroll = vp.scrollLeft;
  });
  window.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 5) { moved = true; vp.classList.add("is-dragging"); }
    if (!moved) return;
    vp.scrollLeft = startScroll - dx;
    if (vp.scrollLeft >= half) { startScroll -= half; vp.scrollLeft -= half; }
    else if (vp.scrollLeft <= 0) { startScroll += half; vp.scrollLeft += half; }
    pos = vp.scrollLeft;
  });
  window.addEventListener("pointerup", function () {
    dragging = false;
    vp.classList.remove("is-dragging");
  });

  function go(dir) {
    if (half <= 0) return;
    holdUntil = Date.now() + 2500;
    var s = step();
    var from = anim ? anim.to : vp.scrollLeft;
    if (from >= half) from -= half;
    if (dir < 0 && from < s) from += half;
    setScroll(from);
    anim = { from: from, to: from + dir * s, t0: performance.now(), dur: reduceMotion ? 0 : 550 };
  }
  $("[data-csb-prev]").addEventListener("click", function () { go(-1); });
  $("[data-csb-next]").addEventListener("click", function () { go(1); });
  vp.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  });

  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) pos = vp.scrollLeft;
  }).observe(carousel);

  measure();
  window.addEventListener("resize", function () { measure(); pos = vp.scrollLeft; wrap(); });
  window.requestAnimationFrame(tick);
})();

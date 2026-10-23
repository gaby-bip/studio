/* ============================================================
   LANDING PAGE — JavaScript puro (sem jQuery, sem build)
   Inicializa apenas dentro de #ss-landing.
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     ⚙️ CONFIGURAÇÃO ÚNICA — EDITE APENAS ESTE BLOCO
     ============================================================
     Substitua o valor de SS_WHATSAPP_URL pelo seu link do WhatsApp.
     Exemplo: "https://wa.me/5511999999999"
     (55 = Brasil, 11 = DDD, 999999999 = número, sem espaços/traços)
     Enquanto não configurar, os botões apontam para "#" (marcador).
     ============================================================ */
  var SS_WHATSAPP_URL = "#"; // <-- COLOQUE SEU LINK DO WHATSAPP AQUI

  // Mensagens pré-preenchidas por serviço (podem ser personalizadas)
  var SS_MESSAGES = {
    geral: "Olá! Vim pelo site e gostaria de conversar sobre um projeto.",
    landing: "Olá! Tenho interesse em criar uma Landing Page.",
    ecommerce: "Olá! Tenho interesse em criar um E-commerce.",
    site: "Olá! Tenho interesse em um Site Personalizado."
  };

  /* Aplica os links de contato em todos os CTAs.
     Cada CTA declara data-ss-msg="landing|ecommerce|site|geral". */
  function applyContactLinks(root) {
    var links = root.querySelectorAll("[data-ss-msg]");
    for (var i = 0; i < links.length; i++) {
      var key = links[i].getAttribute("data-ss-msg") || "geral";
      var msg = SS_MESSAGES[key] || SS_MESSAGES.geral;
      if (SS_WHATSAPP_URL && SS_WHATSAPP_URL !== "#") {
        links[i].setAttribute(
          "href",
          SS_WHATSAPP_URL +
            (SS_WHATSAPP_URL.indexOf("?") > -1 ? "&" : "?") +
            "text=" +
            encodeURIComponent(msg)
        );
        links[i].setAttribute("target", "_blank");
        links[i].setAttribute("rel", "noopener noreferrer");
      } else {
        links[i].setAttribute("href", "#");
        links[i].removeAttribute("target");
        links[i].removeAttribute("rel");
      }
    }
  }

  /* ============================================================
     TEMA: Light | Dark | Automático
     - Automático: 06:00–18:59 = Light | 19:00–05:59 = Dark
     - Persistência via localStorage (com fallback em memória)
     - Recalcula a cada minuto e quando a aba volta a ficar visível
     ============================================================ */

  var STORAGE_KEY = "ss-theme-preference"; // "light" | "dark" | "auto"

  // Fallback seguro quando localStorage está indisponível
  var memoryStore = { value: null };
  var store = {
    get: function () {
      try {
        return window.localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        return memoryStore.value;
      }
    },
    set: function (val) {
      try {
        window.localStorage.setItem(STORAGE_KEY, val);
      } catch (e) {
        memoryStore.value = val;
      }
    },
    remove: function () {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        memoryStore.value = null;
      }
    }
  };

  // Retorna "light" ou "dark" conforme o horário local do navegador
  function themeByTime() {
    var hour = new Date().getHours(); // 0–23, horário local
    return hour >= 6 && hour <= 18 ? "light" : "dark";
  }

  // Preferência salva + horário -> tema efetivo
  function effectiveTheme(preference) {
    if (preference === "light" || preference === "dark") return preference;
    return themeByTime();
  }

  function setThemeAttr(root, theme) {
    root.setAttribute("data-ss-theme", theme);
    root.setAttribute("data-ss-theme-effective", theme);
  }

  // Marca o botão ativo do seletor
  function syncThemeButtons(root, preference) {
    var btns = root.querySelectorAll(".ss-theme__btn");
    for (var i = 0; i < btns.length; i++) {
      var active = btns[i].getAttribute("data-ss-theme-choice") === preference;
      btns[i].setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  function applyTheme(root, preference) {
    setThemeAttr(root, effectiveTheme(preference));
    syncThemeButtons(root, preference);
  }

  function initTheme(root) {
    // Aplica imediatamente (o CSS já evita transição até .ss-ready)
    var saved = store.get();
    applyTheme(root, saved || "auto");

    // Clique no seletor de tema
    root.addEventListener("click", function (ev) {
      var btn = ev.target.closest ? ev.target.closest(".ss-theme__btn") : null;
      if (!btn || !root.contains(btn)) return;
      var choice = btn.getAttribute("data-ss-theme-choice");
      if (!choice) return;

      if (choice === "auto") {
        store.remove(); // remove preferência manual
      } else {
        store.set(choice);
      }
      applyTheme(root, store.get() || "auto");
    });

    // Recalcula o tema a cada minuto (modo automático)
    setInterval(function () {
      if ((store.get() || "auto") === "auto") {
        applyTheme(root, "auto");
      }
    }, 60000);

    // Recalcula quando a página volta a ficar visível
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && (store.get() || "auto") === "auto") {
        applyTheme(root, "auto");
      }
    });
  }

  /* ============================================================
     MENU MOBILE
     ============================================================ */
  function initMobileMenu(root) {
    var toggle = root.querySelector(".ss-menu-toggle");
    var nav = root.querySelector(".ss-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("ss-nav--open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Fecha o menu ao clicar em um link
    nav.addEventListener("click", function (ev) {
      if (ev.target.closest && ev.target.closest("a")) {
        nav.classList.remove("ss-nav--open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Fecha com tecla Escape
    root.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && nav.classList.contains("ss-nav--open")) {
        nav.classList.remove("ss-nav--open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ============================================================
     ANIMAÇÕES LEVES DE ENTRADA (IntersectionObserver)
     ============================================================ */
  function initReveals(root) {
    var items = root.querySelectorAll(".ss-reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add("ss-visible");
      }
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        for (var j = 0; j < entries.length; j++) {
          if (entries[j].isIntersecting) {
            entries[j].target.classList.add("ss-visible");
            observer.unobserve(entries[j].target);
          }
        }
      },
      { threshold: 0.15 }
    );

    for (var k = 0; k < items.length; k++) {
      observer.observe(items[k]);
    }
  }

  /* ============================================================
      FAQ (ACORDEÃO)
      - Usa <details>/<summary> nativos (sem dependências)
      - Apenas uma pergunta aberta por vez
      - Compatível com Elementor (inicialização idempotente)
      ============================================================ */
  function initFaq(root) {
    var faq = root.querySelector("#ss-faq");
    if (!faq || faq.getAttribute("data-ss-faq-init") === "true") return;
    faq.setAttribute("data-ss-faq-init", "true");

    var items = faq.querySelectorAll("details.ss-faq__item");

    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener("toggle", (function (item) {
        return function () {
          if (!item.open) return;
          for (var j = 0; j < items.length; j++) {
            if (items[j] !== item) {
              items[j].open = false;
            }
          }
        };
      })(items[i]));
    }
  }

  /* ============================================================
     INICIALIZAÇÃO
     Roda para cada instância de #ss-landing na página.
     ============================================================ */
  function init() {
    var roots = document.querySelectorAll("#ss-landing");
    for (var i = 0; i < roots.length; i++) {
      var root = roots[i];
      if (root.getAttribute("data-ss-init") === "true") continue; // evita dupla inicialização
      root.setAttribute("data-ss-init", "true");

      applyContactLinks(root);
      initTheme(root);
      initMobileMenu(root);
      initReveals(root);
      initFaq(root);

      // Ano automático no copyright
      var yearEl = root.querySelector("[data-ss-year]");
      if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
      }

      // Habilita transições só depois do tema definido (anti-flash)
      requestAnimationFrame(function (el) {
        return function () {
          el.classList.add("ss-ready");
        };
      }(root));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ============================================================
   WS WEBSTUDIO — Página do serviço Landing Page
   JavaScript puro (sem jQuery, sem build).
   Encapsulado em IIFE; inicializa apenas dentro de
   #ws-landing-page, sem conflitar com outros scripts.
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     ⚙️ CONFIGURAÇÃO — EDITE APENAS ESTE BLOCO
     ============================================================
     1) INTEGRAÇÃO DE ENVIO (futura):
        Quando houver backend ou serviço de formulários (ex.:
        Formspree, WPForms, endpoint próprio), implemente a função
        `submitLead` mais abaixo. Enquanto isso, o formulário apenas
        valida no navegador e exibe o popup de agradecimento.

     2) TEMA:
        Esta página compartilha a MESMA chave de localStorage do site
        principal ("ss-theme-preference"), para respeitar a escolha
        Light / Dark / Auto feita pelo visitante em qualquer página.
     ============================================================ */

  var THEME_STORAGE_KEY = "ss-theme-preference"; // mesma chave do site principal
  var CAROUSEL_INTERVAL_MS = 6000; // intervalo do autoplay (comfortável)

  /* ============================================================
     TEMA: Light | Dark | Auto (mesmo comportamento do site principal)
     - Auto: 06:00–18:59 = Light | 19:00–05:59 = Dark
     ============================================================ */

  var memoryStore = { value: null };
  var store = {
    get: function () {
      try {
        return window.localStorage.getItem(THEME_STORAGE_KEY);
      } catch (e) {
        return memoryStore.value;
      }
    },
    set: function (val) {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, val);
      } catch (e) {
        memoryStore.value = val;
      }
    },
    remove: function () {
      try {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      } catch (e) {
        memoryStore.value = null;
      }
    }
  };

  function themeByTime() {
    var hour = new Date().getHours();
    return hour >= 6 && hour <= 18 ? "light" : "dark";
  }

  function effectiveTheme(preference) {
    if (preference === "light" || preference === "dark") return preference;
    return themeByTime();
  }

  function syncThemeButtons(root, preference) {
    var btns = root.querySelectorAll(".ws-theme__btn");
    for (var i = 0; i < btns.length; i++) {
      var active = btns[i].getAttribute("data-ws-theme-choice") === preference;
      btns[i].setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  function applyTheme(root, preference) {
    var theme = effectiveTheme(preference);
    root.setAttribute("data-ws-theme", theme);
    root.setAttribute("data-ws-theme-effective", theme);
    syncThemeButtons(root, preference);
  }

  function initTheme(root) {
    var saved = store.get();
    applyTheme(root, saved || "auto");

    root.addEventListener("click", function (ev) {
      var btn = ev.target.closest ? ev.target.closest(".ws-theme__btn") : null;
      if (!btn || !root.contains(btn)) return;
      var choice = btn.getAttribute("data-ws-theme-choice");
      if (!choice) return;

      if (choice === "auto") {
        store.remove();
      } else {
        store.set(choice);
      }
      applyTheme(root, store.get() || "auto");
    });

    setInterval(function () {
      if ((store.get() || "auto") === "auto") {
        applyTheme(root, "auto");
      }
    }, 60000);

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
    var toggle = root.querySelector(".ws-menu-toggle");
    var nav = root.querySelector(".ws-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("ws-nav--open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (ev) {
      if (ev.target.closest && ev.target.closest("a")) {
        nav.classList.remove("ws-nav--open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    root.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && nav.classList.contains("ws-nav--open")) {
        nav.classList.remove("ws-nav--open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ============================================================
     ACORDEÃO "CONHEÇA A LANDING PAGE"
     - Usa <details>/<summary> nativos (sem dependências)
     - Apenas uma pergunta aberta por vez
     ============================================================ */
  function initAboutFaq(root) {
    var list = root.querySelector(".ws-about__faq");
    if (!list || list.getAttribute("data-ws-faq-init") === "true") return;
    list.setAttribute("data-ws-faq-init", "true");

    var items = list.querySelectorAll("details.ws-faq__item");

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
     CARROSSEL
     - Setas, indicadores, teclado (← →), toque/swipe
     - Autoplay com pausa em interação e hover/foco
     - Desativado quando o usuário prefere movimento reduzido
     ============================================================ */
  function initCarousel(root) {
    var carousel = root.querySelector("[data-ws-carousel-track]");
    if (!carousel || carousel.getAttribute("data-ws-carousel-init") === "true") return;
    carousel.setAttribute("data-ws-carousel-init", "true");

    var region = carousel.closest(".ws-carousel");
    var slides = carousel.children;
    var total = slides.length;
    if (!region || total === 0) return;

    var dots = region.querySelectorAll(".ws-carousel__dot");
    var caption = region.querySelector("[data-ws-carousel-caption]");
    var count = region.querySelector("[data-ws-carousel-count]");
    var captions = ["Serviços profissionais", "Produtos", "Negócios e empresas", "Captação de leads"];

    var index = 0;
    var timer = null;
    var paused = false;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

    function pad(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function render() {
      carousel.style.transform = "translateX(-" + index * 100 + "%)";
      for (var i = 0; i < dots.length; i++) {
        dots[i].setAttribute("aria-selected", i === index ? "true" : "false");
      }
      if (caption) caption.textContent = captions[index] || "";
      if (count) count.textContent = pad(index + 1) + " / " + pad(total);
    }

    function goTo(next) {
      index = (next + total) % total;
      render();
    }

    function startAutoplay() {
      stopAutoplay();
      if (paused || (reduceMotion && reduceMotion.matches)) return;
      timer = setInterval(function () {
        goTo(index + 1);
      }, CAROUSEL_INTERVAL_MS);
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Controles
    var prev = region.querySelector("[data-ws-carousel-prev]");
    var next = region.querySelector("[data-ws-carousel-next]");

    if (prev) {
      prev.addEventListener("click", function () {
        goTo(index - 1);
        startAutoplay(); // reinicia a contagem após interação
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        goTo(index + 1);
        startAutoplay();
      });
    }

    for (var d = 0; d < dots.length; d++) {
      (function (dot, i) {
        dot.addEventListener("click", function () {
          index = i;
          render();
          startAutoplay();
        });
      })(dots[d], d);
    }

    // Pausa em hover e foco
    region.addEventListener("mouseenter", function () {
      paused = true;
      stopAutoplay();
    });

    region.addEventListener("mouseleave", function () {
      paused = false;
      startAutoplay();
    });

    region.addEventListener("focusin", function () {
      paused = true;
      stopAutoplay();
    });

    region.addEventListener("focusout", function (ev) {
      // Só retoma o autoplay quando o foco sai de fato do carrossel
      if (ev.relatedTarget && region.contains(ev.relatedTarget)) return;
      paused = false;
      startAutoplay();
    });

    // Teclado (setas) quando o carrossel tem foco
    region.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowLeft") {
        goTo(index - 1);
        startAutoplay();
      } else if (ev.key === "ArrowRight") {
        goTo(index + 1);
        startAutoplay();
      }
    });

    // Swipe / arrastar (funciona em dispositivos móveis)
    // O "pointerup" é observado na janela para capturar gestos
    // que terminam fora do carrossel.
    var startX = null;

    carousel.addEventListener("pointerdown", function (ev) {
      startX = ev.clientX;
      stopAutoplay();
    });

    window.addEventListener("pointerup", function (ev) {
      if (startX === null) return;
      var delta = ev.clientX - startX;
      startX = null;
      if (Math.abs(delta) > 40) {
        goTo(delta < 0 ? index + 1 : index - 1);
      }
      startAutoplay();
    });

    carousel.addEventListener("pointercancel", function () {
      startX = null;
      startAutoplay();
    });

    // Evita arrastar as imagens junto com o swipe
    carousel.addEventListener("dragstart", function (ev) {
      ev.preventDefault();
    });

    // Respeita mudanças na preferência de movimento reduzido
    if (reduceMotion) {
      var onMotionChange = function () {
        if (reduceMotion.matches) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      };
      if (reduceMotion.addEventListener) {
        reduceMotion.addEventListener("change", onMotionChange);
      }
    }

    // Pausa quando a aba não está visível
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        startAutoplay();
      } else {
        stopAutoplay();
      }
    });

    render();
    startAutoplay();
  }

  /* ============================================================
     FORMULÁRIO
     - Máscara de telefone brasileiro
     - Validação de obrigatórios e e-mail
     - Popup de agradecimento
     - Envio isolado em `submitLead` (preparado para integração)
     ============================================================ */

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function formatPhone(value) {
    var digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length === 0) return "";
    if (digits.length <= 2) return "(" + digits;
    if (digits.length <= 6) return "(" + digits.slice(0, 2) + ") " + digits.slice(2);
    if (digits.length <= 10) {
      return "(" + digits.slice(0, 2) + ") " + digits.slice(2, 6) + "-" + digits.slice(6);
    }
    return "(" + digits.slice(0, 2) + ") " + digits.slice(2, 7) + "-" + digits.slice(7);
  }

  function setFieldError(field, invalid) {
    field.classList.toggle("ws-field--invalid", invalid);
    var input = field.querySelector(".ws-field__input");
    if (input) {
      if (invalid) {
        input.setAttribute("aria-invalid", "true");
      } else {
        input.removeAttribute("aria-invalid");
      }
    }
  }

  function validateField(field) {
    var input = field.querySelector(".ws-field__input");
    if (!input) return true;

    var value = (input.value || "").trim();
    var invalid = false;

    if (input.hasAttribute("required") && value === "") {
      invalid = true;
    } else if (input.type === "email" && value !== "" && !EMAIL_RE.test(value)) {
      invalid = true;
    } else if (input.type === "tel" && value !== "") {
      var digits = value.replace(/\D/g, "");
      invalid = digits.length < 10 || digits.length > 11;
    }

    setFieldError(field, invalid);
    return !invalid;
  }

  function initForm(root, openModal) {
    var form = root.querySelector("#wslp-form");
    if (!form || form.getAttribute("data-ws-form-init") === "true") return;
    form.setAttribute("data-ws-form-init", "true");

    var phone = form.querySelector("#wslp-telefone");
    if (phone) {
      phone.addEventListener("input", function () {
        var pos = phone.value.length;
        phone.value = formatPhone(phone.value);
        // Mantém o cursor no fim enquanto digita
        if (pos === phone.value.length - 1) {
          try {
            phone.setSelectionRange(phone.value.length, phone.value.length);
          } catch (e) { /* noop */ }
        }
      });
    }

    // Revalida ao sair do campo (feedback imediato, discreto)
    var fields = form.querySelectorAll("[data-ws-field]");
    for (var i = 0; i < fields.length; i++) {
      (function (field) {
        var input = field.querySelector(".ws-field__input");
        if (!input) return;
        input.addEventListener("blur", function () {
          if (input.value.trim() !== "") validateField(field);
        });
        input.addEventListener("input", function () {
          if (field.classList.contains("ws-field--invalid")) {
            validateField(field); // remove o erro assim que corrigir
          }
        });
      })(fields[i]);
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var valid = true;
      var firstInvalid = null;
      for (var j = 0; j < fields.length; j++) {
        var ok = validateField(fields[j]);
        if (!ok && valid) {
          valid = false;
          firstInvalid = fields[j];
        } else if (!ok) {
          valid = false;
        }
      }

      if (!valid) {
        if (firstInvalid) {
          var input = firstInvalid.querySelector(".ws-field__input");
          if (input) input.focus();
        }
        return;
      }

      // Dados prontos para a futura integração
      var data = {
        nome: form.querySelector("#wslp-nome") ? form.querySelector("#wslp-nome").value.trim() : "",
        email: form.querySelector("#wslp-email") ? form.querySelector("#wslp-email").value.trim() : "",
        telefone: phone ? phone.value.trim() : ""
      };

      // Envio isolado: substituir por integração real no futuro.
      submitLead(data);

      form.reset();
      for (var k = 0; k < fields.length; k++) {
        setFieldError(fields[k], false);
      }
      openModal();
    });
  }

  /* Ponto único de integração futura (backend, serviço de e-mail,
     CRM, WhatsApp API etc.). Nesta versão, apenas registra no console
     em ambiente de desenvolvimento e não envia nada. */
  function submitLead(data) {
    // TODO: integrar com backend/serviço de formulários.
    // Ex.: fetch("https://seu-endpoint", { method: "POST", body: JSON.stringify(data) })
    if (window.console && window.console.info) {
      window.console.info("[WS WebStudio] Lead capturado (envio ainda não integrado):", data.nome ? "ok" : "vazio");
    }
  }

  /* ============================================================
     MODAL DE AGRADECIMENTO
     - Fecha com botão, clique fora ou ESC
     - Bloqueia a rolagem do fundo
     - Foco controlado (abre no botão Fechar; devolve ao enviar)
     ============================================================ */
  function initModal(root) {
    var modal = root.querySelector("#wslp-modal");
    if (!modal || modal.getAttribute("data-ws-modal-init") === "true") return;
    modal.setAttribute("data-ws-modal-init", "true");

    var dialog = modal.querySelector(".ws-modal__dialog");
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      modal.hidden = false;

      // Bloqueia a rolagem do fundo
      var body = document.body;
      body.setAttribute("data-ws-scroll-lock", "true");
      body.style.overflow = "hidden";

      var closeBtn = modal.querySelector(".ws-modal__close");
      if (closeBtn) closeBtn.focus();

      document.addEventListener("keydown", onKeydown);
    }

    function close() {
      modal.hidden = true;

      var body = document.body;
      body.style.overflow = "";
      body.removeAttribute("data-ws-scroll-lock");

      document.removeEventListener("keydown", onKeydown);

      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
      lastFocus = null;
    }

    function onKeydown(ev) {
      if (ev.key === "Escape") {
        close();
        return;
      }

      // Mantém o foco dentro do diálogo (Tab / Shift+Tab)
      if (ev.key === "Tab" && dialog) {
        var focusables = dialog.querySelectorAll("button, [href], input, [tabindex]:not([tabindex='-1'])");
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];

        if (ev.shiftKey && document.activeElement === first) {
          ev.preventDefault();
          last.focus();
        } else if (!ev.shiftKey && document.activeElement === last) {
          ev.preventDefault();
          first.focus();
        }
      }
    }

    var closers = modal.querySelectorAll("[data-ws-modal-close]");
    for (var i = 0; i < closers.length; i++) {
      closers[i].addEventListener("click", close);
    }

    return { open: open, close: close };
  }

  /* ============================================================
     ANIMAÇÕES LEVES DE ENTRADA (IntersectionObserver)
     ============================================================ */
  function initReveals(root) {
    var items = root.querySelectorAll(".ws-reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add("ws-visible");
      }
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        for (var j = 0; j < entries.length; j++) {
          if (entries[j].isIntersecting) {
            entries[j].target.classList.add("ws-visible");
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
     INICIALIZAÇÃO
     Roda para cada instância de #ws-landing-page na página.
     ============================================================ */
  function init() {
    var roots = document.querySelectorAll("#ws-landing-page");
    for (var i = 0; i < roots.length; i++) {
      var root = roots[i];
      if (root.getAttribute("data-ws-init") === "true") continue; // evita dupla inicialização
      root.setAttribute("data-ws-init", "true");

      var modalApi = initModal(root);

      initTheme(root);
      initMobileMenu(root);
      initAboutFaq(root);
      initCarousel(root);
      initForm(root, modalApi ? modalApi.open : function () {});
      initReveals(root);

      // Ano automático no copyright
      var yearEl = root.querySelector("[data-ws-year]");
      if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
      }

      // Habilita transições só depois do tema definido (anti-flash)
      requestAnimationFrame(
        function (el) {
          return function () {
            el.classList.add("ws-ready");
          };
        }(root)
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

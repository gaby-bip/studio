/* ============================================================
   WEBSTUDIO — Página do serviço E-commerce
   JavaScript puro (sem jQuery, sem build).
   Encapsulado em IIFE; inicializa apenas dentro de
   #ws-ecommerce-page, sem conflitar com outros scripts.
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     ⚙️ CONFIGURAÇÃO — EDITE APENAS ESTE BLOCO
     ============================================================
     1) ENVIO POR E-MAIL (Web3Forms — https://web3forms.com):
        Crie uma chave gratuita informando o e-mail que receberá os
        contatos e cole em WEB3FORMS_ACCESS_KEY. A chave é pública
        (feita para ficar no navegador); ela só permite ENVIAR para
        o e-mail cadastrado.

     2) WHATSAPP:
        Número com código do país + DDD, apenas dígitos.
        Ex.: "5511999999999". Usado no botão "Continuar no WhatsApp"
        e como alternativa se o envio por e-mail falhar.

     3) TEMA:
        Esta página compartilha a MESMA chave de localStorage do site
        principal ("ss-theme-preference"), para respeitar a escolha
        Light / Dark / Auto feita pelo visitante em qualquer página.
     ============================================================ */

  var WEB3FORMS_ACCESS_KEY = ""; // <-- COLE SUA CHAVE DO WEB3FORMS AQUI
  var WHATSAPP_NUMBER = "";      // <-- SEU WHATSAPP, ex.: "5511999999999"

  /* Dados desta página de serviço */
  var SERVICE_NAME = "E-commerce";   // usado no e-mail, no WhatsApp e no popup
  var SERVICE_ARTICLE = "um";         // "uma Landing Page" / "um E-commerce"
  var WHATSAPP_SUMMARY_FIELDS = ["nome", "negocio", "vende_hoje", "produtos"]; // campos (name) no resumo do WhatsApp
  var CAROUSEL_CAPTIONS = ["Moda e acessórios", "Cosméticos e beleza", "Alimentos e bebidas", "Artesanato e decoração"];

  var THEME_STORAGE_KEY = "ss-theme-preference"; // mesma chave do site principal
  var CAROUSEL_INTERVAL_MS = 6000; // intervalo do autoplay (confortável)

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
    var captions = CAROUSEL_CAPTIONS;

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
     - Validação de obrigatórios, e-mail, telefone e consentimento
     - Envio por e-mail (Web3Forms) + continuação no WhatsApp
     - Nunca informa "recebido" se o envio falhou
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

  function fieldControl(field) {
    return field.querySelector("input, select, textarea");
  }

  function setFieldError(field, invalid) {
    field.classList.toggle("ws-field--invalid", invalid);
    var input = fieldControl(field);
    if (input) {
      if (invalid) {
        input.setAttribute("aria-invalid", "true");
      } else {
        input.removeAttribute("aria-invalid");
      }
    }
  }

  function validateField(field) {
    var input = fieldControl(field);
    if (!input) return true;

    var required = input.hasAttribute("required");
    var invalid = false;

    if (input.type === "checkbox") {
      invalid = required && !input.checked;
    } else {
      var value = (input.value || "").trim();
      if (required && value === "") {
        invalid = true;
      } else if (input.type === "email" && value !== "" && !EMAIL_RE.test(value)) {
        invalid = true;
      } else if (input.type === "tel" && value !== "") {
        var digits = value.replace(/\D/g, "");
        invalid = digits.length < 10 || digits.length > 11;
      } else if (input.name === "nome" && value !== "" && value.split(/\s+/).length < 2) {
        invalid = true; // pede nome e sobrenome
      }
    }

    setFieldError(field, invalid);
    return !invalid;
  }

  function fieldValue(form, name) {
    var el = form.elements[name];
    return el && el.value ? String(el.value).trim() : "";
  }

  /* Texto do rótulo de um campo, sem o "(opcional ...)" */
  function fieldLabel(form, el) {
    var text = "";
    var fieldset = el.type === "checkbox" ? el.closest("fieldset") : null;
    if (fieldset && fieldset.querySelector("legend")) {
      text = fieldset.querySelector("legend").textContent;
    } else if (el.id && form.querySelector("label[for='" + el.id + "']")) {
      text = form.querySelector("label[for='" + el.id + "']").textContent;
    } else {
      text = el.name;
    }
    return text.replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
  }

  /* Lê TODOS os campos do formulário pelo atributo "name", na ordem
     em que aparecem. Assim, novos campos no HTML entram no e-mail
     automaticamente, sem alterar o JS.
     Checkboxes com o mesmo "name" viram uma lista separada por vírgulas. */
  function collectLead(form) {
    var IGNORE = { botcheck: true, consentimento: true };
    var fields = [];
    var index = {};
    var els = form.elements;

    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.name || IGNORE[el.name] || el.type === "submit" || el.type === "button") continue;

      if (!(el.name in index)) {
        index[el.name] = fields.length;
        fields.push({ name: el.name, label: fieldLabel(form, el), values: [] });
      }
      var value = el.type === "checkbox" ? (el.checked ? el.value : "") : String(el.value || "").trim();
      if (value) fields[index[el.name]].values.push(value);
    }

    var lead = {
      fields: fields,
      botcheck: !!(form.elements.botcheck && form.elements.botcheck.checked)
    };
    for (var j = 0; j < fields.length; j++) {
      lead[fields[j].name] = fields[j].values.join(", ");
    }
    return lead;
  }

  /* Link do WhatsApp com um resumo curto (sem e-mail/telefone:
     a conversa já identifica o número de quem envia). */
  function whatsappLink(lead) {
    var number = String(WHATSAPP_NUMBER || "").replace(/\D/g, "");
    if (!number) return "";
    var lines = ["Olá! Tenho interesse em " + SERVICE_ARTICLE + " " + SERVICE_NAME + "."];
    if (lead) {
      for (var i = 0; i < lead.fields.length; i++) {
        var f = lead.fields[i];
        if (WHATSAPP_SUMMARY_FIELDS.indexOf(f.name) > -1 && f.values.length) {
          lines.push(f.label.replace(/\?$/, "") + ": " + f.values.join(", "));
        }
      }
    }
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  /* Envio por e-mail via Web3Forms.
     Chama done(true) se enviado; done(false) se falhou ou não configurado. */
  function submitLead(lead, done) {
    if (!WEB3FORMS_ACCESS_KEY || !window.fetch) {
      done(false);
      return;
    }

    var payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "Novo interesse em " + SERVICE_NAME + " — " + (lead.negocio || lead.nome),
      from_name: "Site WebStudio",
      replyto: lead.email,
      "Serviço": SERVICE_NAME
    };
    for (var i = 0; i < lead.fields.length; i++) {
      payload[lead.fields[i].label] = lead.fields[i].values.join(", ") || "—";
    }
    payload["Consentimento (LGPD)"] = "Aceitou a Política de Privacidade em " + new Date().toLocaleString("pt-BR");

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (json) {
          done(!!(res.ok && json && json.success));
        });
      })
      .catch(function () {
        done(false);
      });
  }

  function initForm(root, modal) {
    var form = root.querySelector("#wsec-form");
    if (!form || form.getAttribute("data-ws-form-init") === "true") return;
    form.setAttribute("data-ws-form-init", "true");

    var submitBtn = form.querySelector("[data-ws-submit]");
    var submitLabel = submitBtn ? submitBtn.textContent : "";
    var status = form.querySelector("[data-ws-form-status]");
    var sending = false;

    var phone = form.querySelector("#wsec-telefone");
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
        var input = fieldControl(field);
        if (!input) return;
        var isToggle = input.type === "checkbox" || input.tagName === "SELECT";
        if (!isToggle) {
          input.addEventListener("blur", function () {
            if (input.value.trim() !== "") validateField(field);
          });
        }
        input.addEventListener(isToggle ? "change" : "input", function () {
          if (field.classList.contains("ws-field--invalid")) {
            validateField(field); // remove o erro assim que corrigir
          }
        });
      })(fields[i]);
    }

    function setSending(on) {
      sending = on;
      if (submitBtn) {
        submitBtn.disabled = on;
        submitBtn.textContent = on ? "Enviando…" : submitLabel;
      }
      if (status) status.textContent = on ? "Enviando suas informações…" : "";
    }

    function clearForm() {
      form.reset();
      for (var k = 0; k < fields.length; k++) setFieldError(fields[k], false);
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (sending) return;

      var firstInvalid = null;
      for (var j = 0; j < fields.length; j++) {
        if (!validateField(fields[j]) && !firstInvalid) firstInvalid = fields[j];
      }

      if (firstInvalid) {
        var input = fieldControl(firstInvalid);
        if (input) input.focus();
        return;
      }

      var lead = collectLead(form);

      // Honeypot marcado = bot: finge sucesso sem enviar nada
      if (lead.botcheck) {
        clearForm();
        modal.open("success", "");
        return;
      }

      var wa = whatsappLink(lead);

      setSending(true);
      submitLead(lead, function (ok) {
        setSending(false);
        if (ok) {
          clearForm();
          modal.open("success", wa);
        } else {
          // Mantém os dados preenchidos para uma nova tentativa
          modal.open(wa ? "fallback" : "error", wa);
        }
      });
    });
  }

  /* ============================================================
     MODAL DE AGRADECIMENTO
     - Fecha com botão, clique fora ou ESC
     - Bloqueia a rolagem do fundo
     - Foco controlado (abre no botão Fechar; devolve ao enviar)
     ============================================================ */
  function initModal(root) {
    var modal = root.querySelector("#wsec-modal");
    if (!modal || modal.getAttribute("data-ws-modal-init") === "true") return;
    modal.setAttribute("data-ws-modal-init", "true");

    var dialog = modal.querySelector(".ws-modal__dialog");
    var titleEl = modal.querySelector(".ws-modal__title");
    var textEl = modal.querySelector(".ws-modal__text");
    var waBtn = modal.querySelector("[data-ws-modal-whatsapp]");
    var lastFocus = null;

    // Mensagens por resultado do envio
    var STATES = {
      success: {
        title: "Que bom ter você por aqui!",
        text: "Recebi seu interesse em desenvolver " + SERVICE_ARTICLE + " " + SERVICE_NAME + " com a WebStudio.\n\nEm breve, entro em contato pelo WhatsApp ou pelo e-mail informado.\n\nSe preferir, já podemos começar a conversa agora.",
        textNoWa: "Recebi seu interesse em desenvolver " + SERVICE_ARTICLE + " " + SERVICE_NAME + " com a WebStudio.\n\nEm breve, entro em contato pelo WhatsApp ou pelo e-mail informado.\n\nAgradeço por confiar sua ideia a mim!"
      },
      fallback: {
        title: "Quase lá!",
        text: "Não consegui registrar seu envio agora.\n\nToque no botão abaixo para me enviar suas informações pelo WhatsApp. Seus dados continuam preenchidos no formulário."
      },
      error: {
        title: "Algo deu errado",
        text: "Não consegui registrar seu envio agora. Seus dados continuam preenchidos no formulário.\n\nTente novamente em alguns instantes."
      }
    };

    function open(state, waUrl) {
      var cfg = STATES[state] || STATES.success;
      if (titleEl) titleEl.textContent = cfg.title;
      if (textEl) textEl.textContent = !waUrl && cfg.textNoWa ? cfg.textNoWa : cfg.text;
      if (waBtn) {
        waBtn.hidden = !waUrl;
        waBtn.setAttribute("href", waUrl || "#");
      }

      lastFocus = document.activeElement;
      modal.hidden = false;

      // Bloqueia a rolagem do fundo
      var body = document.body;
      body.setAttribute("data-ws-scroll-lock", "true");
      body.style.overflow = "hidden";

      var focusBtn = waUrl && waBtn ? waBtn : modal.querySelector(".ws-modal__close");
      if (focusBtn) focusBtn.focus();

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
        var focusables = dialog.querySelectorAll("button:not([hidden]), [href]:not([hidden]), input, [tabindex]:not([tabindex='-1'])");
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
     Roda para cada instância de #ws-ecommerce-page na página.
     ============================================================ */
  function init() {
    var roots = document.querySelectorAll("#ws-ecommerce-page");
    for (var i = 0; i < roots.length; i++) {
      var root = roots[i];
      if (root.getAttribute("data-ws-init") === "true") continue; // evita dupla inicialização
      root.setAttribute("data-ws-init", "true");

      var modalApi = initModal(root);

      initTheme(root);
      initMobileMenu(root);
      initAboutFaq(root);
      initCarousel(root);
      initForm(root, modalApi || { open: function () {} });
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

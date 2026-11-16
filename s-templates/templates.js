/* ============================================================
   BROTALINK — Página de Modelos (destino do Google Ads)
   JavaScript puro (sem jQuery, sem build).
   Encapsulado em IIFE; inicializa apenas dentro de
   #ws-templates-page, sem conflitar com outros scripts.
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

  var WEB3FORMS_ACCESS_KEY = "e93ab6f3-90f2-4cf2-89c5-13d8fe1f7718"; // chave do Web3Forms (envia para brotalink@gmail.com)
  var WHATSAPP_NUMBER = "";      // <-- SEU WHATSAPP, ex.: "5511999999999"

  /* Dados desta página de serviço */
  var SERVICE_NAME = "Landing Page";   // usado no e-mail, no WhatsApp e no popup (ramo e modelo vão nos campos)
  var SERVICE_ARTICLE = "uma";         // "uma Landing Page" / "um E-commerce"
  var WHATSAPP_SUMMARY_FIELDS = ["nome", "negocio", "nicho", "modelo"]; // campos (name) no resumo do WhatsApp
  var CAROUSEL_CAPTIONS = []; // esta página não tem carrossel

  /* Este mesmo JS (e o mesmo CSS) atende as DUAS páginas de modelos:
       templates.html (Landing Page: academia e personal)
       loja.html      (E-commerce: moda e acessórios)
     Cada página informa o serviço nos atributos da raiz:
       data-wstp-service="E-commerce" data-wstp-article="um"
     Abas de nicho: o id do painel é o que vai no link do anúncio
     (ex.: /templates/#personal ou /modelos-loja/#moda). Sem nicho no
     link, abre a primeira aba. */

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
    var lines = ["Oi! Vim pelo site e quero saber mais sobre " + SERVICE_ARTICLE + " " + SERVICE_NAME + "."];
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
      from_name: "Site brotalink",
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
    var form = root.querySelector("#wstp-form");
    if (!form || form.getAttribute("data-ws-form-init") === "true") return;
    form.setAttribute("data-ws-form-init", "true");

    var submitBtn = form.querySelector("[data-ws-submit]");
    var submitLabel = submitBtn ? submitBtn.textContent : "";
    var status = form.querySelector("[data-ws-form-status]");
    var sending = false;

    var phone = form.querySelector("#wstp-telefone");
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
      if (status) status.textContent = on ? "Enviando…" : "";
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
    var modal = root.querySelector("#wstp-modal");
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
        title: "Recebi! Que bom que você brotou por aqui.",
        text: "Em breve eu te chamo no WhatsApp ou no e-mail que você deixou.\n\nSe quiser, a gente já pode começar a conversa agora.",
        textNoWa: "Em breve eu te chamo no WhatsApp ou no e-mail que você deixou.\n\nValeu por confiar a sua ideia à brotalink!"
      },
      fallback: {
        title: "Quase lá!",
        text: "Seu envio não chegou até mim agora.\n\nToque no botão abaixo para me mandar tudo pelo WhatsApp. Seus dados continuam no formulário."
      },
      error: {
        title: "Ops, algo deu errado",
        text: "Seu envio não chegou até mim agora. Seus dados continuam no formulário.\n\nTenta de novo em alguns instantes?"
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
     MODELOS
     - Abas por nicho (teclado: ← → Home End), abertas pelo link
       (#academia, #personal ou ?nicho=...), para cada anúncio
       cair direto no nicho certo
     - Botões Computador / Celular em cada prévia
     - "Quero um site assim": preenche ramo e modelo no formulário
     ============================================================ */
  function initTemplates(root) {
    var tabs = root.querySelectorAll("[data-wstp-tab]");
    if (!tabs.length || root.getAttribute("data-wstp-tpl-init") === "true") return;
    root.setAttribute("data-wstp-tpl-init", "true");

    var onTabChange = null; // definido mais abaixo, junto do formulário

    function panelFor(tab) {
      return root.querySelector("#" + tab.getAttribute("aria-controls"));
    }

    function select(name, focus) {
      var found = false;
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].getAttribute("data-wstp-tab") === name) found = true;
      }
      if (!found) return false;
      for (var j = 0; j < tabs.length; j++) {
        var tab = tabs[j];
        var on = tab.getAttribute("data-wstp-tab") === name;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.setAttribute("tabindex", on ? "0" : "-1");
        var panel = panelFor(tab);
        if (panel) panel.hidden = !on;
        if (on && focus) tab.focus();
      }
      // Fotos do topo acompanham o nicho aberto
      var collages = root.querySelectorAll("[data-wstp-collage]");
      for (var c = 0; c < collages.length; c++) {
        collages[c].hidden = collages[c].getAttribute("data-wstp-collage") !== name;
      }
      // Campo "Modelo que mais gostou" acompanha a aba aberta
      if (onTabChange) onTabChange();
      // Revela os itens animados do painel que acabou de aparecer
      var shown = root.querySelectorAll(".ws-tpl__panel:not([hidden]) .ws-reveal");
      for (var k = 0; k < shown.length; k++) shown[k].classList.add("ws-visible");
      return true;
    }

    function nicheFromUrl() {
      var hash = (window.location.hash || "").replace("#", "").toLowerCase();
      if (hash) return hash;
      var match = /[?&]nicho=([^&#]+)/i.exec(window.location.search || "");
      return match ? decodeURIComponent(match[1]).toLowerCase() : "";
    }

    /* Quem chega pelo link do anúncio (#academia, #moda...) vê no topo
       o título do nicho, com as mesmas palavras da busca (ajuda na
       relevância do anúncio). Os textos ficam nos data-wstp-* de cada aba. */
    function applyHero(name) {
      var tab = null;
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].getAttribute("data-wstp-tab") === name) tab = tabs[i];
      }
      if (!tab) return;
      var parts = [
        ["[data-wstp-hero-eyebrow]", "data-wstp-eyebrow", false],
        ["#wstp-hero-title", "data-wstp-h1", true],
        ["[data-wstp-hero-sub]", "data-wstp-sub", false]
      ];
      for (var p = 0; p < parts.length; p++) {
        var el = root.querySelector(parts[p][0]);
        var value = tab.getAttribute(parts[p][1]);
        if (!el || !value) continue;
        if (parts[p][2]) el.innerHTML = value; // título aceita <em>
        else el.textContent = value;
      }
    }

    function openFromUrl(scroll) {
      var name = nicheFromUrl();
      if (name && select(name, false)) {
        applyHero(name);
        if (scroll) {
          var section = root.querySelector("#wstp-modelos");
          if (section && section.scrollIntoView) section.scrollIntoView();
        }
        return true;
      }
      return false;
    }

    if (!openFromUrl(true)) select(tabs[0].getAttribute("data-wstp-tab"), false);
    window.addEventListener("hashchange", function () {
      openFromUrl(true);
    });

    for (var t = 0; t < tabs.length; t++) {
      tabs[t].addEventListener("click", function () {
        var name = this.getAttribute("data-wstp-tab");
        select(name, false);
        // Atualiza o endereço sem pular a página (permite copiar o link do nicho)
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", "#" + name);
        }
      });
      tabs[t].addEventListener("keydown", function (ev) {
        var list = Array.prototype.slice.call(tabs);
        var idx = list.indexOf(this);
        var next = null;
        if (ev.key === "ArrowRight") next = list[(idx + 1) % list.length];
        else if (ev.key === "ArrowLeft") next = list[(idx - 1 + list.length) % list.length];
        else if (ev.key === "Home") next = list[0];
        else if (ev.key === "End") next = list[list.length - 1];
        if (!next) return;
        ev.preventDefault();
        select(next.getAttribute("data-wstp-tab"), true);
      });
    }

    // Computador / Celular
    var views = root.querySelectorAll("[data-wstp-view]");
    for (var v = 0; v < views.length; v++) {
      views[v].addEventListener("click", function () {
        var stage = this.closest(".ws-demo__stage");
        if (!stage) return;
        var mode = this.getAttribute("data-wstp-view");
        stage.setAttribute("data-wstp-mode", mode);
        var group = stage.querySelectorAll("[data-wstp-view]");
        for (var g = 0; g < group.length; g++) {
          group[g].setAttribute("aria-pressed", group[g] === this ? "true" : "false");
        }
        var screen = stage.querySelector(".ws-demo__screen");
        if (screen) screen.scrollTop = 0;
      });
    }

    var form = root.querySelector("#wstp-form");

    /* Campo "Modelo que mais gostou": lista só os modelos da aba aberta
       (os que a pessoa está vendo). Se ela escolher o ramo no formulário,
       vale a aba daquele ramo. Cada <option> tem data-wstp-panel com o id
       da aba; as opções de "Seu ramo" também, para saber qual aba usar. */
    var modelSelect = form && form.elements.modelo;
    var allModels = modelSelect ? Array.prototype.slice.call(modelSelect.querySelectorAll("option[data-wstp-panel]")) : [];

    function activePanel() {
      var niche = form.elements.nicho;
      var opt = niche && niche.options[niche.selectedIndex];
      var fromNiche = opt && opt.getAttribute("data-wstp-panel");
      if (fromNiche) return fromNiche;
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].getAttribute("aria-selected") === "true") return tabs[i].getAttribute("data-wstp-tab");
      }
      return "";
    }

    function filterModels() {
      if (!modelSelect || !allModels.length) return;
      var panel = activePanel();
      var keep = modelSelect.value;
      for (var r = 0; r < allModels.length; r++) {
        if (allModels[r].parentNode) allModels[r].parentNode.removeChild(allModels[r]);
      }
      for (var m = 0; m < allModels.length; m++) {
        if (allModels[m].getAttribute("data-wstp-panel") === panel) modelSelect.appendChild(allModels[m]);
      }
      modelSelect.value = keep;
      if (modelSelect.selectedIndex < 0) modelSelect.selectedIndex = 0; // modelo de outra aba: "Ainda não sei"
    }

    if (modelSelect) {
      onTabChange = filterModels;
      if (form.elements.nicho) form.elements.nicho.addEventListener("change", filterModels);
      form.addEventListener("reset", function () {
        setTimeout(filterModels, 0);
      });
      filterModels();
    }

    // "Quero um site assim"
    var picks = root.querySelectorAll("[data-wstp-pick]");
    for (var p = 0; p < picks.length; p++) {
      picks[p].addEventListener("click", function () {
        if (!form) return;
        // Ramo primeiro: ele define quais modelos aparecem no campo seguinte
        setSelect(form.elements.nicho, this.getAttribute("data-wstp-niche"));
        setSelect(form.elements.modelo, this.getAttribute("data-wstp-pick"));
        var contact = root.querySelector("#wstp-contato");
        if (contact && contact.scrollIntoView) contact.scrollIntoView();
        var first = form.elements.nome;
        if (first) {
          try {
            first.focus({ preventScroll: true });
          } catch (e) {
            first.focus();
          }
        }
      });
    }

    function setSelect(select, value) {
      if (!select || !value) return;
      for (var o = 0; o < select.options.length; o++) {
        if (select.options[o].text === value) {
          select.selectedIndex = o;
          // Dispara "change" para limpar um erro de validação já exibido
          var ev;
          try {
            ev = new Event("change", { bubbles: true });
          } catch (e) {
            ev = document.createEvent("Event");
            ev.initEvent("change", true, true);
          }
          select.dispatchEvent(ev);
          return;
        }
      }
    }
  }

  /* ============================================================
     WHATSAPP DIRETO (abaixo do formulário)
     Monta o link com WHATSAPP_NUMBER e uma mensagem pronta.
     Sem número configurado, o bloco continua escondido.
     ============================================================ */
  function initWhatsappDirect(root) {
    var box = root.querySelector("[data-ws-wa-direct]");
    if (!box) return;
    var url = whatsappLink(null);
    if (!url) return; // WHATSAPP_NUMBER vazio: nada aparece
    var link = box.querySelector("a");
    if (link) link.href = url;
    box.hidden = false;
  }

  /* ============================================================
     INICIALIZAÇÃO
     Roda para cada instância de #ws-templates-page na página.
     ============================================================ */
  function init() {
    var roots = document.querySelectorAll("#ws-templates-page");
    for (var i = 0; i < roots.length; i++) {
      var root = roots[i];
      if (root.getAttribute("data-ws-init") === "true") continue; // evita dupla inicialização
      root.setAttribute("data-ws-init", "true");

      // Serviço desta página (ver comentário no bloco de configuração)
      SERVICE_NAME = root.getAttribute("data-wstp-service") || SERVICE_NAME;
      SERVICE_ARTICLE = root.getAttribute("data-wstp-article") || SERVICE_ARTICLE;

      var modalApi = initModal(root);

      initTheme(root);
      initMobileMenu(root);
      initAboutFaq(root);
      initCarousel(root);
      initTemplates(root);
      initForm(root, modalApi || { open: function () {} });
      initWhatsappDirect(root);
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

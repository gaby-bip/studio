# Landing Page — Estúdio de Criação de Sites

Landing page premium, minimalista e responsiva, pronta para o **widget HTML do Elementor** (WordPress na Hostinger). Sem frameworks, sem build, sem backend.

---

## 1. Arquivos do projeto

| Arquivo | Para que serve |
|---|---|
| `index.html` | **Prévia local** — abra no navegador para ver a página. Usa `landing-page.css` e `landing-page.js` externos. Não use este arquivo no Elementor. |
| `elementor-html.html` | **Versão para o Elementor** — HTML + CSS + JS consolidados em um único bloco, sem dependência de arquivos locais. |
| `landing-page.css` | Estilos (manutenção — já embutidos na versão Elementor). |
| `landing-page.js` | JavaScript (manutenção — já embutido na versão Elementor). |
| `README.md` | Este guia. |

---

## 2. Configuração do link de WhatsApp (única edição obrigatória)

Todo o contato da página é configurado em **um único local**, no topo do JavaScript. Abra o arquivo `elementor-html.html` (ou `landing-page.js`) e localize:

```js
var SS_WHATSAPP_URL = "#"; // <-- COLOQUE SEU LINK DO WHATSAPP AQUI
```

Substitua `"#"` pelo seu link, no formato:

```js
var SS_WHATSAPP_URL = "https://wa.me/55DDDNÚMERO";
```

- Formato: `55` (Brasil) + DDD + número, **sem espaços, traços ou parênteses**.
- Exemplo: `https://wa.me/5511987654321`.

Enquanto o valor for `"#"`, os botões de contato apontam para um marcador — nenhum telefone é inventado.

### Mensagens pré-preenchidas (opcional)

Logo abaixo, edite as mensagens enviadas por cada serviço:

```js
var SS_MESSAGES = {
  geral:     "Olá! Vim pelo site e gostaria de conversar sobre um projeto.",
  landing:   "Olá! Tenho interesse em criar uma Landing Page.",
  ecommerce: "Olá! Tenho interesse em criar um E-commerce.",
  site:      "Olá! Tenho interesse em um Site Personalizado."
};
```

Cada CTA declara `data-ss-msg="landing|ecommerce|site|geral"` e recebe automaticamente a mensagem correspondente (`?text=` no link do WhatsApp).

### Outras personalizações

- **Marca**: troque o texto `Studio` em `.ss-brand` (cabeçalho e rodapé).
- **Textos**: edite diretamente no HTML dentro de `#ss-landing`.
- **Cores**: variáveis no topo do CSS (`--ss-green-deep`, `--ss-forest`, `--ss-sage`, `--ss-pink`, `--ss-offwhite`).

---

## 3. Instalação no WordPress + Elementor (passo a passo)

> ⚠️ Faça primeiro em uma **página de rascunho**. Só publique depois de aprovar.

1. **Nova página**: no WordPress, crie uma página (ex.: "Início") e edite com o Elementor.
2. **Layout da página**: no canto inferior esquerdo (engrenagem ⚙️), em *Layout da página*, escolha **Elementor Canvas** (recomendado — remove header/footer do tema) ou **Elementor Full Width**.
3. **Copie o código**: abra `elementor-html.html` em um editor de texto e copie **todo** o conteúdo (`Ctrl+A` → `Ctrl+C`).
4. **Widget HTML**: no Elementor, busque o widget **"HTML"** e arraste para uma seção de largura total.
5. **Cole** o código no campo do widget.
6. **Zere os espaçamentos**: selecione a seção → aba *Layout* → padding **0** em todos os lados. Faça o mesmo na coluna.
7. **Atualizar** e visualizar.
8. **Definir como home** (opcional): *Configurações → Leitura → Página inicial estática*.

### Checklist rápido

- [ ] Layout da página: **Canvas** ou **Full Width**
- [ ] Padding da seção e da coluna: **0**
- [ ] `SS_WHATSAPP_URL` configurado
- [ ] Testado em celular (largura < 768px)
- [ ] Testado Light, Dark e Auto

---

## 4. Seletor de tema (Light / Dark / Automático)

O seletor no cabeçalho tem três botões: **Light**, **Dark** e **Auto**.

- **Light / Dark**: aplicados imediatamente e salvos no `localStorage` do navegador — a escolha é lembrada em visitas futuras.
- **Auto**: remove a preferência manual e aplica o tema pelo horário local do navegador:
  - **06:00 às 18:59** → Light
  - **19:00 às 05:59** → Dark
- O tema automático é **recalculado a cada minuto** e também **quando a aba volta a ficar visível** (a página pode ficar aberta e o tema troca sozinho na virada do horário).
- Se o `localStorage` estiver indisponível (navegador com restrições), a página usa um armazenamento em memória e continua funcionando normalmente — apenas sem persistência entre visitas.
- O tema é aplicado **somente** no atributo `data-ss-theme` do contêiner `#ss-landing`, nunca em `html`/`body` — o resto do WordPress não é afetado.

---

## 5. Compatibilidade e limitações conhecidas

| Item | Status | Observação |
|---|---|---|
| Widget HTML do Elementor | ✅ | Código consolidado, sem arquivos externos, sem build, sem terminal. |
| Escopo do CSS | ✅ | Tudo dentro de `#ss-landing`, classes prefixadas `ss-`, zero seletores globais. |
| jQuery / bibliotecas | ✅ Não usa | JavaScript puro (Vanilla). |
| Formulário de contato | ➖ Não incluído | Sem backend para envio — os CTAs apontam para o WhatsApp configurado. Se quiser formulário, use o widget **Formulário** nativo do Elementor. |
| SEO (title/meta) | ⚠️ Limitação do widget | O widget HTML não define `<title>` nem meta tags. Configure o título/descrição SEO nas opções da página do Elementor ou com Rank Math/Yoast. O conteúdo interno é HTML semântico e indexável. |
| `prefers-reduced-motion` | ✅ | Animações são desativadas para quem prefere movimento reduzido. |
| HTTPS | ✅ | Nenhum recurso externo é carregado; links do WhatsApp em `https://wa.me`. |
| Cache (LiteSpeed etc.) | ✅ | Sem dependências externas; nada a configurar. |

---

## 6. O que foi testado (e o que não foi)

- ✅ Prévia local testada em navegador (Chrome/Windows): Light, Dark e Auto funcionando; persistência e recálculo de horário operantes; responsividade verificada redimensionando a janela.
- ⚠️ **Não foi testado no Elementor real.** O teste foi apenas no navegador local. Siga a seção 3 em uma página de rascunho antes de publicar.

### Se algo ficar desalinhado no Elementor

- **Padding residual** → zere o padding da seção e da coluna (passo 6).
- **Espaço em branco acima/abaixo** → o tema pode inserir margens; use o layout **Canvas**.
- **Fontes diferentes** → o design usa fontes de sistema (Georgia para títulos, Helvetica/Arial para interface), disponíveis universalmente.
- **Menu mobile coberto pelo header do tema** → o layout **Canvas** resolve, pois remove o header do tema.
- **Elementor sanitizou o código** → se alguma parte do HTML sumir ao salvar, verifique as permissões de *unfiltered_html* do seu usuário (administradores normalmente têm) ou cole o código novamente após salvar.

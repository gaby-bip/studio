# brotalink — Site

Landing page de apresentação para um estúdio de criação de sites. Página única, minimalista e responsiva, composta por seções institucionais (serviços, benefícios, perguntas frequentes) e canais de contato direto.

O projeto é distribuído em duas formas equivalentes: uma versão de desenvolvimento com arquivos separados e uma versão consolidada para publicação via widget HTML do Elementor (WordPress).

## Tecnologias utilizadas

**Linguagens e marcação**

- HTML5 (marcação semântica)
- CSS3 (variáveis customizadas, Grid Layout, Flexbox, media queries)
- JavaScript (ECMAScript 5, sem transpilação)

**Bibliotecas e frameworks**

- Nenhuma. Todo o JavaScript é vanilla, sem dependências externas ou bibliotecas.
- Fontes do Google Fonts (Bricolage Grotesque, DM Sans e Archivo Black), carregadas por `@import` no topo de cada CSS.

**Plataforma de publicação**

- WordPress com o widget HTML do Elementor
- Hospedagem Hostinger

**Ferramentas de desenvolvimento**

- Não há build, empacotamento ou gerenciador de pacotes. O projeto é composto por arquivos estáticos.

## Estrutura do projeto

```
.
├── index.html                 # Página inicial; referencia landing-page.css e landing-page.js
├── landing-page.css           # Estilos da página inicial (escopados em #ss-landing)
├── landing-page.js            # Interações da página inicial (tema, menu, acordeão, CTAs)
├── elementor-html.html        # GERADO: página inicial consolidada para o Elementor
├── s-landingpage/             # Página do serviço Landing Page (escopada em #ws-landing-page)
│   ├── landingpage.html/.css/.js
│   ├── assets/                # Imagens do carrossel (embutidas na versão Elementor)
│   └── elementor-landingpage.html  # GERADO
├── s-ecommerce/               # Página do serviço E-commerce (escopada em #ws-ecommerce-page)
│   ├── ecommerce.html/.css/.js, assets/
│   └── elementor-ecommerce.html     # GERADO
├── s-personalizado/           # Página do Site Personalizado, sob consulta (#ws-personalizado-page)
│   ├── personalizado.html/.css/.js, assets/
│   └── elementor-personalizado.html # GERADO
├── s-privacidade/
│   └── politica-de-privacidade.html # Política de Privacidade (autocontida, pronta para o Elementor)
├── build-elementor.py         # Gera os arquivos consolidados do Elementor
└── README.md
```

Os arquivos `elementor-*.html` são **gerados** a partir das fontes. Depois de qualquer alteração, rode:

```bash
python build-elementor.py
```

Não edite os arquivos gerados à mão: as mudanças seriam sobrescritas.

## Arquitetura e organização

- **Estrutura (`index.html`)**: todo o conteúdo da página está dentro do contêiner `#ss-landing`, com seções identificadas por IDs (`ss-servicos`, `ss-beneficios`, `ss-faq`, `ss-contato`). As classes seguem o prefixo `ss-` e a convenção BEM (`ss-bloco__elemento--modificador`).
- **Estilos (`landing-page.css`)**: todo o CSS é escopado sob `#ss-landing`, sem seletores globais, para não afetar o restante do WordPress. As cores, fontes e métricas são definidas como variáveis customizadas no topo do arquivo, com dois conjuntos de tokens (tema claro e tema escuro). O tema é aplicado apenas no atributo `data-ss-theme` do contêiner.
- **Interações (`landing-page.js`)**: IIFE autônoma, executada por instância de `#ss-landing` com guarda contra reinicialização (`data-ss-init`). Responsável por tema, menu mobile, animações de entrada e links de contato.
- **Consolidação (`elementor-html.html`)**: união dos três artefatos em um único bloco autocontido, exigida pelo funcionamento do widget HTML do Elementor.
- Não há backend: os pontos de contato são links externos (WhatsApp), com destino centralizado em uma constante no início do JavaScript (`SS_WHATSAPP_URL`). Enquanto o valor for um marcador, os CTAs permanecem sem destino efetivo.

## Funcionalidades

- Cabeçalho fixo com navegação por seções e menu dedicado para telas menores.
- Seletor de tema claro/escuro/automático: preferência salva em `localStorage` (com fallback em memória); no modo automático, o tema é definido pelo horário local e recalculado periodicamente e ao retomar o foco da aba.
- Seção principal (hero) com apresentação do serviço e mockups de interface construídos apenas com CSS.
- Seção de serviços: três cartões (Landing Page, E-commerce, Site Personalizado) com chamadas para contato.
- Seção de benefícios: grade de seis cartões informativos, sem elementos de conversão.
- Perguntas frequentes: acordeão construído com os elementos nativos `<details>`/`<summary>`, com apenas uma resposta aberta por vez.
- Botão flutuante de WhatsApp, fixo no canto inferior direito, com suporte a `env(safe-area-inset-*)`.
- Animações de entrada leves via `IntersectionObserver`, com fallback quando a API não está disponível.
- Ano do copyright atualizado automaticamente.
- Layout responsivo com breakpoints para desktop, tablet e celular.
- Suporte a `prefers-reduced-motion`: animações e transições são desativadas quando o usuário prefere movimento reduzido.

## Limitações conhecidas

- As três páginas de serviço compartilham o mesmo CSS/JS (copiados, com prefixos diferentes). Correções em uma devem ser repetidas nas outras.
- Sem backend próprio. Os formulários das páginas de serviço enviam por e-mail via Web3Forms e oferecem continuar no WhatsApp; configure `WEB3FORMS_ACCESS_KEY` e `WHATSAPP_NUMBER` no topo do JS de cada página (`landingpage.js`, `ecommerce.js`, `personalizado.js`). Sem essa configuração, o formulário mostra uma mensagem de erro e mantém os dados preenchidos (nunca confirma um envio que não aconteceu).
- Valores da seção Investimento e dados da Política de Privacidade estão marcados com `PREENCHER` nos arquivos.
- Publicada via widget HTML do Elementor, a página não define `<title>` nem meta tags — SEO deve ser configurado nas opções da página no WordPress.
- As fontes vêm do Google Fonts: o navegador do visitante se conecta aos servidores do Google (citado na Política de Privacidade). Sem conexão com o Google, o site usa fontes de sistema parecidas.

## Identidade visual (brotalink)

| Cor | Hex | Uso |
|---|---|---|
| Verde-musgo | `#465B32` | destaques no tema claro |
| Laranja tropical | `#F06A32` | grafismos e marcadores |
| Rosa pitaya | `#E83E78` | ponto do logotipo e grafismos |
| Rosa pitaya escurecido | `#C9285F` | botões (texto branco com contraste 5,3:1) |
| Amarelo manga | `#F2C230` | destaques no tema escuro e sublinhados |
| Branco de coco | `#FFF5E8` | fundo claro |
| Verde mata noturno | `#20271D` | fundo escuro |

- Títulos: Bricolage Grotesque. Textos: DM Sans. Chamadas curtas (rótulos e preços): Archivo Black.
- Logotipo `brotalink.` em minúsculas, peso ExtraBold, com o ponto final em rosa.
- O rosa puro (`#E83E78`) não tem contraste suficiente para texto em botões; por isso os botões usam o tom escurecido.
- Os grafismos orgânicos (folhagem no hero, broto em uma seção e faixa de cores no rodapé) ficam na camada "IDENTIDADE BROTALINK", no fim do CSS.

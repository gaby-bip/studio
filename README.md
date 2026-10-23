# Landing Page — Studio

Landing page de apresentação para um estúdio de criação de sites. Página única, minimalista e responsiva, composta por seções institucionais (serviços, benefícios, perguntas frequentes) e canais de contato direto.

O projeto é distribuído em duas formas equivalentes: uma versão de desenvolvimento com arquivos separados e uma versão consolidada para publicação via widget HTML do Elementor (WordPress).

## Tecnologias utilizadas

**Linguagens e marcação**

- HTML5 (marcação semântica)
- CSS3 (variáveis customizadas, Grid Layout, Flexbox, media queries)
- JavaScript (ECMAScript 5, sem transpilação)

**Bibliotecas e frameworks**

- Nenhuma. Todo o JavaScript é vanilla, sem dependências externas, bibliotecas ou fontes de terceiros.

**Plataforma de publicação**

- WordPress com o widget HTML do Elementor
- Hospedagem Hostinger

**Ferramentas de desenvolvimento**

- Não há build, empacotamento ou gerenciador de pacotes. O projeto é composto por arquivos estáticos.

## Estrutura do projeto

```
.
├── index.html          # Página completa; referencia landing-page.css e landing-page.js
├── landing-page.css    # Estilos da landing page (escopados em #ss-landing)
├── landing-page.js     # Interações da página (tema, menu, acordeão, CTAs)
├── elementor-html.html # Versão consolidada (HTML + CSS + JS em um bloco) para o widget HTML do Elementor
└── README.md           # Este documento
```

`elementor-html.html` mantém o mesmo conteúdo e comportamento dos demais arquivos, porém com CSS e JavaScript embutidos, sem dependência de arquivos locais. Os arquivos separados servem para manutenção; as alterações devem ser espelhadas na versão consolidada.

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

- Sem backend: não há formulário de envio próprio; o contato ocorre por links externos.
- Publicada via widget HTML do Elementor, a página não define `<title>` nem meta tags — SEO deve ser configurado nas opções da página no WordPress.
- O design utiliza fontes de sistema (Georgia, Helvetica/Arial), sem carregamento de fontes externas.

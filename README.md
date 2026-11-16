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
├── s-templates/               # Páginas de modelos (#ws-templates-page), destino do Google Ads
│   ├── templates.html           # Landing Page: /templates/#academia e /templates/#personal
│   ├── loja.html                # E-commerce: /modelos-loja/#moda e /modelos-loja/#acessorios
│   ├── templates.js             # JS das DUAS páginas (o serviço vem de data-wstp-service na raiz)
│   ├── templates-modelos.css    # FONTE dos estilos próprios (abas, molduras e os 13 modelos fictícios: 6 de site e 7 de loja)
│   ├── templates.css            # GERADO: base da Landing Page + templates-modelos.css (usado pelas duas)
│   ├── elementor-templates.html # GERADO
│   └── elementor-loja.html      # GERADO
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

## Fotos para trocar (páginas de modelos)

As fotos das páginas `s-templates/templates.html` e `s-templates/loja.html` são do Unsplash (licença gratuita, uso comercial permitido) e carregam direto de `images.unsplash.com`. Cada `<img>` tem um `data-foto="nome"` para você achar fácil.

**Como trocar uma foto pelo WordPress**

1. No WordPress, vá em **Mídia → Adicionar nova** e suba a foto (de preferência `.webp` ou `.jpg` com até 300 KB).
2. Clique na foto e em **Copiar URL** (algo como `https://seusite.com.br/wp-content/uploads/2026/11/forja-topo.webp`).
3. No arquivo HTML, procure (Ctrl+F) pelo `data-foto` da tabela abaixo e troque **só o valor do `src`** pela URL copiada. Mantenha `class`, `data-foto`, `loading` e `decoding`.
4. Rode `python build-elementor.py` e cole o novo `elementor-*.html` no widget do Elementor.

Exemplo:

```html
<!-- antes -->
<img class="tm-img" data-foto="forja-topo" src="https://images.unsplash.com/photo-...?auto=format&amp;fit=crop&amp;w=900&amp;q=70" alt="" loading="lazy" decoding="async">
<!-- depois -->
<img class="tm-img" data-foto="forja-topo" src="https://seusite.com.br/wp-content/uploads/2026/11/forja-topo.webp" alt="" loading="lazy" decoding="async">
```

Observações:
- O build só embute imagens com caminho local (`assets/...`). Links `https://` (Unsplash ou WordPress) ficam como link, então o arquivo do Elementor continua leve.
- Os cortes são feitos pelo CSS (`object-fit: cover`), então a foto não precisa ter o tamanho exato. Use os tamanhos abaixo como referência e deixe o assunto principal no centro.
- Se o mesmo `data-foto` aparecer duas vezes (ex.: uma foto usada na capa e no modelo), troque nas duas.
- As fotos dos carrosséis das páginas de serviço (`assets/landing-01.svg` etc.) também podem apontar para uma URL do WordPress: troque o `src` do mesmo jeito.
- Quando todas as fotos estiverem no WordPress, o item do **Unsplash** na Política de Privacidade pode ser removido.

| Página | `data-foto` | Tamanho sugerido (px) | Foto atual (Unsplash) |
|---|---|---|---|
| Modelos de site (/templates/) | `academia-capa-1` | 600 × 450 (capa do nicho) | `photo-1517438322307-e67111335449` |
| Modelos de site (/templates/) | `academia-capa-2` | 600 × 450 (capa do nicho) | `photo-1641337221253-fdc7237f6b61` |
| Modelos de site (/templates/) | `academia-capa-3` | 600 × 450 (capa do nicho) | `photo-1747239069226-55382c570116` |
| Modelos de site (/templates/) | `personal-capa-1` | 600 × 450 (capa do nicho) | `photo-1758875568932-0eefd3e60090` |
| Modelos de site (/templates/) | `personal-capa-2` | 600 × 450 (capa do nicho) | `photo-1714646442330-9068099f5521` |
| Modelos de site (/templates/) | `personal-capa-3` | 600 × 450 (capa do nicho) | `photo-1756314355668-7d3056db8600` |
| Modelos de site (/templates/) | `forja-topo` | 1600 × 900 (horizontal, tela cheia) | `photo-1723117418183-2422c62a5a75` |
| Modelos de site (/templates/) | `forja-estrutura-1` | 1000 × 1250 (vertical) | `photo-1576678927484-cc907957088c` |
| Modelos de site (/templates/) | `forja-estrutura-2` | 800 × 800 (quadrada ou vertical) | `photo-1595078475328-1ab05d0a6a0e` |
| Modelos de site (/templates/) | `forja-estrutura-3` | 800 × 800 (quadrada ou vertical) | `photo-1641337221253-fdc7237f6b61` |
| Modelos de site (/templates/) | `guarda-alta-topo` | 1000 × 1250 (vertical) | `photo-1517438322307-e67111335449` |
| Modelos de site (/templates/) | `guarda-alta-luta-1` | 800 × 800 (quadrada ou vertical) | `photo-1549719386-74dfcbf7dbed` |
| Modelos de site (/templates/) | `guarda-alta-luta-2` | 800 × 800 (quadrada ou vertical) | `photo-1495555687398-3f50d6e79e1e` |
| Modelos de site (/templates/) | `guarda-alta-luta-3` | 800 × 800 (quadrada ou vertical) | `photo-1622599511051-16f55a1234d0` |
| Modelos de site (/templates/) | `movimento-topo` | 800 × 800 (quadrada ou vertical) | `photo-1747239069226-55382c570116` |
| Modelos de site (/templates/) | `movimento-foto-2` | 800 × 800 (quadrada ou vertical) | `photo-1747238415033-b74eec07eb59` |
| Modelos de site (/templates/) | `movimento-foto-3` | 800 × 800 (quadrada ou vertical) | `photo-1747240549807-fc3962949818` |
| Modelos de site (/templates/) | `rafa-topo` | 1000 × 1250 (vertical) | `photo-1758875568932-0eefd3e60090` |
| Modelos de site (/templates/) | `rafa-video` | 1000 × 1250 (vertical) | `photo-1758875569256-f37c438cac65` |
| Modelos de site (/templates/) | `rafa-feed-1` | 800 × 800 (quadrada ou vertical) | `photo-1758875569399-99a7d80ace43` |
| Modelos de site (/templates/) | `rafa-feed-2` | 800 × 800 (quadrada ou vertical) | `photo-1571019614242-c5c5dee9f50b` |
| Modelos de site (/templates/) | `rafa-feed-3` | 800 × 800 (quadrada ou vertical) | `photo-1534258936925-c58bed479fcb` |
| Modelos de site (/templates/) | `rafa-feed-4` | 800 × 800 (quadrada ou vertical) | `photo-1526506118085-60ce8714f8c5` |
| Modelos de site (/templates/) | `equilibrio-topo` | 800 × 800 (quadrada ou vertical) | `photo-1756314355668-7d3056db8600` |
| Modelos de site (/templates/) | `equilibrio-foto-2` | 800 × 800 (quadrada ou vertical) | `photo-1747302653826-42c6cd7295f2` |
| Modelos de loja (/modelos-loja/) | `moda-capa-1` | 600 × 450 (capa do nicho) | `photo-1784850227098-0a886518216c` |
| Modelos de loja (/modelos-loja/) | `moda-capa-2` | 600 × 450 (capa do nicho) | `photo-1760287363879-6012adab292c` |
| Modelos de loja (/modelos-loja/) | `moda-capa-3` | 600 × 450 (capa do nicho) | `photo-1635650804263-1a1941e14df5` |
| Modelos de loja (/modelos-loja/) | `acessorios-capa-1` | 600 × 450 (capa do nicho) | `photo-1766595898967-22c61e0be796` |
| Modelos de loja (/modelos-loja/) | `acessorios-capa-2` | 600 × 450 (capa do nicho) | `photo-1585960622850-ed33c41d6418` |
| Modelos de loja (/modelos-loja/) | `acessorios-capa-3` | 600 × 450 (capa do nicho) | `photo-1590874103328-eac38a683ce7` |
| Modelos de loja (/modelos-loja/) | `rua9-topo-1` | 1000 × 1250 (vertical) | `photo-1784850227098-0a886518216c` |
| Modelos de loja (/modelos-loja/) | `rua9-topo-2` | 1000 × 1250 (vertical) | `photo-1523398002811-999ca8dec234` |
| Modelos de loja (/modelos-loja/) | `rua9-produto-1` | 800 × 800 (quadrada ou vertical) | `photo-1578854955076-970394ef2512` |
| Modelos de loja (/modelos-loja/) | `rua9-produto-2` | 800 × 800 (quadrada ou vertical) | `photo-1588117260148-b47818741c74` |
| Modelos de loja (/modelos-loja/) | `rua9-produto-3` | 800 × 800 (quadrada ou vertical) | `photo-1635650804263-1a1941e14df5` |
| Modelos de loja (/modelos-loja/) | `miuda-topo` | 1000 × 1250 (vertical) | `photo-1760287363879-6012adab292c` |
| Modelos de loja (/modelos-loja/) | `miuda-produto-1` | 800 × 800 (quadrada ou vertical) | `photo-1766918780914-e19d9de76d85` |
| Modelos de loja (/modelos-loja/) | `miuda-produto-2` | 800 × 800 (quadrada ou vertical) | `photo-1768383235583-99e9d8c836b0` |
| Modelos de loja (/modelos-loja/) | `miuda-produto-3` | 800 × 800 (quadrada ou vertical) | `photo-1766918780914-5df4a5a98c44` |
| Modelos de loja (/modelos-loja/) | `miuda-produto-4` | 800 × 800 (quadrada ou vertical) | `photo-1622290291468-a28f7a7dc6a8` |
| Modelos de loja (/modelos-loja/) | `pulso-topo` | 1600 × 900 (horizontal, tela cheia) | `photo-1645207803533-e2cfe1382f2c` |
| Modelos de loja (/modelos-loja/) | `pulso-atividade-1` | 800 × 800 (quadrada ou vertical) | `photo-1645318800735-737d3a422de6` |
| Modelos de loja (/modelos-loja/) | `pulso-atividade-2` | 800 × 800 (quadrada ou vertical) | `photo-1768929096297-ba9fde63f58f` |
| Modelos de loja (/modelos-loja/) | `pulso-atividade-3` | 800 × 800 (quadrada ou vertical) | `photo-1768853990312-0e20e64cf87f` |
| Modelos de loja (/modelos-loja/) | `pulso-produto-1` | 800 × 800 (quadrada ou vertical) | `photo-1763771522867-c26bf75f12bc` |
| Modelos de loja (/modelos-loja/) | `pulso-produto-2` | 800 × 800 (quadrada ou vertical) | `photo-1768929096150-9a76dc1d6560` |
| Modelos de loja (/modelos-loja/) | `onix-topo` | 1600 × 900 (horizontal, tela cheia) | `photo-1766595898967-22c61e0be796` |
| Modelos de loja (/modelos-loja/) | `onix-destaque` | 1000 × 1250 (vertical) | `photo-1600003014755-ba31aa59c4b6` |
| Modelos de loja (/modelos-loja/) | `onix-produto-1` | 800 × 800 (quadrada ou vertical) | `photo-1524805444758-089113d48a6d` |
| Modelos de loja (/modelos-loja/) | `onix-produto-2` | 800 × 800 (quadrada ou vertical) | `photo-1600003014608-c2ccc1570a65` |
| Modelos de loja (/modelos-loja/) | `aurea-topo` | 1000 × 1250 (vertical) | `photo-1585960622850-ed33c41d6418` |
| Modelos de loja (/modelos-loja/) | `aurea-categoria-1` | 800 × 800 (quadrada ou vertical) | `photo-1617038220319-276d3cfab638` |
| Modelos de loja (/modelos-loja/) | `aurea-categoria-2` | 800 × 800 (quadrada ou vertical) | `photo-1569397288884-4d43d6738fbd` |
| Modelos de loja (/modelos-loja/) | `aurea-categoria-3` | 800 × 800 (quadrada ou vertical) | `photo-1631982690223-8aa4be0a2497` |
| Modelos de loja (/modelos-loja/) | `aurea-categoria-4` | 800 × 800 (quadrada ou vertical) | `photo-1602173574767-37ac01994b2a` |
| Modelos de loja (/modelos-loja/) | `aurea-produto-1` | 800 × 800 (quadrada ou vertical) | `photo-1616837874254-8d5aaa63e273` |
| Modelos de loja (/modelos-loja/) | `aurea-produto-2` | 800 × 800 (quadrada ou vertical) | `photo-1620656798579-1984d9e87df7` |
| Modelos de loja (/modelos-loja/) | `aurea-produto-3` | 800 × 800 (quadrada ou vertical) | `photo-1633934542430-0905ccb5f050` |
| Modelos de loja (/modelos-loja/) | `aurea-produto-4` | 800 × 800 (quadrada ou vertical) | `photo-1601121141461-9d6647bca1ed` |
| Modelos de loja (/modelos-loja/) | `trama-topo` | 1600 × 900 (horizontal, tela cheia) | `photo-1590874103328-eac38a683ce7` |
| Modelos de loja (/modelos-loja/) | `trama-atelie` | 1000 × 1250 (vertical) | `photo-1774702535771-eec0c74d6cb9` |
| Modelos de loja (/modelos-loja/) | `trama-produto-1` | 800 × 800 (quadrada ou vertical) | `photo-1598532163257-ae3c6b2524b6` |
| Modelos de loja (/modelos-loja/) | `trama-produto-2` | 800 × 800 (quadrada ou vertical) | `photo-1584917865442-de89df76afd3` |
| Modelos de loja (/modelos-loja/) | `trama-produto-3` | 800 × 800 (quadrada ou vertical) | `photo-1600857062241-98e5dba7f214` |
| Modelos de loja (/modelos-loja/) | `trama-produto-4` | 800 × 800 (quadrada ou vertical) | `photo-1605733513597-a8f8341084e6` |
| Modelos de loja (/modelos-loja/) | `solar-topo` | 1000 × 1250 (vertical) | `photo-1785672021160-29cccd65500d` |
| Modelos de loja (/modelos-loja/) | `solar-produto-1` | 800 × 800 (quadrada ou vertical) | `photo-1511499767150-a48a237f0083` |
| Modelos de loja (/modelos-loja/) | `solar-produto-2` | 800 × 800 (quadrada ou vertical) | `photo-1577803645773-f96470509666` |
| Modelos de loja (/modelos-loja/) | `solar-produto-3` | 800 × 800 (quadrada ou vertical) | `photo-1584036553516-bf83210aa16c` |
| Modelos de loja (/modelos-loja/) | `solar-produto-4` | 800 × 800 (quadrada ou vertical) | `photo-1764783103855-2b747b9c8417` |
| Modelos de loja (/modelos-loja/) | `solar-produto-5` | 800 × 800 (quadrada ou vertical) | `photo-1653038282189-803202722a05` |
| Modelos de loja (/modelos-loja/) | `solar-produto-6` | 800 × 800 (quadrada ou vertical) | `photo-1611222777277-61319d63ca94` |

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
- Sem backend próprio. Os formulários das páginas de serviço enviam por e-mail via Web3Forms e oferecem continuar no WhatsApp; configure `WEB3FORMS_ACCESS_KEY` e `WHATSAPP_NUMBER` no topo do JS de cada página (`landingpage.js`, `ecommerce.js`, `personalizado.js`, `templates.js`). O botão **"Chamar no WhatsApp"** abaixo de cada formulário usa o mesmo `WHATSAPP_NUMBER` e fica **escondido enquanto o número estiver vazio**. Sem essa configuração, o formulário mostra uma mensagem de erro e mantém os dados preenchidos (nunca confirma um envio que não aconteceu).
- Valores da seção Investimento e dados da Política de Privacidade estão marcados com `PREENCHER` nos arquivos.
- Publicada via widget HTML do Elementor, a página não define `<title>` nem meta tags — SEO deve ser configurado nas opções da página no WordPress.
- As fotos da página de Modelos vêm do Unsplash (licença gratuita, uso comercial permitido) e são carregadas direto do CDN deles (`images.unsplash.com`). Para não depender do Unsplash, baixe as fotos, suba na Biblioteca de Mídia do WordPress e troque os `src`. Use só fotos de `images.unsplash.com` (as de `plus.unsplash.com` são pagas).
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

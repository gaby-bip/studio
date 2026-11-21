# Copy $ Brota — Site

> Publicadas: a **página inicial** (`index.html` → `elementor-html.html`) e a **Política de Privacidade** (`s-privacidade/`). As páginas de serviço (`s-landingpage`, `s-ecommerce`, `s-personalizado`) continuam no projeto com a identidade antiga (brotalink), mas não são publicadas.

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
├── index.html                 # Página inicial Copy $ Brota; referencia landing-page.css e landing-page.js
├── landing-page.css           # Estilos da página inicial (escopados em #csb-site)
├── landing-page.js            # Interações (menu, carrossel, animações, links do WhatsApp/Instagram)
├── marca/copybrota/           # Logos Copy $ Brota (originais + versões web .webp com fundo transparente)
├── portfolio/                 # Modelos do portfólio: modelos.html (fonte), gerar-imagens.py e as imagens .webp
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

## Página inicial (Copy $ Brota)

**Seções** (IDs dentro de `#csb-site`): `csb-inicio` (hero), faixa animada, `csb-servicos`, `csb-portfolio` (carrossel), `csb-diferenciais`, `csb-oferta`, `csb-contato` (chamada final) e rodapé. Não há formulários nem preços: todo botão comercial abre o WhatsApp.

**Configuração** (topo de `landing-page.js`):
- `CSB_WHATSAPP_NUMBER`: número com 55 + DDD (hoje `5513974182734`).
- `CSB_INSTAGRAM_URL`: link do perfil. Vazio = ícone do Instagram escondido no rodapé.
- `CSB_MESSAGES`: mensagem pré-preenchida de cada botão (`data-csb-msg="geral|landing|site|ecommerce|redesign|desconto"`).
- `CSB_CAROUSEL_SPEED`: velocidade do carrossel (px/s).

**Portfólio**: 6 modelos de demonstração (marcas fictícias) — Saúde: psicóloga e nutricionista; Beleza: clínica de estética e depilação a laser; Personal: personal trainer e estúdio funcional. As telas são páginas reais em `portfolio/modelos.html`, fotografadas pelo `portfolio/gerar-imagens.py` (Edge headless, 960 × 600 px, ~30 KB cada). Para mudar um modelo: edite `modelos.html` (as fotos são do Unsplash, licença gratuita), suba o servidor local e rode `python portfolio/gerar-imagens.py`. Para colocar um projeto real, troque o `src` do card no `index.html`. O carrossel duplica os cards sozinho para o loop.

**Logos**: `marca/copybrota/copybrota-csb.webp` (cabeçalho, rodapé e mockup) e `copybrota-logo-completa.webp` (chamada final), gerados a partir dos arquivos originais em `marca/copybrota/originais/`. O build embute logos e imagens do portfólio no `elementor-html.html` (por isso ele tem ~520 KB). Para deixar a página bem mais leve, suba os `.webp` de `marca/copybrota/` e `portfolio/` na Mídia do WordPress e troque os `src` no `index.html` pela URL (links `https://` não são embutidos).

**Como publicar no Elementor**
1. Rode `python build-elementor.py`.
2. No WordPress, edite a página inicial com o Elementor e use o modelo de página **Elementor Canvas** (sem cabeçalho/rodapé do tema, já que a página tem os seus).
3. Crie **um** contêiner/seção com **largura total** e espaçamento interno **0**, e coloque **um** widget **HTML**.
4. Cole **todo** o conteúdo de `elementor-html.html` no widget e atualize. Apague o widget antigo da brotalink (`#ss-landing`), para não ficarem duas páginas empilhadas.
5. Não aplique "Efeitos de movimento" ou animações de entrada do Elementor nesse contêiner: eles criam `transform` no pai e quebram o menu mobile e o botão flutuante (`position: fixed`).

## Arquitetura e organização

- **Estrutura (`index.html`)**: todo o conteúdo está dentro de `#csb-site`. Classes com prefixo `csb-` e convenção BEM (`csb-bloco__elemento--modificador`).
- **Estilos (`landing-page.css`)**: tudo escopado sob `#csb-site`, sem seletores globais. Cores, fontes e métricas em variáveis no topo. Há um reset local (só dentro de `#csb-site`) para neutralizar estilos do tema e do kit do Elementor.
- **Interações (`landing-page.js`)**: IIFE em ES5, com guarda contra rodar duas vezes no editor do Elementor (`data-csb-ready`).
- **Consolidação (`elementor-html.html`)**: união dos três arquivos + imagens embutidas, gerada pelo `build-elementor.py`.

## Funcionalidades (página inicial)

- Cabeçalho fixo que ganha fundo ao rolar; link ativo conforme a seção visível; menu mobile em tela cheia (fecha com Esc ou ao tocar num link).
- Rolagem suave entre seções, com compensação da altura do cabeçalho.
- Hero com entrada animada da headline, revelação do "BROTAR", mockup de notebook em HTML/CSS (sem imagem) flutuando e leve parallax com o mouse.
- Cards de serviço com preenchimento pink no hover/foco (o card inteiro é clicável).
- Carrossel contínuo do portfólio: pausa com o mouse em cima, ao focar pelo teclado ou ao tocar; retoma sozinho; setas e teclas ← →; arrastar com o mouse; deslizar no celular; só anima quando está visível na tela.
- Revelação dos elementos ao rolar (`IntersectionObserver`), em cascata nos grupos de cards.
- Botão flutuante do WhatsApp que aparece depois da primeira dobra.
- `prefers-reduced-motion`: sem carrossel automático, faixa parada e sem animações.

## Limitações conhecidas

- As três páginas de serviço compartilham o mesmo CSS/JS (copiados, com prefixos diferentes). Correções em uma devem ser repetidas nas outras.
- Sem backend próprio. Os formulários das páginas de serviço enviam por e-mail via Web3Forms e oferecem continuar no WhatsApp; configure `WEB3FORMS_ACCESS_KEY` e `WHATSAPP_NUMBER` no topo do JS de cada página (`landingpage.js`, `ecommerce.js`, `personalizado.js`). O botão **"Chamar no WhatsApp"** abaixo de cada formulário usa o mesmo `WHATSAPP_NUMBER` e fica **escondido enquanto o número estiver vazio**. Sem essa configuração, o formulário mostra uma mensagem de erro e mantém os dados preenchidos (nunca confirma um envio que não aconteceu).
- Dados da Política de Privacidade estão marcados com `PREENCHER` nos arquivos. As páginas de serviço ainda mostram valores e formulários (a página inicial não).
- Publicada via widget HTML do Elementor, a página não define `<title>` nem meta tags — SEO deve ser configurado nas opções da página no WordPress.
- As fontes vêm do Google Fonts: o navegador do visitante se conecta aos servidores do Google (citado na Política de Privacidade). Sem conexão com o Google, o site usa fontes de sistema parecidas.

## Identidade visual (Copy $ Brota)

| Cor | Hex | Uso |
|---|---|---|
| Preto | `#0A0A0A` | fundo predominante |
| Pink | `#E60662` | cifrão do logo, botões (texto preto, 4,6:1), faixas e formas |
| Pink claro | `#FF4D93` | textos pequenos em pink sobre preto (contraste AA) |
| Off-white | `#F2ECE4` | textos e letras do logo |
| Cinza quente | `#B5AEA6` | textos de apoio |

- Títulos: **Anton** (caixa alta). Textos: **Archivo**. Palavra de destaque ("BROTAR"): Anton em pink, inclinada, com textura (classe `csb-accent`).
- Logos: sempre os arquivos de `marca/copybrota/` (não recriar com fontes). C$B no cabeçalho/rodapé; logo completa em aplicações grandes.
- Textura: grão leve em SVG (sem imagens pesadas) e bordas de "papel rasgado" com `clip-path`. Sem mascotes, coroas, estrelas, corações ou respingos.

### Identidade antiga (brotalink) — ainda usada nas páginas `s-*`


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

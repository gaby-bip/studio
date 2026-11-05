"""
Gera as versões consolidadas para o widget HTML do Elementor.

    python build-elementor.py

Fontes (edite SEMPRE estes arquivos):
  index.html + landing-page.css + landing-page.js
      -> elementor-html.html
  s-landingpage/landingpage.html + landingpage.css + landingpage.js
      -> s-landingpage/elementor-landingpage.html
      (as imagens de assets/ são embutidas no próprio HTML)

Os arquivos gerados são UTF-8 com BOM (garante acentos corretos ao abrir o arquivo direto no navegador). Não edite os arquivos gerados à mão:
as alterações seriam perdidas na próxima geração.
Usa apenas a biblioteca padrão do Python 3.
"""

import base64
import mimetypes
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent

HEADER = """<!-- ============================================================
     ELEMENTOR - WIDGET HTML  ({name})
     ARQUIVO GERADO por build-elementor.py. NAO edite a mao:
     altere {sources} e rode:  python build-elementor.py
     Cole TODO o conteudo deste arquivo em UM unico widget HTML.
     CSS, JS e imagens estao embutidos: nao depende de arquivos externos.
     ============================================================ -->
"""


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig").replace("\r\n", "\n")


def extract_block(html: str, root_id: str) -> str:
    start = html.find(f'<div id="{root_id}"')
    end_marker = f"<!-- /#{root_id} -->"
    end = html.find(end_marker)
    if start < 0 or end < 0:
        raise SystemExit(f"Não encontrei o bloco #{root_id} (início ou marcador '{end_marker}').")
    return html[start:end + len(end_marker)]


def inline_images(markup: str, base_dir: Path) -> str:
    def repl(match):
        src = match.group(1)
        if src.startswith(("http:", "https:", "data:", "/")):
            return match.group(0)
        file = (base_dir / src).resolve()
        if not file.is_file():
            raise SystemExit(f"Imagem não encontrada: {file}")
        mime = mimetypes.guess_type(file.name)[0] or "application/octet-stream"
        data = base64.b64encode(file.read_bytes()).decode("ascii")
        return f'src="data:{mime};base64,{data}"'

    return re.sub(r'src="([^"]+)"', repl, markup)


def build(name, html_path, css_path, js_path, root_id, out_path, embed_images=False):
    html = read(html_path)
    markup = extract_block(html, root_id)
    if embed_images:
        markup = inline_images(markup, html_path.parent)
    css = read(css_path).rstrip() + "\n"
    js = read(js_path).rstrip() + "\n"

    sources = ", ".join(p.relative_to(ROOT).as_posix() for p in (html_path, css_path, js_path))
    out = (
        HEADER.format(name=name, sources=sources)
        + "\n<style>\n" + css + "</style>\n\n"
        + markup + "\n\n"
        + "<script>\n" + js + "</script>\n"
    )
    out_path.write_text(out, encoding="utf-8-sig", newline="\n")
    print(f"OK  {out_path.relative_to(ROOT).as_posix()}  ({len(out.encode('utf-8')) // 1024} KB)")


if __name__ == "__main__":
    build(
        "Página inicial",
        ROOT / "index.html",
        ROOT / "landing-page.css",
        ROOT / "landing-page.js",
        "ss-landing",
        ROOT / "elementor-html.html",
    )
    lp = ROOT / "s-landingpage"
    build(
        "Serviço: Landing Page",
        lp / "landingpage.html",
        lp / "landingpage.css",
        lp / "landingpage.js",
        "ws-landing-page",
        lp / "elementor-landingpage.html",
        embed_images=True,
    )

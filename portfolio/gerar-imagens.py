"""
Gera as imagens do portfólio a partir de portfolio/modelos.html.

    python -m http.server 8765      (em outro terminal, na raiz do projeto)
    python portfolio/gerar-imagens.py

Precisa do Microsoft Edge e do Pillow (pip install pillow).
"""

import subprocess
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
URL = "http://localhost:8765/portfolio/modelos.html?m={}"
MODELOS = ["psicologia", "nutricao", "estetica", "laser", "personal", "estudio"]

for nome in MODELOS:
    with tempfile.TemporaryDirectory() as tmp:
        png = Path(tmp) / "shot.png"
        subprocess.run([
            EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars",
            "--window-size=1440,900", "--virtual-time-budget=10000",
            f"--user-data-dir={tmp}", f"--screenshot={png}", URL.format(nome),
        ], check=True, capture_output=True, timeout=90)
        img = Image.open(png).convert("RGB").crop((0, 0, 1440, 900))
        out = ROOT / f"modelo-{nome}.webp"
        img.resize((960, 600), Image.LANCZOS).save(out, quality=74, method=6)
        print(f"OK  {out.name}  ({out.stat().st_size // 1024} KB)")

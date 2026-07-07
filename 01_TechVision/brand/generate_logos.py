from pathlib import Path


ROOT = Path(__file__).resolve().parent
SVG_DIR = ROOT / "svg"
SVG_DIR.mkdir(parents=True, exist_ok=True)

W = 1280
H = 760


def write(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def svg_shell(title: str, body: str, bg="#F4F4F2") -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <rect width="{W}" height="{H}" fill="{bg}"/>
  <style>
    .word {{ font-family: Inter, Manrope, 'Segoe UI', Arial, sans-serif; font-weight: 650; letter-spacing: 0; }}
    .sub {{ font-family: Inter, Manrope, 'Segoe UI', Arial, sans-serif; font-weight: 500; letter-spacing: 3px; }}
    .label {{ font-family: Inter, Manrope, 'Segoe UI', Arial, sans-serif; font-weight: 650; letter-spacing: 0; }}
  </style>
  <text x="56" y="72" class="label" font-size="22" fill="#73777F">{title}</text>
  {body}
</svg>
"""


def noverra() -> str:
    body = """
  <g transform="translate(98 180)">
    <rect x="0" y="0" width="180" height="180" rx="42" fill="#111418"/>
    <ellipse cx="90" cy="90" rx="28" ry="54" fill="none" stroke="#F4F4F2" stroke-width="5"/>
    <path d="M52 126 L52 54 L128 126 L128 54" fill="none" stroke="#F4F4F2" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="330" y="286" class="word" font-size="92" fill="#111418">Noverra</text>
  <text x="336" y="340" class="sub" font-size="20" fill="#626873">DIGITAL SYSTEMS</text>
  <g transform="translate(98 500)">
    <rect x="0" y="0" width="64" height="64" rx="16" fill="#111418"/>
    <path d="M20 45 L20 19 L44 45 L44 19" fill="none" stroke="#F4F4F2" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="184" y="544" class="word" font-size="44" fill="#111418">Noverra</text>
"""
    return svg_shell("01 / recommended: quiet premium, strongest for deck", body)


def aureon() -> str:
    body = """
  <g transform="translate(98 180)">
    <circle cx="90" cy="90" r="84" fill="#111418"/>
    <path d="M90 28 L142 148 H118 L106 120 H74 L62 148 H38 Z" fill="#F6F7F9"/>
    <path d="M82 101 H99 L90 76 Z" fill="#111418"/>
    <circle cx="90" cy="90" r="56" fill="none" stroke="#DCE7F5" stroke-width="5" opacity=".72"/>
  </g>
  <text x="330" y="286" class="word" font-size="92" fill="#111418">Aureon</text>
  <text x="336" y="340" class="sub" font-size="20" fill="#626873">PRODUCT STUDIO</text>
  <g transform="translate(98 500)">
    <circle cx="32" cy="32" r="32" fill="#111418"/>
    <path d="M32 11 L51 53 H43 L39 43 H26 L21 53 H13 Z" fill="#F6F7F9"/>
  </g>
  <text x="184" y="544" class="word" font-size="44" fill="#111418">Aureon</text>
"""
    return svg_shell("02 / premium monogram, slightly more luxury", body)


def velora() -> str:
    body = """
  <g transform="translate(98 180)">
    <rect x="0" y="0" width="180" height="180" rx="90" fill="#111418"/>
    <path d="M42 58 L88 132 L138 58" fill="none" stroke="#F6F7F9" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M66 58 L89 96 L114 58" fill="none" stroke="#DCE7F5" stroke-width="6" stroke-linecap="round" opacity=".85"/>
  </g>
  <text x="330" y="286" class="word" font-size="92" fill="#111418">Velora</text>
  <text x="336" y="340" class="sub" font-size="20" fill="#626873">BUSINESS TECHNOLOGY</text>
  <g transform="translate(98 500)">
    <rect x="0" y="0" width="64" height="64" rx="32" fill="#111418"/>
    <path d="M16 22 L32 47 L49 22" fill="none" stroke="#F6F7F9" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="184" y="544" class="word" font-size="44" fill="#111418">Velora</text>
"""
    return svg_shell("03 / softer premium, less enterprise", body)


def arcline() -> str:
    body = """
  <g transform="translate(98 180)">
    <rect x="0" y="0" width="180" height="180" rx="38" fill="#111418"/>
    <path d="M44 128 C56 62 100 40 138 54" fill="none" stroke="#F6F7F9" stroke-width="15" stroke-linecap="round"/>
    <path d="M48 126 H138" fill="none" stroke="#DCE7F5" stroke-width="7" stroke-linecap="round"/>
    <circle cx="138" cy="54" r="10" fill="#DCE7F5"/>
  </g>
  <text x="330" y="286" class="word" font-size="92" fill="#111418">Arcline</text>
  <text x="336" y="340" class="sub" font-size="20" fill="#626873">DIGITAL PARTNERS</text>
  <g transform="translate(98 500)">
    <rect x="0" y="0" width="64" height="64" rx="14" fill="#111418"/>
    <path d="M16 46 C22 22 39 16 50 20" fill="none" stroke="#F6F7F9" stroke-width="6" stroke-linecap="round"/>
    <path d="M17 46 H50" fill="none" stroke="#DCE7F5" stroke-width="3" stroke-linecap="round"/>
  </g>
  <text x="184" y="544" class="word" font-size="44" fill="#111418">Arcline</text>
"""
    return svg_shell("04 / process and growth, best for consulting", body)


def lumeniq() -> str:
    body = """
  <g transform="translate(98 180)">
    <rect x="0" y="0" width="180" height="180" rx="42" fill="#111418"/>
    <path d="M90 34 L110 72 L152 90 L110 108 L90 146 L70 108 L28 90 L70 72 Z" fill="#F6F7F9"/>
    <circle cx="90" cy="90" r="25" fill="#111418"/>
    <circle cx="90" cy="90" r="13" fill="#DCE7F5"/>
  </g>
  <text x="330" y="286" class="word" font-size="92" fill="#111418">Lumeniq</text>
  <text x="336" y="340" class="sub" font-size="20" fill="#626873">INTELLIGENT SYSTEMS</text>
  <g transform="translate(98 500)">
    <rect x="0" y="0" width="64" height="64" rx="16" fill="#111418"/>
    <path d="M32 10 L40 25 L55 32 L40 39 L32 54 L24 39 L9 32 L24 25 Z" fill="#F6F7F9"/>
  </g>
  <text x="184" y="544" class="word" font-size="44" fill="#111418">Lumeniq</text>
"""
    return svg_shell("05 / luminous tech, most futuristic", body)


logos = {
    "01_noverra.svg": noverra(),
    "02_aureon.svg": aureon(),
    "03_velora.svg": velora(),
    "04_arcline.svg": arcline(),
    "05_lumeniq.svg": lumeniq(),
}

for filename, content in logos.items():
    write(SVG_DIR / filename, content)

board = """<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Logo board - premium tech</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #050608;
      color: #f6f7f9;
      font-family: Inter, Manrope, "Segoe UI", Arial, sans-serif;
    }
    main {
      max-width: 1420px;
      margin: 0 auto;
      padding: 44px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 46px;
      line-height: 1;
      letter-spacing: 0;
      font-weight: 680;
    }
    p {
      max-width: 760px;
      margin: 0 0 32px;
      color: #aeb6c2;
      font-size: 18px;
      line-height: 1.45;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }
    .tile {
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 18px;
      background: #f4f4f2;
      box-shadow: 0 26px 80px rgba(0,0,0,.32);
    }
    .tile.recommended {
      border-color: rgba(220,231,245,.72);
      box-shadow: 0 0 0 1px rgba(220,231,245,.26), 0 30px 90px rgba(0,0,0,.38);
    }
    img {
      display: block;
      width: 100%;
      aspect-ratio: 1280 / 760;
      background: #f4f4f2;
    }
    .caption {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 18px 18px;
      background: #0d1015;
      color: #f6f7f9;
      font-size: 15px;
    }
    .caption span:last-child {
      color: #aeb6c2;
      text-align: right;
    }
    @media (max-width: 880px) {
      main { padding: 24px; }
      .grid { grid-template-columns: 1fr; }
      h1 { font-size: 36px; }
    }
  </style>
</head>
<body>
  <main>
    <h1>Logo board: premium tech</h1>
    <p>Пять направлений для вымышленной IT-компании в стиле текущей презентации: спокойная премиальность, чёрно-белая основа, минимум эффектов, хороший вид на тёмных и светлых слайдах.</p>
    <section class="grid">
"""

captions = [
    ("01_noverra.svg", "Noverra", "Рекомендую: лучше всего совпадает с презентацией."),
    ("02_aureon.svg", "Aureon", "Более люксовый монограммный вариант."),
    ("03_velora.svg", "Velora", "Мягкий премиальный знак, менее B2B."),
    ("04_arcline.svg", "Arcline", "Процесс, рост, консалтинг."),
    ("05_lumeniq.svg", "LumenIQ", "Более футуристичный tech-образ."),
]

for i, (file, name, note) in enumerate(captions):
    klass = "tile recommended" if i == 0 else "tile"
    board += f"""      <article class="{klass}">
        <img src="svg/{file}" alt="{name}">
        <div class="caption"><strong>{name}</strong><span>{note}</span></div>
      </article>
"""

board += """    </section>
  </main>
</body>
</html>
"""

write(ROOT / "logo_board.html", board)

summary = """# Logo board

Рекомендованное направление: **Noverra**.

Почему:

- звучит спокойнее и дороже, чем TechVision;
- не выглядит как типовое название IT-компании;
- коротко читается на обложке;
- знак с монограммой N подходит для тёмных и светлых слайдов;
- айдентика ближе к премиальному минимализму текущей презентации.

Остальные варианты:

- Aureon: более люксовый, но может звучать менее технологично.
- Velora: мягкий и приятный, но слабее для B2B.
- Arcline: хорошо для консалтинга и процессов.
- LumenIQ: самый технологичный, но чуть более стартапный.

Юридическая оговорка: это концепты для портфолио. Для реального клиента нужно делать проверку названия и товарного знака.
"""

write(ROOT / "logo_notes.md", summary)
print(ROOT / "logo_board.html")

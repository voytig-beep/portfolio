from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "selected"
OUT.mkdir(parents=True, exist_ok=True)


def write(name: str, content: str) -> None:
    (OUT / name).write_text(content, encoding="utf-8")


MARK_PATHS = """
  <rect x="0" y="0" width="180" height="180" rx="42" fill="{bg}"/>
  <ellipse cx="90" cy="90" rx="28" ry="54" fill="none" stroke="{fg}" stroke-width="5"/>
  <path d="M52 126 L52 54 L128 126 L128 54" fill="none" stroke="{fg}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
"""


def mark_svg(bg="#111418", fg="#F4F4F2", size=180) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 180 180">
{MARK_PATHS.format(bg=bg, fg=fg)}
</svg>
"""


def lockup_svg(mode: str) -> str:
    dark = mode == "dark"
    bg = "#030406" if dark else "#F4F4F2"
    word = "#F4F4F2" if dark else "#111418"
    muted = "#F4F4F2" if dark else "#111418"
    mark_bg = "#F4F4F2" if dark else "#111418"
    mark_fg = "#111418" if dark else "#F4F4F2"
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="940" height="260" viewBox="0 0 940 260">
  <rect width="940" height="260" fill="{bg}"/>
  <style>
    .word {{ font-family: Inter, Manrope, 'Segoe UI', Arial, sans-serif; font-weight: 680; letter-spacing: 0; }}
    .sub {{ font-family: Inter, Manrope, 'Segoe UI', Arial, sans-serif; font-weight: 520; letter-spacing: 7px; }}
  </style>
  <g transform="translate(70 40)">
{MARK_PATHS.format(bg=mark_bg, fg=mark_fg)}
  </g>
  <text x="300" y="128" class="word" font-size="76" fill="{word}">Noverra</text>
  <text x="306" y="177" class="sub" font-size="20" fill="{muted}">DIGITAL SYSTEMS</text>
</svg>
"""


def favicon_svg() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="15" fill="#111418"/>
  <ellipse cx="32" cy="32" rx="10" ry="19" fill="none" stroke="#F4F4F2" stroke-width="2.4"/>
  <path d="M20 45 L20 19 L44 45 L44 19" fill="none" stroke="#F4F4F2" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
"""


write("noverra_mark.svg", mark_svg())
write("noverra_mark_inverse.svg", mark_svg(bg="#F4F4F2", fg="#111418"))
write("noverra_lockup_light.svg", lockup_svg("light"))
write("noverra_lockup_dark.svg", lockup_svg("dark"))
write("favicon.svg", favicon_svg())

guidelines = """# Noverra identity

Рабочее название компании: **Noverra**.

Смысл:

- premium digital systems;
- спокойная технологичность;
- не стартапный шум, а уверенная B2B-подача;
- знак должен выглядеть дорого на фотофонах и белых слайдах.

## Основной комплект

- `noverra_mark.svg` — знак для светлых фонов.
- `noverra_mark_inverse.svg` — знак для тёмных фонов.
- `noverra_lockup_light.svg` — полный логотип для светлых слайдов.
- `noverra_lockup_dark.svg` — полный логотип для тёмных слайдов.
- `favicon.svg` — маленькая версия знака.

## Цвета

- Graphite: #111418.
- Paper: #F4F4F2.

В логотипе использовать только эти 2 цвета. Дополнительные оттенки допустимы в слайдах, но не в знаке.

## Использование в презентации

- На тёмной обложке использовать `noverra_lockup_dark.svg`.
- На светлых слайдах использовать `noverra_lockup_light.svg` или только `noverra_mark.svg`.
- Не использовать цветные градиенты в логотипе.
- Не ставить знак поверх шумной зоны фото без затемнения.
- Минимальный отступ вокруг знака: половина ширины иконки.

## Следующий шаг

После утверждения Noverra заменить TechVision в HTML и PPTX, затем пересобрать PPTX от визуальной структуры HTML.
"""

write("brand_guidelines.md", guidelines)
print(OUT)

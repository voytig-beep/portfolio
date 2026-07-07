from pathlib import Path

from PIL import Image, ImageEnhance


ROOT = Path(__file__).resolve().parents[1]
SLIDES_DIR = ROOT / "exports" / "pptx_match_slides"
OUT = ROOT / "exports" / "Noverra_video_preview.gif"

SIZE = (960, 540)
HOLD_MS = 900
FADE_STEPS = 3
FADE_MS = 90


def fit_slide(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGB")
    image = image.resize(SIZE, Image.Resampling.LANCZOS)
    return image


def add_vignette(image: Image.Image) -> Image.Image:
    # ponytail: subtle shared polish; remove if GIF size matters more than finish.
    overlay = Image.new("RGB", SIZE, (0, 0, 0))
    mask = Image.new("L", SIZE, 0)
    pixels = mask.load()
    width, height = SIZE
    cx, cy = width / 2, height / 2
    max_dist = (cx * cx + cy * cy) ** 0.5
    for y in range(height):
        for x in range(width):
            dist = (((x - cx) ** 2 + ((y - cy) * 1.12) ** 2) ** 0.5) / max_dist
            pixels[x, y] = max(0, min(80, int((dist - 0.48) * 140)))
    return Image.composite(overlay, image, mask)


def main() -> None:
    slide_paths = sorted(SLIDES_DIR.glob("slide_*.png"))
    if len(slide_paths) != 10:
        raise SystemExit(f"Expected 10 slides, found {len(slide_paths)} in {SLIDES_DIR}")

    slides = [add_vignette(ImageEnhance.Contrast(fit_slide(path)).enhance(1.02)) for path in slide_paths]
    frames: list[Image.Image] = []
    durations: list[int] = []

    for index, current in enumerate(slides):
        frames.append(current)
        durations.append(HOLD_MS)
        if index == len(slides) - 1:
            continue
        nxt = slides[index + 1]
        for step in range(1, FADE_STEPS + 1):
            alpha = step / (FADE_STEPS + 1)
            frames.append(Image.blend(current, nxt, alpha))
            durations.append(FADE_MS)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        OUT,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )
    print(f"saved {OUT}")
    print(f"frames {len(frames)} duration_ms {sum(durations)} size {OUT.stat().st_size}")


if __name__ == "__main__":
    main()

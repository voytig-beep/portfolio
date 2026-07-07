from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
src = Path(r'C:\Users\Querido Amigo\Desktop\Портфолио\01_TechVision\exports\html_slides')
out = Path(r'C:\Users\Querido Amigo\Desktop\Портфолио\01_TechVision\exports\html_contact_sheet.jpg')
files = sorted(src.glob('slide_*.png'))
thumb_w, thumb_h = 360, 203
cols = 2
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (thumb_w * cols, thumb_h * rows), (0, 0, 0))
for i, f in enumerate(files):
    img = Image.open(f).convert('RGB')
    img = ImageOps.fit(img, (thumb_w, thumb_h), method=Image.Resampling.LANCZOS)
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, 52, 24), fill=(0, 0, 0))
    d.text((8, 6), f.stem[-2:], fill=(255, 255, 255))
    sheet.paste(img, ((i % cols) * thumb_w, (i // cols) * thumb_h))
sheet.save(out, quality=92)
print(out)

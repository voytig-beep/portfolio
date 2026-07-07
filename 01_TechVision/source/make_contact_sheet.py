from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
assets = Path(r'C:\Users\Querido Amigo\Desktop\Портфолио\01_TechVision\assets')
out = Path(r'C:\Users\Querido Amigo\Desktop\Портфолио\01_TechVision\exports\photo_contact_sheet.jpg')
files = list(assets.glob('*.jpg'))
thumbs = []
for f in files:
    img = Image.open(f).convert('RGB')
    img = ImageOps.fit(img, (420, 236), method=Image.Resampling.LANCZOS)
    d = ImageDraw.Draw(img)
    d.rectangle((0, 202, 420, 236), fill=(0, 0, 0))
    d.text((12, 212), f.name, fill=(255, 255, 255))
    thumbs.append(img)
sheet = Image.new('RGB', (840, 944), (12, 15, 23))
for i, img in enumerate(thumbs):
    sheet.paste(img, ((i % 2) * 420, (i // 2) * 236))
sheet.save(out, quality=92)
print(out)

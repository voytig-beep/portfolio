from pathlib import Path
from zipfile import ZipFile
pptx = Path(r'C:\Users\Querido Amigo\Desktop\Портфолио\01_TechVision\Noverra_коммерческое_предложение.pptx')
with ZipFile(pptx) as z:
    media = [n for n in z.namelist() if n.startswith('ppt/media/')]
    rels = [z.read(n).decode('utf-8', 'ignore') for n in z.namelist() if n.startswith('ppt/slides/_rels/')]
external = [r for r in rels if 'TargetMode="External"' in r]
print('media_files', len(media))
print('external_links', len(external))
print('pptx_size', pptx.stat().st_size)

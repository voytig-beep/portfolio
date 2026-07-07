from pathlib import Path
import re
html_path = Path(r'C:\Users\Querido Amigo\Desktop\Портфолио\01_TechVision\html\index.html')
html = html_path.read_text(encoding='utf-8')
refs = re.findall(r"\.\./(?:assets|brand)/[^\"')]+", html)
missing = []
for ref in refs:
    target = (html_path.parent / ref).resolve()
    if not target.exists():
        missing.append(ref)
print(f"slides={html.count('<section class=\"slide')}")
print(f"refs={len(refs)}")
print(f"missing={missing}")
print(f"has_noverra={'Noverra' in html}")

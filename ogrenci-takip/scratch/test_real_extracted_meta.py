import sys
import re

with open(r'c:\Users\egeme\OneDrive\Desktop\CODEX\EdTech\ogrenci-takip\scratch\test_clean_fulltext.txt', encoding='utf-8') as f:
    text = f.read()

from test_name_fix import extract_karne_metadata

meta = extract_karne_metadata(text)
print("Extracted Metadata:")
for k, v in meta.items():
    print(f"  {k}: {repr(v)}")

assert meta['ogrenciAdi'] == 'KEREM DEMİRER', f"Expected KEREM DEMİRER, got {meta['ogrenciAdi']}"
assert meta['sinavAdi'] == 'ALTERNATİF TYT', f"Expected ALTERNATİF TYT, got {meta['sinavAdi']}"
assert meta['sinavKodu'] == '120801', f"Expected 120801, got {meta['sinavKodu']}"
assert meta['sinavTarihi'] == '2026-11-07', f"Expected 2026-11-07, got {meta['sinavTarihi']}"
assert meta['ogrenciNo'] == '46164', f"Expected 46164, got {meta['ogrenciNo']}"
assert meta['ogrenciSinifi'] == '1313', f"Expected 1313, got {meta['ogrenciSinifi']}"
print("\nALL ASSERTIONS PASSED FOR METADATA EXTRACTION!")

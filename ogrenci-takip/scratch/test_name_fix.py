# -*- coding: utf-8 -*-
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

def extract_karne_metadata(text):
    clean_text = text.replace('\r\n', '\n').replace('\r', '\n')
    lines = [l.strip() for l in clean_text.split('\n') if l.strip()]

    ogrenciAdi = ''
    sinavAdi = ''
    sinavTarihi = ''
    sinavKodu = ''
    ogrenciNo = ''
    ogrenciSinifi = ''
    kitapcik = 'A'

    # 1. Key-Value Pattern with colon (e.g. Öğrenci Adı: KEREM DEMİRER)
    m = re.search(r'Öğrenci\s*Adı\s*:\s*([^\n\r]+)', clean_text, re.IGNORECASE)
    if m:
        val = m.group(1).strip()
        # Clean off any trailing table labels if they were captured
        val = re.split(r'\s{2,}|\bSınıfı\b|\bNo\b|\bKitapçık\b', val)[0].strip()
        if val and not re.search(r'^(?:Sınıfı|No|Kitapçık|Türü)', val, re.IGNORECASE):
            ogrenciAdi = val

    # 2. Table-Row / Multiline Pattern
    if not ogrenciAdi:
        for i, l in enumerate(lines):
            # Case 1: Line contains "Öğrenci Adı" and other column headers:
            # e.g. "Öğrenci Adı Sınıfı No Kitapçık Türü" or "Öğrenci Adı    Sınıfı    No"
            if re.search(r'Öğrenci\s*Adı', l, re.IGNORECASE):
                # If there are other headers on this same line:
                if re.search(r'Sınıfı|No|Kitapçık', l, re.IGNORECASE):
                    # Next line is the values row! e.g. "KEREM DEMİRER 1313 46164 B"
                    if i + 1 < len(lines):
                        val_line = lines[i + 1]
                        # Extract name from beginning of val_line:
                        # e.g. "KEREM DEMİRER 1313 46164 B"
                        # Name is everything before class number and student number
                        vm = re.match(r'^([A-ZÇĞİÖŞÜa-zçğıöşü\s]+?)\s+(\d{1,5}[A-Za-z\-]*)\s+(\d{2,10})(?:\s+([A-D]))?$', val_line)
                        if vm:
                            ogrenciAdi = vm.group(1).strip()
                            ogrenciSinifi = vm.group(2).strip()
                            ogrenciNo = vm.group(3).strip()
                            if vm.group(4):
                                kitapcik = vm.group(4).strip()
                            break
                        else:
                            # Loose regex: student name followed by digits
                            vm2 = re.match(r'^([A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,30}?)\s+(\d{2,10}|\d{1,4}[A-Za-z\-]*)', val_line)
                            if vm2:
                                ogrenciAdi = vm2.group(1).strip()
                                break
                            else:
                                # Just take the first part before multiple spaces or digits
                                parts = re.split(r'\s{2,}|\b\d{2,}\b', val_line)
                                if parts and len(parts[0].strip()) > 2:
                                    ogrenciAdi = parts[0].strip()
                                    break
                else:
                    # Single "Öğrenci Adı" on its own line (OCR format)
                    if i + 1 < len(lines):
                        next_l = lines[i + 1]
                        if not re.search(r'^(?:Sınıfı|No|Kitapçık|Türü|Sınav|Puan)', next_l, re.IGNORECASE):
                            ogrenciAdi = next_l.strip()
                            break

    # Sınav Adı extraction
    m_snv = re.search(r'Sınav\s*Adı\s*:\s*([^\n\r]+)', clean_text, re.IGNORECASE)
    if m_snv:
        val = m_snv.group(1).strip()
        val = re.split(r'\s{2,}|\bŞube\b|\bSınav Kodu\b|\bSınav Tarihi\b', val)[0].strip()
        if val: sinavAdi = val

    if not sinavAdi:
        for i, l in enumerate(lines):
            if re.search(r'Sınav\s*Adı', l, re.IGNORECASE):
                if re.search(r'Şube|Sınav Kodu|Tarih', l, re.IGNORECASE):
                    if i + 1 < len(lines):
                        val_line = lines[i + 1]
                        # e.g. "ALTERNATİF TYT İzmit 120801 07.11.2026"
                        vm = re.match(r'^(.+?)\s+([A-ZÇĞİÖŞÜa-zçğıöşü]+)\s+(\d{4,10})\s+(\d{1,2}\.\d{1,2}\.\d{4})$', val_line)
                        if vm:
                            sinavAdi = vm.group(1).strip()
                            sinavKodu = vm.group(3).strip()
                            sinavTarihi = vm.group(4).strip()
                            break
                        else:
                            # Take first part before city/date/code
                            parts = re.split(r'\s{2,}|\b\d{4,}\b|\b\d{2}\.\d{2}\.\d{4}\b', val_line)
                            if parts and len(parts[0].strip()) > 2:
                                sinavAdi = parts[0].strip()
                                break
                else:
                    if i + 1 < len(lines):
                        next_l = lines[i + 1]
                        if not re.search(r'^(?:Şube|Sınav Kodu|Tarih|Puan|TYT|AYT|LGS)', next_l, re.IGNORECASE):
                            sinavAdi = next_l.strip()
                            break

    return {
        "ogrenciAdi": ogrenciAdi,
        "sinavAdi": sinavAdi,
        "ogrenciSinifi": ogrenciSinifi,
        "ogrenciNo": ogrenciNo,
        "kitapcik": kitapcik,
        "sinavKodu": sinavKodu,
        "sinavTarihi": sinavTarihi
    }

# Test 1: PDF.js Table row format
test1 = """
Detaylı Sonuç Karnesi
Öğrenci Adı   Sınıfı   No   Kitapçık Türü
KEREM DEMİRER   1313   46164   B
Sınav Adı   Şube   Sınav Kodu   Sınav Tarihi
ALTERNATİF TYT   İzmit   120801   07.11.2026
"""

# Test 2: OCR single line format
test2 = """
Öğrenci Adı
KEREM DEMİRER
Sınıfı
1313
No
46164
Kitapçık Türü
B
Sınav Adı
ALTERNATİF TYT
Şube
İzmit
Sınav Kodu
120801
Sınav Tarihi
07.11.2026
"""

# Test 3: Inline colon format
test3 = """
Öğrenci Adı: KEREM DEMİRER
Sınıfı: 1313
No: 46164
Sınav Adı: ALTERNATİF TYT
Sınav Tarihi: 07.11.2026
"""

print("Test 1 (PDF.js Table Row):", extract_karne_metadata(test1))
print("Test 2 (OCR Single Line):", extract_karne_metadata(test2))
print("Test 3 (Inline Colon):", extract_karne_metadata(test3))

assert extract_karne_metadata(test1)["ogrenciAdi"] == "KEREM DEMİRER"
assert extract_karne_metadata(test1)["sinavAdi"] == "ALTERNATİF TYT"
assert extract_karne_metadata(test2)["ogrenciAdi"] == "KEREM DEMİRER"
assert extract_karne_metadata(test2)["sinavAdi"] == "ALTERNATİF TYT"
assert extract_karne_metadata(test3)["ogrenciAdi"] == "KEREM DEMİRER"
assert extract_karne_metadata(test3)["sinavAdi"] == "ALTERNATİF TYT"
print("\nAll 3 formats extracted KEREM DEMİRER and ALTERNATİF TYT perfectly!")

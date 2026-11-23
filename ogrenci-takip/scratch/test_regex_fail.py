# -*- coding: utf-8 -*-
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

text_pdfjs = """
Detaylı Sonuç Karnesi
Öğrenci Adı Sınıfı No Kitapçık Türü
KEREM DEMİRER 1313 46164 B
Sınav Adı Şube Sınav Kodu Sınav Tarihi
ALTERNATİF TYT İzmit 120801 07.11.2026
"""

m = re.search(r'Öğrenci Adı\s*[:\n\r\t]+([^\n\r]+)', text_pdfjs)
print('Current regex result:', repr(m.group(1)) if m else 'None')

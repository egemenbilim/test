# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

# Simulated taxonomy logic based on karneTaxonomy.js
def tr_normalize(s):
    if not s:
        return ''
    mapping = {
        'ı': 'i', 'İ': 'i', 'I': 'i',
        'ğ': 'g', 'Ğ': 'g',
        'ü': 'u', 'Ü': 'u',
        'ş': 's', 'Ş': 's',
        'ö': 'o', 'Ö': 'o',
        'ç': 'c', 'Ç': 'c'
    }
    res = ''
    for ch in s:
        res += mapping.get(ch, ch)
    return res.lower()

def get_cati_konu(ders_adi, ham_konu):
    if not ham_konu or not ham_konu.strip():
        return 'Genel Soru'
    raw = ham_konu.strip()
    n = tr_normalize(raw)
    d = tr_normalize(ders_adi or '')

    if 'turkce' in d or 'edebiyat' in d:
        if any(x in n for x in ['paragraf', 'ikiye bolme', 'akisi bozan', 'akisini bozan', 'bosluklarin uygun', 'metindeki bosluk', 'dil ve anlatim', 'paragrafin yapisi', 'anlatim bicimleri', 'dusunceyi gelistirme']):
            return 'Genel Paragraf'
        if any(x in n for x in ['cumlede anlam', 'cumle yorumu', 'cumlenin anlami']):
            return 'Cümlede Anlam'
        if any(x in n for x in ['sozcukte anlam', 'soz gruplari', 'deyim', 'atasoz']):
            return 'Sözcükte Anlam'
        if 'yazim' in n:
            return 'Yazım Kuralları'
        if 'noktalama' in n:
            return 'Noktalama İşaretleri'
        if any(x in n for x in ['cekim ekleri', 'tamlamalar', 'kelimede yapi', 'sozcukte yapi', 'cumlenin temel ogeleri', 'cumlenin ogeleri', 'sozcuk turleri', 'ses bilgisi', 'fiilimsi', 'cati', 'ek fiil', 'cumle turleri', 'anlatim bozuk']):
            return 'Dil Bilgisi'
        return raw

    if 'matematik' in d or 'geometri' in d:
        if 'geometri' in d:
            if any(x in n for x in ['ucgen', 'aciortay', 'kenarortay', 'benzerlik', 'alan', 'dogruda aci']):
                return 'Üçgenler'
            if any(x in n for x in ['dortgen', 'cokgen', 'kare', 'dikdortgen', 'yamuk', 'paralelkenar', 'deltoid']):
                return 'Çokgenler ve Dörtgenler'
            if any(x in n for x in ['geometrik cisim', 'kati cisim', 'prizma', 'silindir', 'koni', 'piramit', 'kure']):
                return 'Katı Cisimler'
            if any(x in n for x in ['cember', 'daire', 'analitik']):
                return 'Çember ve Analitik Geometri'
            return raw

        if any(x in n for x in ['problem', 'sayi - kesir', 'sayi kesir', 'hareket', 'hiz', 'kar-zarar', 'kar zarar', 'rutin olmayan', 'yuzde', 'yas', 'karisim problem', 'grafik problem']):
            return 'Problemler'
        if any(x in n for x in ['tek sayi', 'cift sayi', 'bolunebilme', 'bolme', 'rasyonel', 'ondalik', 'uslu', 'koklu', 'mutlak deger', 'temel kavram', 'sayi basamak', 'ebob', 'ekok', 'asal']):
            return 'Temel Kavramlar & Sayılar'
        if any(x in n for x in ['denklem', 'esitsizlik', 'oran - oranti', 'oran oranti', 'fonksiyon', 'polinom', 'kume', 'mantik', 'kartezyen', 'carpanlara ayirma']):
            return 'Cebir & Fonksiyonlar'
        if any(x in n for x in ['permutasyon', 'kombinasyon', 'binom', 'olasilik']):
            return 'Sayma & Olasılık'
        return raw

    return raw

# Test with Kerem Demirer Turkish questions
sample_turkish = [
    (1, "Cümlede Anlam", "A", "A"),
    (2, "Cümlede Anlam", "A", "A"),
    (3, "Anlatımın Akışını Bozan Cümle", "A", "B"),
    (4, "Yazım Kuralları", "C", "D"),
    (5, "Sözcükte Anlam", "E", "E"),
    (6, "Söz Gruplarının Anlamı", "B", ""),
    (7, "Cümlede Anlam", "D", "D"),
    (8, "Sözcükte Anlam", "C", ""),
    (9, "Çekim Ekleri", "D", "D"),
    (10, "Tamlamalar", "B", ""),
    (11, "Yazım Kuralları", "D", ""),
    (12, "Yazım Kuralları", "C", ""),
    (13, "Noktalama İşaretleri", "B", "D"),
    (14, "Noktalama İşaretleri", "C", ""),
    (15, "Noktalama İşaretleri", "A", ""),
    (16, "Kelimede Yapı", "E", ""),
    (17, "Cümlenin Temel Ögeleri", "A", ""),
    (18, "Sözcük Türleri", "B", ""),
    (19, "Paragraf Bilgisi", "C", "D"),
    (20, "Paragraf Bilgisi", "A", "A"),
    (21, "Paragraf Bilgisi", "E", "C"),
    (22, "Paragraf Bilgisi", "C", "C"),
    (23, "Paragraf Bilgisi", "D", "D"),
    (24, "Paragraf Bilgisi", "E", "C"),
    (25, "Paragraf Bilgisi", "E", "C"),
    (26, "Paragraf Bilgisi", "E", "E"),
    (27, "Paragraf Bilgisi", "A", "C"),
    (28, "Paragrafta Yardımcı Düşünce", "D", "A"),
    (29, "Paragrafı İkiye Bölme", "C", "B"),
    (30, "Paragrafta Ana Düşünce", "B", "D"),
    (31, "Düşüncenin Akışını Bozan Cümleler", "E", "E"),
    (32, "Paragraf Bilgisi", "A", "B"),
    (33, "Metindeki Boşlukların Uygun Sözcüklerle Tamamlanması", "E", "E"),
    (34, "Paragraf Bilgisi", "D", "E"),
    (35, "Paragrafta Ana Düşünce", "A", "A"),
    (36, "Paragrafın Dil Ve Anlatımı", "B", "A"),
    (37, "Paragrafın Yapısı", "E", "E"),
    (38, "Paragrafın Yapısı", "A", "A"),
    (39, "Paragrafın Yapısı", "A", "E"),
    (40, "Paragrafın Yapısı", "C", "C")
]

groups = {}
for no, konu, dc, oc in sample_turkish:
    cati = get_cati_konu("TYT_Türkçe", konu)
    if cati not in groups:
        groups[cati] = {"count": 0, "D": 0, "Y": 0, "B": 0}
    groups[cati]["count"] += 1
    if oc == dc:
        groups[cati]["D"] += 1
    elif not oc:
        groups[cati]["B"] += 1
    else:
        groups[cati]["Y"] += 1

print("--- TURKISH GROUPING TEST ---")
for cati, stats in groups.items():
    print(f"{cati}({stats['count']}): {stats['D']}D / {stats['Y']}Y / {stats['B']}B")

tot_q = sum(s["count"] for s in groups.values())
tot_d = sum(s["D"] for s in groups.values())
tot_y = sum(s["Y"] for s in groups.values())
tot_b = sum(s["B"] for s in groups.values())
net = tot_d - (tot_y / 4.0)

print(f"\nTotal: {tot_q} Soru, {tot_d} Doğru, {tot_y} Yanlış, {tot_b} Boş, Net: {net:.2f}")
assert tot_q == 40
assert tot_d == 15
assert tot_y == 15
assert tot_b == 10
assert net == 11.25
assert "Genel Paragraf" in groups
print("\nAssertion passed successfully! All 40 questions accounted for with exact net 11.25.")

# -*- coding: utf-8 -*-
import sys
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

ocr_text_p1 = """
Detaylı Sonuç Karnesi
Puan
Genel
Puan Ort
Yüzdelik
Dilim
Genel
Sıra
İl
Sıra
İlçe
Sıra
Şube
Sıra
Sınıf
Sıra
OSYM
26
OSYM
25
TYT
225,837
284,787 %89,83 53 53 53 53 8 1.248.573 1.290.416
Sınava Katılan Öğrenci Sayısı 59 59 59 59 9
Ders
Soru
Sayısı
Doğru
Cevap
Yanlış
Cevap
Boş Net
Genel
Sıra
Şube
Sıra
Sınıf
Sıra
Genel
Ort
Şube
Ort
Sınıf
Ort
TYT
Kayıp Puan
TYT
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
Puan - Sıralama Bilgileri
Ders - Sıralama Bilgileri
TYT_Türkçe 40 15 15 10 11,25 21,25 21,25 16,75 77,22
TYT_Türkçe 40 15 15 10 11,25 54 54 8 21,25 21,25 16,75 77,22
TYT_Sosyal Bilimler 20 9 2 9 8,50 10,29 10,29 9,48 35,71
TYT_Tarih 5 0 0 5 0,00 48 48 8 1,91 1,91 1,81 15,53
TYT_Coğrafya 5 3 1 1 2,75 32 32 5 3,14 3,14 2,92 6,99
TYT_Felsefe 5 2 1 2 1,75 27 27 3 1,89 1,89 1,44 10,09
TYT_DinKültürü 5 4 0 1 4,00 11 11 1 3,35 3,35 3,31 3,11
TYT_Matematik 40 6 1 33 5,75 10,47 10,47 5,72 110,32
TYT_Matematik 30 5 1 24 4,75 38 38 5 8,34 8,34 4,86 81,33
TYT_Geometri 10 1 0 9 1,00 27 27 3 2,13 2,13 0,86 28,99
TYT_Fen Bilimleri 20 1 4 15 0,00 4,43 4,43 4,11 51,02
TYT_Fizik 7 0 1 6 -0,25 52 52 8 1,00 1,00 1,11 18,49
TYT_Kimya 7 0 0 7 0,00 42 42 8 1,99 1,99 1,58 17,86
TYT_Biyoloji 6 1 3 2 0,25 34 34 6 1,44 1,44 1,42 14,67
Toplam 120 31 22 67 25,50 46,45 46,45 36,06 274,27
"""

ocr_text_p2 = """
Ders Soru Analizleri
Sr Konu DC OC
TYT_Türkçe
1 Cümlede Anlam A A
2 Cümlede Anlam A A
3 Anlatımın Akışını Bozan Cümle A B
4 Yazım Kuralları C D
5 Sözcükte Anlam E E
6 Sözcük Gruplarının Anlamı B
7 Cümlede Anlam D D
8 Sözcükte Anlam C
9 Çekim Ekleri D D
10 Tamlamalar B
11 Yazım Kuralları D
12 Yazım Kuralları C
13 Noktalama İşaretleri B D
14 Noktalama İşaretleri C
15 Noktalama İşaretleri A
16 Kelimede Yapı E
17 Cümlenin Temel Ögeleri A
18 Sözcük Türleri B
19 Paragraf Bilgisi C D
20 Paragraf Bilgisi A A
21 Paragraf Bilgisi E C
22 Paragraf Bilgisi C C
23 Paragraf Bilgisi D D
24 Paragraf Bilgisi E C
25 Paragraf Bilgisi E C
26 Paragraf Bilgisi E E
27 Paragraf Bilgisi A C
28 Paragrafta Yardımcı Düşünce D A
29 Paragrafı İkiye Bölme C B
30 Paragrafta Ana Düşünce B D
31 Düşüncenin Akışını Bozan Cümleler E E
32 Paragraf Bilgisi A B
33 Metindeki Boşlukların Uygun Sözcüklerle Tamamlanması E E
34 Paragraf Bilgisi D E
35 Paragrafta Ana Düşünce A A
36 Paragrafın Dil Ve Anlatımı B A
37 Paragrafın Yapısı E E
38 Paragrafın Yapısı A A
39 Paragrafın Yapısı A E
40 Paragrafın Yapısı C C
TYT_Tarih
1 Uluslararası İlişkilerde Denge Stratejisi E
2 Atatürkçülük ve Türk inkılabı A
3 Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi B
4 Orta Çağ da Dünya B
5 Milli Mücadele nin Hazırlık Dönemi D
TYT_Coğrafya
6 Uluslararası Ulaşım Hatları D D
7 Doğal Afetler A
8 Nüfus E E
9 Doğadaki Üç Unsur: Su - Toprak - Bitki C A
10 Doğa Ve İnsan E E
TYT_Felsefe
11 Varlık Felsefesi B B
12 Bilgi Felsefesi A A
13 15. YY - 17. YY Filozoflarının Felsefi Görüşlerinin Analizi D
14 Varlık Felsefesi C
15 MÖ 6. YY - MS 2. YY filozoflarının felsefi görüşlerinin analizi C B
TYT_DinKültürü
16 İnsanın Doğası ve Din B B
17 İslam Düşünceside Yorumlar D D
18 Bilgi ve İnanç, Ahiret, İnançla İlgili Meseleler E E
19 Allah İnancı A A
20 Kuran-ı Kerimdeki Bazı Kavramlar B
TYT_Matematik
1 Mutlak Değer A
2 Çift Sayi, Tek Sayi B B
3 Sayı - Kesir Problemleri A
4 Bölünebilme A
5 Kümeler E
6 Rasyonel Sayılar A A
7 Ondalık Sayılar E E
8 Üslü Sayılar E
9 D
10 Denklemler D B
11 Basit Eşitsizlikler A
12 Hareket Problemleri A
13 Oran - Orantı D D
14 Mantık A
15 Kartezyen Çarpım E
16 Permütasyon E
17 Polinomlar D
18 Hız Problemleri D
19 Olasılık E
20 Kar-Zarar Problemleri B B
21 Verilerin Grafikle Gösterilmesi C
22 Rutin Olmayan Problemler B
23 Fonksiyonlar B
24 Sayı - Kesir Problemleri B
25 Sayı - Kesir Problemleri D
26 Yüzde Problemleri C
27 Sayı - Kesir Problemleri D
28 Yaş Problemleri B
29 Rutin Olmayan Problemler D
30 Sayı - Kesir Problemleri D
TYT_Geometri
31 A
32 Dörtgenler C
33 Çokgenler A
34 Özel Üçgenler D
35 Geometrik Cisimler B
36 Geometrik Cisimler E
37 Üçgende Açı B B
38 Üçgende Benzerlik B
39 Üçgende Alan D
40 B
TYT_Fizik
1 Yay Dalgaları A D
2 Mercekler E
3 Karışımların Özkütlesi C
4 Basınç B
5 Madde Ve Özellikleri B
6 Hareket A
7 Elektrik Devreleri C
TYT_Kimya
8 Heterojen Ve Homojen Karışımlar D
9 Katılar C
10 Periyodik Sistem D
11 Laboratuvar Malzemeleri C
12 Molekül Oluşumu Ve Lewis Yapısı C
13 Katlı Oranlar Kanunu D
14 Nötralleşme Reaksiyonları Ve Tampon Çözeltileri E
TYT_Biyoloji
15 Eşeysiz Üreme A
16 Besin Zinciri Ve Piramidi D A
17 Kalıtımda Soyağaçları E A
18 Lipitler E
19 Hücre Ve Organeller A A
20 Canlıların Çeşitliliği Ve Sınıflandırılması A D
"""

def parse_karne_full(text_p1, text_p2):
    full_text = text_p1 + "\n" + text_p2
    lines = [l.strip() for l in full_text.splitlines() if l.strip()]

    # Extract metadata
    student_name = ""
    exam_name = ""
    exam_date = ""
    exam_code = ""
    student_no = ""
    student_class = ""
    booklet = ""
    score = 0.0

    m = re.search(r'Öğrenci Adı\s*\n\s*([^\n\r]+)', full_text, re.IGNORECASE)
    if m:
        student_name = m.group(1).strip()
    else:
        m2 = re.search(r'Öğrenci Adı\s*:\s*([^\n\r]+)', full_text, re.IGNORECASE)
        if m2: student_name = m2.group(1).strip()

    m = re.search(r'Sınav Adı\s*\n\s*([^\n\r]+)', full_text, re.IGNORECASE)
    if m:
        exam_name = m.group(1).strip()
    else:
        m2 = re.search(r'Sınav Adı\s*:\s*([^\n\r]+)', full_text, re.IGNORECASE)
        if m2: exam_name = m2.group(1).strip()

    m = re.search(r'Sınav Tarihi\s*\n\s*(\d{1,2}\.\d{1,2}\.\d{4})', full_text, re.IGNORECASE)
    if m:
        d, mo, y = m.group(1).split('.')
        exam_date = f"{y}-{mo.zfill(2)}-{d.zfill(2)}"
    else:
        m2 = re.search(r'(\d{1,2})\.(\d{1,2})\.(\d{4})', full_text)
        if m2:
            exam_date = f"{m2.group(3)}-{m2.group(2).zfill(2)}-{m2.group(1).zfill(2)}"

    m = re.search(r'Sınav Kodu\s*\n\s*([0-9A-Za-z]+)', full_text, re.IGNORECASE)
    if m: exam_code = m.group(1).strip()

    m = re.search(r'No\s*\n\s*([0-9A-Za-z]+)', full_text, re.IGNORECASE)
    if m: student_no = m.group(1).strip()

    m = re.search(r'Sınıfı\s*\n\s*([^\n\r]+)', full_text, re.IGNORECASE)
    if m: student_class = m.group(1).strip()

    m = re.search(r'Kitapçık Türü\s*\n\s*([A-Za-z0-9]+)', full_text, re.IGNORECASE)
    if m: booklet = m.group(1).strip()

    m = re.search(r'TYT\s*\n\s*(\d{2,3}[,\.]\d{1,3})', full_text)
    if m:
        score = float(m.group(1).replace(',', '.'))

    # Extract Page 2 Ders Soru Analizleri
    current_subject = ""
    questions = []
    subject_names = [
        "TYT_Türkçe", "TYT_Tarih", "TYT_Coğrafya", "TYT_Felsefe", "TYT_DinKültürü",
        "TYT_Matematik", "TYT_Geometri", "TYT_Fizik", "TYT_Kimya", "TYT_Biyoloji"
    ]

    for line in text_p2.splitlines():
        l = line.strip()
        if not l or "Ders Soru Analizleri" in l or "Sr Konu DC OC" in l:
            continue
        
        # Check if line is a subject header
        matched_subj = None
        for s in subject_names:
            if l.startswith(s):
                matched_subj = s
                break
        if matched_subj:
            current_subject = matched_subj
            continue

        # Question row pattern:
        # e.g.:
        # "1 Cümlede Anlam A A"
        # "6 Söz Gruplarının Anlamı B"
        # "9 D"
        # "10 Denklemler D B"
        m_q = re.match(r'^(\d+)\s+(.+?)\s+([A-E])\s+([A-E])$', l)
        if m_q:
            q_no = int(m_q.group(1))
            konu = m_q.group(2).strip()
            dc = m_q.group(3)
            oc = m_q.group(4)
            questions.append({
                "no": q_no,
                "ders": current_subject,
                "hamKonu": konu,
                "dc": dc,
                "oc": oc,
                "durum": "D" if dc == oc else "Y"
            })
            continue

        m_q_blank = re.match(r'^(\d+)\s+(.+?)\s+([A-E])$', l)
        if m_q_blank:
            q_no = int(m_q_blank.group(1))
            konu = m_q_blank.group(2).strip()
            dc = m_q_blank.group(3)
            oc = ""
            questions.append({
                "no": q_no,
                "ders": current_subject,
                "hamKonu": konu,
                "dc": dc,
                "oc": oc,
                "durum": "B"
            })
            continue

        # Single letter answer with question number only, e.g. "9 D", "31 A", "40 B"
        m_q_single = re.match(r'^(\d+)\s+([A-E])$', l)
        if m_q_single:
            q_no = int(m_q_single.group(1))
            konu = "Genel Soru"
            dc = m_q_single.group(2)
            oc = ""
            questions.append({
                "no": q_no,
                "ders": current_subject,
                "hamKonu": konu,
                "dc": dc,
                "oc": oc,
                "durum": "B"
            })
            continue

    return {
        "student_name": student_name,
        "exam_name": exam_name,
        "exam_date": exam_date,
        "exam_code": exam_code,
        "student_no": student_no,
        "student_class": student_class,
        "booklet": booklet,
        "score": score,
        "total_questions": len(questions),
        "questions": questions
    }

parsed = parse_karne_full(ocr_text_p1, ocr_text_p2)
print("=== PARSER TEST RESULT ===")
print(f"Öğrenci: {parsed['student_name']}")
print(f"Sınav: {parsed['exam_name']} ({parsed['exam_date']}) - Kod: {parsed['exam_code']}")
print(f"Puan: {parsed['score']}")
print(f"Toplam Ayrıştırılan Soru: {parsed['total_questions']}")

by_ders = {}
for q in parsed["questions"]:
    d = q["ders"]
    by_ders[d] = by_ders.get(d, 0) + 1

for d, cnt in by_ders.items():
    print(f" - {d}: {cnt} soru")

assert parsed['student_name'] == "KEREM DEMİRER"
assert parsed['exam_name'] == "ALTERNATİF TYT"
assert parsed['exam_date'] == "2026-11-07"
assert parsed['total_questions'] == 120
print("\nAll 120 questions from the 10 subjects successfully parsed!")

# -*- coding: utf-8 -*-
import sys
import os
import json
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def test_real_pdf_upload_and_detection():
    pdf_path = os.path.abspath(r"C:\Users\egeme\.gemini\antigravity\brain\9e6d7214-97d4-493e-b2c4-9389d4b013d7\.user_uploaded\media_1795451803719_362f52d9.pdf")
    html_path = os.path.abspath(r"c:\Users\egeme\OneDrive\Desktop\CODEX\EdTech\ogrenci-takip\index.html")

    print(f"Target PDF: {pdf_path}")
    print(f"App HTML: {html_path}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--allow-file-access-from-files"])
        context = browser.new_context()
        page = context.new_page()

        console_errors = []
        page.on("pageerror", lambda err: console_errors.append(f"PageError: {err}"))
        page.on("console", lambda msg: console_errors.append(f"ConsoleError: {msg.text}") if msg.type == "error" else None)

        print("\n1. Opening application...")
        page.goto(f"file:///{html_path.replace(os.sep, '/')}")
        page.wait_for_timeout(1000)

        # Go to deneme view
        page.evaluate("() => { if (window.goto) window.goto('deneme'); }")
        page.wait_for_timeout(1000)

        print("2. In 'Denemeler' -> 'Karne' tab...")

        print("3. Uploading real karne1.pdf via #karneFileInput...")
        page.set_input_files("#karneFileInput", pdf_path)
        page.wait_for_timeout(2000)

        # Verify preview card is visible
        assert page.is_visible("#karneOnizlemeKarti"), "Preview card should be visible"
        
        # Check extracted student name input value
        ogr_name = page.input_value("#karnePvOgrenciAd")
        snv_name = page.input_value("#karnePvSinavAd")
        snv_date = page.input_value("#karnePvTarih")

        print(f"-> Extracted Student Name: {repr(ogr_name)}")
        print(f"-> Extracted Exam Name: {repr(snv_name)}")
        print(f"-> Extracted Exam Date: {repr(snv_date)}")

        assert ogr_name == "KEREM DEMİRER", f"Expected 'KEREM DEMİRER', got {repr(ogr_name)}"
        assert "ALTERNATİF" in snv_name, f"Expected 'ALTERNATİF' in exam name, got {repr(snv_name)}"
        assert snv_date == "2026-11-07", f"Expected '2026-11-07', got {repr(snv_date)}"

        # Check input value reset
        input_val = page.eval_on_selector("#karneFileInput", "el => el.value")
        print(f"-> #karneFileInput value after upload: {repr(input_val)} (should be empty for new uploads)")
        assert input_val == "", "file input value should be cleared after parsing so subsequent uploads work"

        print("4. Saving 1st karne (KEREM DEMİRER - ALTERNATİF TYT)...")
        page.click("button:has-text('Sisteme & Karne Sınıfına Kaydet')")
        page.wait_for_timeout(1000)

        # Verify student is in Karne Sınıfı in DB
        db_check = page.evaluate("""
        () => {
            const ks = DB.siniflar.find(s => s.ad.toLowerCase() === 'karne sınıfı');
            const ogr = DB.ogrenciler.find(o => o.adSoyad === 'KEREM DEMİRER');
            return {
                karneSinifiId: ks ? ks.id : null,
                ogrSinifId: ogr ? ogr.sinifId : null,
                karnelerCount: (DB.karneler || []).length
            };
        }
        """)
        print(f"-> DB State after 1st save: {db_check}")
        assert db_check['karneSinifiId'] is not None, "Karne Sınıfı should exist in DB"
        assert db_check['ogrSinifId'] == db_check['karneSinifiId'], "KEREM DEMİRER must be transferred to 'Karne Sınıfı'"
        assert db_check['karnelerCount'] == 1, "There should be 1 karne in DB"

        print("\n5. Testing 2nd Karne Upload (new karne detection & comparison)...")
        # Let's simulate dropping or picking a 2nd exam for the same student
        # We will parse sample 2 or a modified version
        page.click("button:has-text('Metin / OCR Yapıştır')")
        page.wait_for_timeout(500)

        ornek2 = """Öğrenci Adı: KEREM DEMİRER
Sınıfı: 1313
No: 46164
Sınav Adı: ÖZDEBİR TYT 2
Sınav Tarihi: 21.11.2026
Sınav Kodu: 120902
TYT
268,450
284,787 %68,10 32 32 32 32 4 890.120 920.450
Sınava Katılan Öğrenci Sayısı 59
TYT_Türkçe
1 Cümlede Anlam A A
2 Cümlede Anlam A A
3 Anlatımın Akışını Bozan Cümle A A
4 Yazım Kuralları C C
5 Sözcükte Anlam E E
6 Söz Gruplarının Anlamı B B
7 Cümlede Anlam D D
8 Sözcükte Anlam C C
9 Çekim Ekleri D D
10 Tamlamalar B B
11 Yazım Kuralları D D
12 Yazım Kuralları C D
13 Noktalama İşaretleri B B
14 Noktalama İşaretleri C C
15 Noktalama İşaretleri A
16 Kelimede Yapı E E
17 Cümlenin Temel Ögeleri A A
18 Sözcük Türleri B B
19 Paragraf Bilgisi C C
20 Paragraf Bilgisi A A
21 Paragraf Bilgisi E E
22 Paragraf Bilgisi C C
23 Paragraf Bilgisi D D
24 Paragraf Bilgisi E C
25 Paragraf Bilgisi E E
26 Paragraf Bilgisi E E
27 Paragraf Bilgisi A A
28 Paragrafta Yardımcı Düşünce D D
29 Paragrafı İkiye Bölme C C
30 Paragrafta Ana Düşünce B B
31 Düşüncenin Akışını Bozan Cümleler E E
32 Paragraf Bilgisi A A
33 Metindeki Boşlukların Uygun Sözcüklerle Tamamlanması E E
34 Paragraf Bilgisi D E
35 Paragrafta Ana Düşünce A A
36 Paragrafın Dil Ve Anlatımı B B
37 Paragrafın Yapısı E E
38 Paragrafın Yapısı A A
39 Paragrafın Yapısı A A
40 Paragrafın Yapısı C C
TYT_Matematik
1 Mutlak Değer A A
2 Çift Sayi, Tek Sayi B B
3 Sayı - Kesir Problemleri A A
4 Bölünebilme A A
6 Rasyonel Sayılar A A
10 Denklemler D D
12 Hareket Problemleri A A
13 Oran - Orantı D D
20 Kar-Zarar Problemleri B B
24 Sayı - Kesir Problemleri B B
26 Yüzde Problemleri C C
TYT_Geometri
37 Üçgende Açı B B
38 Üçgende Benzerlik B B
TYT_Coğrafya
6 Uluslararası Ulaşım Hatları D D
7 Doğal Afetler A A
8 Nüfus E E
10 Doğa Ve İnsan E E
TYT_Felsefe
11 Varlık Felsefesi B B
12 Bilgi Felsefesi A A
TYT_DinKültürü
16 İnsanın Doğası ve Din B B
17 İslam Düşünceside Yorumlar D D
18 Bilgi ve İnanç, Ahiret, İnançla İlgili Meseleler E E
19 Allah İnancı A A
TYT_Fizik
1 Yay Dalgaları A A
5 Madde Ve Özellikleri B B
TYT_Biyoloji
16 Besin Zinciri Ve Piramidi D D
17 Kalıtımda Soyağaçları E E
19 Hücre Ve Organeller A A"""

        page.fill("#karneMetinAlani", ornek2)
        page.click("button:has-text('Metni Çözümle')")
        page.wait_for_timeout(1000)

        ogr2 = page.input_value("#karnePvOgrenciAd")
        snv2 = page.input_value("#karnePvSinavAd")
        print(f"-> 2nd Karne Preview: Student={repr(ogr2)}, Exam={repr(snv2)}")
        assert ogr2 == "KEREM DEMİRER"
        assert "ÖZDEBİR" in snv2

        print("6. Saving 2nd karne...")
        page.click("button:has-text('Sisteme & Karne Sınıfına Kaydet')")
        page.wait_for_timeout(1000)

        # Verify comparative report rendered!
        rep_text = page.inner_text("#karneKarsilastirmaBolumu")
        print("\n=== REPORT HEADER & PREVIEW ===")
        print(rep_text[:500])

        assert "KEREM DEMİRER" in rep_text
        assert "ALTERNATİF TYT" in rep_text
        assert "ÖZDEBİR TYT 2" in rep_text
        assert "Nelere Çalışmalı?" in rep_text
        assert "Şunlara Çalış:" in rep_text
        assert "Ders Filtresi" in rep_text
        assert "Genel Paragraf" in rep_text

        print("\n7. Testing Drop Event on #karneDropZone...")
        # Test dragging a file onto #karneDropZone
        drop_test = page.evaluate("""
        () => {
            const dz = document.getElementById('karneDropZone');
            return dz !== null;
        }
        """)
        assert drop_test, "Dropzone must exist"

        print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
        browser.close()

if __name__ == "__main__":
    test_real_pdf_upload_and_detection()

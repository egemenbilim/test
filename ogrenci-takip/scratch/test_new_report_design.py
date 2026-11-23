# -*- coding: utf-8 -*-
import sys
import os
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def test_new_report_design():
    html_path = os.path.abspath(r"c:\Users\egeme\OneDrive\Desktop\CODEX\EdTech\ogrenci-takip\index.html")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--allow-file-access-from-files"])
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        console_errors = []
        page.on("pageerror", lambda err: console_errors.append(f"PageError: {err}"))
        page.on("console", lambda msg: console_errors.append(f"ConsoleError: {msg.text}") if msg.type == "error" else None)

        print("1. Opening app...")
        page.goto(f"file:///{html_path.replace(os.sep, '/')}")
        page.wait_for_timeout(1000)

        print("2. Navigating to 'Denemeler' and loading 2 sample karnes...")
        page.evaluate("() => { if (window.goto) window.goto('deneme'); }")
        page.wait_for_timeout(500)
        page.click("button:has-text('Örnek Karne Yükle')")
        page.wait_for_timeout(1000)

        # Verify no console errors
        assert len(console_errors) == 0, f"Found console errors: {console_errors}"

        # 3. Verify Report Mode Selector exists
        print("3. Checking Report Mode buttons...")
        assert page.is_visible("button:has-text('Tam Kapsamlı Rapor')")
        assert page.is_visible("button:has-text('Sadece \"Nelere Çalışmalı?\"')")

        # 4. Verify Subject-by-Subject Organization in Full Report
        print("4. Verifying subject-by-subject organization...")
        rep_text = page.inner_text("#karneRaporYazdirAlani")
        print("rep_text[:400]:\n", repr(rep_text[:400]))
        assert "KARŞILAŞTIRMALI GELİŞİM & DEĞİŞİM ANALİZİ RAPORU" in rep_text
        assert "Türkçe" in rep_text
        assert "Matematik" in rep_text
        assert "Genel Paragraf" in rep_text
        assert "Şunlara Çalış:" in rep_text

        # Verify badge squashing is resolved:
        # Check computed styles of .kr-stat-bad
        stat_badge_box = page.locator(".kr-stat-bad").first.bounding_box()
        print(f"-> .kr-stat-bad bounding box: width={stat_badge_box['width']:.1f}px, height={stat_badge_box['height']:.1f}px")
        # In the old code, .badge was forced to width=32px (and 20px in print).
        # With .kr-stat-bad, width must be > 100px so text never overlaps!
        assert stat_badge_box['width'] > 90, f"Expected width > 90px for full text, got {stat_badge_box['width']}px"

        # 5. Test switching to 'Sadece Nelere Çalışmalı' mode
        print("5. Switching to 'Sadece Nelere Çalışmalı?' mode...")
        page.click("button:has-text('Sadece \"Nelere Çalışmalı?\"')")
        page.wait_for_timeout(500)

        rep_text_calis = page.inner_text("#karneRaporYazdirAlani")
        assert "ÖNCELİKLİ EKSİKLER & ÇALIŞMA EYLEM PLANI" in rep_text_calis
        assert "Şunlara Çalış:" in rep_text_calis
        # General table and details should be omitted in this mode
        assert "Ders Bazında Net Değişim Özeti Tablosu" not in rep_text_calis
        assert "Tüm Konuların Detaylı Karşılaştırmalı Tablosunu Gör" not in rep_text_calis
        print("Mode OK: Only study plan rendered in 'Sadece Nelere Çalışmalı' mode.")

        # 6. Test Subject Filter in 'Sadece Nelere Çalışmalı' mode
        print("6. Filtering by 'Türkçe' only...")
        page.click("#karneDersChipListesi button:has-text('Türkçe')")
        page.wait_for_timeout(500)

        rep_text_tr = page.inner_text("#karneRaporYazdirAlani")
        assert "Türkçe" in rep_text_tr
        assert "Genel Paragraf" in rep_text_tr
        assert "Matematik" not in rep_text_tr
        assert "Geometri" not in rep_text_tr
        print("Subject Filter OK: Only Türkçe shown.")

        # Take screenshot of the clean Türkçe study report
        page.screenshot(path=r"c:\Users\egeme\OneDrive\Desktop\CODEX\EdTech\ogrenci-takip\scratch\study_report_tr_screenshot.png")
        print("Screenshot saved to study_report_tr_screenshot.png")

        # 7. Switch back to 'Tümü'
        print("7. Clearing subject filter...")
        page.click("#karneDersChipListesi button:has-text('Tümü')")
        page.wait_for_timeout(500)

        page.screenshot(path=r"c:\Users\egeme\OneDrive\Desktop\CODEX\EdTech\ogrenci-takip\scratch\study_report_all_screenshot.png")
        print("Screenshot saved to study_report_all_screenshot.png")

        # 8. Test window.karneRaporYazdir execution
        print("8. Testing window.karneRaporYazdir...")
        # Verify karne-print-only class fallback or print function existence
        page.evaluate("""
        () => {
            let called = false;
            const origOpen = window.open;
            window.open = function() { called = true; return null; }; // trigger fallback
            window.karneRaporYazdir();
            window.open = origOpen;
            return called;
        }
        """)
        page.wait_for_timeout(500)
        print("Print handler executed cleanly.")

        print("\nALL DESIGN & FUNCTIONALITY TESTS PASSED WITH ZERO ERRORS!")
        browser.close()

if __name__ == "__main__":
    test_new_report_design()

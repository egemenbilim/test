# -*- coding: utf-8 -*-
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def test_simplified_ui_and_filter():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--allow-file-access-from-files"])
        context = browser.new_context()
        page = context.new_page()

        console_errors = []
        page.on("pageerror", lambda err: console_errors.append(f"PageError: {err}"))
        page.on("console", lambda msg: console_errors.append(f"ConsoleError: {msg.text}") if msg.type == "error" else None)

        print("1. Opening app...")
        page.goto("file:///c:/Users/egeme/OneDrive/Desktop/CODEX/EdTech/ogrenci-takip/index.html")
        page.wait_for_timeout(1000)

        print("2. Navigating to 'deneme' and loading sample karnes...")
        page.click("nav.top a[data-view='deneme']")
        page.wait_for_timeout(500)
        page.click("button:has-text('Örnek Karne Yükle')")
        page.wait_for_timeout(1000)

        # Verify filter bar exists
        assert page.is_visible("#karneDersFiltreWrap"), "Subject filter bar must be visible"
        filter_text = page.inner_text("#karneDersFiltreWrap")
        print(f"Filter bar text: {filter_text[:150]}...")
        assert "Tümü" in filter_text

        # Verify initial state: All subjects shown
        rep_text = page.inner_text("#karneRaporYazdirAlani")
        assert "Tüm Dersler dahil edildi" in rep_text
        assert "Türkçe" in rep_text
        assert "Matematik" in rep_text
        print("Initial state OK: All subjects included when nothing selected.")

        # 3. Click 'Türkçe' filter chip
        print("3. Clicking 'Türkçe' chip...")
        page.click("#karneDersChipListesi button:has-text('Türkçe')")
        page.wait_for_timeout(500)

        rep_text_tr = page.inner_text("#karneRaporYazdirAlani")
        assert "Sadece seçilen Türkçe dersleri gösteriliyor" in rep_text_tr
        assert "Genel Paragraf" in rep_text_tr
        # Matematik should NOT be in the cards
        assert "Problemler" not in rep_text_tr
        print("Filter OK: Only Türkçe shown when Türkçe is selected.")

        # 4. Click 'Matematik' filter chip (multi-select)
        print("4. Clicking 'Matematik' chip...")
        page.click("#karneDersChipListesi button:has-text('Matematik')")
        page.wait_for_timeout(500)

        rep_text_tr_mat = page.inner_text("#karneRaporYazdirAlani")
        assert "Türkçe" in rep_text_tr_mat
        assert "Matematik" in rep_text_tr_mat
        assert "Genel Paragraf" in rep_text_tr_mat
        assert "Problemler" in rep_text_tr_mat
        print("Multi-select OK: Both Türkçe and Matematik shown.")

        # 5. Clear filter
        print("5. Clicking 'Tümü' / Clear filter...")
        page.click("button:has-text('Tümünü Göster')")
        page.wait_for_timeout(500)

        rep_text_all = page.inner_text("#karneRaporYazdirAlani")
        assert "Tüm Dersler dahil edildi" in rep_text_all
        print("Clear filter OK: All subjects restored.")

        # 6. Save simplified report screenshot
        page.screenshot(path="ogrenci-takip/scratch/simplified_report_verified.png", full_page=True)
        print("Screenshot saved to ogrenci-takip/scratch/simplified_report_verified.png")

        assert len(console_errors) == 0, f"Errors: {console_errors}"
        print("ALL TESTS PASSED WITH ZERO CONSOLE ERRORS!")
        browser.close()

if __name__ == "__main__":
    test_simplified_ui_and_filter()

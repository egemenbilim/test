# -*- coding: utf-8 -*-
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def test_karne_workflow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--allow-file-access-from-files"])
        context = browser.new_context()
        page = context.new_page()

        console_errors = []
        page.on("pageerror", lambda err: console_errors.append(f"PageError: {err}"))
        page.on("console", lambda msg: console_errors.append(f"ConsoleError: {msg.text}") if msg.type == "error" else None)

        print("1. Opening index.html...")
        page.goto("file:///c:/Users/egeme/OneDrive/Desktop/CODEX/EdTech/ogrenci-takip/index.html")
        page.wait_for_timeout(1000)

        assert len(console_errors) == 0, f"Errors on initial load: {console_errors}"
        print("Initial load OK. Zero console errors.")

        print("2. Navigating to 'deneme' view...")
        page.click("nav.top a[data-view='deneme']")
        page.wait_for_timeout(500)

        # Check that Karne tab is visible and active
        assert page.is_visible("#denTabKarne"), "denTabKarne should be visible"
        assert page.is_visible("#denKarneAlani"), "denKarneAlani should be visible"
        print("Karne tab is active and visible.")

        print("3. Clicking '📋 Örnek Karne Yükle'...")
        page.click("button:has-text('Örnek Karne Yükle')")
        page.wait_for_timeout(1000)

        # Verify DB state via evaluate
        db_state = page.evaluate("""() => {
            const ks = DB.siniflar.find(s => s.ad === 'Karne Sınıfı');
            const ogr = DB.ogrenciler.find(o => o.adSoyad === 'KEREM DEMİRER');
            const karneler = DB.karneler.filter(k => k.ogrenciId === (ogr ? ogr.id : -1));
            return {
                karneSinifiVar: !!ks,
                karneSinifId: ks ? ks.id : null,
                ogrenciSinifId: ogr ? ogr.sinifId : null,
                ogrenciAdi: ogr ? ogr.adSoyad : null,
                karneSayisi: karneler.length,
                karneler: karneler.map(k => ({
                    sinavAdi: k.sinavAdi,
                    puan: k.tytPuan,
                    net: k.toplam.net,
                    konular: k.konuGruplari.map(g => g.etiket)
                }))
            };
        }""")

        print(f"DB State: {db_state}")
        assert db_state["karneSinifiVar"], "Karne Sınıfı must be created"
        assert db_state["ogrenciSinifId"] == db_state["karneSinifId"], "Student must be assigned to Karne Sınıfı"
        assert db_state["karneSayisi"] >= 2, "2 Karnes should be recorded"

        # Check topics in 1st karne
        k1_topics = db_state["karneler"][0]["konular"]
        print(f"1. Karne Konuları: {k1_topics}")
        assert any("Genel Paragraf" in t for t in k1_topics), "Genel Paragraf topic must exist"
        assert any("Cümlede Anlam" in t for t in k1_topics), "Cümlede Anlam topic must exist"

        print("4. Checking Comparison Report UI...")
        assert page.is_visible("#karneRaporYazdirAlani"), "Comparison report container must be rendered"
        
        report_text = page.inner_text("#karneRaporYazdirAlani")
        assert "ÖĞRENCİ İKİ KARNE DEĞİŞİM & GELİŞİM RAPORU" in report_text
        assert "Nelerde Gelişme Var?" in report_text
        assert "Nelere Çalışmalı?" in report_text
        assert "Puan Değişimi" in report_text
        assert "Toplam Net Değişimi" in report_text
        print("Comparison report verified with all sections!")

        # Screenshot report
        page.screenshot(path="ogrenci-takip/scratch/karne_report_verified.png", full_page=True)
        print("Screenshot saved to ogrenci-takip/scratch/karne_report_verified.png")

        print("5. Checking console errors during full run...")
        assert len(console_errors) == 0, f"Console errors during execution: {console_errors}"
        print("ALL TESTS PASSED WITH ZERO ERRORS!")

        browser.close()

if __name__ == "__main__":
    test_karne_workflow()

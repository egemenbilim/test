import subprocess
import time
import sys
import os
from playwright.sync_api import sync_playwright

TEST_PORT = 8089
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def run_tests():
    print(f"==================================================")
    print(f"       SINAVCI - SİSTEM VE ROTA DOĞRULAMA")
    print(f"==================================================")
    
    server_code = f'''
import server
server.PORT = {TEST_PORT}
server.run()
'''
    temp_runner = os.path.join(BASE_DIR, "_temp_test_runner.py")
    with open(temp_runner, "w", encoding="utf-8") as f:
        f.write(server_code)

    proc = subprocess.Popen([sys.executable, "-B", temp_runner], cwd=BASE_DIR)
    time.sleep(2)
    
    results = {
        "egemens_hub": False,
        "yaprak_test_editor": False,
        "yazili_editor": False,
        "foy_editor": False,
        "soru_havuzu": False,
        "sinavlarim": False,
    }

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            # 1. Test Egemen's Testmaker Main Studio Hub
            print("\n[1/6] Ana Stüdyo Portalı (/) Test Ediliyor...")
            page.goto(f"http://localhost:{TEST_PORT}/", wait_until="networkidle", timeout=15000)
            if "Egemen's Testmaker" in page.title() or "Sınavcı" in page.title():
                results["egemens_hub"] = True
                print("  [BAŞARILI] Ana portal açıldı:", page.title())

            # 2. Test Yaprak Test Editor
            print("\n[2/6] Yaprak Test Atölyesi (/test) Test Ediliyor...")
            page.goto(f"http://localhost:{TEST_PORT}/test", wait_until="networkidle", timeout=15000)
            if "Yaprak Test" in page.title():
                results["yaprak_test_editor"] = True
                print("  [BAŞARILI] Yaprak Test atölyesi açıldı:", page.title())

            # 3. Test Yazılı Sınav Editor
            print("\n[3/6] Yazılı Sınav Atölyesi (/yazili) Test Ediliyor...")
            page.goto(f"http://localhost:{TEST_PORT}/yazili", wait_until="networkidle", timeout=15000)
            if "Yazılı Sınav" in page.title():
                results["yazili_editor"] = True
                print("  [BAŞARILI] Yazılı Sınav atölyesi açıldı:", page.title())

            # 4. Test Konu Föyü Editor
            print("\n[4/6] Konu Anlatım Föyü Atölyesi (/foy) Test Ediliyor...")
            page.goto(f"http://localhost:{TEST_PORT}/foy", wait_until="networkidle", timeout=15000)
            if "Konu Föyü" in page.title() or "Föy" in page.title():
                results["foy_editor"] = True
                print("  [BAŞARILI] Konu Föyü atölyesi açıldı:", page.title())

            # 5. Test Soru Havuzu
            print("\n[5/6] Soru Havuzu Kütüphanesi (/havuz) Test Ediliyor...")
            page.goto(f"http://localhost:{TEST_PORT}/havuz", wait_until="networkidle", timeout=15000)
            if "Soru Havuzu" in page.title():
                results["soru_havuzu"] = True
                print("  [BAŞARILI] Soru Havuzu açıldı:", page.title())

            # 6. Test Sınavlarım
            print("\n[6/6] Sınavlarım / Belgelerim (/sinavlarim) Test Ediliyor...")
            page.goto(f"http://localhost:{TEST_PORT}/sinavlarim", wait_until="networkidle", timeout=15000)
            if "Sınavlarım" in page.title():
                results["sinavlarim"] = True
                print("  [BAŞARILI] Sınavlarım paneli açıldı:", page.title())

            browser.close()
    finally:
        proc.terminate()
        proc.wait()
        if os.path.exists(temp_runner):
            try:
                os.remove(temp_runner)
            except Exception:
                pass
        print("\nTest sunucusu kapatıldı.")

    print("\n==================================================")
    print("           DOĞRULAMA TEST SONUÇLARI               ")
    print("==================================================")
    all_passed = True
    for test_name, passed in results.items():
        status_text = "GEÇTİ (PASS)" if passed else "BAŞARISIZ (FAIL)"
        if not passed:
            all_passed = False
        print(f"  * {test_name:<25}: {status_text}")
    print("==================================================")
    print(f"Genel Durum: {'TÜM MODÜLLER BAŞARIYLA ÇALIŞIYOR!' if all_passed else 'Bazı testler başarısız oldu.'}")
    return all_passed

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)

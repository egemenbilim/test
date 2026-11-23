import os
from playwright.sync_api import sync_playwright

html_path = os.path.abspath(r"c:\Users\egeme\OneDrive\Desktop\CODEX\EdTech\ogrenci-takip\index.html")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--allow-file-access-from-files"])
    page = browser.new_page()
    page.goto(f"file:///{html_path.replace(os.sep, '/')}")
    page.wait_for_timeout(1500)
    page.click("nav.top a[data-view='deneme']")
    page.wait_for_timeout(1000)

    print("Section #deneme class:", page.eval_on_selector("#deneme", "el => el.className"))
    print("denKarneAlani HTML length:", len(page.inner_html("#denKarneAlani")))
    print("Has #karneFileInput:", page.query_selector("#karneFileInput") is not None)
    print("Has #karneDropZone:", page.query_selector("#karneDropZone") is not None)
    browser.close()

import os
from playwright.sync_api import sync_playwright

html_path = os.path.abspath(r"c:\Users\egeme\OneDrive\Desktop\CODEX\EdTech\ogrenci-takip\index.html")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--allow-file-access-from-files"])
    page = browser.new_page()
    page.on("console", lambda msg: print(f"Console [{msg.type}]: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PageError: {err}"))
    page.goto(f"file:///{html_path.replace(os.sep, '/')}")
    page.wait_for_timeout(1500)
    
    # Check if window.goto is defined
    has_goto = page.evaluate("() => typeof window.goto")
    print("typeof window.goto:", has_goto)

    browser.close()

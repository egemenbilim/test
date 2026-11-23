import asyncio
import os
import json
from playwright.async_api import async_playwright

async def main():
    pdf_path = os.path.abspath(r"C:\Users\egeme\.gemini\antigravity\brain\9e6d7214-97d4-493e-b2c4-9389d4b013d7\.user_uploaded\media_1795451803719_362f52d9.pdf")
    html_path = os.path.abspath(r"c:\Users\egeme\OneDrive\Desktop\CODEX\EdTech\ogrenci-takip\index.html")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(f"file:///{html_path.replace(os.sep, '/')}")
        await page.wait_for_function("() => window.pdfjsLib !== undefined")

        with open(pdf_path, "rb") as f:
            pdf_bytes = list(f.read())

        parsed = await page.evaluate("""
        async (bytes) => {
            const { parseKarnePdfFile } = await import('./js/modules/karneParser.js');
            // Mock a File object
            const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
            const file = new File([blob], 'karne1.pdf', { type: 'application/pdf' });
            return await parseKarnePdfFile(file);
        }
        """, pdf_bytes)

        print("Current parsed result without our edits:")
        print("  ogrenciAdi:", repr(parsed.get('ogrenciAdi')))
        print("  sinavAdi:", repr(parsed.get('sinavAdi')))
        print("  sinavTarihi:", repr(parsed.get('sinavTarihi')))
        print("  sinavKodu:", repr(parsed.get('sinavKodu')))
        print("  ogrenciNo:", repr(parsed.get('ogrenciNo')))
        print("  toplam:", parsed.get('toplam'))
        print("  dersOzetleri count:", len(parsed.get('dersOzetleri', [])))
        print("  konuGruplari count:", len(parsed.get('konuGruplari', [])))
        print("  sorular count:", len(parsed.get('sorular', [])))

        await browser.close()

asyncio.run(main())

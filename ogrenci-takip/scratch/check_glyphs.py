import asyncio
import os
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

        details = await page.evaluate("""
        async (bytes) => {
            const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
            const pdfDoc = await loadingTask.promise;
            const page = await pdfDoc.getPage(1);
            const content = await page.getTextContent();
            
            // Look at items around Öğrenci and KEREM
            return content.items.slice(0, 30).map(it => ({
                str: it.str,
                x: it.transform[4],
                y: it.transform[5],
                width: it.width
            }));
        }
        """, pdf_bytes)

        for d in details:
            print(f"str={repr(d['str'])}, x={d['x']:.2f}, y={d['y']:.2f}, w={d['width']:.2f}, end_x={d['x']+d['width']:.2f}")

        await browser.close()

asyncio.run(main())

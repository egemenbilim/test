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

        # Wait for page and pdfjs
        await page.wait_for_function("() => window.pdfjsLib !== undefined")

        # Let's read the PDF file via page evaluate
        with open(pdf_path, "rb") as f:
            pdf_bytes = list(f.read())

        result = await page.evaluate("""
        async (bytes) => {
            const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
            const pdfDoc = await loadingTask.promise;
            let fullText = '';
            for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const content = await page.getTextContent();
                
                // Group by Y
                const rowMap = new Map();
                content.items.forEach(item => {
                    const text = item.str;
                    if (!text || !text.trim()) return;
                    const y = item.transform[5];
                    let foundKey = null;
                    for (const k of rowMap.keys()) {
                        if (Math.abs(k - y) < 4.0) {
                            foundKey = k;
                            break;
                        }
                    }
                    if (foundKey === null) {
                        foundKey = y;
                        rowMap.set(foundKey, []);
                    }
                    rowMap.get(foundKey).push({ str: text, x: item.transform[4] });
                });
                const sortedYs = Array.from(rowMap.keys()).sort((a, b) => b - a);
                sortedYs.forEach(yKey => {
                    const itemsInRow = rowMap.get(yKey);
                    itemsInRow.sort((a, b) => a.x - b.x);
                    fullText += itemsInRow.map(it => it.str).join('   ') + '\\n';
                });
                fullText += '\\n--- PAGE END ---\\n';
            }
            return fullText;
        }
        """, pdf_bytes)

        with open(r"c:\Users\egeme\OneDrive\Desktop\CODEX\EdTech\ogrenci-takip\scratch\extracted_raw_text.txt", "w", encoding="utf-8") as out:
            out.write(result)

        print("Extracted length:", len(result))
        lines = result.splitlines()
        print("First 35 lines:")
        for l in lines[:35]:
            print(repr(l))

        await browser.close()

asyncio.run(main())

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

        lines = await page.evaluate("""
        async (bytes) => {
            const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
            const pdfDoc = await loadingTask.promise;
            if (pdfDoc.numPages < 2) return ['ONLY 1 PAGE'];
            const page = await pdfDoc.getPage(2);
            const content = await page.getTextContent();
            
            // Satır bazlı Y hizalaması
            const rowMap = new Map();
            content.items.forEach(item => {
                const text = item.str;
                if (!text || (!text.trim() && text !== ' ')) return;
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
                rowMap.get(foundKey).push({ str: text, x: item.transform[4], width: item.width || 0 });
            });

            const sortedYs = Array.from(rowMap.keys()).sort((a, b) => b - a);
            const outputLines = [];

            sortedYs.forEach(yKey => {
                const items = rowMap.get(yKey);
                items.sort((a, b) => a.x - b.x);
                let lineStr = '';
                let lastEnd = null;

                for (let i = 0; i < items.length; i++) {
                    const it = items[i];
                    if (!it.str) continue;
                    if (lastEnd === null) {
                        lineStr += it.str;
                    } else {
                        const gap = it.x - lastEnd;
                        if (gap > 10.0) {
                            lineStr += '   ' + it.str;
                        } else if (gap > 2.0) {
                            if (!lineStr.endsWith(' ') && !it.str.startsWith(' ')) {
                                lineStr += ' ' + it.str;
                            } else {
                                lineStr += it.str;
                            }
                        } else {
                            lineStr += it.str;
                        }
                    }
                    lastEnd = it.x + it.width;
                }
                if (lineStr.trim()) outputLines.push(lineStr.trim());
            });

            return outputLines;
        }
        """, pdf_bytes)

        print("=== PAGE 2 RECONSTRUCTED LINES ===")
        for l in lines[:40]:
            print(repr(l))

        await browser.close()

asyncio.run(main())

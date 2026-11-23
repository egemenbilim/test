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

        extracted_text = await page.evaluate("""
        async (bytes) => {
            const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
            const pdfDoc = await loadingTask.promise;
            
            function processItemsToLines(items) {
                const rowMap = new Map();
                items.forEach(item => {
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
                const lines = [];

                sortedYs.forEach(yKey => {
                    const rowItems = rowMap.get(yKey);
                    rowItems.sort((a, b) => a.x - b.x);
                    
                    let lineStr = '';
                    let lastEnd = null;
                    for (let i = 0; i < rowItems.length; i++) {
                        const it = rowItems[i];
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
                    if (lineStr.trim()) lines.push(lineStr.trim());
                });
                return lines;
            }

            let fullText = '';
            
            // Page 1: Single full-width page
            const page1 = await pdfDoc.getPage(1);
            const content1 = await page1.getTextContent();
            const lines1 = processItemsToLines(content1.items);
            fullText += lines1.join('\\n') + '\\n--- SAYFA SONU ---\\n';

            // Page 2: Two column layout (Left: x < 300, Right: x >= 300)
            if (pdfDoc.numPages >= 2) {
                const page2 = await pdfDoc.getPage(2);
                const content2 = await page2.getTextContent();
                
                // Check if page 2 has 2 columns
                const leftItems = content2.items.filter(it => it.transform[4] < 300);
                const rightItems = content2.items.filter(it => it.transform[4] >= 300);
                
                const leftLines = processItemsToLines(leftItems);
                const rightLines = processItemsToLines(rightItems);
                
                fullText += leftLines.join('\\n') + '\\n' + rightLines.join('\\n') + '\\n--- SAYFA SONU ---\\n';
            }

            return fullText;
        }
        """, pdf_bytes)

        with open(r"c:\Users\egeme\OneDrive\Desktop\CODEX\EdTech\ogrenci-takip\scratch\test_clean_fulltext.txt", "w", encoding="utf-8") as f:
            f.write(extracted_text)

        print("Full text length:", len(extracted_text))
        print("First 15 lines:")
        for l in extracted_text.splitlines()[:15]:
            print("  ", l)

        print("\nChecking Page 2 first 15 lines of left column:")
        p2_start = extracted_text.find("--- SAYFA SONU ---") + len("--- SAYFA SONU ---")
        p2_text = extracted_text[p2_start:]
        for l in p2_text.splitlines()[:20]:
            print("  ", l)

        await browser.close()

asyncio.run(main())

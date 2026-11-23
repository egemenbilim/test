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

        res = await page.evaluate("""
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

            let combinedText = '';
            for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const content = await page.getTextContent();
                if (pageNum === 1) {
                    const lines = processItemsToLines(content.items);
                    combinedText += lines.join('\\n') + '\\n--- SAYFA SONU ---\\n';
                } else {
                    const hasTwoCols = content.items.some(it => it.transform[4] >= 300 && it.str && it.str.trim());
                    if (hasTwoCols) {
                        const left = content.items.filter(it => it.transform[4] < 300);
                        const right = content.items.filter(it => it.transform[4] >= 300);
                        combinedText += processItemsToLines(left).join('\\n') + '\\n' + processItemsToLines(right).join('\\n') + '\\n--- SAYFA SONU ---\\n';
                    } else {
                        combinedText += processItemsToLines(content.items).join('\\n') + '\\n--- SAYFA SONU ---\\n';
                    }
                }
            }

            // Test parsing via imported module or local function
            return {
                textLen: combinedText.length,
                preview: combinedText.slice(0, 1000)
            };
        }
        """, pdf_bytes)

        print("Combined text length:", res['textLen'])
        print("First 1000 chars of combined text:")
        print(res['preview'])

        await browser.close()

asyncio.run(main())

import sys
import os

pdf_path = r"C:\Users\egeme\.gemini\antigravity\brain\9e6d7214-97d4-493e-b2c4-9389d4b013d7\.user_uploaded\media_1795451803719_362f52d9.pdf"

print("PDF exists:", os.path.exists(pdf_path))
print("PDF size:", os.path.getsize(pdf_path) if os.path.exists(pdf_path) else 0)

try:
    import pypdf
    reader = pypdf.PdfReader(pdf_path)
    print("Num pages:", len(reader.pages))
    for i, p in enumerate(reader.pages):
        print(f"=== PAGE {i+1} ===")
        txt = p.extract_text()
        print(txt[:1500])
except Exception as e:
    print("pypdf error:", e)

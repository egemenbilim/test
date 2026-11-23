with open(r'c:\Users\egeme\OneDrive\Desktop\CODEX\EdTech\ogrenci-takip\scratch\test_clean_fulltext.txt', encoding='utf-8') as f:
    text = f.read()

p2 = text[text.find('Ders Soru Analizleri'):]
lines = p2.splitlines()
print('Total lines in p2:', len(lines))
for i in [0, 45, 80, 115]:
    print(f'--- chunk {i} ---')
    for l in lines[i:i+10]:
        print(" ", l)

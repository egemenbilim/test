# Sınavcı – Profesyonel Test, Yazılı ve Ders Föyü Hazırlama Stüdyosu

**Sınavcı**, öğretmenler ve eğitimciler için geliştirilmiş bağımsız, çevrimdışı ve web uyumlu çalışan profesyonel bir test, yazılı sınav ve ders föyü hazırlama stüdyosudur.

Tüm telif, hukuki sözleşmeler, üçüncü taraf marka ibareleri ve pazarlama sayfaları tamamen temizlenmiş; yalnızca temel materyal üretim işlevleri tutulup **Egemen's Testmaker** renk paleti, tipografisi ve tasarım diliyle donatılmıştır.

---

## 🎨 Tasarım Sistemi & Renk Şeması

- **Ana Marka Rengi:** Cyan (`#06b6d4`) & Koyu Arka Plan (`#0f172a` / `#06090e`)
- **Vurgu Renkleri:** Zümrüt Yeşili (`#059669`), Kehribar (`#f59e0b`), Barut Grisi (`#334155`)
- **Yazı Tipi:** `Noto Sans`, system-ui, sans-serif
- **İlham Sözü:** *"Milletleri kurtaranlar yalnız ve ancak öğretmenlerdir."*

---

## 🚀 1-Tıkla Başlatma

1. Klasördeki **`baslat.bat`** dosyasına çift tıklayın.
2. Yerel sunucu başlatılır ve tarayıcınızda otomatik olarak **`http://localhost:8080`** açılır.

*Komut satırından başlatmak için:*
```bash
python -B server.py --open
```

---

## 🛠️ Temel Atölyeler ve Özellikler

### 1. Test Oluşturma (Yaprak Test) – [`/test`](http://localhost:8080/test)
- **MEB Uyumlu 2 Sütunlu Düzen:** Sayfa taşması olmadan, matbaa kalitesinde çift sütun test mizanpajı.
- **Çoktan Seçmeli:** A-B-C-D-E seçenekleri, madalyon soru numaralandırması.
- **Soru Havuzu & Kırpma:** PDF dosyasından doğrudan soru kırpıp test sayfasına aktarma.
- **Baskıya Hazır PDF:** Cevap anahtarlı veya öğrenci nüshası olarak tek tıkla yazdırma.

### 2. Yazılı Sınav Oluşturma – [`/yazili`](http://localhost:8080/yazili)
- **MEB Konu Soru Dağılım Senaryoları:** Ortak yazılı sınav senaryolarına tam uyum.
- **Açık Uçlu ve Klasik Sorular:** Puanlama kutuları, soru puan tablosu.
- **Öğrenci Anteti:** Ad, Soyad, Sınıf, Numara ve Not haneleri hazır gelir.

### 3. Konu Anlatım Föyü – [`/foy`](http://localhost:8080/foy)
- **Modüler Blok Mimarisi:** Konu Başlığı, Anlatım Metni, Formül & Kural Kutuları, Çözümlü Örnekler, Sıra Sizde Alıştırmaları.
- **Öğretmen / Öğrenci Görünümü:** Çözümleri tek tuşla gizleme/gösterme özelliği.

### 4. Soru Havuzu Deposu – [`/havuz`](http://localhost:8080/havuz)
- Kırptığınız veya yazdığınız soruların sınıflandırılarak saklandığı kişisel soru bankası.

### 5. Sınavlarım ve Belgelerim – [`/sinavlarim`](http://localhost:8080/sinavlarim)
- Hazırladığınız tüm sınav ve föyleri tarayıcı yerel hafızasında saklayıp tek tıkla geri yükleme.

---

## 🧪 Doğrulama ve Testler

Sistem testlerini çalıştırmak için:
```bash
python -B test_clone.py
```

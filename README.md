# 🎓 Egemen's EdTech — Eğitim Yönetim & Materyal Platformu

> **Canlı Bağlantı:** [https://egemenbilim.github.io/edtech/](https://egemenbilim.github.io/edtech/)

Öğretmenler ve eğitimciler için veri odaklı öğrenci takibi, sınav hazırlığı ve yapay zekâ destekli pedagojik materyal üretimini tek çatı altında toplayan bütünleşik web platformu.

---

## 🏛️ Proje Mimarisi ve Dizin Hiyerarşisi

Proje, modern tarayıcı standartlarında çalışan **Native JavaScript ES Modules (`type="module"`)** mimarisine sahiptir. Herhangi bir derleme (build), paketleme (bundler) veya Node.js bağımlılığı gerektirmez; doğrudan GitHub Pages üzerinde çalışır.

```text
EdTech/
│
├── 🌐 index.html                       # Ana Portal / Karşılama Ekranı
├── 📄 README.md                        # Depo Dokümantasyonu & Vibecoding Rehberi
│
├── 📁 ogrenci-takip/                   # 1. Öğrenci Takip Sistemi (Modüler)
│   ├── index.html                      # Uygulama Arayüzü
│   ├── css/
│   │   └── style.css                   # Panel Stilleri ve A4 Yazdırma (Print) Kuralları
│   └── js/
│       ├── state.js                    # Veritabanı (DB), LocalStorage & Sabitler
│       ├── utils.js                    # Toast, Net Hesaplama, SVG Çizim Motorları
│       ├── main.js                     # Navigasyon, Sekmeler ve Global Orkestrasyon
│       └── modules/
│           ├── dashboard.js            # Özet İstatistik Kartları
│           ├── siniflar.js             # Sınıf Yönetimi, Konu Takibi & Aktif Ders Süreci
│           ├── ogrenciler.js           # Öğrenci Listesi, Detay Analizi, PDF & Toplu Giriş
│           ├── denemeler.js            # Tekli / AI Toplu Deneme Girişi & Parser
│           ├── haftalik.js             # Haftalık Soru Takibi, Branş Raporu & Pasta Grafik
│           ├── raporlar.js             # Gelişim Analizi, Başarı Sıralaması & Rapor PDF
│           └── backup.js               # JSON Yedekleme (Dışa/İçe Aktar)
│
├── 📁 prompt-deposu/                   # 2. Eğitim Promptları Deposu (Modüler)
│   ├── index.html                      # Prompt Üretici Arayüzü
│   ├── css/
│   │   └── style.css                   # Premium Navy-Emerald Tema & Animasyonlar
│   └── js/
│       ├── templates.js                # 9 Hazır Pedagojik Prompt Şablonu & Kurallar
│       ├── utils.js                    # Bildirimler, Çıktı Biçimlendirme & Form Doğrulama
│       └── main.js                     # Dinamik Formlar, Prompt Üretimi & Panoya Kopyalama
│
└── 📁 egemens-testmaker/               # 3. Sınav Hazırlama Aracı (Modüler)
    ├── index.html                      # Testmaker Çalışma Alanı
    ├── css/
    │   └── style.css
    └── js/
        ├── main.js, state.js, storage.js, utils.js
        └── modules/
            ├── cropTool.js             # Görsel / PDF Soru Kırpma & OCR
            ├── equationEditor.js       # KaTeX Matematiksel Formül Editörü
            ├── pdfEngine.js            # Vektörel PDF Üretim Motoru
            ├── previewStage.js         # İnteraktif Önizleme ve Sayfa Düzenleyici
            ├── questionManager.js      # Soru Havuzu ve Sıralama Yönetimi
            ├── sidebar.js              # Şablon ve Test Ayarları (MEB / Klasik)
            ├── textModal.js            # Çoktan Seçmeli, Boşluk Doldurma & Klasik Soru
            └── wordExport.js           # DOCX (Word) Dışa Aktarma Motoru
```

---

## ⚡ Vibecoding ile Token Tasarrufu Rehberi

Kod tabanı, yapay zekâ araçlarına (ChatGPT, Claude, Gemini, Cursor vb.) devasa monolitik dosyalar göndermek yerine **sadece üzerinde çalışmak istediğiniz ufak modülü** atarak minimum token harcamanız için özel olarak ayrıştırılmıştır.

### Nasıl Uygulanır?

1. **Hangi özelliği geliştirmek istediğinizi seçin:**
   - Öğrenci kayıtları veya detay grafiği için 👉 `ogrenci-takip/js/modules/ogrenciler.js`
   - Haftalık branş raporu için 👉 `ogrenci-takip/js/modules/haftalik.js`
   - Prompt şablonları eklemek veya değiştirmek için 👉 `prompt-deposu/js/templates.js`
   - Sınav başlığı veya MEB logosu ayarları için 👉 `egemens-testmaker/js/modules/sidebar.js`

2. **Yapay Zekâya İstemi (Prompt) Verin:**
   Tüm projeyi veya 2.000 satırlık HTML'i göndermek yerine sadece:
   - Veri yapısını (`state.js` içindeki ilgili tanım - 5 satır)
   - İlgili modül dosyasını (ör. `haftalik.js` - ~100 satır) yapıştırın.

> 💡 **Sonuç:** İstek başına 25.000 token yerine sadece **~1.000 token** harcarsınız; yapay zekâ diğer ekranları bozmadan hızlı ve hatasız kod üretir.

---

## 🚀 Yerel Geliştirme (Localhost)

ES Modülleri güvenlik sebebiyle tarayıcıda `file:///` protokolünde kısıtlamaya tabidir. Yerel makinenizde test etmek için basit bir yerel sunucu başlatabilirsiniz:

```bash
# Python ile:
python -m http.server 8000

# veya Node.js npx ile:
npx serve .

# veya VS Code eklentisi ile:
# "Live Server" butonuna basarak açabilirsiniz.
```

---

## 📄 Lisans & İletişim

- **Geliştirici:** Egemen Bilim
- **İletişim:** [egemenbilim@gmail.com](mailto:egemenbilim@gmail.com)
- **Instagram:** [@egemenbilim](https://www.instagram.com/egemenbilim/)

/* ══════════════════════════════════════════════════════
   Öğrenci Takip Sistemi — Detaylı Karne Ayrıştırıcı & Veri Motoru
   Öğrenciyi "Karne Sınıfı"na otomatik aktarır, ders ve konu analizlerini çeker.
   ══════════════════════════════════════════════════════ */

import { DB, saveDB, nid, netHesapla, denemeBulVeyaOlustur } from '../state.js';
import { $, toast, fmtTarih, trNormalize, enIyiOgrenciEslestir } from '../utils.js';
import { getCatiKonu, gruplaSorularKonuBazinda } from './karneTaxonomy.js';
import { renderKarneKarsilastirmaRaporu } from './karneKarsilastirma.js';

let aktifKarneVerisi = null;

export function getAktifKarneVerisi() {
  return aktifKarneVerisi;
}

export function setAktifKarneVerisi(data) {
  aktifKarneVerisi = data;
}

/**
 * "Karne Sınıfı" adlı sınıfı bulur veya oluşturur, ID'sini döner.
 */
export function getOrCreateKarneSinifi() {
  let ks = DB.siniflar.find(s => trNormalize(s.ad).toLowerCase() === 'karne sinifi');
  if (!ks) {
    ks = { id: nid(), ad: 'Karne Sınıfı' };
    DB.siniflar.push(ks);
    saveDB();
  }
  return ks;
}

/**
 * Ham karne metnini (PDF text içeriği veya OCR metni) ayrıştırır.
 */
export function parseKarneMetin(text) {
  if (!text || !text.trim()) {
    return { error: 'Karne içeriği boş veya okunamadı.' };
  }

  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Üst Bilgileri Çıkar
  let ogrenciAdi = '';
  let sinavAdi = '';
  let sinavTarihi = '';
  let sinavKodu = '';
  let ogrenciNo = '';
  let ogrenciSinifi = '';
  let kitapcik = 'A';
  let tytPuan = 0;
  let genelPuanOrt = 0;
  let yuzdelikDilim = 0;
  let sube = '';
  let siralama = { genel: 0, sube: 0, ilce: 0, il: 0, sinif: 0, katilan: 0 };
  let osym26 = '';
  let osym25 = '';

  // 1.A. Öğrenci Adı Tespiti
  // Format 1: İki nokta ile ("Öğrenci Adı: KEREM DEMİRER")
  const mOgrColon = cleanText.match(/Öğrenci\s*Adı\s*:\s*([^\n\r]+)/i);
  if (mOgrColon) {
    let val = mOgrColon[1].trim();
    val = val.split(/\s{2,}|\bSınıfı\b|\bNo\b|\bKitapçık\b/i)[0].trim();
    if (val && !/^(?:Sınıfı|No|Kitapçık|Türü)/i.test(val)) {
      ogrenciAdi = val;
    }
  }

  // Format 2: Tablo Başlığı ve Alt Değer Satırı
  // Başlık: "Öğrenci Adı   Sınıfı   No   Kitapçık Türü"
  // Değer:  "KEREM DEMİRER   1313   46164   B"
  if (!ogrenciAdi) {
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (/Öğrenci\s*Adı/i.test(l)) {
        if (/Sınıfı|No|Kitapçık/i.test(l)) {
          if (i + 1 < lines.length) {
            const valLine = lines[i + 1];
            // Regex ile Ad Soyad + Sınıf + No + Kitapçık
            const vm = valLine.match(/^([A-ZÇĞİÖŞÜa-zçğıöşü\s]+?)\s+(\d{1,5}[A-Za-z\-]*)\s+(\d{2,10})(?:\s+([A-D]))?$/);
            if (vm) {
              ogrenciAdi = vm[1].trim();
              if (!ogrenciSinifi) ogrenciSinifi = vm[2].trim();
              if (!ogrenciNo) ogrenciNo = vm[3].trim();
              if (vm[4]) kitapcik = vm[4].trim();
              break;
            } else {
              const parts = valLine.split(/\s{2,}|\b\d{2,}\b/);
              if (parts && parts[0].trim().length > 2) {
                ogrenciAdi = parts[0].trim();
                break;
              }
            }
          }
        } else {
          if (i + 1 < lines.length) {
            const nextL = lines[i + 1];
            if (!/^(?:Sınıfı|No|Kitapçık|Türü|Sınav|Puan)/i.test(nextL)) {
              ogrenciAdi = nextL.trim();
              break;
            }
          }
        }
      }
    }
  }

  // 1.B. Sınav Adı, Şube, Kodu, Tarihi
  const mSnvColon = cleanText.match(/Sınav\s*Adı\s*:\s*([^\n\r]+)/i);
  if (mSnvColon) {
    let val = mSnvColon[1].trim();
    val = val.split(/\s{2,}|\bŞube\b|\bSınav Kodu\b|\bSınav Tarihi\b/i)[0].trim();
    if (val) sinavAdi = val;
  }

  if (!sinavAdi) {
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (/Sınav\s*Adı/i.test(l)) {
        if (/Şube|Sınav Kodu|Tarih/i.test(l)) {
          if (i + 1 < lines.length) {
            const valLine = lines[i + 1];
            // "ALTERNATİF TYT   İzmit   120801   07.11.2026"
            const vm = valLine.match(/^(.+?)\s+([A-ZÇĞİÖŞÜa-zçğıöşü]+)\s+(\d{4,10})\s+(\d{1,2}\.\d{1,2}\.\d{4})$/);
            if (vm) {
              sinavAdi = vm[1].trim();
              sube = vm[2].trim();
              if (!sinavKodu) sinavKodu = vm[3].trim();
              if (!sinavTarihi) {
                const pts = vm[4].split('.');
                sinavTarihi = `${pts[2]}-${pts[1].padStart(2, '0')}-${pts[0].padStart(2, '0')}`;
              }
              break;
            } else {
              const parts = valLine.split(/\s{2,}|\b\d{4,}\b|\b\d{2}\.\d{2}\.\d{4}\b/);
              if (parts && parts[0].trim().length > 2) {
                sinavAdi = parts[0].trim();
                break;
              }
            }
          }
        } else {
          if (i + 1 < lines.length) {
            const nextL = lines[i + 1];
            if (!/^(?:Şube|Sınav Kodu|Tarih|Puan|TYT|AYT|LGS)/i.test(nextL)) {
              sinavAdi = nextL.trim();
              break;
            }
          }
        }
      }
    }
  }

  // Tarih desteği
  if (!sinavTarihi) {
    const mTar = cleanText.match(/Sınav Tarihi\s*[:\n\r\t]+(\d{1,2}\.\d{1,2}\.\d{4})/i) ||
                 cleanText.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (mTar) {
      if (mTar[1] && mTar[1].includes('.')) {
        const pts = mTar[1].split('.');
        sinavTarihi = `${pts[2]}-${pts[1].padStart(2, '0')}-${pts[0].padStart(2, '0')}`;
      } else if (mTar[3]) {
        sinavTarihi = `${mTar[3]}-${mTar[2].padStart(2, '0')}-${mTar[1].padStart(2, '0')}`;
      }
    }
  }

  if (!sinavKodu) {
    const mKod = cleanText.match(/Sınav Kodu\s*[:\n\r\t]+([0-9A-Za-z]+)/i);
    if (mKod) sinavKodu = mKod[1].trim();
  }

  if (!ogrenciNo) {
    const mNo = cleanText.match(/\bNo\s*[:\n\r\t]+([0-9A-Za-z]+)/i);
    if (mNo) ogrenciNo = mNo[1].trim();
  }

  if (!ogrenciSinifi) {
    const mSin = cleanText.match(/\bSınıfı\s*[:\n\r\t]+([^\n\r]+)/i);
    if (mSin) ogrenciSinifi = mSin[1].trim();
  }

  // Temizleme: Öğrenci adı içindeki artık etiketleri temizle
  ogrenciAdi = ogrenciAdi.replace(/^(?:Öğrenci\s*Adı|Adı\s*Soyadı)\s*[:\s]*/i, '').trim();
  ogrenciAdi = ogrenciAdi.replace(/\s{2,}/g, ' ').trim();
  if (!ogrenciAdi || ogrenciAdi.toLowerCase() === 'öğrenci adı') ogrenciAdi = 'Öğrenci';
  if (!sinavAdi) sinavAdi = 'TYT Detaylı Deneme';
  if (!sinavTarihi) sinavTarihi = new Date().toISOString().split('T')[0];

  // Puan & Sıralamalar
  const mPuan = cleanText.match(/TYT\s*\n\s*(\d{2,3}[,\.]\d{1,4})/i) ||
                cleanText.match(/Puan\s*[:\n\r\t]+(\d{2,3}[,\.]\d{1,4})/i);
  if (mPuan) tytPuan = parseFloat(mPuan[1].replace(',', '.'));

  const mOrt = cleanText.match(/Genel\s*Puan Ort\s*[:\n\r\t]*(\d{2,3}[,\.]\d{1,4})/i) ||
               cleanText.match(/(\d{2,3}[,\.]\d{1,4})\s+%\s*(\d{1,2}[,\.]\d{1,2})/);
  if (mOrt) {
    genelPuanOrt = parseFloat(mOrt[1].replace(',', '.'));
    if (mOrt[2]) yuzdelikDilim = parseFloat(mOrt[2].replace(',', '.'));
  }

  const mYuzde = cleanText.match(/%\s*(\d{1,2}[,\.]\d{1,2})/);
  if (mYuzde && !yuzdelikDilim) {
    yuzdelikDilim = parseFloat(mYuzde[1].replace(',', '.'));
  }

  // OSYM tahminleri
  const mOsym = cleanText.match(/(\d{1,2}\.\d{3}\.\d{3})\s+(\d{1,2}\.\d{3}\.\d{3})/);
  if (mOsym) {
    osym26 = mOsym[1];
    osym25 = mOsym[2];
  }

  // Katılan öğrenci sayısı
  const mKat = cleanText.match(/Sınava Katılan Öğrenci Sayısı\s+(\d+)/i);
  if (mKat) siralama.katilan = parseInt(mKat[1], 10);

  // Sıralamalar (Genel, Şube, Sınıf)
  const mSira = cleanText.match(/%\d{1,2}[,\.]\d{1,2}\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
  if (mSira) {
    siralama.genel = parseInt(mSira[1], 10);
    siralama.il = parseInt(mSira[2], 10);
    siralama.ilce = parseInt(mSira[3], 10);
    siralama.sube = parseInt(mSira[4], 10);
    siralama.sinif = parseInt(mSira[5], 10);
  }

  // 2. Sayfa 2: "Ders Soru Analizleri"
  const subjectList = [
    'TYT_Türkçe', 'TYT_Tarih', 'TYT_Coğrafya', 'TYT_Felsefe', 'TYT_DinKültürü',
    'TYT_Matematik', 'TYT_Geometri', 'TYT_Fizik', 'TYT_Kimya', 'TYT_Biyoloji'
  ];

  let curSubject = 'TYT_Türkçe';
  const questions = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine) continue;

    // Satır içinde yan yana birden çok soru veya sütun varsa segmentlere ayır
    const segments = rawLine.split(/\s{3,}|\t/).map(s => s.trim()).filter(Boolean);

    for (const l of segments) {
      // Ders başlığı tespiti
      let foundSubj = false;
      for (const s of subjectList) {
        if (l === s || l.startsWith(s + ' ') || l.startsWith(s + '\t')) {
          curSubject = s;
          foundSubj = true;
          break;
        }
      }
      if (foundSubj) continue;

      // Pattern 1: No + Konu + DC + OC (örn: "19 Paragraf Bilgisi C D")
      let m = l.match(/^(\d{1,3})\s+(.+?)\s+([A-E])\s+([A-E])$/i);
      if (m) {
        const qNo = parseInt(m[1], 10);
        const hamKonu = m[2].trim();
        const dc = m[3].toUpperCase();
        const oc = m[4].toUpperCase();
        questions.push({
          no: qNo,
          ders: normalizeDersAdi(curSubject),
          hamKonu,
          catiKonu: getCatiKonu(curSubject, hamKonu),
          dc,
          oc,
          durum: dc === oc ? 'D' : 'Y'
        });
        continue;
      }

      // Pattern 2: No + Konu + DC (Boş bırakılmış soru, örn: "6 Söz Gruplarının Anlamı B")
      m = l.match(/^(\d{1,3})\s+(.+?)\s+([A-E])$/i);
      if (m) {
        const qNo = parseInt(m[1], 10);
        const hamKonu = m[2].trim();
        const dc = m[3].toUpperCase();
        questions.push({
          no: qNo,
          ders: normalizeDersAdi(curSubject),
          hamKonu,
          catiKonu: getCatiKonu(curSubject, hamKonu),
          dc,
          oc: '',
          durum: 'B'
        });
        continue;
      }

      // Pattern 3: No + DC (Konu adı belirtilmemiş tek soru, örn: "9 D", "31 A", "40 B")
      m = l.match(/^(\d{1,3})\s+([A-E])$/i);
      if (m) {
        const qNo = parseInt(m[1], 10);
        const dc = m[2].toUpperCase();
        const defaultKonu = curSubject.includes('Geometri') ? 'Geometri' : (curSubject.includes('Matematik') ? 'Temel Kavramlar & Sayılar' : 'Genel Soru');
        questions.push({
          no: qNo,
          ders: normalizeDersAdi(curSubject),
          hamKonu: defaultKonu,
          catiKonu: getCatiKonu(curSubject, defaultKonu),
          dc,
          oc: '',
          durum: 'B'
        });
        continue;
      }
    }
  }

  // 3. Konu Bazlı Gruplama & İstatistikler
  const konuGruplari = gruplaSorularKonuBazinda(questions);

  // 4. Ders Bazlı Toplamlar
  const dersOzetleriMap = new Map();
  questions.forEach(q => {
    if (!dersOzetleriMap.has(q.ders)) {
      dersOzetleriMap.set(q.ders, { ders: q.ders, soru: 0, dogru: 0, yanlis: 0, bos: 0, net: 0 });
    }
    const d = dersOzetleriMap.get(q.ders);
    d.soru++;
    if (q.durum === 'D') d.dogru++;
    else if (q.durum === 'Y') d.yanlis++;
    else d.bos++;
  });

  const dersOzetleri = [];
  dersOzetleriMap.forEach(d => {
    d.net = Math.round(Math.max(0, d.dogru - (d.yanlis / 4.0)) * 100) / 100;
    dersOzetleri.push(d);
  });

  const toplamSoru = questions.length;
  const toplamDogru = questions.filter(q => q.durum === 'D').length;
  const toplamYanlis = questions.filter(q => q.durum === 'Y').length;
  const toplamBos = questions.filter(q => q.durum === 'B').length;
  const toplamNet = Math.round(Math.max(0, toplamDogru - (toplamYanlis / 4.0)) * 100) / 100;

  return {
    ogrenciAdi,
    sinavAdi,
    sinavTarihi,
    sinavKodu,
    ogrenciNo,
    ogrenciSinifi,
    kitapcik,
    sube,
    tytPuan,
    genelPuanOrt,
    yuzdelikDilim,
    siralama,
    osym26,
    osym25,
    toplam: {
      soru: toplamSoru,
      dogru: toplamDogru,
      yanlis: toplamYanlis,
      bos: toplamBos,
      net: toplamNet
    },
    dersOzetleri,
    konuGruplari,
    sorular: questions
  };
}

/**
 * PDF.js text item'larını aralarındaki X mesafesine göre birleştirip satırlara dönüştürür.
 * İki parça arasındaki mesafe küçükse (örn: DEM + İ + RER) boşluksuz birleştirir;
 * büyükse kelime boşluğu veya sütun ayracı ekler.
 */
function processPdfItemsToLines(items) {
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
          // Bitişik karakter parçası (Türkçe harfler vb.)
          lineStr += it.str;
        }
      }
      lastEnd = it.x + it.width;
    }
    if (lineStr.trim()) lines.push(lineStr.trim());
  });
  return lines;
}

/**
 * PDF dosyasını (PDF.js üzerinden) asenkron okur ve parse eder.
 */
export async function parseKarnePdfFile(file) {
  if (!window.pdfjsLib) {
    throw new Error('PDF okuma kütüphanesi hazır değil.');
  }

  if (window.PDF_WORKER_BLOB_URL && window.pdfjsLib.GlobalWorkerOptions) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = window.PDF_WORKER_BLOB_URL;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;

  let combinedText = '';

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();

    if (pageNum === 1) {
      // 1. Sayfa: Geniş özet ve üst bilgiler tablosu
      const lines = processPdfItemsToLines(content.items);
      combinedText += lines.join('\n') + '\n--- SAYFA SONU ---\n';
    } else {
      // 2. Sayfa ve sonrası: 2 sütunlu soru analizi (Sol: x < 300, Sağ: x >= 300)
      const hasTwoCols = content.items.some(it => it.transform[4] >= 300 && it.str && it.str.trim());
      if (hasTwoCols) {
        const leftItems = content.items.filter(it => it.transform[4] < 300);
        const rightItems = content.items.filter(it => it.transform[4] >= 300);
        const leftLines = processPdfItemsToLines(leftItems);
        const rightLines = processPdfItemsToLines(rightItems);
        combinedText += leftLines.join('\n') + '\n' + rightLines.join('\n') + '\n--- SAYFA SONU ---\n';
      } else {
        const lines = processPdfItemsToLines(content.items);
        combinedText += lines.join('\n') + '\n--- SAYFA SONU ---\n';
      }
    }
  }

  return parseKarneMetin(combinedText);
}

function normalizeDersAdi(rawSubj) {
  if (!rawSubj) return 'Türkçe';
  const s = rawSubj.replace(/^TYT_/, '').trim();
  if (s === 'DinKültürü') return 'Din Kültürü';
  return s;
}

/**
 * Karnesi çözümlenen öğrenciyi "Karne Sınıfı"na geçirir ve verileri DB'ye kaydeder.
 */
export function karneVerisiniKaydet(karneData) {
  if (!karneData || !karneData.ogrenciAdi) {
    toast('Kaydedilecek geçerli bir karne verisi yok.', false);
    return null;
  }

  // 1. "Karne Sınıfı"nı güvenceye al
  const karneSinifi = getOrCreateKarneSinifi();

  // 2. Öğrenciyi bul veya oluştur; sınıfını "Karne Sınıfı" olarak güncelle
  let ogr = DB.ogrenciler.find(o => trNormalize(o.adSoyad) === trNormalize(karneData.ogrenciAdi));
  if (!ogr) {
    const match = enIyiOgrenciEslestir(karneData.ogrenciAdi, DB.ogrenciler);
    if (match.eslesti) {
      ogr = match.ogrenci;
    }
  }

  if (ogr) {
    ogr.sinifId = karneSinifi.id; // Karnesi girilen öğrenciyi "Karne Sınıfı" adlı sınıfa geçir!
    if (karneData.ogrenciNo && !ogr.veli) {
      ogr.veli = `No: ${karneData.ogrenciNo}`;
    }
  } else {
    ogr = {
      id: nid(),
      adSoyad: karneData.ogrenciAdi,
      sinifId: karneSinifi.id, // Doğrudan Karne Sınıfı'na kaydolur
      alan: 'Sayısal',
      veli: karneData.ogrenciNo ? `No: ${karneData.ogrenciNo}` : ''
    };
    DB.ogrenciler.push(ogr);
  }

  // 3. Denemeyi bul veya oluştur
  const sinavAdi = karneData.sinavAdi || `TYT Deneme - ${fmtTarih(karneData.sinavTarihi)}`;
  const { deneme, yeni: yeniDeneme } = denemeBulVeyaOlustur(sinavAdi, 'TYT', karneData.sinavTarihi);

  // 4. Genel ders netlerini DB.sonuclar'a yaz (Mükerrer varsa güncelle veya ekle)
  (karneData.dersOzetleri || []).forEach(ds => {
    let mevcutSonuc = DB.sonuclar.find(s => s.denemeId === deneme.id && s.ogrenciId === ogr.id && s.ders === ds.ders);
    if (mevcutSonuc) {
      mevcutSonuc.dogru = ds.dogru;
      mevcutSonuc.yanlis = ds.yanlis;
      mevcutSonuc.bos = ds.bos;
      mevcutSonuc.net = ds.net;
    } else {
      DB.sonuclar.push({
        id: nid(),
        denemeId: deneme.id,
        ogrenciId: ogr.id,
        ders: ds.ders,
        dogru: ds.dogru,
        yanlis: ds.yanlis,
        bos: ds.bos,
        net: ds.net
      });
    }
  });

  // 5. Detaylı Karne Kaydını DB.karneler içinde sakla
  if (!DB.karneler) DB.karneler = [];
  const existingKarneIdx = DB.karneler.findIndex(k => k.ogrenciId === ogr.id && k.denemeId === deneme.id);
  const karneKaydi = {
    id: existingKarneIdx >= 0 ? DB.karneler[existingKarneIdx].id : nid(),
    ogrenciId: ogr.id,
    denemeId: deneme.id,
    sinavAdi: deneme.ad,
    sinavTarihi: deneme.tarih,
    sinavKodu: karneData.sinavKodu,
    ogrenciNo: karneData.ogrenciNo,
    tytPuan: karneData.tytPuan,
    genelPuanOrt: karneData.genelPuanOrt,
    yuzdelikDilim: karneData.yuzdelikDilim,
    siralama: karneData.siralama,
    toplam: karneData.toplam,
    dersOzetleri: karneData.dersOzetleri,
    konuGruplari: karneData.konuGruplari,
    sorular: karneData.sorular
  };

  if (existingKarneIdx >= 0) {
    DB.karneler[existingKarneIdx] = karneKaydi;
  } else {
    DB.karneler.push(karneKaydi);
  }

  saveDB();
  toast(`✅ ${ogr.adSoyad} karnesi başarıyla "Karne Sınıfı"na aktarıldı!`, true);

  return { ogrenci: ogr, deneme, karne: karneKaydi };
}

export let seciliKarneDersFiltresi = new Set();

export function karneDersToggle(dersAdi) {
  if (seciliKarneDersFiltresi.has(dersAdi)) {
    seciliKarneDersFiltresi.delete(dersAdi);
  } else {
    seciliKarneDersFiltresi.add(dersAdi);
  }
  karneKarsilastirManuel();
}

export function karneDersFiltreTemizle() {
  seciliKarneDersFiltresi.clear();
  karneKarsilastirManuel();
}

function renderDersChipBar(tumDersler) {
  const container = $('karneDersFiltreWrap');
  if (!container) return;
  const hepsiAktif = seciliKarneDersFiltresi.size === 0;

  let html = `
    <div style="background:#f8fafc;padding:10px 14px;border-radius:8px;border:1px solid #e2e8f0;margin-top:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
        <div style="font-size:12px;font-weight:700;color:#334155;display:flex;align-items:center;gap:6px">
          <span>📚 Ders Filtresi:</span>
          <span style="font-weight:400;color:#64748b;font-size:11.5px">Gelişimini görmek istediğiniz dersleri seçin (seçim yapılmazsa hepsi raporda yer alır):</span>
        </div>
        ${!hepsiAktif ? `<button type="button" class="btn sm gray" onclick="window.karneDersFiltreTemizle()" style="font-size:11px;padding:3px 8px;cursor:pointer">✕ Filtreyi Temizle (Tümünü Göster)</button>` : ''}
      </div>
      <div id="karneDersChipListesi" style="display:flex;flex-wrap:wrap;gap:6px">
        <button type="button" class="btn sm ${hepsiAktif ? '' : 'gray'}" onclick="window.karneDersFiltreTemizle()" style="font-size:11.5px;padding:4px 10px;cursor:pointer;font-weight:${hepsiAktif ? '700' : '400'}">
          ${hepsiAktif ? '✓ Tümü (Hepsi)' : 'Tümü'}
        </button>
        ${tumDersler.map(d => {
          const isSelected = seciliKarneDersFiltresi.has(d);
          return `
            <button type="button" class="btn sm ${isSelected ? '' : 'gray'}" onclick="window.karneDersToggle('${d}')" style="font-size:11.5px;padding:4px 10px;cursor:pointer;${isSelected ? 'background:var(--indigo);color:#fff;font-weight:700;' : ''}">
              ${isSelected ? '✓ ' : ''}${d}
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
  container.innerHTML = html;
}

/**
 * UI: Detaylı Karne Yükleme Paneli ve Önizleme
 */
export function renderKarneYuklePaneli() {
  const container = $('denKarneAlani');
  if (!container) return;

  container.innerHTML = `
    <div class="card" style="border:2px solid var(--indigo);background:#fcfdff;margin-bottom:16px">
      <div class="flex" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #e2e8f0;padding-bottom:12px">
        <div>
          <h2 style="margin:0;color:var(--indigo);font-size:17px;display:flex;align-items:center;gap:8px">
            <span>📇</span> <span>Detaylı Sonuç Karnesi Girişi & Karşılaştırmalı Analiz</span>
          </h2>
          <p class="muted" style="font-size:12px;margin:4px 0 0 0">
            Öğrencinin kurum detay karnesini (PDF veya OCR metni) otomatik aktarın. Öğrenci otomatik olarak <b>"Karne Sınıfı"</b>na geçirilir ve konular gruplanır.
          </p>
        </div>
        <div class="flex" style="gap:8px">
          <button type="button" class="btn sm gray" onclick="window.karneOrnekYukle()">📋 Örnek Karne Yükle</button>
          <button type="button" class="btn sm" onclick="$('karneMetinModal').classList.toggle('hidden')">📝 Metin / OCR Yapıştır</button>
        </div>
      </div>

      <!-- SÜRÜKLE BIRAK PDF ALANI -->
      <div id="karneDropZone" style="border:2px dashed #818cf8;background:#f8fafc;border-radius:12px;padding:30px 20px;text-align:center;margin-top:14px;cursor:pointer;transition:all .2s" onclick="document.getElementById('karneFileInput').click()">
        <div style="font-size:42px;margin-bottom:8px">📄</div>
        <h3 style="margin:0 0 6px 0;color:#1e293b;font-size:15px">Detaylı Sonuç Karnesi PDF Dosyasını Buraya Bırakın</h3>
        <p class="muted" style="font-size:12px;max-width:540px;margin:0 auto 12px">
          veya <b>tıklayarak bilgisayarınızdan seçin</b>. (Tüm dersler, sıralamalar ve soru-konu analizleri saniyeler içinde ayıklanır.)
        </p>
        <button type="button" class="btn sm" style="pointer-events:none">📂 PDF Dosyası Seç</button>
        <input type="file" id="karneFileInput" accept=".pdf,application/pdf" style="display:none" onchange="window.karnePdfSecildi(event)">
      </div>

      <!-- ALTERNATİF METİN / OCR KUTUSU -->
      <div id="karneMetinModal" class="hidden mt-3" style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:10px;padding:14px">
        <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:8px">
          <b style="color:#92400e;font-size:13px">📥 Karne Metnini veya OCR Çıktısını Buraya Yapıştırın:</b>
          <button type="button" class="btn sm gray" onclick="$('karneMetinModal').classList.add('hidden')">✕ Kapat</button>
        </div>
        <textarea id="karneMetinAlani" class="copy-area" style="min-height:160px;font-size:12px;font-family:monospace" placeholder="Detaylı sonuç karnesi metnini buraya yapıştırın..."></textarea>
        <div class="flex mt-3" style="gap:8px">
          <button type="button" class="btn green sm" onclick="window.karneMetinAyristir()">⚡ Metni Çözümle</button>
          <button type="button" class="btn gray sm" onclick="$('karneMetinAlani').value=''">Temizle</button>
        </div>
      </div>

      <!-- ÖNİZLEME & ONAY KARTI -->
      <div id="karneOnizlemeKarti" class="hidden mt-4"></div>
    </div>

    <!-- İKİ KARNE KARŞILAŞTIRMA VE GELİŞİM RAPORU BÖLÜMÜ -->
    <div id="karneKarsilastirmaBolumu" class="card mt-4" style="background:#ffffff;border:1px solid #cbd5e1">
      <div class="flex" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-bottom:1px solid #f1f5f9;padding-bottom:12px">
        <div>
          <h2 style="margin:0;color:#0f172a;font-size:16px;display:flex;align-items:center;gap:8px">
            <span>📊</span> <span>İki Karne Arası Karşılaştırma & Değişim Analizi Raporu</span>
          </h2>
          <p class="muted" style="font-size:12px;margin:3px 0 0 0">
            Öğrencinin iki farklı deneme karnesini karşılaştırın; net, soru ve konu bazlı artış/düşüşleri, gelişim gösteren alanları ve çalışılması gereken konuları detaylı inceleyin.
          </p>
        </div>
        <div class="flex" style="gap:8px">
          <button type="button" class="btn green sm" onclick="window.karneRaporYazdir()">🖨️ Raporu Yazdır / PDF</button>
        </div>
      </div>

      <div class="grid-3 mt-3" style="gap:12px;background:#f8fafc;padding:12px;border-radius:8px">
        <div class="field">
          <label style="font-weight:700;font-size:12px">👩‍🎓 Öğrenci Seçin (Karne Sınıfı):</label>
          <select id="karneSeciliOgrenci" onchange="window.karneOgrenciDegisti(this.value)" style="font-weight:600"></select>
        </div>
        <div class="field">
          <label style="font-weight:700;font-size:12px">📅 1. Deneme (Önceki Sınav):</label>
          <select id="karneDeneme1" onchange="window.karneKarsilastirManuel()"></select>
        </div>
        <div class="field">
          <label style="font-weight:700;font-size:12px">📅 2. Deneme (Karşılaştırılacak Son Sınav):</label>
          <select id="karneDeneme2" onchange="window.karneKarsilastirManuel()"></select>
        </div>
      </div>

      <!-- DİNAMİK DERS FİLTRESİ ÇUBUĞU -->
      <div id="karneDersFiltreWrap"></div>

      <div id="karneKarsilastirmaRaporIcerik" class="mt-4">
        <div class="empty">Karşılaştırma için lütfen yukarıdan öğrenci ve incelenecek iki denemeyi seçin veya yeni karne yükleyin.</div>
      </div>
    </div>
  `;

  // Selectleri doldur
  doldurKarneOgrenciSelectleri();

  // Sürükle bırak olaylarını dropzone'a doğrudan bağla
  const dropZone = $('karneDropZone');
  if (dropZone) {
    ['dragenter', 'dragover'].forEach(ev => {
      dropZone.addEventListener(ev, e => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.background = '#e0e7ff';
        dropZone.style.borderColor = 'var(--indigo2)';
      });
    });
    ['dragleave'].forEach(ev => {
      dropZone.addEventListener(ev, e => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.background = '#f8fafc';
        dropZone.style.borderColor = '#818cf8';
      });
    });
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.background = '#f8fafc';
      dropZone.style.borderColor = '#818cf8';
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) {
        window.karnePdfSecildi({ dataTransfer: e.dataTransfer });
      }
    });
  }
}

/**
 * Karne karşılaştırma için öğrenci ve deneme listesini doldurur.
 */
export function doldurKarneOgrenciSelectleri() {
  const oSel = $('karneSeciliOgrenci');
  if (!oSel) return;

  const karneSinifi = DB.siniflar.find(s => trNormalize(s.ad).toLowerCase() === 'karne sinifi');
  let ogrList = DB.ogrenciler;
  if (karneSinifi) {
    ogrList = DB.ogrenciler.filter(o => o.sinifId === karneSinifi.id);
    if (!ogrList.length) ogrList = DB.ogrenciler;
  }

  if (!ogrList.length) {
    oSel.innerHTML = '<option value="">Henüz öğrenci kaydı yok</option>';
    return;
  }

  oSel.innerHTML = ogrList.map(o => `<option value="${o.id}">${o.adSoyad} (${o.veli || 'Karne Sınıfı'})</option>`).join('');

  if (ogrList.length > 0) {
    karneOgrenciDegisti(ogrList[0].id);
  }
}

export function karneOgrenciDegisti(ogrenciId) {
  const oid = Number(ogrenciId);
  const d1Sel = $('karneDeneme1');
  const d2Sel = $('karneDeneme2');
  if (!d1Sel || !d2Sel) return;

  const karneler = (DB.karneler || []).filter(k => k.ogrenciId === oid).sort((a, b) => (a.sinavTarihi || '').localeCompare(b.sinavTarihi || ''));

  if (karneler.length === 0) {
    d1Sel.innerHTML = '<option value="">Bu öğrenciye ait kayıtlı karne yok</option>';
    d2Sel.innerHTML = '<option value="">Bu öğrenciye ait kayıtlı karne yok</option>';
    $('karneKarsilastirmaRaporIcerik').innerHTML = '<div class="empty">Bu öğrenci için henüz detaylı karne kaydedilmemiş. Lütfen yukarıdan karne yükleyin.</div>';
    return;
  }

  const opts = karneler.map(k => `<option value="${k.id}">${k.sinavAdi} (${fmtTarih(k.sinavTarihi)}) • Net: ${k.toplam.net}</option>`).join('');
  d1Sel.innerHTML = opts;
  d2Sel.innerHTML = opts;

  if (karneler.length >= 2) {
    d1Sel.selectedIndex = karneler.length - 2; // Sondan bir önceki
    d2Sel.selectedIndex = karneler.length - 1; // En son sınav
  } else {
    d1Sel.selectedIndex = 0;
    d2Sel.selectedIndex = 0;
  }

  karneKarsilastirManuel();
}

export function karneKarsilastirManuel() {
  const k1Id = Number($('karneDeneme1')?.value);
  const k2Id = Number($('karneDeneme2')?.value);
  const repEl = $('karneKarsilastirmaRaporIcerik');
  if (!repEl) return;

  const k1 = (DB.karneler || []).find(k => k.id === k1Id);
  const k2 = (DB.karneler || []).find(k => k.id === k2Id);

  if (!k1 || !k2) {
    repEl.innerHTML = '<div class="empty">Karşılaştırma için en az 1 karne seçilmelidir.</div>';
    const chipWrap = $('karneDersFiltreWrap');
    if (chipWrap) chipWrap.innerHTML = '';
    return;
  }

  // Mevcut benzersiz dersleri topla ve filtre çubuğunu güncelle
  const tumDersler = Array.from(new Set([
    ...(k1.dersOzetleri || []).map(d => d.ders),
    ...(k2.dersOzetleri || []).map(d => d.ders)
  ]));

  renderDersChipBar(tumDersler);

  repEl.innerHTML = renderKarneKarsilastirmaRaporu(k1, k2, seciliKarneDersFiltresi);
}

/**
 * Önizleme kartını ekrana çizer.
 */
export function gosterKarneOnizleme(parsed) {
  aktifKarneVerisi = parsed;
  const card = $('karneOnizlemeKarti');
  if (!card) return;

  card.classList.remove('hidden');

  const toplam = parsed.toplam;
  const dersRows = parsed.dersOzetleri.map(d => `
    <tr>
      <td style="font-weight:600">${d.ders}</td>
      <td class="num muted">${d.soru}</td>
      <td class="num green"><b>${d.dogru}</b></td>
      <td class="num red-c"><b>${d.yanlis}</b></td>
      <td class="num muted">${d.bos}</td>
      <td class="num mono" style="color:var(--indigo);font-weight:700">${d.net.toFixed(2)}</td>
    </tr>
  `).join('');

  // Konu Grupları tablosu (Örn: Genel Paragraf(23), Cümlede Anlam(3))
  const konuRows = parsed.konuGruplari.map(k => `
    <tr>
      <td style="font-size:12px;color:#64748b">${k.ders}</td>
      <td style="font-weight:700;color:var(--indigo);font-size:13px">${k.etiket}</td>
      <td class="num green">${k.dogru}</td>
      <td class="num red-c">${k.yanlis}</td>
      <td class="num muted">${k.bos}</td>
      <td class="num mono"><b>%${k.basariYuzde}</b></td>
    </tr>
  `).join('');

  card.innerHTML = `
    <div style="background:#f1f5f9;border-radius:10px;padding:16px;border:1.5px solid #cbd5e1">
      <div class="flex" style="justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
        <div style="flex:1;min-width:300px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span class="badge" style="background:#dbeafe;color:#1e40af;font-size:11px;font-weight:700">KARNE ÖNİZLEME</span>
            <span style="font-size:11.5px;color:#64748b">Bilgileri kontrol edip gerekirse değiştirebilirsiniz:</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
            <div style="flex:1;min-width:180px">
              <label style="font-size:11px;font-weight:700;color:#334155;display:block">👤 Öğrenci Adı Soyadı:</label>
              <input type="text" id="karnePvOgrenciAd" value="${parsed.ogrenciAdi}" style="font-size:15px;font-weight:700;color:#0f172a;width:100%;padding:5px 8px;border:1.5px solid #cbd5e1;border-radius:6px;background:#fff">
            </div>
            <div style="flex:1;min-width:160px">
              <label style="font-size:11px;font-weight:700;color:#334155;display:block">📝 Sınav Adı:</label>
              <input type="text" id="karnePvSinavAd" value="${parsed.sinavAdi}" style="font-size:13px;font-weight:600;color:#0f172a;width:100%;padding:5px 8px;border:1.5px solid #cbd5e1;border-radius:6px;background:#fff">
            </div>
            <div style="width:130px">
              <label style="font-size:11px;font-weight:700;color:#334155;display:block">📅 Sınav Tarihi:</label>
              <input type="date" id="karnePvTarih" value="${parsed.sinavTarihi}" style="font-size:13px;color:#0f172a;width:100%;padding:5px 8px;border:1.5px solid #cbd5e1;border-radius:6px;background:#fff">
            </div>
          </div>
          <div class="muted" style="font-size:11.5px;margin-top:6px">
            Sınıfı: <b>${parsed.ogrenciSinifi || '—'}</b> • No: <b>${parsed.ogrenciNo || '—'}</b> ➔ Otomatik olarak <b>"Karne Sınıfı"</b>na geçirilecektir.
          </div>
        </div>
        <div class="flex" style="gap:8px">
          <button type="button" class="btn green" onclick="window.karneOnaylaVeKaydetBtn()" style="padding:10px 16px;font-weight:700;font-size:13px">💾 Sisteme & Karne Sınıfına Kaydet</button>
          <button type="button" class="btn gray sm" onclick="$('karneOnizlemeKarti').classList.add('hidden')">✕ İptal</button>
        </div>
      </div>

      <!-- Skor Kartları -->
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin:14px 0">
        <div style="flex:1;min-width:110px;background:#fff;padding:10px 14px;border-radius:8px;border:1px solid #e2e8f0;text-align:center">
          <div style="font-size:11px;color:#64748b">TYT Puanı</div>
          <div style="font-size:20px;font-weight:800;color:var(--indigo)">${parsed.tytPuan ? parsed.tytPuan.toFixed(3) : '—'}</div>
        </div>
        <div style="flex:1;min-width:110px;background:#fff;padding:10px 14px;border-radius:8px;border:1px solid #e2e8f0;text-align:center">
          <div style="font-size:11px;color:#64748b">Toplam Net</div>
          <div style="font-size:20px;font-weight:800;color:#047857">${toplam.net.toFixed(2)}</div>
        </div>
        <div style="flex:1;min-width:110px;background:#fff;padding:10px 14px;border-radius:8px;border:1px solid #e2e8f0;text-align:center">
          <div style="font-size:11px;color:#64748b">Doğru / Yanlış / Boş</div>
          <div style="font-size:16px;font-weight:700;color:#0f172a">
            <span style="color:#047857">${toplam.dogru}D</span> / <span style="color:#b91c1c">${toplam.yanlis}Y</span> / <span style="color:#64748b">${toplam.bos}B</span>
          </div>
        </div>
        <div style="flex:1;min-width:110px;background:#fff;padding:10px 14px;border-radius:8px;border:1px solid #e2e8f0;text-align:center">
          <div style="font-size:11px;color:#64748b">Yüzdelik Dilim / Sıra</div>
          <div style="font-size:16px;font-weight:700;color:#b45309">%${parsed.yuzdelikDilim || '—'} (${parsed.siralama.genel || '—'}/${parsed.siralama.katilan || '—'})</div>
        </div>
      </div>

      <!-- Ders ve Konu Dağılımı -->
      <div class="grid-2" style="gap:14px;margin-top:12px">
        <div style="background:#fff;padding:12px;border-radius:8px;border:1px solid #e2e8f0">
          <h4 style="margin:0 0 8px 0;font-size:13px;color:#0f172a">📚 Ders Bazlı Dağılım</h4>
          <div style="overflow-x:auto">
            <table class="table" style="font-size:12px">
              <thead><tr><th>Ders</th><th class="num">Soru</th><th class="num">D</th><th class="num">Y</th><th class="num">B</th><th class="num">Net</th></tr></thead>
              <tbody>${dersRows}</tbody>
            </table>
          </div>
        </div>

        <div style="background:#fff;padding:12px;border-radius:8px;border:1px solid #e2e8f0">
          <h4 style="margin:0 0 8px 0;font-size:13px;color:#0f172a">🎯 Çatı Konu Grupları [Konu(n)]</h4>
          <div style="overflow-x:auto;max-height:280px">
            <table class="table" style="font-size:12px">
              <thead><tr><th>Ders</th><th>Çatı Konu</th><th class="num">D</th><th class="num">Y</th><th class="num">B</th><th class="num">Başarı %</th></tr></thead>
              <tbody>${konuRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

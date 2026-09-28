/* ══════════════════════════════════════════════════════
   Öğrenci Takip Sistemi — PDF Deneme Ayrıştırıcı ve Onay Modülü
   ══════════════════════════════════════════════════════ */

import {
  DB, saveDB, nid, netHesapla, denemeBulVeyaOlustur
} from '../state.js';
import { $, toast, fmtTarih, ogrenciAdi, sinifAdi } from '../utils.js';
import { renderDenemeler, dersListesiniOlustur } from './denemeler.js';

let aktifPdfVerisi = null;
let onUpdateSelectsCallback = null;

export function setPdfSelectCallback(cb) {
  onUpdateSelectsCallback = cb;
}

function notifySelects() {
  if (onUpdateSelectsCallback) onUpdateSelectsCallback();
}

/* ═════ TÜRKÇE KARAKTER TEMİZLEYİCİ ═════ */
export function cleanTurkishText(text) {
  if (!text) return '';
  let s = String(text);

  // PDF font eşleme sorunları için yaygın kalıplar
  const dict = {
    'HSEY  N': 'HÜSEYİN',
    'HSEYN': 'HÜSEYİN',
    'ZDEM  R': 'ÖZDEMİR',
    'ZDEMR': 'ÖZDEMİR',
    'AL ': 'ALİ ',
    'KA  AN': 'KAĞAN',
    'KAAN': 'KAĞAN',
    'ZAVOTU': 'ZAVOTÇU',
    'A  CA': 'AĞCA',
    'ACA': 'AĞCA',
    'TANRIVER': 'TANRIÖVER',
    'Trke': 'Türkçe',
    'Corafya': 'Coğrafya',
    'Co  rafya': 'Coğrafya',
    'Snf': 'Sınıf',
    'ube': 'Şube',
    ' l': 'İl',
    ' le': 'İlçe',
    'Snav': 'Sınav',
    'Hz': 'Hız',
    'MAAR  F0': 'MAARİF',
    'MAARF0': 'MAARİF',
    'MAAR  F': 'MAARİF',
    'KOCAEL ': 'KOCAELİ',
    ' ZM  T': 'İZMİT',
    'zmit': 'İzmit',
    'sral': 'sıralı'
  };

  for (const [k, v] of Object.entries(dict)) {
    s = s.replaceAll(k, v);
  }

  // Unicode replacement karakterlerini ve fazla boşlukları temizle
  s = s.replace(/\ufffd/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/* ═════ PDF METNİNDEN DENEME BİLGİLERİNİ ÇÖZÜMLEME ═════ */
export function parseExamLines(lines) {
  if (!lines || !lines.length) return { error: 'PDF içeriği okunamadı veya boş.' };

  let sinavTuru = 'TYT';
  let sinavAdi = '';
  let sinavTarihi = '';
  let subeKurum = '';

  // 1. Üst bilgileri tara
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const l = lines[i];

    // Sınav Türü
    if (/\bTYT\b/i.test(l)) sinavTuru = 'TYT';
    else if (/\bAYT\b/i.test(l)) sinavTuru = 'AYT';
    else if (/\bLGS\b/i.test(l)) sinavTuru = 'LGS';

    // Tarih tespiti: GG.AA.YYYY
    const tm = l.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (tm && !sinavTarihi) {
      sinavTarihi = `${tm[3]}-${tm[2].padStart(2, '0')}-${tm[1].padStart(2, '0')}`;
    }

    // Deneme Adı tespiti (örn: 12.09.2026 - 110300 - 11 Hız ve Renk MAARİF0 TYT)
    if (/MAAR[İI]?F|H[ıiIİ]z ve Renk|[ÖO]zdebir|T[ÖO]DER|Limit|Yan[ıi]t|Apotemi|TYT|AYT/i.test(l)) {
      if (!sinavAdi && l.length > 5 && !/NET-PUAN|L[İI]STES[İI]|S[ıi]nav Tarihi/i.test(l)) {
        // Tarih ve kodu ayıkla
        let adClean = cleanTurkishText(l);
        // Örn: "12.09.2026 - 110300 - 11 Hız ve Renk MAARİF0 TYT İzmit..."
        const subeSplit = adClean.split(/\s+(?:İzmit|KOCAELİ|Şube|\d{2}\s+\d{2})/i)[0];
        sinavAdi = subeSplit.replace(/^\d{2}\.\d{2}\.\d{4}\s*-\s*\d+\s*-\s*/, '').replace(/[\-\s]+$/, '').trim();
        if (!sinavAdi) sinavAdi = subeSplit.trim();
      }
    }

    // Şube / İlçe tespiti
    if (/İzmit|KOCAELİ|Şube|İlçe/i.test(l) && !subeKurum) {
      const sm = l.match(/([A-ZÇĞİÖŞÜa-zçğıöşü\s\-]+KOCAEL[İI][A-ZÇĞİÖŞÜa-zçğıöşü\s\-]+)/);
      if (sm) subeKurum = sm[1].trim();
    }
  }

  if (!sinavAdi) sinavAdi = `${sinavTuru} Deneme Sınavı`;
  if (!sinavTarihi) sinavTarihi = new Date().toISOString().split('T')[0];

  // 2. Öğrenci satırlarını tara
  const ogrenciler = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;

    // Satır yapısı: SıraNo ÖğrNo Ad Soyad Sınıf Kitapçık Numaralar...
    // Örnek: "1 39791 HÜSEYİN UMU ARSLAN 1112 B 28 12 25,00 ..."
    const m = raw.match(/^\s*(\d+)\s+(\d+)\s+(.*?)\s+([^\s]+)\s+([ABCD])\s+([\d\,\.\-\s]+)$/);
    if (!m) continue;

    const sira = parseInt(m[1], 10);
    const ogrNo = m[2].trim();
    const rawAd = m[3].trim();
    const pdfSinif = m[4].trim();
    const kitapcik = m[5].trim();
    const rest = m[6].trim();

    const adSoyad = cleanTurkishText(rawAd);

    // Sayıları çıkar (virgülleri noktaya çevirerek)
    const tokens = rest.replace(/,/g, '.').split(/\s+/);
    const nums = [];
    for (const t of tokens) {
      const v = parseFloat(t);
      if (!isNaN(v)) nums.push(v);
    }

    if (nums.length < 15) continue; // Yeterli ders neti yoksa atla

    // 11 üçlü:
    // 0: Türkçe, 1: Tarih, 2: Coğrafya, 3: Felsefe, 4: Din Kültürü,
    // 5: Matematik, 6: Geometri, 7: Fizik, 8: Kimya, 9: Biyoloji, 10: Toplam
    const trip = (idx) => {
      const pos = idx * 3;
      if (pos + 2 < nums.length) {
        return {
          dogru: Math.round(nums[pos]),
          yanlis: Math.round(nums[pos + 1]),
          net: Math.round(nums[pos + 2] * 100) / 100
        };
      }
      return { dogru: 0, yanlis: 0, net: 0 };
    };

    const turkce = trip(0);
    const tarih = trip(1);
    const cografya = trip(2);
    const felsefe = trip(3);
    const din = trip(4);
    const mat = trip(5);
    const geo = trip(6);
    const fizik = trip(7);
    const kimya = trip(8);
    const biyoloji = trip(9);
    const toplam = trip(10);

    // TYT'de Matematik = Matematik (30) + Geometri (10) tek derste 40 soru
    const matToplam = {
      dogru: mat.dogru + geo.dogru,
      yanlis: mat.yanlis + geo.yanlis,
      net: Math.round((mat.net + geo.net) * 100) / 100,
      altMat: mat,
      altGeo: geo
    };

    // Puan (genellikle 33. index)
    const puan = nums.length > 33 ? nums[33] : 0;

    // Sistemde kayıtlı öğrenci var mı?
    const eslesenOgr = DB.ogrenciler.find(o =>
      o.adSoyad.trim().toLowerCase() === adSoyad.toLowerCase() ||
      o.adSoyad.replace(/\s+/g, '').toLowerCase() === adSoyad.replace(/\s+/g, '').toLowerCase()
    );

    ogrenciler.push({
      dahilEt: true,
      sira,
      ogrNo,
      adSoyad,
      sinif: pdfSinif,
      seciliSinifId: eslesenOgr ? eslesenOgr.sinifId : null,
      kitapcik,
      mevcutOgrenci: !!eslesenOgr,
      eslesenOgrenciId: eslesenOgr ? eslesenOgr.id : null,
      turkce,
      tarih,
      cografya,
      felsefe,
      din,
      mat: matToplam,
      fizik,
      kimya,
      biyoloji,
      toplam,
      puan
    });
  }

  if (!ogrenciler.length) {
    return { error: 'PDF içeriğinde tablo veya öğrenci satırı bulunamadı. Lütfen "TYT / AYT Şube Net-Puan Listesi" formatında bir PDF yüklediğinizden emin olun.' };
  }

  return {
    sinavTuru,
    sinavAdi,
    sinavTarihi,
    subeKurum,
    ogrenciler
  };
}

/* ═════ DOSYADAN OKUMA (PDF.JS) ═════ */
export async function parsePdfFile(file) {
  if (!window.pdfjsLib) {
    throw new Error('PDF okuma kütüphanesi (pdf.js) yüklenemedi. Lütfen internet bağlantınızı kontrol edip sayfayı yenileyin.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;

  const allLines = [];

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();

    // Text item'larını Y koordinatına göre satır satır grupla
    // PDF'te Y koordinatı aşağıdan yukarıya artar, o yüzden tolerance ile grupluyoruz
    const rowMap = new Map();

    content.items.forEach(item => {
      const text = item.str;
      if (!text || !text.trim()) return;
      const x = item.transform[4];
      const y = item.transform[5];

      // Yaklaşık 2.5 piksel aralığındakileri aynı satır kabul et
      let foundKey = null;
      for (const k of rowMap.keys()) {
        if (Math.abs(k - y) < 3.0) {
          foundKey = k;
          break;
        }
      }
      if (foundKey === null) {
        foundKey = y;
        rowMap.set(foundKey, []);
      }
      rowMap.get(foundKey).push({ str: text, x, y });
    });

    // Satırları yukarıdan aşağıya sırala (büyük Y'den küçük Y'ye)
    const sortedYs = Array.from(rowMap.keys()).sort((a, b) => b - a);

    sortedYs.forEach(yKey => {
      const itemsInRow = rowMap.get(yKey);
      // Satır içi soldan sağa X'e göre sırala
      itemsInRow.sort((a, b) => a.x - b.x);

      // Kelimeleri birleştir
      let lineStr = '';
      let lastX = -1;
      itemsInRow.forEach(it => {
        if (lastX >= 0 && it.x - lastX > 4) {
          lineStr += ' ';
        }
        lineStr += it.str;
        lastX = it.x + (it.width || (it.str.length * 4.5));
      });

      if (lineStr.trim()) {
        allLines.push(lineStr.trim());
      }
    });
  }

  return parseExamLines(allLines);
}

/* ═════ ONAY VE ÖNİZLEME EKRANI RENDER ═════ */
export function renderPdfOnayPaneli(parsed) {
  aktifPdfVerisi = parsed;
  const panel = $('pdfOnayAlani');
  if (!panel) return;

  panel.classList.remove('hidden');

  // Mevcut sınıflar dropdown seçenekleri
  const sinifSecenekleriHtml = DB.siniflar.map(s =>
    `<option value="${s.id}">${s.ad}</option>`
  ).join('');

  // PDF'ten çıkan benzersiz sınıf kodları
  const pdfSiniflar = [...new Set(parsed.ogrenciler.map(o => o.sinif))];
  const pdfSinifTavsiye = pdfSiniflar[0] || '11-A';

  const html = `
    <div class="card" style="background:#f8fafc;border:2px solid var(--indigo);margin-bottom:16px">
      <div class="flex" style="justify-content:space-between;flex-wrap:wrap;gap:10px;align-items:center;border-bottom:1px solid var(--border);padding-bottom:12px">
        <div>
          <h2 style="margin:0;color:var(--indigo)">🔍 PDF Çözümleme Sonucu & Onay Ekranı</h2>
          <p class="muted" style="font-size:12px;margin-top:2px">
            Belgeden <b>${parsed.ogrenciler.length} öğrenci</b> tespit edildi. Kaydetmeden önce sınıf, öğrenci adı veya sınav detaylarını düzenleyebilirsiniz.
          </p>
        </div>
        <button class="btn gray sm" onclick="window.pdfTemizle()">🧹 İptal / Kapat</button>
      </div>

      <!-- GENEL SINAV BİLGİLERİ -->
      <div class="grid-3 mt-3" style="gap:12px">
        <div class="field">
          <label>Sınav Türü *</label>
          <select id="pdfSinavTuru" style="font-weight:700">
            <option value="TYT" ${parsed.sinavTuru === 'TYT' ? 'selected' : ''}>TYT</option>
            <option value="AYT" ${parsed.sinavTuru === 'AYT' ? 'selected' : ''}>AYT</option>
            <option value="LGS" ${parsed.sinavTuru === 'LGS' ? 'selected' : ''}>LGS</option>
          </select>
        </div>
        <div class="field">
          <label>Deneme Adı *</label>
          <input id="pdfSinavAdi" value="${parsed.sinavAdi}" placeholder="Sınav Adı">
        </div>
        <div class="field">
          <label>Sınav Tarihi *</label>
          <input type="date" id="pdfSinavTarihi" value="${parsed.sinavTarihi}">
        </div>
      </div>

      <!-- TOPLU SINIF BELİRLEME ÇUBUĞU -->
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;margin:14px 0">
        <div class="flex" style="flex-wrap:wrap;gap:12px;align-items:center">
          <span style="font-weight:600;color:var(--indigo);font-size:13px">🏫 Toplu Sınıf Belirle:</span>
          <select id="pdfTopluSinifSecim" style="width:auto;min-width:180px">
            <optgroup label="Sistemdeki Mevcut Sınıflar">
              ${sinifSecenekleriHtml}
            </optgroup>
            <optgroup label="PDF'teki Sınıf Koduyla Yeni Oluştur">
              ${pdfSiniflar.map(sc => `<option value="NEW_${sc}">➕ "${sc}" Adında Yeni Sınıf Aç</option>`).join('')}
            </optgroup>
          </select>
          <button class="btn sm" onclick="window.pdfTopluSinifUygula()">Tümüne Uygula</button>
          <span class="muted" style="font-size:11px">PDF'teki sınıf: <b>${pdfSiniflar.join(', ')}</b></span>
        </div>
      </div>

      <!-- ÖĞRENCİ ONAY TABLOSU -->
      <div style="overflow-x:auto;max-height:480px;border:1px solid var(--border);border-radius:8px">
        <table class="table" style="margin:0;font-size:12.5px" id="pdfOgrenciTablosu">
          <thead style="position:sticky;top:0;background:#fff;z-index:10;box-shadow:0 1px 2px rgba(0,0,0,0.05)">
            <tr>
              <th style="width:36px;text-align:center">
                <input type="checkbox" id="pdfSecTumu" checked onchange="window.pdfSecTumuDegistir(this.checked)">
              </th>
              <th style="width:40px">Sıra</th>
              <th style="width:80px">Öğr No</th>
              <th style="min-width:190px">Öğrenci Adı Soyadı (Düzenlenebilir)</th>
              <th style="min-width:150px">Sınıf Seçimi</th>
              <th style="width:110px">Durum</th>
              <th class="num" title="Türkçe Net">Türkçe</th>
              <th class="num" title="Sosyal Net (Tarih+Coğ+Fel+Din)">Sosyal</th>
              <th class="num" title="Matematik Net (Mat+Geo)">Matematik</th>
              <th class="num" title="Fen Net (Fiz+Kim+Biyo)">Fen</th>
              <th class="num" style="color:var(--indigo);font-weight:700" title="Toplam Net">Toplam Net</th>
              <th class="num">Puan</th>
            </tr>
          </thead>
          <tbody>
            ${parsed.ogrenciler.map((o, idx) => {
              const sosyalNet = (o.tarih.net + o.cografya.net + o.felsefe.net + o.din.net).toFixed(2);
              const fenNet = (o.fizik.net + o.kimya.net + o.biyoloji.net).toFixed(2);
              const matNet = o.mat.net.toFixed(2);
              const turkceNet = o.turkce.net.toFixed(2);
              const topNet = o.toplam.net.toFixed(2);

              return `
                <tr id="pdf_row_${idx}">
                  <td style="text-align:center">
                    <input type="checkbox" class="pdf-row-chk" id="pdf_chk_${idx}" ${o.dahilEt ? 'checked' : ''} onchange="window.pdfRowToggle(${idx})">
                  </td>
                  <td class="muted">${o.sira}</td>
                  <td>
                    <input id="pdf_no_${idx}" value="${o.ogrNo}" style="width:65px;padding:4px 6px;font-size:12px;text-align:center">
                  </td>
                  <td>
                    <input id="pdf_ad_${idx}" value="${o.adSoyad}" style="width:100%;min-width:180px;padding:4px 8px;font-size:12.5px;font-weight:600">
                  </td>
                  <td>
                    <select id="pdf_sinif_${idx}" style="width:100%;min-width:130px;padding:4px 6px;font-size:12px">
                      ${DB.siniflar.map(s => `
                        <option value="${s.id}" ${(o.seciliSinifId === s.id || (!o.seciliSinifId && s.ad === o.sinif)) ? 'selected' : ''}>
                          ${s.ad}
                        </option>
                      `).join('')}
                      <option value="NEW_${o.sinif}" ${!o.seciliSinifId && !DB.siniflar.some(s => s.ad === o.sinif) ? 'selected' : ''}>
                        ➕ Yeni: "${o.sinif}"
                      </option>
                    </select>
                  </td>
                  <td>
                    ${o.mevcutOgrenci ?
                      '<span class="badge" style="background:#ecfdf5;color:var(--emerald);font-size:11px">✅ Mevcut</span>' :
                      '<span class="badge" style="background:#eff6ff;color:var(--indigo);font-size:11px">➕ Yeni</span>'
                    }
                  </td>
                  <td class="num mono">${turkceNet}</td>
                  <td class="num mono" title="Tar: ${o.tarih.net} | Coğ: ${o.cografya.net} | Fel: ${o.felsefe.net} | Din: ${o.din.net}">${sosyalNet}</td>
                  <td class="num mono" title="Mat: ${o.mat.altMat.net} | Geo: ${o.mat.altGeo.net}">${matNet}</td>
                  <td class="num mono" title="Fiz: ${o.fizik.net} | Kim: ${o.kimya.net} | Biyo: ${o.biyoloji.net}">${fenNet}</td>
                  <td class="num mono" style="font-weight:700;color:var(--indigo)">${topNet}</td>
                  <td class="num mono muted">${o.puan ? o.puan.toFixed(2) : '—'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- AKSİYON BUTONLARI -->
      <div class="flex mt-4" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <span style="font-size:13px;color:var(--muted)">
          Seçili: <b id="pdfSeciliSayi" style="color:var(--indigo)">${parsed.ogrenciler.filter(o => o.dahilEt).length}</b> / ${parsed.ogrenciler.length} öğrenci
        </span>
        <div class="flex" style="gap:10px">
          <button class="btn gray" onclick="window.pdfTemizle()">🧹 Vazgeç</button>
          <button class="btn green" style="font-size:14px;padding:10px 20px" onclick="window.pdfOnaylaVeKaydet()">
            💾 Onayla ve Sisteme Aktar
          </button>
        </div>
      </div>
    </div>
  `;

  panel.innerHTML = html;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ═════ ONAY EKRANI ETKİLEŞİMLERİ ═════ */
export function pdfSecTumuDegistir(secili) {
  if (!aktifPdfVerisi) return;
  aktifPdfVerisi.ogrenciler.forEach((o, i) => {
    o.dahilEt = secili;
    const chk = $(`pdf_chk_${i}`);
    if (chk) chk.checked = secili;
  });
  pdfSeciliSayisiGuncelle();
}

export function pdfRowToggle(idx) {
  if (!aktifPdfVerisi || !aktifPdfVerisi.ogrenciler[idx]) return;
  const chk = $(`pdf_chk_${idx}`);
  aktifPdfVerisi.ogrenciler[idx].dahilEt = chk ? chk.checked : false;
  pdfSeciliSayisiGuncelle();
}

function pdfSeciliSayisiGuncelle() {
  if (!aktifPdfVerisi) return;
  const sec = aktifPdfVerisi.ogrenciler.filter((_, i) => {
    const chk = $(`pdf_chk_${i}`);
    return chk && chk.checked;
  }).length;
  const el = $('pdfSeciliSayi');
  if (el) el.textContent = sec;
}

export function pdfTopluSinifUygula() {
  if (!aktifPdfVerisi) return;
  const secilenVal = $('pdfTopluSinifSecim').value;
  aktifPdfVerisi.ogrenciler.forEach((_, idx) => {
    const sel = $(`pdf_sinif_${idx}`);
    if (sel) sel.value = secilenVal;
  });
  toast('Tüm satırlara sınıf uygulandı');
}

export function pdfTemizle() {
  aktifPdfVerisi = null;
  const panel = $('pdfOnayAlani');
  if (panel) {
    panel.innerHTML = '';
    panel.classList.add('hidden');
  }
  const f = $('pdfDosyaInput');
  if (f) f.value = '';
  const m = $('pdfMetinInput');
  if (m) m.value = '';
}

/* ═════ ONAYLA VE KAYDET ═════ */
export function pdfOnaylaVeKaydet() {
  if (!aktifPdfVerisi) {
    toast('Aktarılacak veri bulunamadı', false);
    return;
  }

  const sinavAdi = $('pdfSinavAdi').value.trim();
  const sinavTuru = $('pdfSinavTuru').value;
  const sinavTarihi = $('pdfSinavTarihi').value;

  if (!sinavAdi || !sinavTarihi) {
    toast('Lütfen sınav adı ve tarihini eksiksiz girin', false);
    return;
  }

  // Seçili öğrencileri topla ve doğrula
  const aktarilacaklar = [];
  aktifPdfVerisi.ogrenciler.forEach((orig, idx) => {
    const chk = $(`pdf_chk_${idx}`);
    if (!chk || !chk.checked) return;

    const adInput = $(`pdf_ad_${idx}`);
    const noInput = $(`pdf_no_${idx}`);
    const sinifSel = $(`pdf_sinif_${idx}`);

    const guncelAd = adInput ? adInput.value.trim() : orig.adSoyad;
    const guncelNo = noInput ? noInput.value.trim() : orig.ogrNo;
    const guncelSinifVal = sinifSel ? sinifSel.value : (orig.seciliSinifId || `NEW_${orig.sinif}`);

    if (guncelAd) {
      aktarilacaklar.push({
        ...orig,
        adSoyad: guncelAd,
        ogrNo: guncelNo,
        sinifSecim: guncelSinifVal
      });
    }
  });

  if (!aktarilacaklar.length) {
    toast('Aktarmak için en az bir öğrenci seçmelisiniz', false);
    return;
  }

  // 1. Sınıfları hazırla / oluştur
  const sinifMap = new Map(); // key: secimVal -> sinifId
  aktarilacaklar.forEach(item => {
    const v = item.sinifSecim;
    if (sinifMap.has(v)) return;

    if (String(v).startsWith('NEW_')) {
      const yeniSinifAdi = v.replace('NEW_', '').trim() || 'Yeni Sınıf';
      let mevcut = DB.siniflar.find(s => s.ad.toLowerCase() === yeniSinifAdi.toLowerCase());
      if (!mevcut) {
        mevcut = { id: nid(), ad: yeniSinifAdi };
        DB.siniflar.push(mevcut);
      }
      sinifMap.set(v, mevcut.id);
    } else {
      const sid = parseInt(v, 10);
      sinifMap.set(v, sid);
    }
  });

  // 2. Öğrencileri hazırla / oluştur
  let yeniOgrSayisi = 0;
  aktarilacaklar.forEach(item => {
    const sid = sinifMap.get(item.sinifSecim) || (DB.siniflar[0] ? DB.siniflar[0].id : 1);

    // İsim benzerliğine göre öğrenci ara
    let ogr = DB.ogrenciler.find(o =>
      o.adSoyad.trim().toLowerCase() === item.adSoyad.trim().toLowerCase()
    );

    if (!ogr) {
      // Yeni öğrenci ekle
      ogr = {
        id: nid(),
        adSoyad: item.adSoyad,
        sinifId: sid,
        alan: '',
        veli: item.ogrNo ? `Öğr No: ${item.ogrNo}` : ''
      };
      DB.ogrenciler.push(ogr);
      yeniOgrSayisi++;
    } else {
      // Mevcut öğrencinin sınıfını güncelle
      ogr.sinifId = sid;
    }
    item.kaydedilenOgrenciId = ogr.id;
  });

  // 3. Denemeyi bul veya oluştur
  const { deneme, yeni: yeniDeneme } = denemeBulVeyaOlustur(sinavAdi, sinavTuru, sinavTarihi);

  // 4. Sonuçları kaydet
  let kaydedilenDersSayisi = 0;
  let mukerrerSayisi = 0;

  aktarilacaklar.forEach(item => {
    const oid = item.kaydedilenOgrenciId;

    // Bu denemede bu öğrencinin zaten kaydı var mı?
    if (DB.sonuclar.some(s => s.denemeId === deneme.id && s.ogrenciId === oid)) {
      mukerrerSayisi++;
      return;
    }

    // TYT Standart Dersleri
    const dersler = [
      { ders: 'Türkçe', d: item.turkce.dogru, y: item.turkce.yanlis, b: 0 },
      { ders: 'Tarih', d: item.tarih.dogru, y: item.tarih.yanlis, b: 0 },
      { ders: 'Coğrafya', d: item.cografya.dogru, y: item.cografya.yanlis, b: 0 },
      { ders: 'Felsefe', d: item.felsefe.dogru, y: item.felsefe.yanlis, b: 0 },
      { ders: 'Din Kültürü', d: item.din.dogru, y: item.din.yanlis, b: 0 },
      { ders: 'Matematik', d: item.mat.dogru, y: item.mat.yanlis, b: 0 },
      { ders: 'Fizik', d: item.fizik.dogru, y: item.fizik.yanlis, b: 0 },
      { ders: 'Kimya', d: item.kimya.dogru, y: item.kimya.yanlis, b: 0 },
      { ders: 'Biyoloji', d: item.biyoloji.dogru, y: item.biyoloji.yanlis, b: 0 }
    ];

    dersler.forEach(ds => {
      if (ds.d > 0 || ds.y > 0) {
        DB.sonuclar.push({
          id: nid(),
          denemeId: deneme.id,
          ogrenciId: oid,
          ders: ds.ders,
          dogru: ds.d,
          yanlis: ds.y,
          bos: ds.b,
          net: netHesapla(sinavTuru, ds.d, ds.y)
        });
        kaydedilenDersSayisi++;
      }
    });
  });

  saveDB();
  notifySelects();

  let msg = `✅ ${aktarilacaklar.length - mukerrerSayisi} öğrenci ve ${kaydedilenDersSayisi} ders sonucu başarıyla sisteme aktarıldı!`;
  if (yeniOgrSayisi > 0) msg += ` (${yeniOgrSayisi} yeni öğrenci açıldı)`;
  if (mukerrerSayisi > 0) msg += ` • ${mukerrerSayisi} öğrenci zaten kayıtlı olduğu için atlandı`;

  toast(msg, true);

  // Formu temizle ve listeleri güncelle
  pdfTemizle();
  dersListesiniOlustur();
  renderDenemeler();
}

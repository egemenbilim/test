/* ══════════════════════════════════════════════════════
   Öğrenci Takip Sistemi — İki Karne Arası Karşılaştırma & Değişim Analiz Motoru
   Öğrencinin iki karnesi arasındaki gelişim, gerileme ve çalışma tavsiyelerini raporlar.
   Seçilen derslere göre dinamik filtreleme ve sadeleştirilmiş modern UI sunar.
   ══════════════════════════════════════════════════════ */

import { fmtTarih } from '../utils.js';
import { getCalismaTavsiyesi } from './karneTaxonomy.js';

/**
 * İki karne arasındaki ders ve konu bazlı değişimleri hesaplar.
 * @param {Object} k1 - 1. Karne (Önceki)
 * @param {Object} k2 - 2. Karne (Yeni)
 * @param {Array<string>|Set<string>} seciliDersler - Filtrelenecek dersler (Boş ise tümü)
 */
export function karsilastirKarneler(k1, k2, seciliDersler = []) {
  if (!k1 || !k2) return null;

  const filtreAktif = Array.isArray(seciliDersler) ? seciliDersler.length > 0 : (seciliDersler && seciliDersler.size > 0);
  const dersFiltreSet = new Set(Array.from(seciliDersler || []));

  // 1. Ders Bazlı Değişimler
  const tumDersAdlari = new Set([
    ...(k1.dersOzetleri || []).map(d => d.ders),
    ...(k2.dersOzetleri || []).map(d => d.ders)
  ]);

  let dersKarsilastirma = [];
  tumDersAdlari.forEach(dersAdi => {
    if (filtreAktif && !dersFiltreSet.has(dersAdi)) return;

    const d1 = (k1.dersOzetleri || []).find(d => d.ders === dersAdi) || { soru: 0, dogru: 0, yanlis: 0, bos: 0, net: 0 };
    const d2 = (k2.dersOzetleri || []).find(d => d.ders === dersAdi) || { soru: 0, dogru: 0, yanlis: 0, bos: 0, net: 0 };
    const dNetFark = Math.round((d2.net - d1.net) * 100) / 100;
    const dDogruFark = d2.dogru - d1.dogru;
    const dYanlisFark = d2.yanlis - d1.yanlis;
    const dBosFark = d2.bos - d1.bos;

    dersKarsilastirma.push({
      ders: dersAdi,
      d1,
      d2,
      netFarki: dNetFark,
      dogruFarki: dDogruFark,
      yanlisFarki: dYanlisFark,
      bosFarki: dBosFark
    });
  });

  // Seçili derslere göre toplam net ve doğru/yanlış hesapla
  let k1TopNet = 0, k2TopNet = 0, k1TopD = 0, k2TopD = 0, k1TopY = 0, k2TopY = 0, k1TopB = 0, k2TopB = 0;
  if (filtreAktif) {
    dersKarsilastirma.forEach(d => {
      k1TopNet += d.d1.net;
      k2TopNet += d.d2.net;
      k1TopD += d.d1.dogru;
      k2TopD += d.d2.dogru;
      k1TopY += d.d1.yanlis;
      k2TopY += d.d2.yanlis;
      k1TopB += d.d1.bos;
      k2TopB += d.d2.bos;
    });
    k1TopNet = Math.round(k1TopNet * 100) / 100;
    k2TopNet = Math.round(k2TopNet * 100) / 100;
  } else {
    k1TopNet = k1.toplam?.net || 0;
    k2TopNet = k2.toplam?.net || 0;
    k1TopD = k1.toplam?.dogru || 0;
    k2TopD = k2.toplam?.dogru || 0;
    k1TopY = k1.toplam?.yanlis || 0;
    k2TopY = k2.toplam?.yanlis || 0;
    k1TopB = k1.toplam?.bos || 0;
    k2TopB = k2.toplam?.bos || 0;
  }

  const puanFarki = Math.round(((k2.tytPuan || 0) - (k1.tytPuan || 0)) * 1000) / 1000;
  const netFarki = Math.round((k2TopNet - k1TopNet) * 100) / 100;
  const dogruFarki = k2TopD - k1TopD;
  const yanlisFarki = k2TopY - k1TopY;
  const bosFarki = k2TopB - k1TopB;

  // 2. Konu Bazlı Değişimler (Çatı Konu Eşleştirme)
  const mapKonular = new Map();

  (k1.konuGruplari || []).forEach(kg => {
    if (filtreAktif && !dersFiltreSet.has(kg.ders)) return;
    const key = `${kg.ders}___${kg.catiKonu}`;
    mapKonular.set(key, {
      ders: kg.ders,
      catiKonu: kg.catiKonu,
      k1: kg,
      k2: null
    });
  });

  (k2.konuGruplari || []).forEach(kg => {
    if (filtreAktif && !dersFiltreSet.has(kg.ders)) return;
    const key = `${kg.ders}___${kg.catiKonu}`;
    if (!mapKonular.has(key)) {
      mapKonular.set(key, {
        ders: kg.ders,
        catiKonu: kg.catiKonu,
        k1: null,
        k2: kg
      });
    } else {
      mapKonular.get(key).k2 = kg;
    }
  });

  const konuKarsilastirma = [];
  mapKonular.forEach(val => {
    const kg1 = val.k1 || { toplamSoru: 0, dogru: 0, yanlis: 0, bos: 0, net: 0, basariYuzde: 0, etiket: `${val.catiKonu}(0)` };
    const kg2 = val.k2 || { toplamSoru: 0, dogru: 0, yanlis: 0, bos: 0, net: 0, basariYuzde: 0, etiket: `${val.catiKonu}(0)` };

    const dogruFark = kg2.dogru - kg1.dogru;
    const yanlisFark = kg2.yanlis - kg1.yanlis;
    const bosFark = kg2.bos - kg1.bos;
    const netFark = Math.round((kg2.net - kg1.net) * 100) / 100;
    const basariFark = kg2.basariYuzde - kg1.basariYuzde;

    let durum = 'sabit';
    if (dogruFark > 0 || (yanlisFark < 0 && kg2.dogru >= kg1.dogru) || basariFark >= 10) {
      durum = 'gelisme';
    } else if (dogruFark < 0 || yanlisFark > 0 || basariFark <= -10) {
      durum = 'dusus';
    } else if (kg2.basariYuzde < 50 || kg2.yanlis >= 2 || kg2.bos >= 2) {
      durum = 'eksik';
    }

    const guncelSoruSayisi = kg2.toplamSoru || kg1.toplamSoru || 1;
    const etiket = `${val.catiKonu}(${guncelSoruSayisi})`;
    const tavsiye = getCalismaTavsiyesi(val.ders, val.catiKonu, kg2.basariYuzde, kg2.yanlis, kg2.bos);

    konuKarsilastirma.push({
      ders: val.ders,
      catiKonu: val.catiKonu,
      etiket,
      k1: kg1,
      k2: kg2,
      dogruFark,
      yanlisFark,
      bosFark,
      netFark,
      basariFark,
      durum,
      tavsiye
    });
  });

  // Gelişen Konular
  const gelisenKonular = konuKarsilastirma.filter(item =>
    item.dogruFark > 0 || (item.yanlisFark < 0 && item.k2.dogru >= item.k1.dogru) || item.basariFark >= 15
  ).sort((a, b) => (b.dogruFark - a.dogruFark) || (b.basariFark - a.basariFark));

  // Nelere Çalışmalı (En çok yanlış yapılanlar ve başarı <%60 olanlar)
  const calisilacakKonular = konuKarsilastirma.filter(item => {
    return item.k2.yanlis > 0 || item.k2.bos > 0 || item.basariFark < 0 || item.k2.basariYuzde < 60;
  }).sort((a, b) => {
    const agirlikA = (a.k2.yanlis * 2) + a.k2.bos + (a.basariFark < 0 ? 3 : 0);
    const agirlikB = (b.k2.yanlis * 2) + b.k2.bos + (b.basariFark < 0 ? 3 : 0);
    return agirlikB - agirlikA;
  });

  return {
    k1,
    k2,
    filtreAktif,
    seciliDersler: Array.from(dersFiltreSet),
    tumDersler: Array.from(tumDersAdlari),
    puanFarki,
    netFarki,
    dogruFarki,
    yanlisFarki,
    bosFarki,
    k1TopNet,
    k2TopNet,
    k1TopD,
    k2TopD,
    k1TopY,
    k2TopY,
    k1TopB,
    k2TopB,
    dersKarsilastirma,
    konuKarsilastirma,
    gelisenKonular,
    calisilacakKonular
  };
}

/**
 * Sade, ferah ve pedagojik karşılaştırma raporunu oluşturur.
 */
export function renderKarneKarsilastirmaRaporu(k1, k2, seciliDersler = []) {
  const analiz = karsilastirKarneler(k1, k2, seciliDersler);
  if (!analiz) return '<div class="empty">Karşılaştırma hesaplanamadı.</div>';

  const {
    filtreAktif, seciliDersler: aktifDersListesi,
    puanFarki, netFarki, dogruFarki, yanlisFarki, bosFarki,
    k1TopNet, k2TopNet, k1TopD, k2TopD, k1TopY, k2TopY,
    dersKarsilastirma, konuKarsilastirma, gelisenKonular, calisilacakKonular
  } = analiz;

  const netFarkStr = netFarki >= 0 ? `+${netFarki.toFixed(2)}` : netFarki.toFixed(2);
  const netBadgeColor = netFarki >= 0 ? '#10b981' : '#ef4444';

  // 1. NELERDE GELİŞME VAR (Sade ve Net Kartlar)
  let gelismeHtml = '';
  if (!gelisenKonular.length) {
    gelismeHtml = `
      <div style="background:#f8fafc;padding:12px 16px;border-radius:8px;border:1px solid #e2e8f0;font-size:13px;color:#64748b">
        Seçilen kapsamda belirgin bir doğru sayısı artışı kaydedilmedi. Düzenli soru çözümüyle eksiklerin kapatılması önerilir.
      </div>
    `;
  } else {
    gelismeHtml = `
      <div style="display:flex;flex-direction:column;gap:8px">
        ${gelisenKonular.map(item => {
          const dFarkStr = item.dogruFark >= 0 ? `+${item.dogruFark}` : `${item.dogruFark}`;
          const basariFarkStr = item.basariFark >= 0 ? `+${item.basariFark}%` : `${item.basariFark}%`;
          return `
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #16a34a;border-radius:6px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
              <div>
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="font-size:11px;font-weight:700;color:#15803d;background:#dcfce7;padding:2px 6px;border-radius:4px">${item.ders}</span>
                  <b style="font-size:13.5px;color:#14532d">${item.etiket}</b>
                </div>
                <div style="font-size:11.5px;color:#475569;margin-top:3px">
                  Önceki: <b>${item.k1.dogru}D / ${item.k1.yanlis}Y</b> (%${item.k1.basariYuzde}) ➔ Yeni: <b>${item.k2.dogru}D / ${item.k2.yanlis}Y</b> (%${item.k2.basariYuzde})
                </div>
                <div style="font-size:11.5px;color:#166534;margin-top:2px">💡 ${item.tavsiye}</div>
              </div>
              <div style="text-align:right">
                <span class="badge" style="background:#dcfce7;color:#15803d;font-weight:800;font-size:12px;padding:4px 8px">
                  ${dFarkStr} Doğru (${basariFarkStr}) 🚀
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // 2. NELERE ÇALIŞMALI (Sade ve Eylem Odaklı Kartlar)
  let calismaHtml = '';
  if (!calisilacakKonular.length) {
    calismaHtml = `
      <div style="background:#f0fdf4;padding:12px 16px;border-radius:8px;border:1px solid #bbf7d0;font-size:13px;color:#15803d">
        Harika! Seçilen kapsamdaki tüm konularda yüksek başarı sağlandı, kritik bir eksik bulunmuyor.
      </div>
    `;
  } else {
    const oncelikliList = calisilacakKonular.slice(0, 6);
    calismaHtml = `
      <div style="display:flex;flex-direction:column;gap:8px">
        ${oncelikliList.map(item => {
          const isKritik = item.k2.yanlis >= 2 || item.k2.basariYuzde < 40;
          const borderLeft = isKritik ? '#dc2626' : '#d97706';
          const bgCol = isKritik ? '#fef2f2' : '#fffbeb';
          const brdCol = isKritik ? '#fecaca' : '#fde68a';
          const txtCol = isKritik ? '#991b1b' : '#92400e';
          const badgeBg = isKritik ? '#fee2e2' : '#fef3c7';

          return `
            <div style="background:${bgCol};border:1px solid ${brdCol};border-left:4px solid ${borderLeft};border-radius:6px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
              <div>
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="font-size:11px;font-weight:700;color:${txtCol};background:${badgeBg};padding:2px 6px;border-radius:4px">${item.ders}</span>
                  <b style="font-size:13.5px;color:${txtCol}">${item.etiket}</b>
                  <span class="badge" style="background:${badgeBg};color:${txtCol};font-size:10px;font-weight:700">
                    ${isKritik ? '🔴 ACİL ÇALIŞ' : '🟡 PEKİŞTİR'}
                  </span>
                </div>
                <div style="font-size:11.5px;color:#475569;margin-top:3px">
                  Önceki: <b>${item.k1.dogru}D / ${item.k1.yanlis}Y</b> ➔ Yeni: <b>${item.k2.dogru}D / ${item.k2.yanlis}Y / ${item.k2.bos}B</b> (%${item.k2.basariYuzde} Başarı)
                </div>
                <div style="font-size:11.5px;color:${txtCol};margin-top:2px">
                  🎯 <b>Öneri:</b> ${item.tavsiye}
                </div>
              </div>
              <div style="text-align:right">
                <span class="badge" style="background:${badgeBg};color:${txtCol};font-weight:700;font-size:11px;padding:4px 8px">
                  ${item.k2.yanlis} Yanlış / ${item.k2.bos} Boş
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // 3. SADELEŞTİRİLMİŞ DERS GELİŞİM TABLOSU
  const dersRows = dersKarsilastirma.map(d => {
    const nFark = d.netFarki >= 0 ? `+${d.netFarki.toFixed(2)}` : d.netFarki.toFixed(2);
    const nRenk = d.netFarki > 0 ? '#15803d' : (d.netFarki < 0 ? '#b91c1c' : '#64748b');

    return `
      <tr>
        <td style="font-weight:700;color:#0f172a;font-size:13px">${d.ders}</td>
        <td class="num mono">${d.d1.dogru}D / ${d.d1.yanlis}Y / ${d.d1.bos}B</td>
        <td class="num mono" style="font-weight:600">${d.d1.net.toFixed(2)}</td>
        <td class="num mono">${d.d2.dogru}D / ${d.d2.yanlis}Y / ${d.d2.bos}B</td>
        <td class="num mono" style="font-weight:700;color:var(--indigo)">${d.d2.net.toFixed(2)}</td>
        <td class="num mono" style="font-weight:800;color:${nRenk}">${nFark} Net</td>
      </tr>
    `;
  }).join('');

  // 4. DETAYLI KONU TABLOSU SATIRLARI (İsteğe bağlı açılabilir akordeon içinde)
  const konuTabloRows = konuKarsilastirma.map(item => {
    const trendRenk = item.dogruFark > 0 ? '#15803d' : (item.dogruFark < 0 ? '#b91c1c' : '#64748b');
    const trendTxt = item.dogruFark > 0 ? `+${item.dogruFark} Doğru 📈` : (item.dogruFark < 0 ? `${item.dogruFark} Doğru 📉` : 'Değişmedi ➖');

    return `
      <tr>
        <td style="font-size:11.5px;color:#64748b">${item.ders}</td>
        <td style="font-weight:700;color:var(--indigo);font-size:12.5px">${item.etiket}</td>
        <td class="num mono">${item.k1.dogru}D / ${item.k1.yanlis}Y</td>
        <td class="num mono">%${item.k1.basariYuzde}</td>
        <td class="num mono">${item.k2.dogru}D / ${item.k2.yanlis}Y</td>
        <td class="num mono" style="font-weight:700">%${item.k2.basariYuzde}</td>
        <td class="num mono" style="font-weight:700;color:${trendRenk}">${trendTxt}</td>
      </tr>
    `;
  }).join('');

  return `
    <div id="karneRaporYazdirAlani" style="background:#ffffff;padding:18px 20px;border-radius:10px;border:1px solid #e2e8f0">
      
      <!-- SADE VE ŞIK BAŞLIK KARTI -->
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding-bottom:12px;border-bottom:2px solid #4f46e5;margin-bottom:16px">
        <div>
          <div style="font-size:11px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:0.5px">Karşılaştırmalı Gelişim Raporu</div>
          <h2 style="margin:2px 0 0 0;font-size:18px;color:#0f172a">
            👤 ${k2.ogrenciAdi || k1.ogrenciAdi || 'Öğrenci'}
            <span class="badge" style="background:#eff6ff;color:#4f46e5;font-weight:700;margin-left:6px;font-size:11px">Karne Sınıfı</span>
          </h2>
          <div style="font-size:12px;color:#64748b;margin-top:2px">
            <b>1. Sınav:</b> ${k1.sinavAdi} (${fmtTarih(k1.sinavTarihi)}) &nbsp;➔&nbsp; <b>2. Sınav:</b> ${k2.sinavAdi} (${fmtTarih(k2.sinavTarihi)})
          </div>
        </div>

        <!-- SAĞ: NET DEĞİŞİMİ BÜYÜK GÖSTERGE -->
        <div style="display:flex;align-items:center;gap:14px;background:#f8fafc;padding:8px 16px;border-radius:8px;border:1px solid #e2e8f0">
          <div>
            <div style="font-size:10.5px;color:#64748b;font-weight:600">SEÇİLİ KAPSAM NETİ</div>
            <div style="font-size:18px;font-weight:800;color:#0f172a">${k1TopNet.toFixed(2)} ➔ ${k2TopNet.toFixed(2)}</div>
          </div>
          <div style="border-left:1px solid #cbd5e1;padding-left:14px">
            <div style="font-size:10.5px;color:#64748b;font-weight:600">NET FARKI</div>
            <div style="font-size:18px;font-weight:800;color:${netBadgeColor}">${netFarkStr} Net</div>
          </div>
        </div>
      </div>

      <!-- KAPSAM BİLGİLENDİRME BİLGİSİ -->
      <div style="font-size:12px;color:#475569;margin-bottom:14px;background:#f8fafc;padding:6px 12px;border-radius:6px;border:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center">
        <span>📌 <b>Kapsam:</b> ${filtreAktif ? `Sadece seçilen <b>${aktifDersListesi.join(', ')}</b> dersleri gösteriliyor.` : '<b>Tüm Dersler</b> dahil edildi.'}</span>
        <span style="font-size:11px;color:#64748b">Toplam Soru Değişimi: <b>${dogruFarki >= 0 ? '+' + dogruFarki : dogruFarki} Doğru, ${yanlisFarki <= 0 ? yanlisFarki : '+' + yanlisFarki} Yanlış</b></span>
      </div>

      <!-- 2 SÜTUNLU SADE ODAK ALANI -->
      <div class="grid-2" style="gap:16px;margin-bottom:20px">
        <!-- SOL: NELERDE GELİŞME VAR -->
        <div>
          <h3 style="margin:0 0 8px 0;font-size:14px;color:#15803d;display:flex;align-items:center;gap:6px">
            <span>🚀</span> <span>Nelerde Gelişme Var? (Güçlü Yönler)</span>
          </h3>
          ${gelismeHtml}
        </div>

        <!-- SAĞ: NELERE ÇALIŞMALI -->
        <div>
          <h3 style="margin:0 0 8px 0;font-size:14px;color:#b91c1c;display:flex;align-items:center;gap:6px">
            <span>🎯</span> <span>Nelere Çalışmalı? (Öncelikli Eksikler)</span>
          </h3>
          ${calismaHtml}
        </div>
      </div>

      <!-- SADE DERS BAZLI GELİŞİM TABLOSU -->
      <div style="margin-bottom:16px">
        <h3 style="margin:0 0 8px 0;font-size:14px;color:#0f172a">📚 Ders Bazında Net Değişim Özeti</h3>
        <div style="overflow-x:auto">
          <table class="table" style="font-size:12px">
            <thead>
              <tr>
                <th>Ders</th>
                <th class="num">1. Sınav (D/Y/B)</th>
                <th class="num">1. Sınav Net</th>
                <th class="num">2. Sınav (D/Y/B)</th>
                <th class="num">2. Sınav Net</th>
                <th class="num">Net Değişimi</th>
              </tr>
            </thead>
            <tbody>${dersRows}</tbody>
          </table>
        </div>
      </div>

      <!-- AKORDEON: TÜM KONU DETAYLARI (İSTENİRSE AÇILIR, ARAYÜZÜ YORMAZ) -->
      <details style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px">
        <summary style="font-weight:700;font-size:12.5px;color:#4f46e5;cursor:pointer;user-select:none">
          🔍 Tüm Konuların Detaylı Listesini Gör (${konuKarsilastirma.length} Konu Çatısı) ▾
        </summary>
        <div style="overflow-x:auto;margin-top:10px">
          <table class="table" style="font-size:11.5px;background:#ffffff">
            <thead>
              <tr>
                <th>Ders</th>
                <th>Çatı Konu [Konu(n)]</th>
                <th class="num">1. Sınav D/Y</th>
                <th class="num">1. Başarı %</th>
                <th class="num">2. Sınav D/Y</th>
                <th class="num">2. Başarı %</th>
                <th class="num">Değişim</th>
              </tr>
            </thead>
            <tbody>${konuTabloRows}</tbody>
          </table>
        </div>
      </details>
    </div>
  `;
}

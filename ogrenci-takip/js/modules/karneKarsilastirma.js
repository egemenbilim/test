/* ══════════════════════════════════════════════════════
   Öğrenci Takip Sistemi — İki Karne Arası Karşılaştırma & Değişim Analiz Motoru
   Öğrencinin iki karnesi arasındaki gelişim, gerileme ve çalışma tavsiyelerini raporlar.
   Seçilen derslere göre dinamik filtreleme ve sadeleştirilmiş modern UI sunar.
   ══════════════════════════════════════════════════════ */

import { fmtTarih } from '../utils.js';
import { DB } from '../state.js';
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

function getDersIcon(ders) {
  const d = (ders || '').toLowerCase();
  if (d.includes('turkce') || d.includes('edebiyat')) return '📚';
  if (d.includes('geometri')) return '📏';
  if (d.includes('matematik')) return '📐';
  if (d.includes('tarih')) return '🏛️';
  if (d.includes('cografya')) return '🌍';
  if (d.includes('felsefe')) return '💭';
  if (d.includes('din')) return '🕌';
  if (d.includes('fizik')) return '⚡';
  if (d.includes('kimya')) return '🧪';
  if (d.includes('biyoloji')) return '🧬';
  if (d.includes('fen')) return '🔬';
  if (d.includes('sosyal')) return '🌐';
  return '📖';
}

/**
 * Sade, ferah, pedagojik ve ders bazında yapılandırılmış karşılaştırma raporunu oluşturur.
 * @param {Object} k1 - 1. Karne
 * @param {Object} k2 - 2. Karne
 * @param {Array<string>|Set<string>} seciliDersler - Filtre dersleri (Boş ise hepsi)
 * @param {string} raporModu - 'hepsi' | 'sadece_calis'
 */
export function renderKarneKarsilastirmaRaporu(k1, k2, seciliDersler = [], raporModu = 'hepsi') {
  const analiz = karsilastirKarneler(k1, k2, seciliDersler);
  if (!analiz) return '<div class="empty">Karşılaştırma hesaplanamadı.</div>';

  const isSadeceCalis = (raporModu === 'sadece_calis');

  const {
    filtreAktif, seciliDersler: aktifDersListesi,
    puanFarki, netFarki, dogruFarki, yanlisFarki, bosFarki,
    k1TopNet, k2TopNet, k1TopD, k2TopD, k1TopY, k2TopY,
    dersKarsilastirma, konuKarsilastirma
  } = analiz;

  const netFarkStr = netFarki >= 0 ? `+${netFarki.toFixed(2)}` : netFarki.toFixed(2);
  const netBadgeColor = netFarki >= 0 ? '#15803d' : '#b91c1c';
  const netBadgeBg = netFarki >= 0 ? '#dcfce7' : '#fee2e2';
  const netBadgeBrd = netFarki >= 0 ? '#bbf7d0' : '#fecaca';

  // DERS DERS İLERLEYİŞ VE ÇALIŞILMASI GEREKEN KISIMLAR
  const dersBloklariHtml = dersKarsilastirma.map(d => {
    const subjTopics = konuKarsilastirma.filter(k => k.ders === d.ders);

    // Çalışılması gereken konular (Yanlışı veya boşu olanlar veya başarısı %60 altı olanlar)
    const subjCalisma = subjTopics.filter(k => k.k2.yanlis > 0 || k.k2.bos > 0 || k.k2.basariYuzde < 60 || k.basariFark < 0)
      .sort((a, b) => ((b.k2.yanlis * 2 + b.k2.bos) - (a.k2.yanlis * 2 + a.k2.bos)));

    // Gelişme gösterilen konular
    const subjGelisen = subjTopics.filter(k => k.dogruFark > 0 || (k.yanlisFark < 0 && k.k2.dogru >= k.k1.dogru) || k.basariFark >= 15);

    const nFark = d.netFarki >= 0 ? `+${d.netFarki.toFixed(2)}` : d.netFarki.toFixed(2);
    const nRenk = d.netFarki > 0 ? '#15803d' : (d.netFarki < 0 ? '#b91c1c' : '#475569');
    const nBg = d.netFarki > 0 ? '#dcfce7' : (d.netFarki < 0 ? '#fee2e2' : '#f1f5f9');
    const nBrd = d.netFarki > 0 ? '#bbf7d0' : (d.netFarki < 0 ? '#fecaca' : '#cbd5e1');

    // Eğer sadece eksikler modu seçildiyse ve bu derste hiç eksik yoksa:
    if (isSadeceCalis && subjCalisma.length === 0) {
      if (filtreAktif) {
        return `
          <div class="kr-subject-card" style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:10px;padding:12px 16px;margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div style="font-weight:700;font-size:14px;color:#166534;display:flex;align-items:center;gap:8px">
                <span>${getDersIcon(d.ders)}</span> <span>${d.ders}</span>
              </div>
              <div style="font-size:12px;color:#15803d;font-weight:600">
                ✅ Bu derste tüm sorular doğru cevaplandı; çalışılması gereken öncelikli bir eksik bulunmuyor.
              </div>
            </div>
          </div>
        `;
      }
      return ''; // Genel filtrede sıfır eksikli dersler aşağıda tek blokta toplanır
    }

    return `
      <div class="kr-subject-card" style="background:#ffffff;border:1.5px solid #e2e8f0;border-radius:10px;padding:16px 18px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.02)">
        
        <!-- DERS ÜST BİLGİSİ & İLERLEYİŞ ÖZETİ -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding-bottom:12px;border-bottom:1px solid #f1f5f9">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:22px">${getDersIcon(d.ders)}</span>
            <div>
              <h3 style="margin:0;font-size:15.5px;color:#0f172a;font-weight:800">${d.ders}</h3>
              <div style="font-size:12px;color:#475569;margin-top:2px">
                1. Sınav: <b>${d.d1.dogru}D / ${d.d1.yanlis}Y / ${d.d1.bos}B</b> (${d.d1.net.toFixed(2)} Net) &nbsp;➔&nbsp;
                2. Sınav: <b>${d.d2.dogru}D / ${d.d2.yanlis}Y / ${d.d2.bos}B</b> (${d.d2.net.toFixed(2)} Net)
              </div>
            </div>
          </div>
          <div>
            <span class="kr-pill" style="background:${nBg};color:${nRenk};border:1px solid ${nBrd};font-size:13px;padding:4px 10px">
              ${nFark} Net ${d.netFarki > 0 ? '🚀' : (d.netFarki < 0 ? '📉' : '➖')}
            </span>
          </div>
        </div>

        <!-- 🎯 ÇALIŞILMASI GEREKEN KISIMLAR (ŞUNLARA ŞUNLARA ÇALIŞ) -->
        <div style="margin-top:14px">
          <div style="font-size:13px;font-weight:800;color:#991b1b;margin-bottom:10px;display:flex;align-items:center;gap:6px">
            <span>🎯</span> <span>Nelere Çalışmalı? (Öncelikli Eksikler & Eylem Planı):</span>
          </div>

          ${subjCalisma.length === 0 ? `
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:10px 14px;color:#166534;font-size:12px;font-weight:600">
              ✅ Bu derste hedeflenen başarı sağlandı, kritik bir çalışma ihtiyacı bulunmuyor.
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:10px">
              ${subjCalisma.map(item => {
                const isKritik = item.k2.yanlis >= 2 || item.k2.basariYuzde < 40;
                const borderLeft = isKritik ? '#dc2626' : '#ea580c';
                const cardBg = isKritik ? '#fff5f5' : '#fffaf0';
                const cardBorder = isKritik ? '#fecaca' : '#fed7aa';

                return `
                  <div style="background:${cardBg};border:1px solid ${cardBorder};border-left:4px solid ${borderLeft};border-radius:8px;padding:12px 14px">
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                      <div style="display:flex;align-items:center;gap:8px">
                        <b style="font-size:14px;color:#0f172a">${item.etiket}</b>
                        <span class="kr-pill" style="background:${isKritik ? '#fee2e2' : '#fef3c7'};color:${isKritik ? '#991b1b' : '#92400e'};font-size:10.5px">
                          ${isKritik ? '🔴 Acil Çalışılmalı' : '🟡 Pekiştirilmeli'}
                        </span>
                      </div>
                      <div>
                        <!-- Temiz, ferah, üst üste binmeyen istatistik kutusu -->
                        <span class="kr-stat-bad">
                          ${item.k2.yanlis} Yanlış &nbsp;•&nbsp; ${item.k2.bos} Boş &nbsp;•&nbsp; %${item.k2.basariYuzde} Başarı
                        </span>
                      </div>
                    </div>

                    <div style="font-size:12px;color:#475569;margin-top:4px">
                      1. Sınav: <b>${item.k1.dogru}D / ${item.k1.yanlis}Y</b> (%${item.k1.basariYuzde}) &nbsp;➔&nbsp; 
                      2. Sınav: <b>${item.k2.dogru}D / ${item.k2.yanlis}Y / ${item.k2.bos}B</b> (%${item.k2.basariYuzde})
                    </div>

                    <!-- ŞUNLARA ŞUNLARA ÇALIŞ BÖLÜMÜ -->
                    <div style="margin-top:8px;background:#ffffff;border:1px dashed ${isKritik ? '#f87171' : '#fb923c'};border-radius:6px;padding:8px 12px;font-size:12.5px;color:#7c2d12;line-height:1.55">
                      👉 <b>Şunlara Çalış:</b> ${item.tavsiye}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <!-- 🚀 BU DERSTE GELİŞME GÖSTERİLEN KONULAR (Sadece Tam Rapor Modunda) -->
        ${!isSadeceCalis && subjGelisen.length > 0 ? `
          <div style="margin-top:14px;padding-top:12px;border-top:1px dashed #e2e8f0">
            <div style="font-size:12.5px;font-weight:700;color:#166534;margin-bottom:8px;display:flex;align-items:center;gap:6px">
              <span>🚀</span> <span>Bu Derste Gelişme Gösterilen Konular:</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:8px">
              ${subjGelisen.map(g => {
                const dFarkStr = g.dogruFark >= 0 ? `+${g.dogruFark}` : `${g.dogruFark}`;
                return `
                  <div class="kr-pill" style="background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;padding:4px 10px;font-size:12px">
                    <b>${g.etiket}</b>: ${dFarkStr} Doğru Artış (%${g.k1.basariYuzde} ➔ %${g.k2.basariYuzde}) 📈
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  }).filter(Boolean).join('');

  // Sıfır eksikli dersler özeti (Eğer sadece çalış moduysa ve toplu görünümdeyse)
  let sifirEksikliDerslerHtml = '';
  if (isSadeceCalis && !filtreAktif) {
    const hatasizDersler = dersKarsilastirma.filter(d => {
      const subjTopics = konuKarsilastirma.filter(k => k.ders === d.ders);
      const subjCalisma = subjTopics.filter(k => k.k2.yanlis > 0 || k.k2.bos > 0 || k.k2.basariYuzde < 60 || k.basariFark < 0);
      return subjCalisma.length === 0;
    });
    if (hatasizDersler.length > 0) {
      sifirEksikliDerslerHtml = `
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin-top:14px">
          <b style="color:#166534;font-size:13px">✅ Öncelikli Eksik Bulunmayan Başarılı Dersler:</b>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
            ${hatasizDersler.map(d => `
              <span class="kr-pill" style="background:#dcfce7;color:#15803d;border:1px solid #86efac;font-size:12px">
                ${getDersIcon(d.ders)} ${d.ders} (Hedef Başarı Sağlandı)
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // SADELEŞTİRİLMİŞ DERS GELİŞİM TABLOSU (Sadece Tam Rapor Modunda)
  let genelTabloHtml = '';
  if (!isSadeceCalis) {
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

    // Akordeon Konu Listesi
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

    genelTabloHtml = `
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0">
        <h3 style="margin:0 0 10px 0;font-size:14px;color:#0f172a">📚 Ders Bazında Net Değişim Özeti Tablosu</h3>
        <div style="overflow-x:auto">
          <table class="table" style="font-size:12px;background:#fff">
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

      <details style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;margin-top:16px">
        <summary style="font-weight:700;font-size:12.5px;color:#4f46e5;cursor:pointer;user-select:none">
          🔍 Tüm Konuların Detaylı Karşılaştırmalı Tablosunu Gör (${konuKarsilastirma.length} Konu Çatısı) ▾
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
    `;
  }

  const ogrObj = (DB && DB.ogrenciler) ? DB.ogrenciler.find(o => o.id === (k2.ogrenciId || k1.ogrenciId)) : null;
  const gorunenOgrAd = k2.ogrenciAdi || k1.ogrenciAdi || (ogrObj ? ogrObj.adSoyad : 'Öğrenci');

  return `
    <div id="karneRaporYazdirAlani" style="background:#ffffff;padding:20px 22px;border-radius:10px;border:1px solid #cbd5e1;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
      
      <!-- BAŞLIK & ÖĞRENCİ KARTI -->
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding-bottom:14px;border-bottom:2.5px solid #4f46e5;margin-bottom:16px">
        <div>
          <div style="font-size:11px;font-weight:800;color:#4f46e5;text-transform:uppercase;letter-spacing:0.8px">
            ${isSadeceCalis ? '🎯 ÖNCELİKLİ EKSİKLER & ÇALIŞMA EYLEM PLANI' : '📊 KARŞILAŞTIRMALI GELİŞİM & DEĞİŞİM ANALİZİ RAPORU'}
          </div>
          <h2 style="margin:4px 0 0 0;font-size:20px;color:#0f172a;display:flex;align-items:center;gap:8px">
            <span>👤 ${gorunenOgrAd}</span>
            <span class="kr-pill" style="background:#eff6ff;color:#4f46e5;border:1px solid #bfdbfe;font-size:11.5px">Karne Sınıfı</span>
          </h2>
          <div style="font-size:12px;color:#475569;margin-top:4px">
            <b>1. Sınav:</b> ${k1.sinavAdi} (${fmtTarih(k1.sinavTarihi)}) &nbsp;➔&nbsp; <b>2. Sınav:</b> ${k2.sinavAdi} (${fmtTarih(k2.sinavTarihi)})
          </div>
        </div>

        <!-- SAĞ: NET SKOR VE DEĞİŞİM GÖSTERGESİ -->
        <div style="display:flex;align-items:center;gap:14px;background:#f8fafc;padding:10px 18px;border-radius:8px;border:1px solid #e2e8f0">
          <div>
            <div style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase">Seçili Kapsam Neti</div>
            <div style="font-size:18px;font-weight:800;color:#0f172a">${k1TopNet.toFixed(2)} ➔ ${k2TopNet.toFixed(2)}</div>
          </div>
          <div style="border-left:1.5px solid #cbd5e1;padding-left:14px">
            <div style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase">Net Değişimi</div>
            <div style="font-size:18px;font-weight:800;color:${netBadgeColor}">${netFarkStr} Net</div>
          </div>
        </div>
      </div>

      <!-- KAPSAM VE ÖZET BİLGİ BANDI -->
      <div style="font-size:12px;color:#334155;margin-bottom:16px;background:#f8fafc;padding:8px 14px;border-radius:6px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <span>📌 <b>Kapsam:</b> ${filtreAktif ? `Sadece seçilen <b>${aktifDersListesi.join(', ')}</b> dersleri inceleniyor.` : '<b>Tüm Dersler</b> dahil edildi.'}</span>
        </div>
        <div style="font-size:11.5px;color:#475569">
          Toplam Soru Farkı: <b>${dogruFarki >= 0 ? '+' + dogruFarki : dogruFarki} Doğru, ${yanlisFarki <= 0 ? yanlisFarki : '+' + yanlisFarki} Yanlış</b>
        </div>
      </div>

      <!-- DERS DERS İLERLEYİŞ VE ÇALIŞILMASI GEREKEN KISIMLAR -->
      <div>
        ${dersBloklariHtml || '<div class="empty">Seçili kapsamda görüntülenecek veri bulunamadı.</div>'}
      </div>

      ${sifirEksikliDerslerHtml}

      ${genelTabloHtml}
    </div>
  `;
}

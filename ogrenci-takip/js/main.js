/* ══════════════════════════════════════════════════════
   Öğrenci Takip Sistemi — Ana Orkestrasyon (Main)
   ══════════════════════════════════════════════════════ */

import { DB, loadDB, saveDB, sinifAdi } from './state.js';
import { $, toast, promptKopyala } from './utils.js';

import { renderDashboard } from './modules/dashboard.js';
import {
  sinifEkle, sinifDuzenle, sinifIptal, sinifSil, renderSiniflar,
  aktifSurecRender, aktifSurecOzetRender, aktifSurecRapor, aktifSurecOtomatikDoldur,
  sinifDetayGoster, konuEkle, konuDurumDegis, konuSil,
  konuTumunuSil, setSelectUpdateCallback as setSinifSelectCallback
} from './modules/siniflar.js';
import {
  ogrenciKaydet, ogrenciDuzenle, ogrEditKapat, ogrEditKaydet,
  ogrenciIptal, ogrenciSil, renderOgrenciler, ogrTopluAksiyonGuncelle,
  ogrenciSecTumu, ogrenciSecTemizle, ogrenciTopluSil, ogrenciTasi,
  ogrenciDetayGoster, denemeSonucDuzenle, dzNet, denemeSonucKaydet,
  ogrenciDetayPDF, topluOgrKaydet, setSelectUpdateCallback as setOgrSelectCallback
} from './modules/ogrenciler.js';
import {
  dersListesiniOlustur, dNG, denUyariGuncelle, denemeKaydet,
  denemeSil, renderDenemeler, gosterOrnek, topluSonuclariTemizle,
  topluDegerlendir, topluKaydet, setSelectUpdateCallback as setDenSelectCallback
} from './modules/denemeler.js';
import {
  hfBitisOtomatik, hfDersOnerileriGuncelle, hfKaydet,
  hfTopluKaydet, hfSil, renderHaftalik, hfRaporAl,
  hfOgrenciSecildi, hfSinavTuruSecildi, hfDersSecildi, hfKonuSecildi,
  hfTurDegis, hfNetHesaplaLive, hfOdevDurumHizliDegis, hfFiltreTurSec,
  hfOzelRaporAc, hfOzelRaporKapat, hfOzelRaporRender, hfOzelRaporYazdir,
  hfWhatsAppPaylas, seciliHfOgrenciId,
  hfYildizSec, hfKntYildizSec, hfHizliYildizAyarla,
  hfFiltreSon1Hafta, hfFiltreTarihTemizle, hfFiltreDurumSec,
  hfKontrolModalAc, hfKontrolModalKapat, hfKntNetHesapla, hfKontrolKaydet,
  getRecordSoruSayisi
} from './modules/haftalik.js';
import {
  doldurRaporFiltreleri,
  ogrSecTumu, ogrSecTemizle, gelisimSec, gelisimSecTumu, gelisimTemizle,
  renderRapor, renderDetayliAnaliz, raporPDF, raporSinifDegisti, raporTurDegisti
} from './modules/raporlar.js';
import {
  disaAktar, iceriAktar, handleFile, tumunuSil,
  renderCikti, setBackupReloadCallback
} from './modules/backup.js';
import {
  parsePdfFile, parseExamLines, renderPdfOnayPaneli,
  pdfSecTumuDegistir, pdfRowToggle, pdfTopluSinifUygula,
  pdfTemizle, pdfOnaylaVeKaydet, setPdfSelectCallback,
  pdfAdDegisti, pdfOgrenciSecildi, pdfFiltrele, pdfOzetSayaclariGuncelle,
  pdfManuelEsleModalAc, pdfManuelEsleModalKapat, pdfManuelEsleFiltrele,
  pdfManuelEsleSec, pdfManuelEsleKaldir, pdfManuelEsleKaldirAction
} from './modules/pdfParser.js';
import {
  uypSelectleriGuncelle, uypPlanSecildi, uypPlaniSinifaCek,
  uypModalAc, uypPlaniOnizleModal, uypPlaniOnizleGoster,
  uypOzelPlanSil, parseUypDosya, parseUypMetin, renderUypOnayPaneli,
  uypOnaySatirSil, uypOnaySatirEkle, uypOnayVeKaydet
} from './modules/uypParser.js';
import {
  renderKarneYuklePaneli, parseKarnePdfFile, parseKarneMetin,
  karneVerisiniKaydet, gosterKarneOnizleme, getAktifKarneVerisi,
  doldurKarneOgrenciSelectleri, karneOgrenciDegisti, karneKarsilastirManuel,
  karneDersToggle, karneDersFiltreTemizle
} from './modules/karneParser.js';
import { renderKarneKarsilastirmaRaporu } from './modules/karneKarsilastirma.js';

/* ═════ NAVİGASYON VE SEKME YÖNETİMİ ═════ */
export function goto(v) {
  document.querySelectorAll('nav.top a').forEach(a => {
    a.classList.toggle('active', a.dataset.view === v);
  });
  document.querySelectorAll('main section').forEach(s => {
    s.classList.toggle('hidden', s.id !== v);
  });

  if (v === 'dashboard') renderDashboard();
  if (v === 'siniflar') renderSiniflar();
  if (v === 'ogrenciler') { doldurSelectler(); renderOgrenciler(); }
  if (v === 'deneme') {
    doldurSelectler();
    dersListesiniOlustur();
    renderDenemeler();
    denTab('karne');
  }
  if (v === 'haftalik') {
    doldurSelectler();
    if (!seciliHfOgrenciId && DB.ogrenciler.length) {
      hfOgrenciSecildi(DB.ogrenciler[0].id);
    } else if (seciliHfOgrenciId) {
      hfOgrenciSecildi(seciliHfOgrenciId);
    } else {
      renderHaftalik();
    }
  }
  if (v === 'rapor') { doldurRaporFiltreleri(); renderRapor(); }
  if (v === 'cikti') renderCikti();
}

export function ogrTab(m) {
  $('ogrListe').classList.toggle('hidden', m !== 'liste');
  $('ogrTekli').classList.toggle('hidden', m !== 'tek');
  $('ogrToplu').classList.toggle('hidden', m !== 'toplu');
  $('ogrTabListe').className = 'tab' + (m === 'liste' ? ' on' : '');
  $('ogrTabTek').className = 'tab' + (m === 'tek' ? ' on' : '');
  $('ogrTabToplu').className = 'tab' + (m === 'toplu' ? ' on' : '');
  if (m === 'liste') renderOgrenciler();
}

export function denTab(m) {
  const dk = $('denKarneAlani');
  if (dk) dk.classList.toggle('hidden', m !== 'karne');
  $('denTekli').classList.toggle('hidden', m !== 'tek');
  $('denToplu').classList.toggle('hidden', m !== 'toplu');
  const dp = $('denPdf');
  if (dp) dp.classList.toggle('hidden', m !== 'pdf');

  if ($('denTabKarne')) $('denTabKarne').className = 'tab' + (m === 'karne' ? ' on' : '');
  $('denTabTek').className = 'tab' + (m === 'tek' ? ' on' : '');
  $('denTabToplu').className = 'tab' + (m === 'toplu' ? ' on' : '');
  const tp = $('denTabPdf');
  if (tp) tp.className = 'tab' + (m === 'pdf' ? ' on' : '');

  if (m === 'karne') renderKarneYuklePaneli();
}

export function hfTab(m) {
  $('hfTekli').classList.toggle('hidden', m !== 'tek');
  $('hfToplu').classList.toggle('hidden', m !== 'toplu');
  $('hfTabTek').className = 'tab' + (m === 'tek' ? ' on' : '');
  $('hfTabToplu').className = 'tab' + (m === 'toplu' ? ' on' : '');
  if (m === 'tek') renderHaftalik();
}

/* ═════ ORTAK SELECTLERİ DOLDURMA ═════ */
export function doldurSelectler() {
  const sO = '<option value="">Sınıf seçin</option>' + DB.siniflar.map(s => `<option value="${s.id}">${s.ad}</option>`).join('');
  if ($('ogrSinif')) $('ogrSinif').innerHTML = sO;
  if ($('filtreSinif')) $('filtreSinif').innerHTML = '<option value="">Tüm Sınıflar</option>' + DB.siniflar.map(s => `<option value="${s.id}">${s.ad}</option>`).join('');

  const oO = DB.ogrenciler.map(o => `<option value="${o.id}">${o.adSoyad} (${sinifAdi(o.sinifId)})</option>`).join('');
  if ($('denOgrenci')) $('denOgrenci').innerHTML = '<option value="">Öğrenci seçin</option>' + oO;
  if ($('hfOgrenci')) $('hfOgrenci').innerHTML = '<option value="">Öğrenci seçin</option>' + oO;
  if ($('filtreHfOgrenci')) $('filtreHfOgrenci').innerHTML = '<option value="">Tüm Öğrenciler</option>' + oO;

  uypSelectleriGuncelle();
  doldurRaporFiltreleri();
}

// Modüller arası callback bağlamaları
setSinifSelectCallback(doldurSelectler);
setOgrSelectCallback(doldurSelectler);
setDenSelectCallback(doldurSelectler);
setPdfSelectCallback(doldurSelectler);
setBackupReloadCallback(() => {
  doldurSelectler();
  aktifSurecRender();
  goto('dashboard');
});

/* ═════ INLINE HTML ETKİLEŞİMLERİ İÇİN GLOBAL WINDOW BAĞLAMASI ═════ */
window.$ = $;
window.DB = DB;
window.saveDB = saveDB;
window.goto = goto;
window.ogrTab = ogrTab;
window.denTab = denTab;
window.hfTab = hfTab;

// Sınıflar
window.sinifEkle = sinifEkle;
window.sinifDuzenle = sinifDuzenle;
window.sinifIptal = sinifIptal;
window.sinifSil = sinifSil;
window.renderSiniflar = renderSiniflar;
window.sinifDetayGoster = sinifDetayGoster;
window.konuEkle = konuEkle;
window.konuDurumDegis = konuDurumDegis;
window.konuSil = konuSil;
window.konuTumunuSil = konuTumunuSil;
window.aktifSurecOzetRender = aktifSurecOzetRender;
window.aktifSurecRapor = aktifSurecRapor;
window.aktifSurecOtomatikDoldur = aktifSurecOtomatikDoldur;

// Ünitelendirilmiş Yıllık Plan (ÜYP)
window.uypSelectleriGuncelle = uypSelectleriGuncelle;
window.uypPlanSecildi = uypPlanSecildi;
window.uypPlaniSinifaCek = uypPlaniSinifaCek;
window.uypModalAc = uypModalAc;
window.uypPlaniOnizleModal = uypPlaniOnizleModal;
window.uypPlaniOnizleGoster = uypPlaniOnizleGoster;
window.uypOzelPlanSil = uypOzelPlanSil;
window.uypOnaySatirSil = uypOnaySatirSil;
window.uypOnaySatirEkle = uypOnaySatirEkle;
window.uypOnayVeKaydet = uypOnayVeKaydet;
window.uypYapistirilanMetniAyristir = function() {
  const t = ($('uypYapistirMetin') && $('uypYapistirMetin').value) || '';
  if (!t.trim()) { toast('Lütfen önce plan metnini yapıştırın', false); return; }
  const taslak = parseUypMetin(t, 'Yapıştırılan Yıllık Plan');
  if (!taslak || !taslak.haftalar.length) {
    toast('Metinden geçerli konu satırı çıkarılamadı', false);
    return;
  }
  renderUypOnayPaneli(taslak);
  toast(`✅ ${taslak.haftalar.length} satır ayrıştırıldı!`);
};

// Öğrenciler
window.ogrenciKaydet = ogrenciKaydet;
window.ogrenciDuzenle = ogrenciDuzenle;
window.ogrEditKapat = ogrEditKapat;
window.ogrEditKaydet = ogrEditKaydet;
window.ogrenciIptal = ogrenciIptal;
window.ogrenciSil = ogrenciSil;
window.renderOgrenciler = renderOgrenciler;
window.ogrTopluAksiyonGuncelle = ogrTopluAksiyonGuncelle;
window.ogrenciSecTumu = ogrenciSecTumu;
window.ogrenciSecTemizle = ogrenciSecTemizle;
window.ogrenciTopluSil = ogrenciTopluSil;
window.ogrenciTasi = ogrenciTasi;
window.ogrenciDetayGoster = ogrenciDetayGoster;
window.denemeSonucDuzenle = denemeSonucDuzenle;
window.dzNet = dzNet;
window.denemeSonucKaydet = denemeSonucKaydet;
window.ogrenciDetayPDF = ogrenciDetayPDF;
window.topluOgrKaydet = topluOgrKaydet;

// Denemeler
window.dersListesiniOlustur = dersListesiniOlustur;
window.dNG = dNG;
window.denemeKaydet = denemeKaydet;
window.denemeSil = denemeSil;
window.gosterOrnek = gosterOrnek;
window.topluDegerlendir = topluDegerlendir;
window.topluKaydet = topluKaydet;
window.topluSonuclariTemizle = topluSonuclariTemizle;

// Haftalık Soru / Ödev Takibi
window.hfBitisOtomatik = hfBitisOtomatik;
window.hfKaydet = hfKaydet;
window.hfTopluKaydet = hfTopluKaydet;
window.hfSil = hfSil;
window.renderHaftalik = renderHaftalik;
window.hfRaporAl = hfRaporAl;
window.hfOgrenciSecildi = hfOgrenciSecildi;
window.hfSinavTuruSecildi = hfSinavTuruSecildi;
window.hfDersSecildi = hfDersSecildi;
window.hfKonuSecildi = hfKonuSecildi;
window.hfTurDegis = hfTurDegis;
window.hfNetHesaplaLive = hfNetHesaplaLive;
window.hfOdevDurumHizliDegis = hfOdevDurumHizliDegis;
window.hfFiltreTurSec = hfFiltreTurSec;
window.hfOzelRaporAc = hfOzelRaporAc;
window.hfOzelRaporKapat = hfOzelRaporKapat;
window.hfOzelRaporRender = hfOzelRaporRender;
window.hfOzelRaporYazdir = hfOzelRaporYazdir;
window.hfWhatsAppPaylas = hfWhatsAppPaylas;

// Haftalık Yeni Özellikler (Yıldızlar, Tarih/Durum Filtreleri, Kontrol Modalı)
window.hfYildizSec = hfYildizSec;
window.hfKntYildizSec = hfKntYildizSec;
window.hfHizliYildizAyarla = hfHizliYildizAyarla;
window.hfFiltreSon1Hafta = hfFiltreSon1Hafta;
window.hfFiltreTarihTemizle = hfFiltreTarihTemizle;
window.hfFiltreDurumSec = hfFiltreDurumSec;
window.hfKontrolModalAc = hfKontrolModalAc;
window.hfKontrolModalKapat = hfKontrolModalKapat;
window.hfKntNetHesapla = hfKntNetHesapla;
window.hfKontrolKaydet = hfKontrolKaydet;
window.getRecordSoruSayisi = getRecordSoruSayisi;

// Raporlar
window.doldurRaporFiltreleri = doldurRaporFiltreleri;
window.raporTurDegisti = raporTurDegisti;
window.raporSinifDegisti = raporSinifDegisti;
window.ogrSecTumu = ogrSecTumu;
window.ogrSecTemizle = ogrSecTemizle;
window.gelisimSecTumu = gelisimSecTumu;
window.gelisimSec = gelisimSec;
window.gelisimTemizle = gelisimTemizle;
window.renderRapor = renderRapor;
window.raporPDF = raporPDF;

// PDF Ayrıştırma ve Onay
window.pdfDosyaSecAc = function() {
  const inp = $('pdfDosyaInput');
  if (inp) {
    inp.value = '';
    inp.click();
  }
};

window.pdfDosyaSecildi = async function(ev) {
  const file = (ev && ev.target && ev.target.files && ev.target.files[0]) ||
               (ev && ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0]) ||
               (ev instanceof File ? ev : null);
  if (!file) return;

  const infoEl = $('pdfSecilenDosya');
  const yk = $('pdfYukleniyor');
  const ht = $('pdfHata');

  if (infoEl) {
    infoEl.textContent = `📄 Seçilen Dosya: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    infoEl.classList.remove('hidden');
  }
  if (yk) yk.classList.remove('hidden');
  if (ht) ht.classList.add('hidden');

  try {
    const parsed = await parsePdfFile(file);
    if (parsed.error) {
      if (ht) {
        ht.textContent = '❌ ' + parsed.error;
        ht.classList.remove('hidden');
      }
      toast(parsed.error, false);
    } else {
      renderPdfOnayPaneli(parsed);
      toast(`✅ PDF okundu: ${parsed.ogrenciler.length} öğrenci bulundu`);
    }
  } catch (err) {
    console.error(err);
    if (ht) {
      ht.textContent = '❌ PDF okunurken hata oluştu: ' + (err.message || err);
      ht.classList.remove('hidden');
    }
    toast('PDF okunamadı', false);
  } finally {
    if (yk) yk.classList.add('hidden');
  }
};

window.pdfMetinCozumle = function() {
  const txt = $('pdfMetinInput').value.trim();
  const ht = $('pdfHata');
  if (ht) ht.classList.add('hidden');

  if (!txt) {
    toast('Lütfen metin yapıştırın', false);
    return;
  }

  const lines = txt.split(/\r?\n/).filter(l => l.trim().length > 0);
  const parsed = parseExamLines(lines);

  if (parsed.error) {
    if (ht) {
      ht.textContent = '❌ ' + parsed.error;
      ht.classList.remove('hidden');
    }
    toast(parsed.error, false);
  } else {
    renderPdfOnayPaneli(parsed);
    toast(`✅ Metin çözümlendi: ${parsed.ogrenciler.length} öğrenci bulundu`);
  }
};

window.renderPdfOnayPaneli = renderPdfOnayPaneli;
window.pdfSecTumuDegistir = pdfSecTumuDegistir;
window.pdfRowToggle = pdfRowToggle;
window.pdfTopluSinifUygula = pdfTopluSinifUygula;
window.pdfTemizle = pdfTemizle;
window.pdfOnaylaVeKaydet = pdfOnaylaVeKaydet;
window.pdfAdDegisti = pdfAdDegisti;
window.pdfOgrenciSecildi = pdfOgrenciSecildi;
window.pdfFiltrele = pdfFiltrele;
window.pdfOzetSayaclariGuncelle = pdfOzetSayaclariGuncelle;
window.pdfManuelEsleModalAc = pdfManuelEsleModalAc;
window.pdfManuelEsleModalKapat = pdfManuelEsleModalKapat;
window.pdfManuelEsleFiltrele = pdfManuelEsleFiltrele;
window.pdfManuelEsleSec = pdfManuelEsleSec;
window.pdfManuelEsleKaldir = pdfManuelEsleKaldir;
window.pdfManuelEsleKaldirAction = pdfManuelEsleKaldirAction;

// Navigasyon & Sekmeler
window.goto = goto;
window.denTab = denTab;

// Yedek
window.disaAktar = disaAktar;
window.iceriAktar = iceriAktar;
window.tumunuSil = tumunuSil;

// Detaylı Karne & Karşılaştırmalı Analiz
window.karnePdfSecildi = async function(event) {
  const files = (event.target && event.target.files) || (event.dataTransfer && event.dataTransfer.files);
  if (!files || !files.length) return;
  const file = files[0];
  try {
    toast('⏳ Karne PDF ayrıştırılıyor...', true);
    const parsed = await parseKarnePdfFile(file);
    if (parsed.error) {
      toast(parsed.error, false);
      return;
    }
    gosterKarneOnizleme(parsed);
    toast(`✅ ${parsed.ogrenciAdi} karnesi başarıyla çözümlendi!`);
  } catch (err) {
    console.error(err);
    toast('PDF okunamadı: ' + (err.message || err), false);
  } finally {
    const fileInput = document.getElementById('karneFileInput');
    if (fileInput) fileInput.value = '';
  }
};

window.karneMetinAyristir = function() {
  const txt = $('karneMetinAlani')?.value || '';
  if (!txt.trim()) {
    toast('Lütfen karne metnini yapıştırın', false);
    return;
  }
  const parsed = parseKarneMetin(txt);
  if (parsed.error) {
    toast(parsed.error, false);
    return;
  }
  gosterKarneOnizleme(parsed);
  $('karneMetinModal').classList.add('hidden');
  toast(`✅ ${parsed.ogrenciAdi} karnesi başarıyla çözümlendi!`);
};

window.karneOnaylaVeKaydetBtn = function() {
  const parsed = getAktifKarneVerisi();
  if (!parsed) {
    toast('Önce bir karne yükleyin', false);
    return;
  }

  // Kullanıcının önizleme kartında yaptığı düzenlemeleri aktar
  const edOgr = $('karnePvOgrenciAd')?.value?.trim();
  const edSnv = $('karnePvSinavAd')?.value?.trim();
  const edTar = $('karnePvTarih')?.value?.trim();
  if (edOgr) parsed.ogrenciAdi = edOgr;
  if (edSnv) parsed.sinavAdi = edSnv;
  if (edTar) parsed.sinavTarihi = edTar;

  const res = karneVerisiniKaydet(parsed);
  if (res) {
    $('karneOnizlemeKarti').classList.add('hidden');
    doldurSelectler();
    doldurKarneOgrenciSelectleri();
    renderDenemeler();
    if ($('karneSeciliOgrenci')) {
      $('karneSeciliOgrenci').value = String(res.ogrenci.id);
      karneOgrenciDegisti(res.ogrenci.id);
    }
    $('karneKarsilastirmaBolumu')?.scrollIntoView({ behavior: 'smooth' });
  }
};

window.karneOgrenciDegisti = karneOgrenciDegisti;
window.karneKarsilastirManuel = karneKarsilastirManuel;
window.karneDersToggle = karneDersToggle;
window.karneDersFiltreTemizle = karneDersFiltreTemizle;

window.karneRaporYazdir = function() {
  const rep = $('karneRaporYazdirAlani');
  if (!rep) {
    toast('Yazdırılacak rapor bulunamadı', false);
    return;
  }
  window.print();
};

window.karneOrnekYukle = function() {
  // Örnek 1: Kerem Demirer - ALTERNATİF TYT (07.11.2026)
  const ornek1Metin = `Öğrenci Adı: KEREM DEMİRER\nSınıfı: 1313\nNo: 46164\nSınav Adı: ALTERNATİF TYT\nSınav Tarihi: 07.11.2026\nSınav Kodu: 120801\nTYT\n225,837\n284,787 %89,83 53 53 53 53 8 1.248.573 1.290.416\nSınava Katılan Öğrenci Sayısı 59\nTYT_Türkçe\n1 Cümlede Anlam A A\n2 Cümlede Anlam A A\n3 Anlatımın Akışını Bozan Cümle A B\n4 Yazım Kuralları C D\n5 Sözcükte Anlam E E\n6 Söz Gruplarının Anlamı B\n7 Cümlede Anlam D D\n8 Sözcükte Anlam C\n9 Çekim Ekleri D D\n10 Tamlamalar B\n11 Yazım Kuralları D\n12 Yazım Kuralları C\n13 Noktalama İşaretleri B D\n14 Noktalama İşaretleri C\n15 Noktalama İşaretleri A\n16 Kelimede Yapı E\n17 Cümlenin Temel Ögeleri A\n18 Sözcük Türleri B\n19 Paragraf Bilgisi C D\n20 Paragraf Bilgisi A A\n21 Paragraf Bilgisi E C\n22 Paragraf Bilgisi C C\n23 Paragraf Bilgisi D D\n24 Paragraf Bilgisi E C\n25 Paragraf Bilgisi E C\n26 Paragraf Bilgisi E E\n27 Paragraf Bilgisi A C\n28 Paragrafta Yardımcı Düşünce D A\n29 Paragrafı İkiye Bölme C B\n30 Paragrafta Ana Düşünce B D\n31 Düşüncenin Akışını Bozan Cümleler E E\n32 Paragraf Bilgisi A B\n33 Metindeki Boşlukların Uygun Sözcüklerle Tamamlanması E E\n34 Paragraf Bilgisi D E\n35 Paragrafta Ana Düşünce A A\n36 Paragrafın Dil Ve Anlatımı B A\n37 Paragrafın Yapısı E E\n38 Paragrafın Yapısı A A\n39 Paragrafın Yapısı A E\n40 Paragrafın Yapısı C C\nTYT_Matematik\n1 Mutlak Değer A\n2 Çift Sayi, Tek Sayi B B\n3 Sayı - Kesir Problemleri A\n10 Denklemler D B\n13 Oran - Orantı D D\n20 Kar-Zarar Problemleri B B\n24 Sayı - Kesir Problemleri B\nTYT_Geometri\n37 Üçgende Açı B B\nTYT_Coğrafya\n6 Uluslararası Ulaşım Hatları D D\n8 Nüfus E E\n9 Doğadaki Üç Unsur: Su - Toprak - Bitki C A\n10 Doğa Ve İnsan E E\nTYT_Felsefe\n11 Varlık Felsefesi B B\n12 Bilgi Felsefesi A A\n15 MÖ 6. YY - MS 2. YY filozoflarının felsefi görüşlerinin analizi C B\nTYT_DinKültürü\n16 İnsanın Doğası ve Din B B\n17 İslam Düşünceside Yorumlar D D\n18 Bilgi ve İnanç, Ahiret, İnançla İlgili Meseleler E E\n19 Allah İnancı A A\nTYT_Fizik\n1 Yay Dalgaları A D\nTYT_Biyoloji\n16 Besin Zinciri Ve Piramidi D A\n17 Kalıtımda Soyağaçları E A\n19 Hücre Ve Organeller A A\n20 Canlıların Çeşitliliği Ve Sınıflandırılması A D`;

  // Örnek 2: Kerem Demirer - ÖZDEBİR TYT 2 (21.11.2026) -> Gelişim kaydedilmiş ikinci karne
  const ornek2Metin = `Öğrenci Adı: KEREM DEMİRER\nSınıfı: 1313\nNo: 46164\nSınav Adı: ÖZDEBİR TYT 2\nSınav Tarihi: 21.11.2026\nSınav Kodu: 120902\nTYT\n268,450\n284,787 %68,10 32 32 32 32 4 890.120 920.450\nSınava Katılan Öğrenci Sayısı 59\nTYT_Türkçe\n1 Cümlede Anlam A A\n2 Cümlede Anlam A A\n3 Anlatımın Akışını Bozan Cümle A A\n4 Yazım Kuralları C C\n5 Sözcükte Anlam E E\n6 Söz Gruplarının Anlamı B B\n7 Cümlede Anlam D D\n8 Sözcükte Anlam C C\n9 Çekim Ekleri D D\n10 Tamlamalar B B\n11 Yazım Kuralları D D\n12 Yazım Kuralları C D\n13 Noktalama İşaretleri B B\n14 Noktalama İşaretleri C C\n15 Noktalama İşaretleri A\n16 Kelimede Yapı E E\n17 Cümlenin Temel Ögeleri A A\n18 Sözcük Türleri B B\n19 Paragraf Bilgisi C C\n20 Paragraf Bilgisi A A\n21 Paragraf Bilgisi E E\n22 Paragraf Bilgisi C C\n23 Paragraf Bilgisi D D\n24 Paragraf Bilgisi E C\n25 Paragraf Bilgisi E E\n26 Paragraf Bilgisi E E\n27 Paragraf Bilgisi A A\n28 Paragrafta Yardımcı Düşünce D D\n29 Paragrafı İkiye Bölme C C\n30 Paragrafta Ana Düşünce B B\n31 Düşüncenin Akışını Bozan Cümleler E E\n32 Paragraf Bilgisi A A\n33 Metindeki Boşlukların Uygun Sözcüklerle Tamamlanması E E\n34 Paragraf Bilgisi D E\n35 Paragrafta Ana Düşünce A A\n36 Paragrafın Dil Ve Anlatımı B B\n37 Paragrafın Yapısı E E\n38 Paragrafın Yapısı A A\n39 Paragrafın Yapısı A A\n40 Paragrafın Yapısı C C\nTYT_Matematik\n1 Mutlak Değer A A\n2 Çift Sayi, Tek Sayi B B\n3 Sayı - Kesir Problemleri A A\n4 Bölünebilme A A\n6 Rasyonel Sayılar A A\n10 Denklemler D D\n12 Hareket Problemleri A A\n13 Oran - Orantı D D\n20 Kar-Zarar Problemleri B B\n24 Sayı - Kesir Problemleri B B\n26 Yüzde Problemleri C C\nTYT_Geometri\n37 Üçgende Açı B B\n38 Üçgende Benzerlik B B\nTYT_Coğrafya\n6 Uluslararası Ulaşım Hatları D D\n7 Doğal Afetler A A\n8 Nüfus E E\n10 Doğa Ve İnsan E E\nTYT_Felsefe\n11 Varlık Felsefesi B B\n12 Bilgi Felsefesi A A\nTYT_DinKültürü\n16 İnsanın Doğası ve Din B B\n17 İslam Düşünceside Yorumlar D D\n18 Bilgi ve İnanç, Ahiret, İnançla İlgili Meseleler E E\n19 Allah İnancı A A\nTYT_Fizik\n1 Yay Dalgaları A A\n5 Madde Ve Özellikleri B B\nTYT_Biyoloji\n16 Besin Zinciri Ve Piramidi D D\n17 Kalıtımda Soyağaçları E E\n19 Hücre Ve Organeller A A`;

  const k1 = parseKarneMetin(ornek1Metin);
  const k2 = parseKarneMetin(ornek2Metin);

  const res1 = karneVerisiniKaydet(k1);
  const res2 = karneVerisiniKaydet(k2);

  doldurSelectler();
  doldurKarneOgrenciSelectleri();
  renderDenemeler();

  if (res2 && $('karneSeciliOgrenci')) {
    $('karneSeciliOgrenci').value = String(res2.ogrenci.id);
    karneOgrenciDegisti(res2.ogrenci.id);
  }

  toast('🎉 2 Örnek karne başarıyla yüklendi ve karşılaştırma raporu hazırlandı!', true);
};

// Araçlar
window.promptKopyala = promptKopyala;

/* ═════ BAŞLATICI ═════ */
document.addEventListener('DOMContentLoaded', () => {
  loadDB();

  const denTarihEl = $('denTarih');
  if (denTarihEl) denTarihEl.value = new Date().toISOString().split('T')[0];

  hfDersOnerileriGuncelle();
  doldurSelectler();

  document.querySelectorAll('nav.top a').forEach(a => {
    a.onclick = () => goto(a.dataset.view);
  });

  document.addEventListener('change', e => {
    if (e.target.id === 'raporTur') doldurRaporFiltreleri();
    if (['raporSiralama', 'raporAltinda', 'raporGelisimGoster', 'raporDersIlerleyis', 'raporDetayli'].includes(e.target.id)) {
      if ($('raporSonuc') && $('raporSonuc').innerHTML.trim()) renderRapor();
    }
  });

  // Drag & drop dosya yükleme (JSON yedek ve PDF için)
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => {
    document.body.addEventListener(ev, e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });

  document.body.addEventListener('drop', e => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length) {
      const f = files[0];
      if (f.name.endsWith('.json')) {
        handleFile(f);
      } else if (f.name.endsWith('.pdf')) {
        const isKarneTab = $('denTabKarne')?.classList.contains('active') ||
                           (!$('denTabKarne')?.classList.contains('hidden') && $('denKarneAlani') && !$('denKarneAlani').classList.contains('hidden'));
        if (isKarneTab) {
          window.karnePdfSecildi({ dataTransfer: { files: [f] } });
        } else {
          goto('deneme');
          denTab('pdf');
          window.pdfDosyaSecildi({ dataTransfer: { files: [f] } });
        }
      }
    }
  }, false);

  const dropZone = $('pdfDropZone');
  if (dropZone) {
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.style.background = '#e0e7ff';
      dropZone.style.borderColor = 'var(--indigo2)';
    });
    dropZone.addEventListener('dragleave', e => {
      e.preventDefault();
      dropZone.style.background = '#f8fafc';
      dropZone.style.borderColor = 'var(--indigo)';
    });
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.style.background = '#f8fafc';
      dropZone.style.borderColor = 'var(--indigo)';
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) {
        window.pdfDosyaSecildi({ dataTransfer: { files: [files[0]] } });
      }
    });
  }

  // ÜYP Yıllık Plan Dosya Yükleme Eventleri
  const uypDrop = $('uypDropZone');
  const uypInput = $('uypDosyaInput');
  if (uypDrop && uypInput) {
    uypDrop.addEventListener('click', () => {
      uypInput.click();
    });
    uypInput.addEventListener('change', e => {
      if (e.target.files && e.target.files.length) {
        parseUypDosya(e.target.files[0]);
      }
    });
    uypDrop.addEventListener('dragover', e => {
      e.preventDefault();
      uypDrop.style.background = '#dcfce7';
      uypDrop.style.borderColor = '#15803d';
    });
    uypDrop.addEventListener('dragleave', e => {
      e.preventDefault();
      uypDrop.style.background = '#f0fdf4';
      uypDrop.style.borderColor = '#059669';
    });
    uypDrop.addEventListener('drop', e => {
      e.preventDefault();
      uypDrop.style.background = '#f0fdf4';
      uypDrop.style.borderColor = '#059669';
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) {
        parseUypDosya(files[0]);
      }
    });
  }

  goto('dashboard');
});

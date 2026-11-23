/* ══════════════════════════════════════════════════════
   Öğrenci Takip Sistemi — Karne Konu Taksonomisi ve Gruplama Motoru
   Kural: Alt konu başlıklarını çatı konularda birleştir ve Konu(n) formatında sun.
   ══════════════════════════════════════════════════════ */

import { trNormalize } from '../utils.js';

/**
 * Verilen ders ve ham konu başlığını akıllı çatı konusuna (umbrella topic) eşler.
 */
export function getCatiKonu(dersAdi, hamKonu) {
  if (!hamKonu || !hamKonu.trim()) return 'Genel Soru';
  const raw = hamKonu.trim();
  const n = trNormalize(raw).toLowerCase();
  const d = trNormalize(dersAdi || '').toLowerCase();

  // 1. TÜRKÇE & EDEBİYAT
  if (d.includes('turkce') || d.includes('edebiyat')) {
    // Genel Paragraf Çatısı
    if (
      n.includes('paragraf') ||
      n.includes('ikiye bolme') ||
      n.includes('akisi bozan') ||
      n.includes('akisini bozan') ||
      n.includes('bosluklarin uygun') ||
      n.includes('metindeki bosluk') ||
      n.includes('dil ve anlatim') ||
      n.includes('paragrafin yapisi') ||
      n.includes('anlatim bicimleri') ||
      n.includes('dusunceyi gelistirme')
    ) {
      return 'Genel Paragraf';
    }

    if (n.includes('cumlede anlam') || n.includes('cumle yorumu') || n.includes('cumlenin anlami')) {
      return 'Cümlede Anlam';
    }

    if (n.includes('sozcukte anlam') || n.includes('soz gruplari') || n.includes('deyim') || n.includes('atasoz')) {
      return 'Sözcükte Anlam';
    }

    if (n.includes('yazim')) {
      return 'Yazım Kuralları';
    }

    if (n.includes('noktalama')) {
      return 'Noktalama İşaretleri';
    }

    if (
      n.includes('cekim ekleri') ||
      n.includes('tamlamalar') ||
      n.includes('kelimede yapi') ||
      n.includes('sozcukte yapi') ||
      n.includes('cumlenin temel ogeleri') ||
      n.includes('cumlenin ogeleri') ||
      n.includes('sozcuk turleri') ||
      n.includes('ses bilgisi') ||
      n.includes('fiilimsi') ||
      n.includes('cati') ||
      n.includes('ek fiil') ||
      n.includes('cumle turleri') ||
      n.includes('anlatim bozuk')
    ) {
      return 'Dil Bilgisi';
    }

    return raw;
  }

  // 2. MATEMATİK & GEOMETRİ
  if (d.includes('matematik') || d.includes('geometri')) {
    if (d.includes('geometri')) {
      if (n.includes('ucgen') || n.includes('aciortay') || n.includes('kenarortay') || n.includes('benzerlik') || n.includes('alan') || n.includes('dogruda aci')) {
        return 'Üçgenler';
      }
      if (n.includes('dortgen') || n.includes('cokgen') || n.includes('kare') || n.includes('dikdortgen') || n.includes('yamuk') || n.includes('paralelkenar') || n.includes('deltoid')) {
        return 'Çokgenler ve Dörtgenler';
      }
      if (n.includes('geometrik cisim') || n.includes('kati cisim') || n.includes('prizma') || n.includes('silindir') || n.includes('koni') || n.includes('piramit') || n.includes('kure')) {
        return 'Katı Cisimler';
      }
      if (n.includes('cember') || n.includes('daire') || n.includes('analitik')) {
        return 'Çember ve Analitik Geometri';
      }
      return raw;
    }

    // Matematik
    if (
      n.includes('problem') ||
      n.includes('sayi - kesir') ||
      n.includes('sayi kesir') ||
      n.includes('hareket') ||
      n.includes('hiz') ||
      n.includes('kar-zarar') ||
      n.includes('kar zarar') ||
      n.includes('rutin olmayan') ||
      n.includes('yuzde') ||
      n.includes('yas') ||
      n.includes('karisim problem') ||
      n.includes('grafik problem')
    ) {
      return 'Problemler';
    }

    if (
      n.includes('tek sayi') ||
      n.includes('cift sayi') ||
      n.includes('bolunebilme') ||
      n.includes('bolme') ||
      n.includes('rasyonel') ||
      n.includes('ondalik') ||
      n.includes('uslu') ||
      n.includes('koklu') ||
      n.includes('mutlak deger') ||
      n.includes('temel kavram') ||
      n.includes('sayi basamak') ||
      n.includes('ebob') ||
      n.includes('ekok') ||
      n.includes('asal')
    ) {
      return 'Temel Kavramlar & Sayılar';
    }

    if (
      n.includes('denklem') ||
      n.includes('esitsizlik') ||
      n.includes('oran - oranti') ||
      n.includes('oran oranti') ||
      n.includes('fonksiyon') ||
      n.includes('polinom') ||
      n.includes('kume') ||
      n.includes('mantik') ||
      n.includes('kartezyen') ||
      n.includes('carpanlara ayirma')
    ) {
      return 'Cebir & Fonksiyonlar';
    }

    if (n.includes('permutasyon') || n.includes('kombinasyon') || n.includes('binom') || n.includes('olasilik')) {
      return 'Sayma & Olasılık';
    }

    if (n.includes('veri') || n.includes('istatistik') || n.includes('grafik')) {
      return 'Veri & İstatistik';
    }

    return raw;
  }

  // 3. FİZİK
  if (d.includes('fizik')) {
    if (n.includes('dalga') || n.includes('yay dalga') || n.includes('su dalga') || n.includes('ses') || n.includes('deprem')) {
      return 'Dalgalar';
    }
    if (n.includes('mercek') || n.includes('ayna') || n.includes('optik') || n.includes('kirilma') || n.includes('aydinlanma') || n.includes('golge') || n.includes('renk')) {
      return 'Optik';
    }
    if (n.includes('madde') || n.includes('ozkutle') || n.includes('basinc') || n.includes('kaldirma') || n.includes('gaz') || n.includes('sivi')) {
      return 'Madde, Özkütle ve Basınç';
    }
    if (n.includes('hareket') || n.includes('kuvvet') || n.includes('dinamik') || n.includes('newton') || n.includes('is') || n.includes('guc') || n.includes('enerji')) {
      return 'Kuvvet ve Hareket';
    }
    if (n.includes('elektrik') || n.includes('devre') || n.includes('manyetizma') || n.includes('miknatis') || n.includes('elektrostatik')) {
      return 'Elektrik ve Manyetizma';
    }
    if (n.includes('isi') || n.includes('sicaklik') || n.includes('genlesme')) {
      return 'Isı ve Sıcaklık';
    }
    return raw;
  }

  // 4. KİMYA
  if (d.includes('kimya')) {
    if (n.includes('karisim') || n.includes('homojen') || n.includes('heterojen') || n.includes('cozelti') || n.includes('ayristirma')) {
      return 'Karışımlar';
    }
    if (n.includes('kati') || n.includes('sivi') || n.includes('gaz') || n.includes('maddenin hal')) {
      return 'Maddenin Halleri';
    }
    if (n.includes('periyodik') || n.includes('atom') || n.includes('katman') || n.includes('iyon')) {
      return 'Atom ve Periyodik Sistem';
    }
    if (n.includes('laboratuvar') || n.includes('kimya bilimi') || n.includes('guvenlik')) {
      return 'Kimya Bilimi';
    }
    if (n.includes('molekul') || n.includes('lewis') || n.includes('turler arasi') || n.includes('etkilesim') || n.includes('bag')) {
      return 'Kimyasal Türler Arası Etkileşimler';
    }
    if (n.includes('katli oran') || n.includes('mol') || n.includes('hesaplama') || n.includes('tepkime') || n.includes('kanun')) {
      return 'Kimyanın Temel Kanunları & Hesaplamalar';
    }
    if (n.includes('notral') || n.includes('tampon') || n.includes('asit') || n.includes('baz') || n.includes('tuz') || n.includes('ph')) {
      return 'Asitler, Bazlar ve Tuzlar';
    }
    return raw;
  }

  // 5. BİYOLOJİ
  if (d.includes('biyoloji')) {
    if (n.includes('eseysiz') || n.includes('eseyli') || n.includes('mitoz') || n.includes('mayoz') || n.includes('ureme') || n.includes('bolunme')) {
      return 'Hücre Bölünmeleri ve Üreme';
    }
    if (n.includes('besin') || n.includes('piramit') || n.includes('zincir') || n.includes('ekosistem') || n.includes('cevre') || n.includes('madde dongu')) {
      return 'Ekosistem Ekolojisi';
    }
    if (n.includes('kalitim') || n.includes('soyagac') || n.includes('mendel') || n.includes('genetik')) {
      return 'Kalıtım ve Genetik';
    }
    if (n.includes('lipit') || n.includes('protein') || n.includes('karbonhidrat') || n.includes('enzim') || n.includes('vitamin') || n.includes('organik')) {
      return 'Canlıların Temel Bileşenleri';
    }
    if (n.includes('hucre') || n.includes('organel') || n.includes('hucre zari') || n.includes('gecis')) {
      return 'Hücre ve Organeller';
    }
    if (n.includes('cesitlilik') || n.includes('siniflandirma') || n.includes('canlilar dunyasi') || n.includes('bakteri') || n.includes('virus')) {
      return 'Canlılar Dünyası ve Sınıflandırma';
    }
    return raw;
  }

  // 6. SOSYAL BİLİMLER (TARİH, COĞRAFYA, FELSEFE, DİN KÜLTÜRÜ)
  if (d.includes('felsefe')) {
    if (n.includes('varlik')) return 'Varlık Felsefesi';
    if (n.includes('bilgi')) return 'Bilgi Felsefesi';
    if (n.includes('filozof') || n.includes('gorus')) return 'Felsefi Dönemler ve Filozoflar';
    if (n.includes('ahlak')) return 'Ahlak Felsefesi';
    if (n.includes('din felsefesi')) return 'Din Felsefesi';
    if (n.includes('siyaset')) return 'Siyaset Felsefesi';
    if (n.includes('sanat')) return 'Sanat Felsefesi';
    return raw;
  }

  if (d.includes('cografya')) {
    if (n.includes('ulasim')) return 'Ulaşım Hatları ve Ticaret';
    if (n.includes('afet')) return 'Doğal Afetler';
    if (n.includes('nufus') || n.includes('yerlesme')) return 'Nüfus ve Yerleşme';
    if (n.includes('su') || n.includes('toprak') || n.includes('bitki') || n.includes('uc unsur')) return 'Doğal Sistemler (Su, Toprak, Bitki)';
    if (n.includes('doga ve insan') || n.includes('doga insan')) return 'Doğa ve İnsan';
    if (n.includes('iklim') || n.includes('hava')) return 'İklim Bilgisi';
    if (n.includes('harita')) return 'Harita Bilgisi';
    return raw;
  }

  if (d.includes('din')) {
    if (n.includes('dogasi ve din') || n.includes('insan ve din')) return 'İnsan ve Din';
    if (n.includes('islam dusuncesi') || n.includes('yorum')) return 'İslam Düşüncesinde Yorumlar & Mezhepler';
    if (n.includes('ahiret') || n.includes('inanc') || n.includes('kader') || n.includes('melek')) return 'İnanç Esasları ve Ahiret';
    if (n.includes('allah inanci') || n.includes('allah')) return 'Allah İnancı ve Sıfatları';
    if (n.includes('kuran') || n.includes('ayet') || n.includes('kavram')) return 'Kur\'an-ı Kerim ve Kavramlar';
    if (n.includes('ibadet') || n.includes('namaz') || n.includes('zekat')) return 'İslam\'da İbadetler';
    if (n.includes('ahlak')) return 'Ahlak ve Değerler';
    return raw;
  }

  if (d.includes('tarih')) {
    if (n.includes('denge') || n.includes('uluslararasi')) return 'Uluslararası İlişkilerde Denge Stratejisi';
    if (n.includes('ataturk') || n.includes('inkilap')) return 'Atatürkçülük ve Türk İnkılabı';
    if (n.includes('selcuklu') || n.includes('turkiyesi')) return 'Selçuklu ve Beylikler Dönemi';
    if (n.includes('orta cag') || n.includes('orta cagi')) return 'Orta Çağ\'da Dünya ve Türkler';
    if (n.includes('milli mucadele') || n.includes('hazirlik')) return 'Millî Mücadele Hazırlık ve Cepheler';
    if (n.includes('osmanli')) return 'Osmanlı Tarihi';
    if (n.includes('ilk turk')) return 'İlk Türk Devletleri';
    return raw;
  }

  return raw;
}

/**
 * Konu adını soru sayısıyla birlikte formatlar. Örn: "Cümlede Anlam(2)"
 */
export function formatKonuBasligi(catiKonu, soruSayisi) {
  if (!soruSayisi || soruSayisi <= 1) {
    return `${catiKonu}(1)`;
  }
  return `${catiKonu}(${soruSayisi})`;
}

/**
 * Soru dizisini ders ve çatı konuya göre gruplar.
 * @param {Array} sorular [{ no, ders, hamKonu, dc, oc, durum }]
 * @returns {Array} [{ ders, catiKonu, etiket, toplamSoru, dogru, yanlis, bos, net, basariYuzde, soruNumaralari, altKonular }]
 */
export function gruplaSorularKonuBazinda(sorular) {
  if (!Array.isArray(sorular) || !sorular.length) return [];

  // Gruplama haritası: key = ders + '___' + catiKonu
  const map = new Map();

  sorular.forEach(q => {
    const ders = q.ders || 'Genel';
    const cati = q.catiKonu || getCatiKonu(ders, q.hamKonu || q.konu);
    const key = `${ders}___${cati}`;

    if (!map.has(key)) {
      map.set(key, {
        ders,
        catiKonu: cati,
        toplamSoru: 0,
        dogru: 0,
        yanlis: 0,
        bos: 0,
        net: 0,
        basariYuzde: 0,
        soruNumaralari: [],
        altKonular: new Map()
      });
    }

    const item = map.get(key);
    item.toplamSoru++;
    item.soruNumaralari.push(q.no);

    const subKey = q.hamKonu || q.konu || cati;
    item.altKonular.set(subKey, (item.altKonular.get(subKey) || 0) + 1);

    const durum = q.durum || (q.oc === q.dc ? 'D' : (!q.oc || !q.oc.trim() ? 'B' : 'Y'));
    if (durum === 'D') item.dogru++;
    else if (durum === 'Y') item.yanlis++;
    else item.bos++;
  });

  const gruplar = [];
  map.forEach(val => {
    const isLgs = (val.ders || '').includes('LGS');
    const ceza = isLgs ? 3 : 4;
    val.net = Math.round(Math.max(0, val.dogru - (val.yanlis / ceza)) * 100) / 100;
    val.basariYuzde = val.toplamSoru > 0 ? Math.round((val.dogru / val.toplamSoru) * 100) : 0;
    val.etiket = formatKonuBasligi(val.catiKonu, val.toplamSoru);

    // Alt konuları okunabilir diziye çevir
    val.altKonuDetaylari = Array.from(val.altKonular.entries()).map(([k, count]) => `${k} (${count})`);

    gruplar.push(val);
  });

  // Ders içi sıralama: Önce soru sayısı çok olanlar
  gruplar.sort((a, b) => {
    if (a.ders !== b.ders) return a.ders.localeCompare(b.ders, 'tr');
    return b.toplamSoru - a.toplamSoru;
  });

  return gruplar;
}

/**
 * Konuya özel eyleme dönüştürülebilir çalışma tavsiyesi ve pedagojik yönlendirme üretir.
 */
export function getCalismaTavsiyesi(ders, catiKonu, basariYuzde, yanlisSayisi, bosSayisi) {
  const d = trNormalize(ders || '').toLowerCase();
  const c = trNormalize(catiKonu || '').toLowerCase();

  if (basariYuzde >= 75) {
    return 'Tebrikler! Konu hakimiyeti yüksek. Hız ve net istikrarını korumak için haftalık deneme/karma testlerle pekiştirmeye devam edin.';
  }

  // Türkçe Tavsiyeleri
  if (d.includes('turkce') || d.includes('edebiyat')) {
    if (c.includes('paragraf')) {
      if (yanlisSayisi >= 6) {
        return '🔴 Kritik Odak: Paragrafta ana düşünce ve olumsuz soru köklerinde yüksek çeldirici kaybı var. Günlük 20 paragraf rutini başlatılmalı, şıkları metinden doğrulayarak eleme taktiği uygulanmalıdır.';
      }
      return '🟡 Günde en az 15-20 paragraf sorusu çözülmeli; özellikle yardımcı düşünce ve paragrafta yapı/ikiye bölme soru tipleri taranmalıdır.';
    }
    if (c.includes('cumlede anlam')) {
      return 'Cümle analizi, kavram ve çıkarım sorularında soru kökünü dikkatli okuyun. Cümleler arası neden-sonuç, amaç ve koşul ilişkilerini tekrar edin.';
    }
    if (c.includes('yazim') || c.includes('noktalama')) {
      return 'Yazım ve noktalama kuralları özet tablosunu duvara asın; her gün 10 dakika kuralları gözden geçirip bitişik-ayrı yazılan ekleri test edin.';
    }
    if (c.includes('dil bilgisi')) {
      return 'Sözcük türleri ve ekler konusundan özet konu anlatımı dinleyip soru bankasından konu kavrama testlerini eksiksiz çözün.';
    }
  }

  // Matematik Tavsiyeleri
  if (d.includes('matematik')) {
    if (c.includes('problem')) {
      if (yanlisSayisi + bosSayisi >= 5) {
        return '🔴 Kritik Odak: Problem çözme pratiği acil artırılmalı. Sayı-kesir ve hareket problemlerinde soruyu değişkenlere (x, y) dökme modeli çalışılmalı, günde 15 problem çözülmelidir.';
      }
      return '🟡 Kar-zarar, yüzde ve hareket problemlerinde modelleme eksikleri giderilmeli, rutin olmayan yeni nesil problem soruları çözülmelidir.';
    }
    if (c.includes('temel kavram')) {
      return 'Temel sayılar, bölünebilme ve üslü/köklü işlemlerinde işlem hatası veya eksik kural var. Temel kavram özet formül defterini tekrar edin.';
    }
    if (c.includes('cebir') || c.includes('fonksiyon')) {
      return 'Birinci dereceden denklemler ve fonksiyon mantığı baştan taranmalı, adım adım çözüm yazma alışkanlığı kazanılmalıdır.';
    }
    if (c.includes('olasilik') || c.includes('permutasyon')) {
      return 'Permütasyon ve olasılıkta durum sayma ağaçları ve kombinasyon formüllerini kavrama seviyesinde tekrar çözün.';
    }
  }

  // Geometri Tavsiyeleri
  if (d.includes('geometri') || c.includes('ucgen')) {
    if (bosSayisi >= 2 || yanlisSayisi >= 2) {
      return '🔴 Geometride temel görme eksikliği var: Özel üçgenler (30-60-90, 45-45-90) ve benzerlik kurallarını yazarak çalışın, her gün 10 geometri sorusu çözün.';
    }
    return 'Üçgende açı ve alan bağlantılarını pekiştirmek için renkli kalemle ek çizgi çizme alıştırmaları yapın.';
  }

  // Fen Bilimleri Tavsiyeleri
  if (d.includes('fizik')) {
    if (c.includes('dalga') || c.includes('optik')) {
      return 'Dalga ve optikte kavram haritaları çıkarılmalı, ışık kırılma ve mercek çizimleri bizzat elle çizilerek çalışılmalıdır.';
    }
    if (c.includes('madde') || c.includes('basinc')) {
      return 'Basınç ve özkütle formüllerinin birim analizini yapın, MEB kazanım testlerindeki yorum sorularını çözün.';
    }
    return 'Fizikte kavram yanılgılarını önlemek için konu anlatımı sonrası MEB kazanım testlerini çözün.';
  }

  if (d.includes('kimya')) {
    if (c.includes('karisim') || c.includes('hal')) {
      return 'Maddenin halleri ve karışım ayırma yöntemleri tablosunu tekrar edin, soru tiplerini tarayın.';
    }
    return 'Kimya periyodik özellikler ve kimyasal türler arası etkileşimler şemalarını özetleyip kavrama testleri çözün.';
  }

  if (d.includes('biyoloji')) {
    if (c.includes('ekoloji') || c.includes('besin')) {
      return 'Besin piramidi ve ekosistem döngülerini görsel şemalarla tekrar edin, biyoloji terim sözlüğü oluşturun.';
    }
    if (c.includes('hucre') || c.includes('kalitim')) {
      return 'Hücre organellerinin görevleri ve soyağacı çaprazlama kurallarını not alarak tekrar edin.';
    }
    return 'Biyolojide unutulan terimleri hafıza kartlarıyla tekrar edin ve haftalık 2 konu testi çözün.';
  }

  // Sosyal Tavsiyeleri
  if (d.includes('tarih') || d.includes('cografya') || d.includes('felsefe') || d.includes('din')) {
    if (bosSayisi > 0) {
      return `Konu bilgisi eksikliği nedeniyle soru boş bırakılmış (${bosSayisi} boş). İlgili ünitenin hap notlarını okuyun.`;
    }
    return 'Kavramlar ve çeldiriciler arası farklara dikkat edilmeli; soru köklerindeki olumsuz ifadelerin altı çizilmelidir.';
  }

  return 'Konuyla ilgili temel kavram özetlerini okuyup en az 2 test çözerek eksikleri tamamlayın.';
}

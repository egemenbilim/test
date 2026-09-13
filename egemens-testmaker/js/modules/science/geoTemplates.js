import { escSvg } from './overlayEngine.js';

/**
 * Egemen's Testmaker — Coğrafya Şablon Envanteri (TYT, AYT & KPSS)
 * Türkiye Vektörel Haritası (Genel & Bölgesel Yakınlaştırmalar),
 * Horst-Graben Kırıklı Dağlar, Tombolo & Kıyı Şekilleri, Dünya Haritası,
 * Dünyanın Yıllık Hareketi & Mevsimler, Meridyen / Yerel Saat ve İzohips Haritası.
 */

export const GEO_TEMPLATES = {
  // --------------------------------------------------------------------------
  // 1. TÜRKİYE VEKTÖREL HARİTASI (GENEL & BÖLGESEL YAKINLAŞTIRMA)
  // --------------------------------------------------------------------------
  turkeyMap: {
    id: 'turkeyMap',
    category: 'cografya',
    name: 'Türkiye Vektörel Haritası (Genel & Bölgesel)',
    tags: ['TYT', 'AYT', 'KPSS', 'Türkiye', 'Dilsiz Harita', 'Bölgeler'],
    desc: 'Türkiye genel dilsiz haritası ve bölgesel yakınlaştırmalar (Ege, Marmara, Akdeniz vb.). Nokta koyma ve isimlendirme destekli.',
    defaultParams: {
      title: 'Türkiye Fiziki / Dilsiz Haritası',
      viewRegion: 'all', // 'all' | 'marmara' | 'ege' | 'akdeniz' | 'karadeniz' | 'icanadolu' | 'doguanadolu'
      showGraticule: true,
      showLakes: true,
      showRivers: true,
      pins: [
        { id: 'p1', x: 120, y: 75, label: 'I', text: 'Ergene Havzası', color: '#dc2626' },
        { id: 'p2', x: 95, y: 220, label: 'II', text: 'Menteşe Yöresi', color: '#dc2626' },
        { id: 'p3', x: 335, y: 245, label: 'III', text: 'Çukurova Deltası', color: '#dc2626' },
        { id: 'p4', x: 460, y: 90, label: 'IV', text: 'Doğu Karadeniz', color: '#dc2626' },
        { id: 'p5', x: 550, y: 240, label: 'V', text: 'Hakkari Yöresi', color: '#dc2626' }
      ]
    },
    presets: [
      {
        name: 'ÖSYM TYT Klasik 5 Bölge (I: Ergene, II: Menteşe, III: Çukurova, IV: Rize, V: Hakkari)',
        params: {
          title: 'Haritada Numaralandırılmış 5 Bölge',
          viewRegion: 'all',
          pins: [
            { id: 'p1', x: 120, y: 75, label: 'I', text: 'Ergene Havzası', color: '#dc2626' },
            { id: 'p2', x: 95, y: 220, label: 'II', text: 'Menteşe Yöresi', color: '#dc2626' },
            { id: 'p3', x: 335, y: 245, label: 'III', text: 'Çukurova Deltası', color: '#dc2626' },
            { id: 'p4', x: 460, y: 90, label: 'IV', text: 'Doğu Karadeniz', color: '#dc2626' },
            { id: 'p5', x: 550, y: 240, label: 'V', text: 'Hakkari Yöresi', color: '#dc2626' }
          ]
        }
      },
      {
        name: 'Bölgesel Yakınlaştırma: Kıyı Ege & Horst-Grabenler',
        params: {
          title: 'Kıyı Ege Bölümü & Çöküntü Ovaları',
          viewRegion: 'ege',
          pins: [
            { id: 'p1', x: 100, y: 120, label: '1', text: 'Bakırçay Grabeni', color: '#0284c7' },
            { id: 'p2', x: 110, y: 160, label: '2', text: 'Gediz Grabeni', color: '#0284c7' },
            { id: 'p3', x: 125, y: 195, label: '3', text: 'K. Menderes Grabeni', color: '#0284c7' },
            { id: 'p4', x: 135, y: 230, label: '4', text: 'B. Menderes Grabeni', color: '#0284c7' }
          ]
        }
      },
      {
        name: 'Bölgesel Yakınlaştırma: Marmara & Boğazlar',
        params: {
          title: 'Marmara Denizi, Boğazlar & Kapıdağ Tombolosu',
          viewRegion: 'marmara',
          pins: [
            { id: 'p1', x: 80, y: 135, label: 'Ç', text: 'Çanakkale Boğazı', color: '#7c3aed' },
            { id: 'p2', x: 165, y: 90, label: 'İ', text: 'İstanbul Boğazı', color: '#7c3aed' },
            { id: 'p3', x: 115, y: 140, label: 'K', text: 'Kapıdağ Tombolosu', color: '#dc2626' }
          ]
        }
      },
      {
        name: 'Türkiye Delta Ovaları (Bafra, Çarşamba, Çukurova, Silifke)',
        params: {
          title: 'Türkiye\'nin Önemli Delta Ovaları',
          viewRegion: 'all',
          pins: [
            { id: 'p1', x: 330, y: 70, label: 'B', text: 'Bafra Deltası', color: '#16a34a' },
            { id: 'p2', x: 360, y: 80, label: 'Ç', text: 'Çarşamba Deltası', color: '#16a34a' },
            { id: 'p3', x: 335, y: 245, label: 'Çu', text: 'Çukurova Deltası', color: '#16a34a' },
            { id: 'p4', x: 280, y: 250, label: 'S', text: 'Silifke Deltası', color: '#16a34a' },
            { id: 'p5', x: 75, y: 165, label: 'M', text: 'Menemen Deltası', color: '#16a34a' }
          ]
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Harita Başlığı', type: 'text' },
      {
        key: 'viewRegion',
        label: 'Görünüm / Bölgesel Yakınlaştırma',
        type: 'select',
        options: [
          { v: 'all', l: 'Tüm Türkiye (Genel Harita)' },
          { v: 'marmara', l: 'Marmara & Boğazlar' },
          { v: 'ege', l: 'Kıyı Ege & Horst-Grabenler' },
          { v: 'akdeniz', l: 'Akdeniz & Toroslar / Çukurova' },
          { v: 'karadeniz', l: 'Karadeniz Kıyı Kuşağı & Deltalar' },
          { v: 'icanadolu', l: 'İç Anadolu & Tuz Gölü' },
          { v: 'doguanadolu', l: 'Doğu Anadolu & Van Gölü' }
        ]
      },
      { key: 'showGraticule', label: 'Enlem - Boylam Çizgilerini Göster', type: 'checkbox' },
      { key: 'showLakes', label: 'Büyük Gölleri Göster (Van, Tuz)', type: 'checkbox' },
      { key: 'showRivers', label: 'Önemli Akarsuları Çiz', type: 'checkbox' }
    ],
    renderSvg(p) {
      // ViewBox bölgeye göre ayarlanır
      let vb = '0 0 620 340';
      if (p.viewRegion === 'marmara') vb = '30 20 200 170';
      else if (p.viewRegion === 'ege') vb = '20 90 220 180';
      else if (p.viewRegion === 'akdeniz') vb = '80 170 340 150';
      else if (p.viewRegion === 'karadeniz') vb = '140 10 380 150';
      else if (p.viewRegion === 'icanadolu') vb = '160 90 260 170';
      else if (p.viewRegion === 'doguanadolu') vb = '350 70 250 190';

      // Yüksek hassasiyetli Türkiye kıyı ve sınır vektörü
      const turkeyPath = `
        M 105 38
        C 125 35 150 42 165 72
        C 175 62 185 68 200 75
        C 220 72 245 68 260 62
        C 275 60 295 62 315 58
        C 328 35 342 38 350 62
        C 365 75 390 82 410 80
        C 435 80 460 76 480 82
        C 500 85 510 75 518 90
        C 525 110 540 105 550 115
        C 565 125 580 120 590 140
        C 585 160 595 180 580 200
        C 570 215 575 235 560 250
        C 545 255 530 240 515 242
        C 490 245 470 240 445 245
        C 420 248 395 242 375 250
        C 365 270 355 285 348 260
        C 335 255 315 252 300 258
        C 285 265 270 282 250 285
        C 230 270 215 265 195 268
        C 170 255 160 248 140 255
        C 125 245 110 265 95 250
        C 90 230 105 220 95 205
        C 80 200 70 185 85 175
        C 75 160 85 145 75 130
        C 65 120 70 105 60 95
        C 75 90 85 98 92 88
        C 90 75 80 65 90 52
        Z
      `;

      // Marmara Denizi & Boğazlar iç deniz kesimi
      const marmaraSeaPath = `
        M 88 88
        C 105 82 135 85 152 100
        C 145 118 115 125 98 115
        C 90 105 85 95 88 88
        Z
      `;

      // Kapıdağ Tombolosu (Marmara güneyinde saplı ada)
      const kapidagPath = `
        M 112 112
        C 114 105 122 104 125 110
        C 124 116 116 118 112 112
        Z
      `;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <!-- Deniz ve Arka Plan -->
        <rect x="-100" y="-100" width="850" height="550" fill="#e0f2fe" />
        
        <!-- Enlem & Boylam Çizgileri -->
        ${p.showGraticule ? `
          <g stroke="#93c5fd" stroke-width="0.75" stroke-dasharray="4,4">
            <line x1="0" y1="65" x2="620" y2="65" />
            <line x1="0" y1="150" x2="620" y2="150" />
            <line x1="0" y1="240" x2="620" y2="240" />
            <line x1="120" y1="0" x2="120" y2="340" />
            <line x1="260" y1="0" x2="260" y2="340" />
            <line x1="400" y1="0" x2="400" y2="340" />
            <line x1="540" y1="0" x2="540" y2="340" />
          </g>
          <g font-size="9" fill="#64748b">
            <text x="5" y="62">42° K</text>
            <text x="5" y="147">39° K</text>
            <text x="5" y="237">36° K</text>
            <text x="122" y="15">30° D</text>
            <text x="262" y="15">35° D</text>
            <text x="402" y="15">40° D</text>
            <text x="542" y="15">45° D</text>
          </g>
        ` : ''}

        <!-- Türkiye Kara Kütlesi -->
        <path d="${turkeyPath}" fill="#f8fafc" stroke="#334155" stroke-width="2.2" stroke-linejoin="round" />
        
        <!-- Marmara Denizi -->
        <path d="${marmaraSeaPath}" fill="#e0f2fe" stroke="#334155" stroke-width="1.6" />
        <!-- Kapıdağ Tombolosu -->
        <path d="${kapidagPath}" fill="#f8fafc" stroke="#334155" stroke-width="1.5" />
        <line x1="117" y1="114" x2="119" y2="120" stroke="#334155" stroke-width="2" />

        <!-- Komşu Sınır Çizgileri -->
        <g stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,3">
          <line x1="60" y1="95" x2="88" y2="50" />
          <line x1="518" y1="90" x2="550" y2="60" />
          <line x1="580" y1="200" x2="610" y2="210" />
          <line x1="445" y1="245" x2="430" y2="300" />
        </g>
      `;

      // Büyük Göller (Van & Tuz)
      if (p.showLakes) {
        svg += `
          <!-- Van Gölü -->
          <g id="lakeVan" transform="translate(505, 160)">
            <path d="M 0 0 C 8 -12 24 -8 30 2 C 28 15 15 22 2 18 C -6 10 -4 4 0 0 Z" fill="#93c5fd" stroke="#0284c7" stroke-width="1.4" />
            <text x="14" y="8" font-size="8" fill="#0369a1" text-anchor="middle" font-weight="bold">Van G.</text>
          </g>
          <!-- Tuz Gölü -->
          <g id="lakeTuz" transform="translate(245, 145)">
            <ellipse cx="0" cy="0" rx="16" ry="24" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.4" opacity="0.9" />
            <text x="0" y="3" font-size="7.5" fill="#64748b" text-anchor="middle" font-weight="bold">Tuz G.</text>
          </g>
        `;
      }

      // Akarsular
      if (p.showRivers) {
        svg += `
          <g stroke="#38bdf8" stroke-width="1.4" fill="none" stroke-linecap="round">
            <!-- Kızılırmak Yay Çizimi -->
            <path d="M 370 140 C 330 180 250 170 270 110 C 285 70 330 65 330 62" />
            <!-- Yeşilırmak -->
            <path d="M 400 130 C 380 110 370 95 360 70" />
            <!-- Gediz -->
            <path d="M 130 155 C 100 155 90 162 82 165" />
            <!-- Çukurova Seyhan-Ceyhan -->
            <path d="M 345 200 C 340 220 335 240 336 250" />
            <!-- Fırat -->
            <path d="M 430 150 C 410 180 405 210 395 245" />
          </g>
        `;
      }

      // Harita Pinleri (I, II, III... veya özel etiketli)
      if (p.pins && p.pins.length) {
        p.pins.forEach(pin => {
          svg += `
            <g class="sci-draggable sci-overlay-item" data-map-pin-id="${pin.id}" data-overlay-type="mapPin" transform="translate(${pin.x},${pin.y})">
              <!-- Damla Pin Şekli -->
              <path d="M 0 0 C -9 -12 -11 -18 -11 -24 A 11 11 0 1 1 11 -24 C 11 -18 9 -12 0 0 Z" fill="${pin.color || '#dc2626'}" stroke="#ffffff" stroke-width="1.8" />
              <circle cx="0" cy="-24" r="6" fill="#ffffff" />
              <text x="0" y="-21" text-anchor="middle" font-size="8" font-weight="bold" fill="${pin.color || '#dc2626'}">${escSvg(pin.label)}</text>
              ${pin.text ? `
                <rect x="12" y="-32" width="${pin.text.length * 6.8 + 10}" height="18" rx="4" fill="#ffffff" fill-opacity="0.95" stroke="${pin.color || '#dc2626'}" stroke-width="1" />
                <text x="${17 + (pin.text.length * 3.4)}" y="-19" text-anchor="middle" font-size="10" font-weight="bold" fill="#0f172a">${escSvg(pin.text)}</text>
              ` : ''}
            </g>
          `;
        });
      }

      // Başlık ve Ölçek Çubuğu
      if (p.title) {
        svg += `
          <rect x="10" y="10" width="${p.title.length * 7.5 + 24}" height="26" rx="6" fill="#ffffff" fill-opacity="0.9" stroke="#cbd5e1" stroke-width="1" />
          <text x="22" y="27" font-size="12" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>
        `;
      }

      // Kıyı İsimleri / Yön Oku
      svg += `
        <g font-size="11" font-weight="bold" fill="#0284c7" opacity="0.8">
          <text x="320" y="25" text-anchor="middle">KARADENİZ</text>
          <text x="40" y="200" text-anchor="middle" transform="rotate(-90, 40, 200)">EGE DENİZİ</text>
          <text x="280" y="315" text-anchor="middle">AKDENİZ</text>
        </g>
        <!-- Kuzey Oku -->
        <g transform="translate(${vb.split(' ')[0] * 1 + vb.split(' ')[2] * 1 - 35}, ${vb.split(' ')[1] * 1 + 35})">
          <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
          <polygon points="0,-11 4,4 0,1 -4,4" fill="#dc2626" />
          <polygon points="0,1 4,4 0,11 -4,4" fill="#64748b" />
          <text x="0" y="-13" font-size="8" font-weight="bold" text-anchor="middle" fill="#0f172a">K</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 2. HORST - GRABEN SİSTEMİ & KIRIKLI DAĞLAR
  // --------------------------------------------------------------------------
  horstGraben: {
    id: 'horstGraben',
    category: 'cografya',
    name: 'Horst - Graben Kırık Dağ Sistemi',
    tags: ['TYT', 'AYT', 'Orojenez', 'Ege', 'Fay', 'Jeomorfoloji'],
    desc: 'Tektonik kırılma sonucu yükselen blok (Horst) ve çöken çöküntü hendeği (Graben) 3D kesit modeli.',
    defaultParams: {
      title: 'Horst - Graben Kırıklı Dağ Yapısı (Orojenez)',
      horst1Name: 'Horst (Kırık Dağı)',
      grabenName: 'Graben (Çöküntü Ovası)',
      horst2Name: 'Horst',
      showFaultLines: true,
      showArrows: true,
      showStrata: true,
      labelMode: 'names' // 'names' | 'num' | 'letters'
    },
    presets: [
      {
        name: 'Ege Bölgesi Preseti (Bozdağlar - Küçük Menderes - Aydın Dağları)',
        params: {
          title: 'Ege Kırık Sistemi: Bozdağlar - K. Menderes - Aydın Dağları',
          horst1Name: 'Bozdağlar (Horst)',
          grabenName: 'K. Menderes (Graben)',
          horst2Name: 'Aydın Dağları (Horst)',
          showFaultLines: true,
          showArrows: true,
          showStrata: true,
          labelMode: 'names'
        }
      },
      {
        name: 'TYT Numaralandırılmış Soru Modeli (I: Horst, II: Graben, III: Fay)',
        params: {
          title: 'Yer Kabuğu Kırılma Şeması',
          horst1Name: 'I',
          grabenName: 'II',
          horst2Name: 'I',
          showFaultLines: true,
          showArrows: true,
          showStrata: true,
          labelMode: 'num'
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Başlık / Soru Notu', type: 'text' },
      { key: 'horst1Name', label: '1. Yükselen Blok İsmi (Horst)', type: 'text' },
      { key: 'grabenName', label: 'Çöken Blok İsmi (Graben)', type: 'text' },
      { key: 'horst2Name', label: '2. Yükselen Blok İsmi (Horst)', type: 'text' },
      { key: 'showFaultLines', label: 'Fay Düzlemlerini Göster', type: 'checkbox' },
      { key: 'showArrows', label: 'Atım Yönü Oklarını Göster (↑ ↓)', type: 'checkbox' },
      { key: 'showStrata', label: 'Tortul Kayaç Tabakalarını Renklendir', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <!-- Gökyüzü -->
        <rect x="0" y="0" width="540" height="350" fill="#f8fafc" />

        ${p.title ? `<text x="270" y="26" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- 3D İzo-Blok Katmanları -->
        <g stroke="#1e293b" stroke-width="2" stroke-linejoin="round">
          
          <!-- SOL BLOK (HORST 1) -->
          <path d="M 30 110 L 150 110 L 190 220 L 30 220 Z" fill="#cbd5e1" />
          ${p.showStrata ? `
            <path d="M 30 140 L 160 140 L 170 170 L 30 170 Z" fill="#94a3b8" opacity="0.6" />
            <path d="M 30 180 L 175 180 L 185 210 L 30 210 Z" fill="#64748b" opacity="0.4" />
          ` : ''}
          <!-- 3D Üst Yüzey -->
          <polygon points="30,110 90,70 210,70 150,110" fill="#e2e8f0" stroke="#1e293b" stroke-width="2" />
          <!-- 3D Yan Fay Düzlemi -->
          <polygon points="150,110 210,70 250,180 190,220" fill="#94a3b8" stroke="#1e293b" stroke-width="2" />

          <!-- ORTA BLOK (GRABEN - ÇÖKÜNTÜ) -->
          <path d="M 190 220 L 330 220 L 300 290 L 160 290 Z" fill="#e2e8f0" />
          ${p.showStrata ? `
            <path d="M 175 240 L 315 240 L 310 260 L 170 260 Z" fill="#94a3b8" opacity="0.6" />
          ` : ''}
          <!-- Graben Tabanı -->
          <polygon points="190,220 250,180 390,180 330,220" fill="#bbf7d0" stroke="#16a34a" stroke-width="2" />
          <!-- Graben Alüvyon Dolgusu & Akarsu -->
          <path d="M 230 195 Q 280 205 320 195" fill="none" stroke="#0284c7" stroke-width="3" />

          <!-- SAĞ BLOK (HORST 2) -->
          <path d="M 330 110 L 470 110 L 470 220 L 370 220 Z" fill="#cbd5e1" />
          ${p.showStrata ? `
            <path d="M 345 140 L 470 140 L 470 170 L 355 170 Z" fill="#94a3b8" opacity="0.6" />
            <path d="M 360 180 L 470 180 L 470 210 L 368 210 Z" fill="#64748b" opacity="0.4" />
          ` : ''}
          <polygon points="330,110 390,70 510,70 470,110" fill="#e2e8f0" stroke="#1e293b" stroke-width="2" />
          <!-- Sağ Blok Fay Aynası -->
          <polygon points="330,110 390,70 390,180 330,220" fill="#cbd5e1" stroke="#1e293b" stroke-width="2" />
        </g>
      `;

      // Fay Hatları (Kırmızı kesikli)
      if (p.showFaultLines) {
        svg += `
          <g stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6,4">
            <line x1="210" y1="70" x2="160" y2="290" />
            <line x1="390" y1="70" x2="330" y2="290" />
          </g>
          <text x="180" y="275" font-size="10" font-weight="bold" fill="#dc2626">Fay Hattı</text>
          <text x="365" y="275" font-size="10" font-weight="bold" fill="#dc2626">Fay Hattı</text>
        `;
      }

      // Atım Okları (Yükselme ve Çökme Vektörleri)
      if (p.showArrows) {
        svg += `
          <!-- Sol Horst Yukarı Oku -->
          <g transform="translate(100, 160)">
            <line x1="0" y1="25" x2="0" y2="-20" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
            <polygon points="0,-26 -6,-14 6,-14" fill="#2563eb" />
          </g>
          <!-- Graben Aşağı Oku -->
          <g transform="translate(290, 230)">
            <line x1="0" y1="-20" x2="0" y2="25" stroke="#dc2626" stroke-width="3" stroke-linecap="round" />
            <polygon points="0,31 -6,19 6,19" fill="#dc2626" />
          </g>
          <!-- Sağ Horst Yukarı Oku -->
          <g transform="translate(420, 160)">
            <line x1="0" y1="25" x2="0" y2="-20" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
            <polygon points="0,-26 -6,-14 6,-14" fill="#2563eb" />
          </g>
        `;
      }

      // İsimlendirme Kutucukları
      svg += `
        <!-- Horst 1 -->
        <g transform="translate(110, 85)">
          <rect x="-60" y="-12" width="120" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.horst1Name)}</text>
        </g>
        <!-- Graben -->
        <g transform="translate(290, 175)">
          <rect x="-65" y="-12" width="130" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.grabenName)}</text>
        </g>
        <!-- Horst 2 -->
        <g transform="translate(430, 85)">
          <rect x="-60" y="-12" width="120" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.horst2Name)}</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 3. TOMBOLO (SAPLI ADA) & KIYI BİRİKTİRME ŞEKİLLERİ
  // --------------------------------------------------------------------------
  tomboloCoastal: {
    id: 'tomboloCoastal',
    category: 'cografya',
    name: 'Tombolo (Saplı Ada) & Lagün Kıyı Şekli',
    tags: ['TYT', 'Dalga Biriktirmesi', 'Sinop', 'Kapıdağ', 'Lagün', 'Kıyı'],
    desc: 'Açık denizdeki adanın dalga ve akıntıların biriktirdiği kıyı oku (bağlama seti) ile karaya bağlanması şeması.',
    defaultParams: {
      title: 'Tombolo (Saplı Ada) Oluşumu',
      mainlandLabel: 'Anakara (Kıta)',
      islandLabel: 'Ada (Eski Ada)',
      tomboloLabel: 'Tombolo (Bağlama Seti)',
      lagoonLabel: 'Lagün (Kıyı Set Gölü)',
      showWaves: true,
      showDepthLines: true,
      showWindArrow: true
    },
    presets: [
      {
        name: 'Sinop Boztepe Tombolosu Örneği',
        params: {
          title: 'Türkiye Kıyı Şekilleri: Sinop Boztepe Tombolosu',
          mainlandLabel: 'Sinop Anakara',
          islandLabel: 'Boztepe (Saplı Ada)',
          tomboloLabel: 'Bağlama Kordonu',
          lagoonLabel: 'Sığ Kıyı',
          showWaves: true,
          showDepthLines: true,
          showWindArrow: true
        }
      },
      {
        name: 'Kapıdağ Yarımadası (Erdek / Balıkesir)',
        params: {
          title: 'Marmara Denizi: Kapıdağ Tombolosu (Dalga Biriktirmesi)',
          mainlandLabel: 'Erdek / Balıkesir Kıyısı',
          islandLabel: 'Kapıdağ Kütlesi',
          tomboloLabel: 'Çift Kıyı Oku (Tombolo)',
          lagoonLabel: 'Kıyı Lagünü',
          showWaves: true,
          showDepthLines: true,
          showWindArrow: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'mainlandLabel', label: 'Anakara Etiketi', type: 'text' },
      { key: 'islandLabel', label: 'Ada / Yarımada Etiketi', type: 'text' },
      { key: 'tomboloLabel', label: 'Tombolo (Bağlantı) Etiketi', type: 'text' },
      { key: 'lagoonLabel', label: 'Lagün Etiketi', type: 'text' },
      { key: 'showWaves', label: 'Dalga Cephelerini Göster', type: 'checkbox' },
      { key: 'showDepthLines', label: 'Derinlik Eş Yükselti Çizgilerini Göster', type: 'checkbox' },
      { key: 'showWindArrow', label: 'Hakim Rüzgar Yönü Okunu Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 360" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <!-- Deniz -->
        <rect x="0" y="0" width="540" height="360" fill="#bae6fd" />

        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Derinlik Çizgileri (Batimetri) -->
        ${p.showDepthLines ? `
          <g stroke="#7dd3fc" stroke-width="1.2" fill="none" stroke-dasharray="5,5">
            <path d="M 0 160 C 120 180 200 130 270 120 C 350 110 440 180 540 170" />
            <path d="M 0 100 C 140 120 220 80 300 70 C 380 60 460 110 540 100" />
            <circle cx="270" cy="90" r="65" />
          </g>
        ` : ''}

        <!-- Dalga Cepheleri ve Kırılma Okları -->
        ${p.showWaves ? `
          <g stroke="#38bdf8" stroke-width="1.8" fill="none" stroke-linecap="round">
            <path d="M 50 30 C 120 45 180 40 220 30" />
            <path d="M 320 30 C 360 40 420 45 490 30" />
            <path d="M 60 70 C 130 85 180 80 210 60" />
            <path d="M 330 60 C 360 80 410 85 480 70" />
          </g>
        ` : ''}

        <!-- ANAKARA (Güney Bölgesi) -->
        <path d="M 0 240 C 90 230 180 260 270 255 C 360 250 450 225 540 240 L 540 360 L 0 360 Z" fill="#cbd5e1" stroke="#334155" stroke-width="2.5" />
        <path d="M 0 240 C 90 230 180 260 270 255 C 360 250 450 225 540 240 L 540 255 L 0 255 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="1" opacity="0.6" />

        <!-- ADA (Kuzeyde Bağımsız Kütle) -->
        <g id="islandGroup">
          <ellipse cx="270" cy="90" rx="60" ry="42" fill="#94a3b8" stroke="#334155" stroke-width="2.5" />
          <ellipse cx="270" cy="90" rx="63" ry="45" fill="none" stroke="#ca8a04" stroke-width="2" stroke-dasharray="2,2" />
        </g>

        <!-- TOMBOLO (Kıyı Oku / Bağlama Seti Kumsal Köprüsü) -->
        <path d="M 235 125 C 248 160 252 210 240 255 L 300 255 C 288 210 292 160 305 125 Z" fill="#fde047" stroke="#ca8a04" stroke-width="2.2" />
        <!-- Kumsal Çizgileri -->
        <g stroke="#eab308" stroke-width="1" stroke-linecap="round">
          <line x1="255" y1="160" x2="285" y2="160" />
          <line x1="252" y1="185" x2="288" y2="185" />
          <line x1="250" y1="210" x2="290" y2="210" />
        </g>

        <!-- LAGÜN (Kıyı Set Gölü - Sağ Tarafta) -->
        <ellipse cx="430" cy="275" rx="45" ry="22" fill="#7dd3fc" stroke="#0284c7" stroke-width="2" />
        <path d="M 375 255 C 410 245 450 248 485 255" stroke="#ca8a04" stroke-width="4" fill="none" stroke-linecap="round" />

        <!-- Hakim Rüzgar Oku -->
        ${p.showWindArrow ? `
          <g transform="translate(60, 80)">
            <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
            <line x1="-10" y1="-10" x2="8" y2="8" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" />
            <polygon points="12,12 3,10 10,3" fill="#2563eb" />
            <text x="0" y="28" font-size="9" font-weight="bold" fill="#2563eb" text-anchor="middle">Dalga / Rüzgar</text>
          </g>
        ` : ''}

        <!-- Etiket Kutuları -->
        <!-- Anakara -->
        <g transform="translate(120, 305)">
          <rect x="-60" y="-12" width="120" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.6" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.mainlandLabel)}</text>
        </g>
        <!-- Ada -->
        <g transform="translate(270, 88)">
          <rect x="-65" y="-12" width="130" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.6" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.islandLabel)}</text>
        </g>
        <!-- Tombolo -->
        <g transform="translate(270, 185)">
          <rect x="-70" y="-12" width="140" height="24" rx="4" fill="#ffffff" stroke="#ca8a04" stroke-width="2" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#854d0e">${escSvg(p.tomboloLabel)}</text>
        </g>
        <!-- Lagün -->
        <g transform="translate(430, 275)">
          <text x="0" y="4" text-anchor="middle" font-size="10" font-weight="bold" fill="#0369a1">${escSvg(p.lagoonLabel)}</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 4. DÜNYA VEKTÖREL HARİTASI & BOĞAZLAR / KANALLAR
  // --------------------------------------------------------------------------
  worldMap: {
    id: 'worldMap',
    category: 'cografya',
    name: 'Dünya Vektörel Haritası & Boğazlar/Kanallar',
    tags: ['TYT', 'AYT', 'Dünya', 'Boğazlar', 'İklim', 'Dilsiz Harita'],
    desc: 'Kıtalar, Ekvator, Dönenceler, Greenwich meridyeni ve stratejik su yollarını (Panama, Süveyş, Hürmüz, Cebelitarık vb.) içeren vektörel dünya haritası.',
    defaultParams: {
      title: 'Dünya Dilsiz Haritası & Stratejik Noktalar',
      showEquator: true,
      showTropics: true,
      showGreenwich: true,
      pins: [
        { id: 'w1', x: 165, y: 195, label: '1', text: 'Panama Kanalı', color: '#dc2626' },
        { id: 'w2', x: 268, y: 135, label: '2', text: 'Cebelitarık Boğazı', color: '#dc2626' },
        { id: 'w3', x: 335, y: 155, label: '3', text: 'Süveyş Kanalı', color: '#dc2626' },
        { id: 'w4', x: 375, y: 165, label: '4', text: 'Hürmüz Boğazı', color: '#dc2626' },
        { id: 'w5', x: 440, y: 215, label: '5', text: 'Malakka Boğazı', color: '#dc2626' }
      ]
    },
    presets: [
      {
        name: 'Dünya Önemli Boğaz ve Kanalları (1: Panama, 2: Cebelitarık, 3: Süveyş, 4: Hürmüz, 5: Malakka)',
        params: {
          title: 'Dünya Deniz Ticaretinin Stratejik Su Yolları',
          showEquator: true,
          showTropics: true,
          showGreenwich: true,
          pins: [
            { id: 'w1', x: 165, y: 195, label: '1', text: 'Panama', color: '#dc2626' },
            { id: 'w2', x: 268, y: 135, label: '2', text: 'Cebelitarık', color: '#dc2626' },
            { id: 'w3', x: 335, y: 155, label: '3', text: 'Süveyş', color: '#dc2626' },
            { id: 'w4', x: 375, y: 165, label: '4', text: 'Hürmüz', color: '#dc2626' },
            { id: 'w5', x: 440, y: 215, label: '5', text: 'Malakka', color: '#dc2626' }
          ]
        }
      },
      {
        name: 'Dünya Nüfusunun Seyrek Olduğu 5 Bölge (Çöller, Kutuplar, Ekvatoral Orman)',
        params: {
          title: 'Dünyada Nüfusun Seyrek Olduğu Alanlar',
          showEquator: true,
          showTropics: true,
          showGreenwich: false,
          pins: [
            { id: 'w1', x: 200, y: 220, label: 'I', text: 'Amazon Havzası (Aşırı nem/sıcak)', color: '#d97706' },
            { id: 'w2', x: 300, y: 155, label: 'II', text: 'Büyük Sahra Çölü (Kuraklık)', color: '#d97706' },
            { id: 'w3', x: 410, y: 85, label: 'III', text: 'Sibirya (Şiddetli soğuk)', color: '#d97706' },
            { id: 'w4', x: 225, y: 55, label: 'IV', text: 'Grönland (Buzul alanı)', color: '#d97706' },
            { id: 'w5', x: 470, y: 265, label: 'V', text: 'Avustralya Çölleri', color: '#d97706' }
          ]
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Harita Başlığı', type: 'text' },
      { key: 'showEquator', label: 'Ekvator Çizgisini Göster (0°)', type: 'checkbox' },
      { key: 'showTropics', label: 'Dönenceleri Göster (23° 27\' K / G)', type: 'checkbox' },
      { key: 'showGreenwich', label: 'Başlangıç Meridyenini Göster (0°)', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 340" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <!-- Okyanuslar -->
        <rect x="0" y="0" width="580" height="340" fill="#e0f2fe" />

        <!-- Meridyen & Paralel Rehber Çizgileri -->
        ${p.showGreenwich ? `
          <line x1="285" y1="0" x2="285" y2="340" stroke="#64748b" stroke-width="1.2" stroke-dasharray="4,3" />
          <text x="288" y="16" font-size="8.5" font-weight="bold" fill="#475569">0° Greenwich</text>
        ` : ''}

        ${p.showTropics ? `
          <!-- Yengeç Dönencesi -->
          <line x1="0" y1="125" x2="580" y2="125" stroke="#f59e0b" stroke-width="1" stroke-dasharray="5,4" />
          <text x="6" y="121" font-size="8" font-weight="bold" fill="#b45309">23° 27' K (Yengeç)</text>
          <!-- Oğlak Dönencesi -->
          <line x1="0" y1="235" x2="580" y2="235" stroke="#f59e0b" stroke-width="1" stroke-dasharray="5,4" />
          <text x="6" y="231" font-size="8" font-weight="bold" fill="#b45309">23° 27' G (Oğlak)</text>
        ` : ''}

        ${p.showEquator ? `
          <!-- Ekvator Çizgisi -->
          <line x1="0" y1="180" x2="580" y2="180" stroke="#dc2626" stroke-width="1.6" stroke-dasharray="6,3" />
          <text x="6" y="176" font-size="9" font-weight="bold" fill="#dc2626">0° Ekvator</text>
        ` : ''}

        <!-- Kıtalar Vektör Çizimi -->
        <g fill="#f8fafc" stroke="#475569" stroke-width="1.4" stroke-linejoin="round">
          <!-- Kuzey Amerika -->
          <path d="M 60 45 C 90 40 140 45 160 70 C 180 90 170 120 160 140 C 145 160 120 150 100 130 C 80 120 70 80 60 45 Z" />
          <!-- Grönland -->
          <path d="M 205 35 C 230 30 245 45 235 65 C 220 75 205 60 205 35 Z" fill="#f1f5f9" />
          <!-- Güney Amerika -->
          <path d="M 160 185 C 190 180 220 205 210 240 C 200 270 180 300 165 315 C 155 295 150 250 155 210 Z" />
          <!-- Avrupa -->
          <path d="M 270 70 C 300 65 325 75 320 100 C 305 115 285 110 270 100 C 260 85 265 75 270 70 Z" />
          <!-- Afrika -->
          <path d="M 270 125 C 320 120 345 150 340 190 C 330 230 310 270 290 275 C 275 260 265 200 260 160 Z" />
          <!-- Asya -->
          <path d="M 330 65 C 380 50 460 55 490 85 C 510 110 490 150 460 160 C 440 170 410 190 395 180 C 380 150 350 140 330 110 Z" />
          <!-- Hindistan Yarımadası -->
          <path d="M 390 145 C 410 150 415 185 400 195 C 390 185 385 165 390 145 Z" />
          <!-- Avustralya -->
          <path d="M 445 230 C 485 225 510 245 495 280 C 470 295 440 285 435 260 Z" />
          <!-- Antarktika -->
          <path d="M 120 335 C 240 325 360 325 480 335 L 480 340 L 120 340 Z" fill="#f1f5f9" />
        </g>
      `;

      // Harita Pinleri
      if (p.pins && p.pins.length) {
        p.pins.forEach(pin => {
          svg += `
            <g class="sci-draggable sci-overlay-item" data-map-pin-id="${pin.id}" data-overlay-type="mapPin" transform="translate(${pin.x},${pin.y})">
              <path d="M 0 0 C -9 -12 -11 -18 -11 -24 A 11 11 0 1 1 11 -24 C 11 -18 9 -12 0 0 Z" fill="${pin.color || '#dc2626'}" stroke="#ffffff" stroke-width="1.8" />
              <circle cx="0" cy="-24" r="6" fill="#ffffff" />
              <text x="0" y="-21" text-anchor="middle" font-size="8" font-weight="bold" fill="${pin.color || '#dc2626'}">${escSvg(pin.label)}</text>
              ${pin.text ? `
                <rect x="12" y="-32" width="${pin.text.length * 6.5 + 10}" height="18" rx="4" fill="#ffffff" fill-opacity="0.95" stroke="${pin.color || '#dc2626'}" stroke-width="1" />
                <text x="${17 + (pin.text.length * 3.25)}" y="-19" text-anchor="middle" font-size="10" font-weight="bold" fill="#0f172a">${escSvg(pin.text)}</text>
              ` : ''}
            </g>
          `;
        });
      }

      if (p.title) {
        svg += `
          <rect x="10" y="10" width="${p.title.length * 7.5 + 24}" height="26" rx="6" fill="#ffffff" fill-opacity="0.9" stroke="#cbd5e1" stroke-width="1" />
          <text x="22" y="27" font-size="12" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>
        `;
      }

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 5. GÜNEŞ SİSTEMİNDE DÜNYA, EKSEN EĞİKLİĞİ & MEVSİMLER
  // --------------------------------------------------------------------------
  earthOrbitSeasons: {
    id: 'earthOrbitSeasons',
    category: 'cografya',
    name: 'Güneş Sisteminde Dünyanın Konumu & Mevsimler',
    tags: ['TYT', 'Mevsimler', 'Ekinoks', 'Gündönümü', 'Eksen Eğikliği'],
    desc: 'Dünyanın Güneş etrafında dolanımı, 23° 27\' eksen eğikliği, 21 Haziran, 23 Eylül, 21 Aralık, 21 Mart aydınlanma çemberi ve ışın geliş açıları.',
    defaultParams: {
      title: 'Dünyanın Yıllık Hareketi & 4 Önemli Tarih',
      focusDate: 'all', // 'all' | 'june' | 'december' | 'equinox'
      showRays: true,
      showAxialTilt: true,
      showOrbitPath: true
    },
    presets: [
      {
        name: '21 Haziran Konumu (Yaz Gündönümü - Yengeç Dönencesine Dik)',
        params: {
          title: '21 Haziran Yaz Gündönümü (Kuzey Yaz / Güney Kış)',
          focusDate: 'june',
          showRays: true,
          showAxialTilt: true,
          showOrbitPath: true
        }
      },
      {
        name: '21 Aralık Konumu (Kış Gündönümü - Oğlak Dönencesine Dik)',
        params: {
          title: '21 Aralık Kış Gündönümü (Kuzey Kış / Güney Yaz)',
          focusDate: 'december',
          showRays: true,
          showAxialTilt: true,
          showOrbitPath: true
        }
      },
      {
        name: '21 Mart & 23 Eylül Ekinoksu (Gece=Gündüz Eşitliği)',
        params: {
          title: 'Ekinoks Konumu: Ekvatora Dik Geliş & 12 Saat Gece/Gündüz',
          focusDate: 'equinox',
          showRays: true,
          showAxialTilt: true,
          showOrbitPath: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      {
        key: 'focusDate',
        label: 'Görünüm Modu',
        type: 'select',
        options: [
          { v: 'all', l: '4 Tarihli Genel Yıllık Yörünge (Elips)' },
          { v: 'june', l: '21 Haziran Yakın Çekim (Yaz Gündönümü)' },
          { v: 'december', l: '21 Aralık Yakın Çekim (Kış Gündönümü)' },
          { v: 'equinox', l: 'Ekinoks Yakın Çekim (21 Mart - 23 Eylül)' }
        ]
      },
      { key: 'showRays', label: 'Güneş Işınlarını Göster', type: 'checkbox' },
      { key: 'showAxialTilt', label: '23° 27\' Eksen Eğikliği Çizgisini Göster', type: 'checkbox' },
      { key: 'showOrbitPath', label: 'Yörünge Elips Çizgisini Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      if (p.focusDate === 'june' || p.focusDate === 'december' || p.focusDate === 'equinox') {
        return renderSingleDateCloseUp(p);
      }

      // Genel 4 Tarihli Yörünge Şeması
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="560" height="360" fill="#090d16" />

        ${p.title ? `<text x="280" y="26" text-anchor="middle" font-size="13" font-weight="bold" fill="#f8fafc">${escSvg(p.title)}</text>` : ''}

        <!-- Elips Yörünge -->
        ${p.showOrbitPath ? `
          <ellipse cx="280" cy="180" rx="220" ry="110" fill="none" stroke="#334155" stroke-width="1.8" stroke-dasharray="6,4" />
          <!-- Dolanım Yönü Okları (Saat yönünün tersi) -->
          <polygon points="280,70 290,65 290,75" fill="#38bdf8" />
          <polygon points="500,180 505,190 495,190" fill="#38bdf8" />
          <polygon points="280,290 270,295 270,285" fill="#38bdf8" />
          <polygon points="60,180 55,170 65,170" fill="#38bdf8" />
        ` : ''}

        <!-- Güneş (Merkezde) -->
        <g id="sunCentral" transform="translate(280, 180)">
          <circle cx="0" cy="0" r="32" fill="#f59e0b" />
          <circle cx="0" cy="0" r="26" fill="#fbbf24" />
          <text x="0" y="5" text-anchor="middle" font-size="11" font-weight="bold" fill="#78350f">GÜNEŞ</text>
        </g>

        <!-- 1. SOL KONUM: 21 HAZİRAN (YAZ GÜNDÖNÜMÜ) -->
        ${renderEarthMiniGlobe(60, 180, '21 Haziran', 'Yaz Gündönümü', -23.5, true)}

        <!-- 2. SAĞ KONUM: 21 ARALIK (KIŞ GÜNDÖNÜMÜ) -->
        ${renderEarthMiniGlobe(500, 180, '21 Aralık', 'Kış Gündönümü', -23.5, false)}

        <!-- 3. ÜST KONUM: 23 EYLÜL (SONBAHAR EKİNOKSU) -->
        ${renderEarthMiniGlobe(280, 70, '23 Eylül', 'Ekinoks', -23.5, null)}

        <!-- 4. ALT KONUM: 21 MART (İLKBAHAR EKİNOKSU) -->
        ${renderEarthMiniGlobe(280, 290, '21 Mart', 'Ekinoks', -23.5, null)}

        <!-- Yörünge Günberi ve Günöte Notu -->
        <text x="110" y="275" font-size="10" fill="#94a3b8">3 Ocak: Günberi (147 Milyon km)</text>
        <text x="360" y="95" font-size="10" fill="#94a3b8">4 Temmuz: Günöte (152 Milyon km)</text>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 6. MERİDYENLER, PARALELLER & YEREL SAAT HESAPLAMA
  // --------------------------------------------------------------------------
  meridianTime: {
    id: 'meridianTime',
    category: 'cografya',
    name: 'Meridyenler & Yerel Saat Hesaplama',
    tags: ['TYT', 'Meridyen', 'Yerel Saat', 'Boylam', 'Güneşin Konumu'],
    desc: 'Başlangıç meridyeni (Greenwich 0°), 4 dakikalık yerel saat farkı formülü ve Güneşin gökyüzündeki tepe noktası şeması.',
    defaultParams: {
      title: 'Meridyenler & Yerel Saat Farkı Hesabı',
      meridian1: '30° Doğu (İzmit)',
      time1: '12:00',
      meridian2: '45° Doğu (Iğdır)',
      time2: '13:00',
      showFormulas: true
    },
    presets: [
      {
        name: 'ÖSYM Çıkmış Soru: İzmit (30°D) ile Iğdır (45°D) Yerel Saat Farkı',
        params: {
          title: '30°D (İzmit) ve 45°D (Iğdır) Saat Farkı Hesabı',
          meridian1: '30° D (İzmit)',
          time1: '12:00',
          meridian2: '45° D (Iğdır)',
          time2: '13:00',
          showFormulas: true
        }
      },
      {
        name: 'Doğu ve Batı Boylamları Farkı (15° Batı vs 30° Doğu)',
        params: {
          title: 'Farklı Yarımkürelerdeki Boylamlar Arası Süre',
          meridian1: '15° Batı',
          time1: '10:00',
          meridian2: '30° Doğu',
          time2: '13:00',
          showFormulas: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'meridian1', label: '1. Meridyen Bilgisi', type: 'text' },
      { key: 'time1', label: '1. Merkez Saati', type: 'text' },
      { key: 'meridian2', label: '2. Meridyen Bilgisi', type: 'text' },
      { key: 'time2', label: '2. Merkez Saati', type: 'text' },
      { key: 'showFormulas', label: 'Hesaplama Formülü Kutusunu Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 340" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="340" fill="#f8fafc" />

        ${p.title ? `<text x="270" y="26" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Ufuk Düzlemi ve Güneşin Yükseltisi Yayı -->
        <path d="M 60 210 Q 270 50 480 210" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="6,4" />
        <line x1="40" y1="210" x2="500" y2="210" stroke="#0f172a" stroke-width="2.5" />
        <text x="50" y="230" font-size="11" font-weight="bold" fill="#0f172a">DOĞU (Doğuş)</text>
        <text x="440" y="230" font-size="11" font-weight="bold" fill="#0f172a">BATI (Batış)</text>

        <!-- 1. Merkez Güneşi (Öğle Vakti Tepe Noktası) -->
        <g transform="translate(270, 130)">
          <circle cx="0" cy="0" r="22" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
          <text x="0" y="4" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#78350f">12:00 (Öğle)</text>
          <line x1="0" y1="24" x2="0" y2="80" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3" />
        </g>

        <!-- 1. Merkez Bilgi Kutusu -->
        <g transform="translate(140, 175)">
          <rect x="-65" y="-22" width="130" height="44" rx="6" fill="#ffffff" stroke="#2563eb" stroke-width="2" />
          <text x="0" y="-4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.meridian1)}</text>
          <text x="0" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#2563eb">Saat: ${escSvg(p.time1)}</text>
        </g>

        <!-- 2. Merkez Bilgi Kutusu -->
        <g transform="translate(400, 175)">
          <rect x="-65" y="-22" width="130" height="44" rx="6" fill="#ffffff" stroke="#16a34a" stroke-width="2" />
          <text x="0" y="-4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.meridian2)}</text>
          <text x="0" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#16a34a">Saat: ${escSvg(p.time2)}</text>
        </g>

        <!-- Formül ve Kural Bilgi Kutusu -->
        ${p.showFormulas ? `
          <g transform="translate(70, 255)">
            <rect x="0" y="0" width="400" height="65" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
            <text x="15" y="20" font-size="11" font-weight="bold" fill="#0f172a">📐 Coğrafi Yerel Saat Kuralları:</text>
            <text x="15" y="38" font-size="10.5" fill="#334155">• İki ardışık meridyen arasındaki yerel saat farkı daima 4 dakikadır (1° = 4 dk).</text>
            <text x="15" y="54" font-size="10.5" fill="#334155">• Doğu meridyenlerinde Güneş daha erken doğar ve yerel saat daima daha ileridir.</text>
          </g>
        ` : ''}
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 7. İZOHİPS (EŞ YÜKSELTİ EĞRİLERİ) & TOPOGRAFYA HARİTASI
  // --------------------------------------------------------------------------
  isohypseTopography: {
    id: 'isohypseTopography',
    category: 'cografya',
    name: 'İzohips (Eş Yükselti) Topografya Haritası',
    tags: ['TYT', 'İzohips', 'Tepe', 'Vadi', 'Sırt', 'Falez', 'Delta'],
    desc: 'Tepe, sırt (V), vadi (ters V), akarsu akış yönü, kapalı çukur/krater (içe dönük oklar), boyun, falez ve profil hattı.',
    defaultParams: {
      title: 'İzohips Topografya Haritası & Yer Şekilleri',
      contourInterval: '50 m',
      showStream: true,
      showDepression: true,
      showProfileLine: true,
      showCliff: true
    },
    presets: [
      {
        name: 'ÖSYM Klasik Soru Modeli (Tepe, Boyun, Vadi, Delta)',
        params: {
          title: 'Topografya Haritasında Numaralandırılmış Şekiller',
          contourInterval: '50 m',
          showStream: true,
          showDepression: true,
          showProfileLine: true,
          showCliff: true
        }
      },
      {
        name: 'Kapalı Çukur (Krater) ve Falez Sorusu',
        params: {
          title: 'Volkanik Krater (Kapalı Çukur) & Kıyı Falezi',
          contourInterval: '100 m',
          showStream: false,
          showDepression: true,
          showProfileLine: true,
          showCliff: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Harita Başlığı', type: 'text' },
      { key: 'contourInterval', label: 'İzohips Aralığı (Eş Yükselti Adımı)', type: 'text' },
      { key: 'showStream', label: 'Akarsu ve Delta Ovası Çiz', type: 'checkbox' },
      { key: 'showDepression', label: 'Kapalı Çukur (Krater Okları) Göster', type: 'checkbox' },
      { key: 'showProfileLine', label: 'A - B Profil Doğrultusunu Göster', type: 'checkbox' },
      { key: 'showCliff', label: 'Falez / Kıyı Uçurumunu Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 360" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <!-- Zemin -->
        <rect x="0" y="0" width="540" height="360" fill="#f8fafc" />

        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Deniz (Kuzeydoğu veya Doğu Tarafı) -->
        <path d="M 430 0 C 420 120 440 220 540 300 L 540 0 Z" fill="#bae6fd" stroke="#0284c7" stroke-width="2" />
        <text x="490" y="60" font-size="12" font-weight="bold" fill="#0369a1">DENİZ (0 m)</text>

        <!-- İzohips Eğrileri (Kahverengi) -->
        <g stroke="#92400e" stroke-width="1.6" fill="none" stroke-linejoin="round">
          <!-- Kıyı Çizgisi (0 m) -->
          <path d="M 430 0 C 420 120 440 220 540 300" stroke="#0284c7" stroke-width="2.5" />
          
          <!-- 50 m Eğrisi -->
          <path d="M 370 0 C 360 120 375 230 460 360" />
          
          <!-- 100 m Eğrisi (Vadi ve Sırt Girintileriyle) -->
          <path d="M 310 0 C 290 80 320 160 300 220 C 290 260 350 310 390 360" />

          <!-- 150 m Eğrisi -->
          <path d="M 250 0 C 230 70 260 150 240 210 C 220 260 270 320 310 360" />

          <!-- SOL TEPE (Zirve: 350 m) -->
          <path d="M 120 120 C 145 100 175 110 180 140 C 175 170 135 180 115 160 C 100 145 105 130 120 120 Z" />
          <path d="M 130 130 C 145 120 160 125 165 140 C 160 155 140 160 130 150 Z" />
          <polygon points="145,135 150,143 140,143" fill="#b45309" stroke="#b45309" stroke-width="1" />
          <text x="145" y="156" font-size="8" font-weight="bold" fill="#b45309" text-anchor="middle">▲ 365 m</text>

          <!-- SAĞ TEPE (Zirve: 300 m) -->
          <path d="M 210 120 C 235 100 265 110 270 140 C 265 170 225 180 205 160 C 190 145 195 130 210 120 Z" />
          <path d="M 220 130 C 235 120 250 125 255 140 C 250 155 230 160 220 150 Z" />
          <polygon points="235,135 240,143 230,143" fill="#b45309" stroke="#b45309" stroke-width="1" />
        </g>
      `;

      // Akarsu ve Vadi (Ters V girintisi)
      if (p.showStream) {
        svg += `
          <!-- Akarsu -->
          <path d="M 50 250 Q 150 210 280 210 Q 360 200 440 190" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
          <!-- Akış Yönü Oku -->
          <polygon points="380,195 365,190 365,200" fill="#0284c7" />
          <!-- Delta Çıkıntısı -->
          <path d="M 435 175 Q 465 190 435 205 Z" fill="#fde047" stroke="#ca8a04" stroke-width="1.5" />
          <text x="475" y="195" font-size="9" font-weight="bold" fill="#854d0e">Delta</text>
        `
      }

      // Kapalı Çukur / Krater (İçe dönük oklar)
      if (p.showDepression) {
        svg += `
          <!-- Kapalı Çukur Çemberi -->
          <g transform="translate(100, 260)">
            <ellipse cx="0" cy="0" rx="35" ry="25" fill="#fef3c7" stroke="#b45309" stroke-width="1.8" />
            <!-- İçe Dönük Oklar -->
            <line x1="0" y1="-25" x2="0" y2="-13" stroke="#b45309" stroke-width="1.6" />
            <polygon points="0,-10 -3,-16 3,-16" fill="#b45309" />
            <line x1="0" y1="25" x2="0" y2="13" stroke="#b45309" stroke-width="1.6" />
            <polygon points="0,10 -3,16 3,16" fill="#b45309" />
            <line x1="-35" y1="0" x2="-23" y2="0" stroke="#b45309" stroke-width="1.6" />
            <polygon points="-20,0 -26,-3 -26,3" fill="#b45309" />
            <line x1="35" y1="0" x2="23" y2="0" stroke="#b45309" stroke-width="1.6" />
            <polygon points="20,0 26,-3 26,3" fill="#b45309" />
            <text x="0" y="4" font-size="8" font-weight="bold" fill="#78350f" text-anchor="middle">Krater / Çukur</text>
          </g>
        `;
      }

      // Falez (Kıyı Uçurumu - İzohipslerin deniz kıyısında sıklaşması)
      if (p.showCliff) {
        svg += `
          <g transform="translate(425, 60)">
            <line x1="-15" y1="0" x2="15" y2="0" stroke="#b91c1c" stroke-width="2" stroke-dasharray="2,2" />
            <text x="-25" y="4" font-size="9" font-weight="bold" fill="#b91c1c">Falez</text>
          </g>
        `;
      }

      // İki Tepe Arası Boyun
      svg += `
        <text x="190" y="145" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">Boyun</text>
      `;

      // Profil Hattı A - B
      if (p.showProfileLine) {
        svg += `
          <line x1="60" y1="140" x2="400" y2="140" stroke="#2563eb" stroke-width="2" stroke-dasharray="4,3" />
          <circle cx="60" cy="140" r="5" fill="#2563eb" />
          <text x="50" y="144" font-size="12" font-weight="bold" fill="#2563eb">A</text>
          <circle cx="400" cy="140" r="5" fill="#2563eb" />
          <text x="410" y="144" font-size="12" font-weight="bold" fill="#2563eb">B</text>
        `;
      }

      // Lejant ve İzo Aralığı
      svg += `
        <g transform="translate(20, 310)">
          <rect x="0" y="0" width="160" height="28" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
          <text x="8" y="18" font-size="9.5" font-weight="bold" fill="#0f172a">Eş Yükselti Eğrisi: ${escSvg(p.contourInterval)}</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  }
};

function renderEarthMiniGlobe(x, y, dateText, subText, tiltAngle = -23.5, northSummer = true) {
  const r = 24;
  return `
    <g transform="translate(${x}, ${y})">
      <!-- Eksen Çizgisi -->
      <line x1="${tiltAngle * 0.7}" y1="-34" x2="${-tiltAngle * 0.7}" y2="34" stroke="#e2e8f0" stroke-width="1.5" />
      <circle cx="0" cy="0" r="${r}" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />
      
      <!-- Aydınlanma Çemberi -->
      ${northSummer === true ? `
        <!-- Sol aydınlık, sağ karanlık (21 Haziran) -->
        <path d="M 0 -${r} A ${r} ${r} 0 0 1 0 ${r} Z" fill="#030712" opacity="0.65" />
      ` : (northSummer === false ? `
        <!-- Sağ aydınlık, sol karanlık (21 Aralık) -->
        <path d="M 0 -${r} A ${r} ${r} 0 0 0 0 ${r} Z" fill="#030712" opacity="0.65" />
      ` : `
        <!-- Ekinoks (Yarı aydınlık) -->
        <path d="M 0 -${r} A ${r} ${r} 0 0 1 0 ${r} Z" fill="#030712" opacity="0.5" />
      `)}

      <!-- Tarih Etiketi -->
      <rect x="-45" y="32" width="90" height="26" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
      <text x="0" y="44" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#f8fafc">${dateText}</text>
      <text x="0" y="54" text-anchor="middle" font-size="8" fill="#94a3b8">${subText}</text>
    </g>
  `;
}

function renderSingleDateCloseUp(p) {
  const isJune = p.focusDate === 'june';
  const isDec = p.focusDate === 'december';
  const title = isJune ? '21 Haziran Konumu & Güneş Işınları' : (isDec ? '21 Aralık Konumu & Aydınlanma Çemberi' : 'Ekinoks Durumu');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
      <rect x="0" y="0" width="540" height="350" fill="#0f172a" />
      <text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#f8fafc">${title}</text>

      <!-- Güneş (Sol Tarafta) -->
      <g transform="translate(40, 175)">
        <circle cx="0" cy="0" r="50" fill="#f59e0b" />
        <circle cx="0" cy="0" r="42" fill="#fbbf24" />
        <text x="0" y="5" text-anchor="middle" font-size="11" font-weight="bold" fill="#78350f">GÜNEŞ</text>
      </g>

      <!-- Işınlar -->
      <g stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,4">
        <line x1="95" y1="120" x2="270" y2="120" />
        <line x1="95" y1="175" x2="270" y2="175" />
        <line x1="95" y1="230" x2="270" y2="230" />
      </g>

      <!-- Büyük Dünya Modeli -->
      <g transform="translate(360, 175)">
        <!-- Eksen Eğikliği Çizgisi (23° 27') -->
        <line x1="-40" y1="-140" x2="40" y2="140" stroke="#f8fafc" stroke-width="2" />
        <text x="-48" y="-144" font-size="9" font-weight="bold" fill="#f8fafc">Kuzey Kutup Noktası</text>
        <text x="44" y="148" font-size="9" font-weight="bold" fill="#f8fafc">Güney Kutup Noktası</text>

        <!-- Küre -->
        <circle cx="0" cy="0" r="90" fill="#0284c7" stroke="#38bdf8" stroke-width="2" />

        <!-- Aydınlanma Çemberi -->
        <path d="M 0 -90 A 90 90 0 0 ${isJune ? '1' : '0'} 0 90 Z" fill="#030712" opacity="0.65" />

        <!-- Enlem Paralelleri -->
        <ellipse cx="0" cy="-35" rx="82" ry="12" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="4,2" />
        <text x="86" y="-32" font-size="8.5" fill="#f59e0b">Yengeç Dönencesi (23°27' K)</text>

        <ellipse cx="0" cy="0" rx="90" ry="14" fill="none" stroke="#ef4444" stroke-width="2" />
        <text x="94" y="4" font-size="8.5" font-weight="bold" fill="#ef4444">Ekvator (0°)</text>

        <ellipse cx="0" cy="35" rx="82" ry="12" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="4,2" />
        <text x="86" y="38" font-size="8.5" fill="#f59e0b">Oğlak Dönencesi (23°27' G)</text>
      </g>
    </svg>
  `;
}

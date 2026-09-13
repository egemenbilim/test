import { escSvg } from './overlayEngine.js';

/**
 * Egemen's Testmaker — Biyoloji Şablon Envanteri (TYT & AYT)
 * Sürüklenebilir Hücre Mimarisi & Organeller, Nefron & Boşaltım,
 * Nöron & Sinaps İletimi, Kalp & Dolaşım, Kloroplast / Calvin Döngüsü ve Besin Ağı.
 */

export const BIO_TEMPLATES = {
  // --------------------------------------------------------------------------
  // 1. HÜCRE MİMARİSİ (SÜRÜKLENEBİLİR ORGANELLER & DİNAMİK OKLAR)
  // --------------------------------------------------------------------------
  cellStructure: {
    id: 'cellStructure',
    category: 'biyoloji',
    name: 'Hücre Mimarisi & Sürüklenebilir Organeller',
    tags: ['TYT', 'LGS', 'Organeller', 'Hücre', 'Mitokondri', 'Çekirdek'],
    desc: 'Bitki veya hayvan hücresi; organeller (çekirdek, mitokondri, golgi vb.) tuval üzerinde serbestçe sürüklenebilir, ok ve yazılar organeli dinamik takip eder.',
    defaultParams: {
      cellType: 'animal', // 'animal' | 'plant'
      labelStyle: 'roman', // 'roman' | 'letters' | 'names'
      showCellWall: true,
      organelles: {
        nucleus: { active: true, x: 220, y: 175, label: 'I' },
        mitochondria: { active: true, x: 370, y: 130, label: 'II' },
        golgi: { active: true, x: 140, y: 240, label: 'III' },
        vacuole: { active: true, x: 320, y: 235, label: 'IV' },
        chloroplast: { active: false, x: 360, y: 95, label: 'V' },
        ribosome: { active: true, x: 190, y: 105, label: 'VI' },
        centrosome: { active: true, x: 170, y: 205, label: 'VII' }
      }
    },
    presets: [
      {
        name: 'TYT - Hayvan Hücresi (Organeller Sürüklenebilir I-VII)',
        params: {
          cellType: 'animal',
          labelStyle: 'roman',
          showCellWall: false,
          organelles: {
            nucleus: { active: true, x: 220, y: 175, label: 'I' },
            mitochondria: { active: true, x: 370, y: 130, label: 'II' },
            golgi: { active: true, x: 140, y: 240, label: 'III' },
            vacuole: { active: true, x: 320, y: 235, label: 'IV' },
            chloroplast: { active: false, x: 360, y: 95, label: 'V' },
            ribosome: { active: true, x: 190, y: 105, label: 'VI' },
            centrosome: { active: true, x: 170, y: 205, label: 'VII' }
          }
        }
      },
      {
        name: 'TYT - Bitki Hücresi (Kloroplast & Merkezi Koful Aktif)',
        params: {
          cellType: 'plant',
          labelStyle: 'roman',
          showCellWall: true,
          organelles: {
            nucleus: { active: true, x: 170, y: 155, label: 'I' },
            mitochondria: { active: true, x: 130, y: 265, label: 'II' },
            golgi: { active: true, x: 140, y: 90, label: 'III' },
            vacuole: { active: true, x: 330, y: 215, label: 'IV' },
            chloroplast: { active: true, x: 370, y: 100, label: 'V' },
            ribosome: { active: true, x: 240, y: 110, label: 'VI' },
            centrosome: { active: false, x: 170, y: 205, label: 'VII' }
          }
        }
      }
    ],
    schema: [
      {
        key: 'cellType',
        label: 'Hücre Tipi',
        type: 'select',
        options: [
          { v: 'animal', l: 'Hayvan Hücresi (Yuvarlak / Esnek Zar)' },
          { v: 'plant', l: 'Bitki Hücresi (Köşeli / Çeperli)' }
        ]
      },
      {
        key: 'labelStyle',
        label: 'Etiketleme Şekli',
        type: 'select',
        options: [
          { v: 'roman', l: 'Roma Rakamları (I, II, III...)' },
          { v: 'letters', l: 'Harfler (K, L, M...)' },
          { v: 'names', l: 'Organel İsimleri' }
        ]
      }
    ],
    renderSvg(p) {
      const isPlant = p.cellType === 'plant';
      const orgs = p.organelles || {};

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 370" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <defs>
          <radialGradient id="bioCytoGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${isPlant ? '#f0fdf4' : '#eff6ff'}" />
            <stop offset="100%" stop-color="${isPlant ? '#dcfce7' : '#dbeafe'}" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="540" height="370" fill="#ffffff" />
        <text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">
          ${isPlant ? 'Bitki Hücresi Mimarisi & Organeller' : 'Hayvan Hücresi Mimarisi & Organeller'}
        </text>
      `;

      // Hücre Çeperi ve Zarı
      if (isPlant) {
        svg += `
          <!-- Hücre Çeperi (Selüloz) -->
          <polygon points="70,45 440,45 485,190 440,335 70,335 30,190" fill="#bbf7d0" stroke="#16a34a" stroke-width="7" stroke-linejoin="round" />
          <!-- Plazma Zarı -->
          <polygon points="76,51 434,51 477,190 434,329 76,329 38,190" fill="url(#bioCytoGrad)" stroke="#22c55e" stroke-width="2.5" stroke-linejoin="round" />
        `;
      } else {
        svg += `
          <!-- Hayvan Plazma Zarı -->
          <ellipse cx="260" cy="190" rx="205" ry="145" fill="url(#bioCytoGrad)" stroke="#0284c7" stroke-width="3" />
        `;
      }

      // Sürüklenebilir Organeller
      // 1. Çekirdek (Nucleus)
      if (orgs.nucleus?.active) {
        const nx = orgs.nucleus.x;
        const ny = orgs.nucleus.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="nucleus" transform="translate(${nx},${ny})">
            <circle cx="0" cy="0" r="42" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5" />
            <circle cx="0" cy="0" r="15" fill="#c2410c" opacity="0.85" />
            <circle cx="24" cy="0" r="2" fill="#9a3412" />
            <circle cx="-24" cy="0" r="2" fill="#9a3412" />
            <circle cx="0" cy="24" r="2" fill="#9a3412" />
          </g>
          ${renderOrganellePointer(nx, ny - 42, nx, ny - 70, nx - 35, ny - 70, getOrgLabel(orgs.nucleus.label, p.labelStyle, 'Çekirdek'))}
        `;
      }

      // 2. Mitokondri
      if (orgs.mitochondria?.active) {
        const mx = orgs.mitochondria.x;
        const my = orgs.mitochondria.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="mitochondria" transform="translate(${mx},${my}) rotate(-25)">
            <rect x="-35" y="-18" width="70" height="36" rx="18" fill="#fecdd3" stroke="#e11d48" stroke-width="2" />
            <path d="M -22 -10 Q -15 0 -22 10 Q -8 0 -5 -10 Q 5 0 2 10 Q 15 0 12 -10" fill="none" stroke="#be123c" stroke-width="2" />
          </g>
          ${renderOrganellePointer(mx, my, mx + 50, my, mx + 75, my, getOrgLabel(orgs.mitochondria.label, p.labelStyle, 'Mitokondri'))}
        `;
      }

      // 3. Golgi Aygıtı
      if (orgs.golgi?.active) {
        const gx = orgs.golgi.x;
        const gy = orgs.golgi.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="golgi" transform="translate(${gx},${gy})">
            <path d="M -25 -12 C 0 -6 0 -6 25 -12" fill="none" stroke="#8b5cf6" stroke-width="5" stroke-linecap="round" />
            <path d="M -30 0 C 0 8 0 8 30 0" fill="none" stroke="#8b5cf6" stroke-width="5" stroke-linecap="round" />
            <path d="M -25 14 C 0 20 0 20 25 14" fill="none" stroke="#8b5cf6" stroke-width="5" stroke-linecap="round" />
            <circle cx="-35" cy="4" r="3.5" fill="#8b5cf6" />
            <circle cx="34" cy="-4" r="3" fill="#8b5cf6" />
          </g>
          ${renderOrganellePointer(gx, gy, gx - 50, gy, gx - 75, gy, getOrgLabel(orgs.golgi.label, p.labelStyle, 'Golgi Aygıtı'))}
        `;
      }

      // 4. Koful (Vacuole)
      if (orgs.vacuole?.active) {
        const vx = orgs.vacuole.x;
        const vy = orgs.vacuole.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="vacuole" transform="translate(${vx},${vy})">
            ${isPlant ? `
              <rect x="-65" y="-50" width="130" height="100" rx="30" fill="#bae6fd" stroke="#0284c7" stroke-width="2" opacity="0.8" />
              <text x="0" y="5" font-size="10" fill="#0369a1" text-anchor="middle" font-style="italic">Hücre Özsuyu</text>
            ` : `
              <ellipse cx="0" cy="0" rx="26" ry="18" fill="#bae6fd" stroke="#0284c7" stroke-width="2" opacity="0.85" />
            `}
          </g>
          ${renderOrganellePointer(vx, vy, vx + 55, vy + 15, vx + 80, vy + 15, getOrgLabel(orgs.vacuole.label, p.labelStyle, isPlant ? 'Merkezi Koful' : 'Koful'))}
        `;
      }

      // 5. Kloroplast
      if (orgs.chloroplast?.active) {
        const cx = orgs.chloroplast.x;
        const cy = orgs.chloroplast.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="chloroplast" transform="translate(${cx},${cy}) rotate(15)">
            <ellipse cx="0" cy="0" rx="34" ry="22" fill="#86efac" stroke="#15803d" stroke-width="2" />
            <line x1="-18" y1="-8" x2="18" y2="-8" stroke="#166534" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3,3" />
            <line x1="-22" y1="0" x2="22" y2="0" stroke="#166534" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3,3" />
            <line x1="-18" y1="8" x2="18" y2="8" stroke="#166534" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3,3" />
          </g>
          ${renderOrganellePointer(cx, cy, cx + 55, cy - 20, cx + 80, cy - 20, getOrgLabel(orgs.chloroplast.label, p.labelStyle, 'Kloroplast'))}
        `;
      }

      // 6. Ribozom
      if (orgs.ribosome?.active) {
        const rx = orgs.ribosome.x;
        const ry = orgs.ribosome.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="ribosome" transform="translate(${rx},${ry})">
            <circle cx="0" cy="0" r="6.5" fill="#475569" stroke="#0f172a" stroke-width="1.5" />
            <circle cx="8" cy="4" r="5.5" fill="#475569" stroke="#0f172a" stroke-width="1.5" />
          </g>
          ${renderOrganellePointer(rx, ry, rx, ry - 35, rx - 35, ry - 35, getOrgLabel(orgs.ribosome.label, p.labelStyle, 'Ribozom'))}
        `;
      }

      // 7. Sentrozom
      if (orgs.centrosome?.active && !isPlant) {
        const sx = orgs.centrosome.x;
        const sy = orgs.centrosome.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="centrosome" transform="translate(${sx},${sy})">
            <rect x="-8" y="-4" width="16" height="8" rx="2" fill="#eab308" stroke="#a16207" stroke-width="1.5" />
            <rect x="-4" y="-8" width="8" height="16" rx="2" fill="#eab308" stroke="#a16207" stroke-width="1.5" />
          </g>
          ${renderOrganellePointer(sx, sy, sx - 45, sy - 15, sx - 70, sy - 15, getOrgLabel(orgs.centrosome.label, p.labelStyle, 'Sentrozom'))}
        `;
      }

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 2. NEFRON & BOŞALTIM SİSTEMİ
  // --------------------------------------------------------------------------
  nephron: {
    id: 'nephron',
    category: 'biyoloji',
    name: 'Nefron & Boşaltım Modeli (Süzülme & Emilim)',
    tags: ['AYT', 'Boşaltım', 'Nefron', 'Glomerulus', 'Bowman', 'Henle'],
    desc: 'Glomerulus, Bowman kapsülü, proksimal tüp, Henle kulpu, distal tüp, toplama kanalı ve süzülme/emilim okları.',
    defaultParams: {
      title: 'Böbrek Nefronunun Yapısı & İdrar Oluşumu',
      labelType: 'num', // 'num' | 'names'
      showFlowArrows: true,
      showVessels: true
    },
    presets: [
      {
        name: 'AYT - Numaralandırılmış Nefron Kısımları (I-V)',
        params: {
          title: 'Nefronda Numaralandırılmış Bölgeler',
          labelType: 'num',
          showFlowArrows: true,
          showVessels: true
        }
      },
      {
        name: 'Nefron Kısımları İsimleriyle',
        params: {
          title: 'Nefronun Anatomik Yapısı ve Süzülme Yönü',
          labelType: 'names',
          showFlowArrows: true,
          showVessels: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      {
        key: 'labelType',
        label: 'Bölge İsimlendirmesi',
        type: 'select',
        options: [{ v: 'num', l: 'Numaralı (I, II, III, IV, V)' }, { v: 'names', l: 'Anatomik İsimler' }]
      },
      { key: 'showFlowArrows', label: 'Süzülme ve Emilim Oklarını Göster', type: 'checkbox' },
      { key: 'showVessels', label: 'Getirici / Götürücü Kılcalları Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      const isNum = p.labelType === 'num';
      const l1 = isNum ? 'I' : 'Glomerulus';
      const l2 = isNum ? 'II' : 'Bowman Kapsülü';
      const l3 = isNum ? 'III' : 'Proksimal Tüp';
      const l4 = isNum ? 'IV' : 'Henle Kulpu';
      const l5 = isNum ? 'V' : 'Toplama Kanalı';

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 360" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="360" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Korteks / Medulla Ayrım Çizgisi -->
        <line x1="40" y1="170" x2="500" y2="170" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="6,4" />
        <text x="50" y="165" font-size="10" font-weight="bold" fill="#94a3b8">Korteks (Kabuk)</text>
        <text x="50" y="185" font-size="10" font-weight="bold" fill="#94a3b8">Medulla (Öz)</text>

        <!-- NEFRON KANALI YOLU -->
        <!-- Bowman -> Proksimal -> Henle İnen -> Henle Çıkan -> Distal -> Toplama -->
        <g stroke="#f59e0b" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85">
          <!-- Bowman C Kapsülü -->
          <path d="M 140 100 C 110 80 110 140 140 120" />
          <!-- Proksimal Tüp Kıvrımları -->
          <path d="M 140 110 C 180 90 190 140 220 120" />
          <!-- Henle Kulpu İnen Kol -->
          <path d="M 220 120 L 220 280 C 220 310 270 310 270 280 L 270 120" />
          <!-- Distal Tüp -->
          <path d="M 270 120 C 310 100 320 140 360 110" />
          <!-- İdrar Toplama Kanalı -->
          <path d="M 360 110 L 430 110 L 430 330" />
        </g>
        <!-- Nefron Kanalı Dış Konturu -->
        <g stroke="#b45309" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 140 92 C 100 70 100 150 140 128" />
          <path d="M 140 102 C 175 82 185 132 212 112" />
          <path d="M 212 112 L 212 280 C 212 318 278 318 278 280 L 278 112" />
          <path d="M 278 112 C 315 92 325 132 352 102" />
          <path d="M 352 102 L 422 102 L 422 330" />
        </g>

        <!-- Glomerulus Kılcal Yumağı (Kırmızı Damar) -->
        <g id="glomerulusGroup" transform="translate(125, 110)">
          <circle cx="0" cy="0" r="16" fill="#fecdd3" stroke="#dc2626" stroke-width="2.5" />
          <path d="M -8 -8 Q 0 8 8 -8 Q -8 0 8 8" fill="none" stroke="#dc2626" stroke-width="2.5" />
        </g>

        <!-- Damarlar (Getirici / Götürücü Atardamarlar) -->
        ${p.showVessels ? `
          <g stroke="#dc2626" stroke-width="3" fill="none" stroke-linecap="round">
            <line x1="80" y1="70" x2="115" y2="100" />
            <line x1="115" y1="120" x2="80" y2="150" />
            <text x="60" y="65" font-size="9.5" font-weight="bold" fill="#dc2626" stroke="none">Getirici Atar</text>
          </g>
        ` : ''}

        <!-- Süzülme ve Geri Emilim Okları -->
        ${p.showFlowArrows ? `
          <!-- Süzülme (Glomerulus -> Bowman) -->
          <line x1="135" y1="110" x2="160" y2="110" stroke="#2563eb" stroke-width="2.5" />
          <polygon points="166,110 156,106 156,114" fill="#2563eb" />
          <text x="155" y="100" font-size="9" font-weight="bold" fill="#2563eb">Süzülme</text>

          <!-- Henle Geri Emilim Okları -->
          <line x1="220" y1="200" x2="185" y2="200" stroke="#059669" stroke-width="2" />
          <polygon points="180,200 188,197 188,203" fill="#059669" />
          <text x="175" y="195" font-size="9" font-weight="bold" fill="#059669">H₂O Emilimi</text>

          <line x1="270" y1="220" x2="305" y2="220" stroke="#d97706" stroke-width="2" />
          <polygon points="310,220 302,217 302,223" fill="#d97706" />
          <text x="312" y="215" font-size="9" font-weight="bold" fill="#d97706">NaCl Emilimi</text>
        ` : ''}

        <!-- Numaralandırılmış / İsimlendirilmiş Etiket Kutuları -->
        <!-- I: Glomerulus -->
        ${renderNephronBadge(125, 60, l1)}
        <!-- II: Bowman Kapsülü -->
        ${renderNephronBadge(80, 115, l2)}
        <!-- III: Proksimal Tüp -->
        ${renderNephronBadge(200, 75, l3)}
        <!-- IV: Henle Kulpu -->
        ${renderNephronBadge(245, 335, l4)}
        <!-- V: Toplama Kanalı -->
        ${renderNephronBadge(430, 75, l5)}
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 3. NÖRON & SİNAPS İLETİMİ
  // --------------------------------------------------------------------------
  synapse: {
    id: 'synapse',
    category: 'biyoloji',
    name: 'Nöron Yapısı & Sinaps İletimi',
    tags: ['AYT', 'Sinir Sistemi', 'Nöron', 'Sinaps', 'Akson', 'Dendrit'],
    desc: 'Hücre gövdesi, dendritler, akson, miyelin kılıf, Ranvier boğumu ve sinaptik boşluktaki nörotransmitter iletimi.',
    defaultParams: {
      title: 'Motor Nöron Yapısı & İmpuls İletim Yönü',
      showMyelin: true,
      showTransmitters: true,
      impulseDirection: 'left_to_right'
    },
    presets: [
      {
        name: 'AYT - Miyelinli Nöron & Atlama İletimi',
        params: {
          title: 'Miyelin Kılıflı Nöronda İmpuls İletimi',
          showMyelin: true,
          showTransmitters: true,
          impulseDirection: 'left_to_right'
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'showMyelin', label: 'Miyelin Kılıfları & Ranvier Boğumunu Göster', type: 'checkbox' },
      { key: 'showTransmitters', label: 'Sinaptik Boşluktaki Nörotransmitterleri Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 340" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="340" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Nöron Gövdesi (Soma) & Dendritler (Sol) -->
        <g id="somaGroup" transform="translate(100, 170)">
          <!-- Dendrit Dalları -->
          <path d="M -30 -30 L -60 -60 M -35 0 L -75 0 M -30 30 L -60 60 M 0 -35 L 0 -70 M 0 35 L 0 70" stroke="#0284c7" stroke-width="3" stroke-linecap="round" />
          <!-- Hücre Gövdesi -->
          <circle cx="0" cy="0" r="36" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5" />
          <circle cx="0" cy="0" r="14" fill="#0284c7" opacity="0.8" />
          <text x="0" y="4" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#ffffff">Çekirdek</text>
          <text x="-65" y="-65" font-size="11" font-weight="bold" fill="#0369a1">Dendrit</text>
        </g>

        <!-- Akson Gövdesi (İletken Hat) -->
        <line x1="136" y1="170" x2="450" y2="170" stroke="#0284c7" stroke-width="6" stroke-linecap="round" />

        <!-- Miyelin Kılıf Boğumları (Schwann Hücreleri) -->
        ${p.showMyelin ? `
          <g transform="translate(160, 170)">
            <!-- 1. Kılıf -->
            <rect x="0" y="-16" width="60" height="32" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
            <!-- 2. Kılıf -->
            <rect x="75" y="-16" width="60" height="32" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
            <!-- 3. Kılıf -->
            <rect x="150" y="-16" width="60" height="32" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
            <!-- 4. Kılıf -->
            <rect x="225" y="-16" width="60" height="32" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />

            <!-- Ranvier Boğumu Ok ve Notu -->
            <line x1="68" y1="-2" x2="68" y2="-45" stroke="#dc2626" stroke-width="1.8" />
            <polygon points="68,-2 65,-10 71,-10" fill="#dc2626" />
            <text x="68" y="-50" text-anchor="middle" font-size="10" font-weight="bold" fill="#dc2626">Ranvier Boğumu</text>
            <text x="180" y="-22" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#854d0e">Miyelin Kılıf</text>
          </g>
        ` : ''}

        <!-- Akson Uçları & Sinaps Yumruları (Sağ) -->
        <g id="axonTerminals" transform="translate(450, 170)" stroke="#0284c7" stroke-width="3">
          <line x1="0" y1="0" x2="35" y2="-40" />
          <circle cx="35" cy="-40" r="7" fill="#0284c7" />
          <line x1="0" y1="0" x2="45" y2="0" />
          <circle cx="45" cy="0" r="7" fill="#0284c7" />
          <line x1="0" y1="0" x2="35" y2="40" />
          <circle cx="35" cy="40" r="7" fill="#0284c7" />
          <text x="55" y="4" font-size="11" font-weight="bold" fill="#0369a1" stroke="none">Akson Ucu (Sinaps)</text>
        </g>

        <!-- İmpuls İletim Yönü Oku (Dendrit -> Akson Ucu) -->
        <g transform="translate(180, 240)">
          <line x1="0" y1="0" x2="200" y2="0" stroke="#dc2626" stroke-width="3" stroke-linecap="round" />
          <polygon points="210,0 196,-6 196,6" fill="#dc2626" />
          <text x="100" y="-10" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">İmpuls İletim Yönü (Dendrit ➔ Akson)</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  }
};

function renderOrganellePointer(fromX, fromY, midX, midY, toX, toY, label) {
  const isLeft = toX < fromX;
  const boxW = label.length > 2 ? label.length * 8 + 16 : 28;
  const boxX = isLeft ? toX - boxW : toX;

  return `
    <g stroke="#0f172a" stroke-width="1.6" fill="none">
      <circle cx="${fromX}" cy="${fromY}" r="2.5" fill="#0f172a" />
      <line x1="${fromX}" y1="${fromY}" x2="${midX}" y2="${midY}" />
      <line x1="${midX}" y1="${midY}" x2="${toX}" y2="${toY}" />
    </g>
    <g transform="translate(${boxX}, ${toY - 12})">
      <rect x="0" y="0" width="${boxW}" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.6" />
      <text x="${boxW / 2}" y="16" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0f172a">${escSvg(label)}</text>
    </g>
  `;
}

function getOrgLabel(code, style, name) {
  if (style === 'names') return name;
  return code || name;
}

function renderNephronBadge(x, y, label) {
  const w = label.length > 2 ? label.length * 8 + 14 : 26;
  return `
    <g transform="translate(${x}, ${y})">
      <rect x="-${w / 2}" y="-12" width="${w}" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" />
      <text x="0" y="4.5" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0f172a">${escSvg(label)}</text>
    </g>
  `;
}

import { $, openModal, closeModal } from '../utils.js';

let activeShape = 'triangle';
let onInsertCallback = null;

// Geometry configuration state
const G = {
  // Triangle (12 variants)
  triangleVariant: 'dik',
  triVertexA: 'A',
  triVertexB: 'B',
  triVertexC: 'C',
  triSideAB: 'c',
  triSideBC: 'a',
  triSideAC: 'b',
  triAngleA: '',
  triAngleB: '90°',
  triAngleC: '45°',
  triAltitude: true,
  triShade: false,
  triTicks: true,

  // Öklid fields
  oklidH: 'h',
  oklidP: 'p = 4',
  oklidK: 'k = 9',

  // Açıortay fields
  aciAN: 'n_A',
  aciBN: 'x',
  aciNC: '6',

  // Kenarortay fields
  medAD: 'V_a',
  showG: true,

  // Benzerlik fields
  benAD: '4',
  benDB: '2',
  benDE: 'x',
  benAE: '',
  benEC: '',

  // Circle
  circleVariant: 'merkez_aci',
  circleCenter: 'O',
  circleRadius: 'r = 6 cm',
  circleAngle: 60,
  circleAngleLabel: '60°',
  circleSector: true,
  circleShade: true,
  circleChord: false,
  circleTangent: false,

  // Quadrilateral
  quadVariant: 'dikdortgen',
  quadVertexA: 'A',
  quadVertexB: 'B',
  quadVertexC: 'C',
  quadVertexD: 'D',
  quadSideAB: '12 cm',
  quadSideBC: '5 cm',
  quadSideCD: '',
  quadSideDA: '',
  quadDiagonals: false,
  quadShade: false,
  quadAltitude: false,

  // Parallel lines & angles
  parVariant: 'z_kurali',
  parAngle1: '120°',
  parAngle2: 'x',
  parMAngA: '40°',
  parMAngX: 'x',
  parMAngB: '35°',
  parLine1: 'd₁',
  parLine2: 'd₂'
};

export function setOnGeometryInsertCallback(fn) {
  onInsertCallback = fn;
}

export function openGeometryModal(callback) {
  if (typeof callback === 'function') {
    onInsertCallback = callback;
  }
  syncControlsFromState();
  renderGeometryCanvas();
  openModal('geoModal');
}

export function syncControlsFromState() {
  // Shape tab selection buttons
  document.querySelectorAll('[data-geo-shape]').forEach(btn => {
    const isAct = btn.dataset.geoShape === activeShape;
    btn.classList.toggle('active', isAct);
    if (isAct) {
      btn.className = 'active flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900 shadow-sm';
    } else {
      btn.className = 'flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200';
    }
  });

  // Shape container panels - only the selected shape panel is displayed!
  const panels = {
    triangle: $('geoTriControls'),
    circle: $('geoCirControls'),
    quad: $('geoQuadControls'),
    parallel: $('geoParControls')
  };
  Object.keys(panels).forEach(k => {
    if (panels[k]) {
      panels[k].classList.toggle('hidden', k !== activeShape);
    }
  });

  // Dynamic Sub-Settings for Triangle
  if (activeShape === 'triangle') {
    const tv = G.triangleVariant;
    if ($('geoTriVariant')) $('geoTriVariant').value = tv;

    const isOklid = tv === 'oklid';
    const isAciortay = tv === 'aciortay';
    const isKenarortay = tv === 'kenarortay';
    const isBenzerlik = tv === 'benzerlik';

    if ($('triOklidFields')) $('triOklidFields').classList.toggle('hidden', !isOklid);
    if ($('triAciortayFields')) $('triAciortayFields').classList.toggle('hidden', !isAciortay);
    if ($('triKenarortayFields')) $('triKenarortayFields').classList.toggle('hidden', !isKenarortay);
    if ($('triBenzerlikFields')) $('triBenzerlikFields').classList.toggle('hidden', !isBenzerlik);

    if ($('triStandardSides')) $('triStandardSides').classList.toggle('hidden', isBenzerlik);
    if ($('triAnglesRow')) $('triAnglesRow').classList.toggle('hidden', isOklid || isBenzerlik || isKenarortay);

    if ($('geoTriAltLabel')) {
      const showAlt = ['dik', 'ikizkenar', 'eskenar', 'cesitkenar', 'genis'].includes(tv);
      $('geoTriAltLabel').classList.toggle('hidden', !showAlt);
    }

    if ($('geoTriVA')) $('geoTriVA').value = G.triVertexA;
    if ($('geoTriVB')) $('geoTriVB').value = G.triVertexB;
    if ($('geoTriVC')) $('geoTriVC').value = G.triVertexC;
    if ($('geoTriSAB')) $('geoTriSAB').value = G.triSideAB;
    if ($('geoTriSBC')) $('geoTriSBC').value = G.triSideBC;
    if ($('geoTriSAC')) $('geoTriSAC').value = G.triSideAC;
    if ($('geoTriAngA')) $('geoTriAngA').value = G.triAngleA;
    if ($('geoTriAngB')) $('geoTriAngB').value = G.triAngleB;
    if ($('geoTriAngC')) $('geoTriAngC').value = G.triAngleC;
    if ($('geoTriAltitude')) $('geoTriAltitude').checked = G.triAltitude;
    if ($('geoTriShade')) $('geoTriShade').checked = G.triShade;
    if ($('geoTriTicks')) $('geoTriTicks').checked = G.triTicks;

    if ($('geoTriOklidH')) $('geoTriOklidH').value = G.oklidH;
    if ($('geoTriOklidP')) $('geoTriOklidP').value = G.oklidP;
    if ($('geoTriOklidK')) $('geoTriOklidK').value = G.oklidK;

    if ($('geoTriAciAN')) $('geoTriAciAN').value = G.aciAN;
    if ($('geoTriAciBN')) $('geoTriAciBN').value = G.aciBN;
    if ($('geoTriAciNC')) $('geoTriAciNC').value = G.aciNC;

    if ($('geoTriMedAD')) $('geoTriMedAD').value = G.medAD;
    if ($('geoTriShowG')) $('geoTriShowG').checked = G.showG;

    if ($('geoTriBenAD')) $('geoTriBenAD').value = G.benAD;
    if ($('geoTriBenDB')) $('geoTriBenDB').value = G.benDB;
    if ($('geoTriBenDE')) $('geoTriBenDE').value = G.benDE;
    if ($('geoTriBenAE')) $('geoTriBenAE').value = G.benAE;
    if ($('geoTriBenEC')) $('geoTriBenEC').value = G.benEC;
  }

  // Dynamic Sub-Settings for Circle
  if (activeShape === 'circle') {
    const cv = G.circleVariant;
    if ($('geoCirVariant')) $('geoCirVariant').value = cv;

    const isSector = cv === 'merkez_aci';
    const isCevre = cv === 'cevre_aci';
    const isKirisTeget = cv === 'kiris_teget';
    const isCap = cv === 'cap_aci';

    if ($('cirAngleBlock')) $('cirAngleBlock').classList.toggle('hidden', !isSector && !isCevre);
    if ($('cirAngleLabelBlock')) $('cirAngleLabelBlock').classList.toggle('hidden', isCap);
    if ($('cirSectorToggle')) $('cirSectorToggle').classList.toggle('hidden', !isSector);
    if ($('cirShadeToggle')) $('cirShadeToggle').classList.toggle('hidden', !isSector && !isCevre);
    if ($('cirChordToggle')) $('cirChordToggle').classList.toggle('hidden', !isKirisTeget);
    if ($('cirTangentToggle')) $('cirTangentToggle').classList.toggle('hidden', !isKirisTeget);

    if ($('geoCirCenter')) $('geoCirCenter').value = G.circleCenter;
    if ($('geoCirRadius')) $('geoCirRadius').value = G.circleRadius;
    if ($('geoCirAngleRange')) $('geoCirAngleRange').value = G.circleAngle;
    if ($('geoCirAngleVal')) $('geoCirAngleVal').textContent = G.circleAngle + '°';
    if ($('geoCirAngleLbl')) $('geoCirAngleLbl').value = G.circleAngleLabel;
    if ($('geoCirSector')) $('geoCirSector').checked = G.circleSector;
    if ($('geoCirShade')) $('geoCirShade').checked = G.circleShade;
    if ($('geoCirChord')) $('geoCirChord').checked = G.circleChord;
    if ($('geoCirTangent')) $('geoCirTangent').checked = G.circleTangent;
  }

  // Dynamic Sub-Settings for Quadrilateral
  if (activeShape === 'quad') {
    const qv = G.quadVariant;
    if ($('geoQuadVariant')) $('geoQuadVariant').value = qv;

    const hasExtraSides = ['yamuk', 'dik_yamuk', 'deltoid'].includes(qv);
    const hasAlt = ['paralelkenar', 'yamuk', 'dik_yamuk'].includes(qv);

    if ($('quadExtraSides')) $('quadExtraSides').classList.toggle('hidden', !hasExtraSides);
    if ($('quadAltitudeToggle')) $('quadAltitudeToggle').classList.toggle('hidden', !hasAlt);

    if ($('geoQuadVA')) $('geoQuadVA').value = G.quadVertexA;
    if ($('geoQuadVB')) $('geoQuadVB').value = G.quadVertexB;
    if ($('geoQuadVC')) $('geoQuadVC').value = G.quadVertexC;
    if ($('geoQuadVD')) $('geoQuadVD').value = G.quadVertexD;
    if ($('geoQuadSAB')) $('geoQuadSAB').value = G.quadSideAB;
    if ($('geoQuadSBC')) $('geoQuadSBC').value = G.quadSideBC;
    if ($('geoQuadSCD')) $('geoQuadSCD').value = G.quadSideCD;
    if ($('geoQuadSDA')) $('geoQuadSDA').value = G.quadSideDA;
    if ($('geoQuadDiagonals')) $('geoQuadDiagonals').checked = G.quadDiagonals;
    if ($('geoQuadShade')) $('geoQuadShade').checked = G.quadShade;
    if ($('geoQuadAltitude')) $('geoQuadAltitude').checked = G.quadAltitude;
  }

  // Dynamic Sub-Settings for Parallel Lines
  if (activeShape === 'parallel') {
    const pv = G.parVariant;
    if ($('geoParVariant')) $('geoParVariant').value = pv;

    const isM = pv === 'm_kurali';
    if ($('parTwoAngles')) $('parTwoAngles').classList.toggle('hidden', isM);
    if ($('parMFields')) $('parMFields').classList.toggle('hidden', !isM);

    if ($('geoParL1')) $('geoParL1').value = G.parLine1;
    if ($('geoParL2')) $('geoParL2').value = G.parLine2;
    if ($('geoParAng1')) $('geoParAng1').value = G.parAngle1;
    if ($('geoParAng2')) $('geoParAng2').value = G.parAngle2;
    if ($('geoParMAngA')) $('geoParMAngA').value = G.parMAngA;
    if ($('geoParMAngX')) $('geoParMAngX').value = G.parMAngX;
    if ($('geoParMAngB')) $('geoParMAngB').value = G.parMAngB;

    if ($('parTipText')) {
      if (pv === 'z_kurali') $('parTipText').textContent = '💡 Z Kuralı: d₁ // d₂ doğrularında iç ters açılar birbirine eşittir (a = b).';
      else if (pv === 'u_kurali') $('parTipText').textContent = '💡 U Kuralı: Karşı durumlu açıların toplamı 180° dir (a + b = 180°).';
      else if (pv === 'm_kurali') $('parTipText').textContent = '💡 M Kuralı: Sağa bakan açıların toplamı sola bakan açıya eşittir (x = a + b).';
      else if (pv === 'yondes') $('parTipText').textContent = '💡 Yöndeş Açılar: Aynı yöne bakan açılar eşittir.';
    }
  }
}

export function renderGeometryCanvas() {
  const canvas = $('geoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 2;
  const width = 560;
  const height = 380;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Styling constants
  const strokeColor = '#0f172a';
  const fillColor = 'rgba(15, 23, 42, 0.08)';
  const arcColor = '#475569';
  const labelColor = '#0f172a';
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (activeShape === 'triangle') {
    drawTriangle(ctx, width, height, strokeColor, fillColor, arcColor, labelColor);
  } else if (activeShape === 'circle') {
    drawCircle(ctx, width, height, strokeColor, fillColor, arcColor, labelColor);
  } else if (activeShape === 'quad') {
    drawQuad(ctx, width, height, strokeColor, fillColor, arcColor, labelColor);
  } else if (activeShape === 'parallel') {
    drawParallel(ctx, width, height, strokeColor, fillColor, arcColor, labelColor);
  }

  ctx.restore();
}

function drawTriangle(ctx, W, H, strokeColor, fillColor, arcColor, labelColor) {
  const v = G.triangleVariant;
  let A, B, C;

  if (v === 'dik') {
    // 1. Standart Dik Üçgen (B=90°)
    B = { x: 100, y: 285 };
    C = { x: 450, y: 285 };
    A = { x: 100, y: 80 };
  } else if (v === 'dik_30_60') {
    // 2. 30-60-90 Özel Dik Üçgen (A=30°, B=90°, C=60°)
    B = { x: 130, y: 285 };
    C = { x: 420, y: 285 };
    A = { x: 130, y: 80 };
  } else if (v === 'dik_45_45') {
    // 3. 45-45-90 İkizkenar Dik Üçgen
    B = { x: 150, y: 285 };
    C = { x: 410, y: 285 };
    A = { x: 150, y: 75 };
  } else if (v === 'oklid') {
    // 4. Öklid Bağıntısı (Tepede A=90°, taban BC hipotenüs)
    A = { x: 260, y: 80 };
    B = { x: 90, y: 285 };
    C = { x: 470, y: 285 };
  } else if (v === 'muhtesem_uclu') {
    // 5. Muhteşem Üçlü (B=90°, hipotenüse inen kenarortay)
    B = { x: 110, y: 285 };
    C = { x: 460, y: 285 };
    A = { x: 110, y: 85 };
  } else if (v === 'eskenar') {
    // 6. Eşkenar Üçgen (60°-60°-60°)
    A = { x: 280, y: 70 };
    B = { x: 110, y: 290 };
    C = { x: 450, y: 290 };
  } else if (v === 'ikizkenar') {
    // 7. İkizkenar Üçgen (|AB| = |AC|)
    A = { x: 280, y: 75 };
    B = { x: 95, y: 285 };
    C = { x: 465, y: 285 };
  } else if (v === 'genis') {
    // 8. Geniş Açılı Üçgen (B açısı geniş açı, dış yükseklik)
    A = { x: 120, y: 80 };
    B = { x: 255, y: 280 };
    C = { x: 460, y: 280 };
  } else if (v === 'cesitkenar') {
    // 9. Çeşitkenar / Dar Açılı
    A = { x: 230, y: 75 };
    B = { x: 90, y: 285 };
    C = { x: 465, y: 265 };
  } else if (v === 'aciortay') {
    // 10. İç Açıortaylı Üçgen
    A = { x: 250, y: 75 };
    B = { x: 90, y: 285 };
    C = { x: 465, y: 285 };
  } else if (v === 'kenarortay') {
    // 11. Kenarortaylı Üçgen
    A = { x: 270, y: 75 };
    B = { x: 95, y: 285 };
    C = { x: 465, y: 285 };
  } else if (v === 'benzerlik') {
    // 12. Benzerlik / Thales (DE // BC)
    A = { x: 280, y: 70 };
    B = { x: 95, y: 290 };
    C = { x: 465, y: 290 };
  }

  // Shading if enabled
  if (G.triShade) {
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  // Draw main triangle lines
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.closePath();
  ctx.stroke();

  // 1 & 2 & 3: Standard Right Triangles at B
  if (v === 'dik' || v === 'dik_30_60' || v === 'dik_45_45') {
    drawRightAngleSquare(ctx, B.x, B.y, 16, -16);

    if (v === 'dik_30_60') {
      drawAngleArc(ctx, A, B, C, 32, '30°');
      drawAngleArc(ctx, C, B, A, 32, '60°');
    } else if (v === 'dik_45_45') {
      drawAngleArc(ctx, A, B, C, 30, '45°');
      drawAngleArc(ctx, C, B, A, 30, '45°');
      if (G.triTicks) {
        drawTickMark(ctx, (A.x + B.x) / 2, (A.y + B.y) / 2, 9);
        drawTickMark(ctx, (B.x + C.x) / 2, (B.y + C.y) / 2, 9);
      }
    } else {
      if (G.triAngleC) drawAngleArc(ctx, C, B, A, 30, G.triAngleC);
      if (G.triAngleA) drawAngleArc(ctx, A, B, C, 30, G.triAngleA);
    }
  }

  // 4: Öklid (Right angle at A, altitude [AH] to hypotenuse BC)
  if (v === 'oklid') {
    drawRightAngleSquareAtAngle(ctx, A, B, C, 15);

    const Hpt = { x: A.x, y: 285 };

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(Hpt.x, Hpt.y);
    ctx.stroke();
    ctx.restore();

    drawRightAngleSquare(ctx, Hpt.x, Hpt.y, -14, -14);
    drawMathText(ctx, 'H', Hpt.x, Hpt.y + 18, 14, true);

    drawMathText(ctx, G.oklidH || 'h', Hpt.x + 14, (A.y + Hpt.y) / 2, 13, true, true);
    drawMathText(ctx, G.oklidP || 'p', (B.x + Hpt.x) / 2, Hpt.y + 18, 12, false, true);
    drawMathText(ctx, G.oklidK || 'k', (Hpt.x + C.x) / 2, Hpt.y + 18, 12, false, true);
  }

  // 5: Muhteşem Üçlü (Right angle at B, median [BD] to AC)
  if (v === 'muhtesem_uclu') {
    drawRightAngleSquare(ctx, B.x, B.y, 16, -16);
    const D = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };

    ctx.beginPath();
    ctx.moveTo(B.x, B.y);
    ctx.lineTo(D.x, D.y);
    ctx.stroke();

    drawMathText(ctx, 'D', D.x + 14, D.y - 10, 14, true);

    if (G.triTicks) {
      drawTickMark(ctx, (A.x + D.x) / 2, (A.y + D.y) / 2, 9);
      drawTickMark(ctx, (C.x + D.x) / 2, (C.y + D.y) / 2, 9);
      drawTickMark(ctx, (B.x + D.x) / 2, (B.y + D.y) / 2, 9);
    }
  }

  // 6: Eşkenar Üçgen (60°-60°-60°)
  if (v === 'eskenar') {
    drawAngleArc(ctx, A, B, C, 28, '60°');
    drawAngleArc(ctx, B, A, C, 28, '60°');
    drawAngleArc(ctx, C, B, A, 28, '60°');
    if (G.triTicks) {
      drawTickMark(ctx, (A.x + B.x) / 2, (A.y + B.y) / 2, 9);
      drawTickMark(ctx, (A.x + C.x) / 2, (A.y + C.y) / 2, 9);
      drawTickMark(ctx, (B.x + C.x) / 2, (B.y + C.y) / 2, 9);
    }
  }

  // 7: İkizkenar Üçgen
  if (v === 'ikizkenar') {
    if (G.triTicks) {
      drawDoubleTickMark(ctx, (A.x + B.x) / 2, (A.y + B.y) / 2, 8);
      drawDoubleTickMark(ctx, (A.x + C.x) / 2, (A.y + C.y) / 2, 8);
    }
    if (G.triAngleB) drawAngleArc(ctx, B, A, C, 28, G.triAngleB);
    if (G.triAngleC) drawAngleArc(ctx, C, B, A, 28, G.triAngleC);
  }

  // 8: Geniş Açılı Üçgen (Dış yükseklik)
  if (v === 'genis') {
    drawAngleArc(ctx, B, C, A, 28, G.triAngleB || '120°');

    if (G.triAltitude) {
      const Hpt = { x: A.x, y: B.y };
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(B.x, B.y);
      ctx.lineTo(Hpt.x, Hpt.y);
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(Hpt.x, Hpt.y);
      ctx.stroke();
      ctx.restore();

      drawRightAngleSquare(ctx, Hpt.x, Hpt.y, 14, -14);
      drawMathText(ctx, 'H', Hpt.x - 14, Hpt.y + 14, 14, true);
      drawMathText(ctx, 'h', Hpt.x - 14, (A.y + Hpt.y) / 2, 13, false, true);
    }
  }

  // 10: İç Açıortaylı Üçgen
  if (v === 'aciortay') {
    const cLen = Math.hypot(B.x - A.x, B.y - A.y);
    const bLen = Math.hypot(C.x - A.x, C.y - A.y);
    const ratio = cLen / (cLen + bLen);
    const N = { x: B.x + (C.x - B.x) * ratio, y: 285 };

    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(N.x, N.y);
    ctx.stroke();

    drawMathText(ctx, 'N', N.x, N.y + 18, 14, true);

    drawAngleArcDot(ctx, A, B, N, 30);
    drawAngleArcDot(ctx, A, N, C, 30);

    drawMathText(ctx, G.aciAN || 'n_A', (A.x + N.x) / 2 + 16, (A.y + N.y) / 2, 12, false, true);
    drawMathText(ctx, G.aciBN || 'x', (B.x + N.x) / 2, N.y + 16, 12, false, true);
    drawMathText(ctx, G.aciNC || 'y', (N.x + C.x) / 2, N.y + 16, 12, false, true);
  }

  // 11: Kenarortaylı Üçgen & G
  if (v === 'kenarortay') {
    const D = { x: (B.x + C.x) / 2, y: 285 };

    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(D.x, D.y);
    ctx.stroke();

    drawMathText(ctx, 'D', D.x, D.y + 18, 14, true);

    drawTickMark(ctx, (B.x + D.x) / 2, D.y, 8);
    drawTickMark(ctx, (D.x + C.x) / 2, D.y, 8);

    if (G.showG) {
      const Gpt = { x: A.x + (D.x - A.x) * (2 / 3), y: A.y + (D.y - A.y) * (2 / 3) };
      ctx.beginPath();
      ctx.arc(Gpt.x, Gpt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
      drawMathText(ctx, 'G', Gpt.x + 16, Gpt.y - 6, 14, true);
    }
  }

  // 12: Benzerlik / Thales (DE // BC)
  if (v === 'benzerlik') {
    const r = 0.55;
    const D = { x: A.x + (B.x - A.x) * r, y: A.y + (B.y - A.y) * r };
    const E = { x: A.x + (C.x - A.x) * r, y: A.y + (C.y - A.y) * r };

    ctx.beginPath();
    ctx.moveTo(D.x, D.y);
    ctx.lineTo(E.x, E.y);
    ctx.stroke();

    drawParallelArrow(ctx, (D.x + E.x) / 2, D.y, 1);
    drawParallelArrow(ctx, (B.x + C.x) / 2, B.y, 1);

    drawMathText(ctx, 'D', D.x - 16, D.y, 14, true);
    drawMathText(ctx, 'E', E.x + 16, E.y, 14, true);

    if (G.benAD) drawMathText(ctx, G.benAD, (A.x + D.x) / 2 - 16, (A.y + D.y) / 2, 12, false, true);
    if (G.benDB) drawMathText(ctx, G.benDB, (D.x + B.x) / 2 - 16, (D.y + B.y) / 2, 12, false, true);
    if (G.benDE) drawMathText(ctx, G.benDE, (D.x + E.x) / 2, D.y - 12, 13, true, true);
    if (G.benAE) drawMathText(ctx, G.benAE, (A.x + E.x) / 2 + 16, (A.y + E.y) / 2, 12, false, true);
    if (G.benEC) drawMathText(ctx, G.benEC, (E.x + C.x) / 2 + 16, (E.y + C.y) / 2, 12, false, true);
  }

  // Standard Altitude for other triangles if enabled
  if (G.triAltitude && ['ikizkenar', 'eskenar', 'cesitkenar'].includes(v)) {
    const Hpt = { x: A.x, y: 285 };
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(Hpt.x, Hpt.y);
    ctx.stroke();
    ctx.restore();

    drawRightAngleSquare(ctx, Hpt.x, Hpt.y, -14, -14);
    drawMathText(ctx, 'H', Hpt.x, Hpt.y + 18, 14, true);
    drawMathText(ctx, 'h', Hpt.x + 12, (A.y + Hpt.y) / 2, 13, false, true);
  }

  // Vertex Labels A, B, C
  drawMathText(ctx, G.triVertexA, A.x, A.y - 14, 16, true);
  drawMathText(ctx, G.triVertexB, B.x - 18, B.y + 14, 16, true);
  drawMathText(ctx, G.triVertexC, C.x + 18, C.y + 14, 16, true);

  // Standard Side Labels if applicable
  if (!['oklid', 'benzerlik'].includes(v)) {
    if (G.triSideAB) {
      const midAB = { x: (A.x + B.x) / 2 - 20, y: (A.y + B.y) / 2 };
      drawMathText(ctx, G.triSideAB, midAB.x, midAB.y, 13, false, true);
    }
    if (G.triSideBC) {
      const midBC = { x: (B.x + C.x) / 2, y: B.y + 22 };
      drawMathText(ctx, G.triSideBC, midBC.x, midBC.y, 13, false, true);
    }
    if (G.triSideAC) {
      const midAC = { x: (A.x + C.x) / 2 + 18, y: (A.y + C.y) / 2 };
      drawMathText(ctx, G.triSideAC, midAC.x, midAC.y, 13, false, true);
    }
  }
}

function drawCircle(ctx, W, H, strokeColor, fillColor, arcColor, labelColor) {
  const O = { x: W / 2, y: H / 2 };
  const R = 120;
  const cv = G.circleVariant;
  const angRad = (G.circleAngle * Math.PI) / 180;

  if (cv === 'merkez_aci') {
    if (G.circleShade) {
      ctx.beginPath();
      ctx.moveTo(O.x, O.y);
      ctx.arc(O.x, O.y, R, 0, -angRad, true);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(O.x, O.y, R, 0, Math.PI * 2);
    ctx.stroke();

    drawDot(ctx, O.x, O.y);
    drawMathText(ctx, G.circleCenter, O.x - 18, O.y - 10, 15, true);

    const ptA = { x: O.x + R, y: O.y };
    const ptB = { x: O.x + R * Math.cos(-angRad), y: O.y + R * Math.sin(-angRad) };

    ctx.beginPath();
    ctx.moveTo(O.x, O.y);
    ctx.lineTo(ptA.x, ptA.y);
    ctx.moveTo(O.x, O.y);
    ctx.lineTo(ptB.x, ptB.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(O.x, O.y, 36, 0, -angRad, true);
    ctx.strokeStyle = arcColor;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.4;

    const midAng = -angRad / 2;
    const lx = O.x + 54 * Math.cos(midAng);
    const ly = O.y + 54 * Math.sin(midAng);
    drawMathText(ctx, G.circleAngleLabel || (G.circleAngle + '°'), lx, ly, 13, false, true);

    drawMathText(ctx, 'A', ptA.x + 14, ptA.y, 14, true);
    drawMathText(ctx, 'B', ptB.x + 12 * Math.cos(-angRad), ptB.y + 12 * Math.sin(-angRad), 14, true);

    if (G.circleRadius) drawMathText(ctx, G.circleRadius, O.x + R / 2, O.y + 18, 12, false, true);
  } else if (cv === 'cevre_aci') {
    ctx.beginPath();
    ctx.arc(O.x, O.y, R, 0, Math.PI * 2);
    ctx.stroke();

    drawDot(ctx, O.x, O.y);
    drawMathText(ctx, G.circleCenter, O.x - 14, O.y + 16, 14, true);

    const pAng = Math.PI * 0.85;
    const P = { x: O.x + R * Math.cos(pAng), y: O.y - R * Math.sin(pAng) };
    const A = { x: O.x + R * Math.cos(0.15), y: O.y - R * Math.sin(0.15) };
    const B = { x: O.x + R * Math.cos(-0.65), y: O.y - R * Math.sin(-0.65) };

    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(P.x, P.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();

    ctx.save();
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(O.x, O.y, R, -0.15, 0.65, false);
    ctx.stroke();
    ctx.restore();

    drawAngleArc(ctx, P, A, B, 32, G.circleAngleLabel || '35°');
    drawMathText(ctx, 'P', P.x - 16, P.y - 12, 14, true);
    drawMathText(ctx, 'A', A.x + 14, A.y, 14, true);
    drawMathText(ctx, 'B', B.x + 14, B.y + 10, 14, true);
    drawMathText(ctx, 'Yay: 2α', O.x + R + 24, O.y, 12, true, true);
  } else if (cv === 'kiris_teget') {
    ctx.beginPath();
    ctx.arc(O.x, O.y, R, 0, Math.PI * 2);
    ctx.stroke();

    drawDot(ctx, O.x, O.y);
    drawMathText(ctx, G.circleCenter, O.x - 14, O.y - 12, 14, true);

    const T = { x: O.x, y: O.y + R };
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(O.x, O.y);
    ctx.lineTo(T.x, T.y);
    ctx.stroke();
    ctx.restore();

    drawRightAngleSquare(ctx, T.x, T.y, 14, -14);

    ctx.beginPath();
    ctx.moveTo(T.x - 130, T.y);
    ctx.lineTo(T.x + 130, T.y);
    ctx.stroke();
    drawMathText(ctx, 't (teğet)', T.x + 150, T.y + 5, 12, true);
    drawMathText(ctx, 'T', T.x - 14, T.y + 16, 14, true);

    const A = { x: O.x - R * 0.8, y: O.y - R * 0.6 };
    const B = { x: O.x + R * 0.8, y: O.y - R * 0.6 };
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();

    drawMathText(ctx, 'A', A.x - 16, A.y - 10, 14, true);
    drawMathText(ctx, 'B', B.x + 16, B.y - 10, 14, true);
    drawMathText(ctx, '[AB] kirişi', O.x, A.y - 14, 12, false, true);
  } else if (cv === 'cap_aci') {
    ctx.beginPath();
    ctx.arc(O.x, O.y, R, 0, Math.PI * 2);
    ctx.stroke();

    const A = { x: O.x - R, y: O.y };
    const B = { x: O.x + R, y: O.y };

    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();

    drawDot(ctx, O.x, O.y);
    drawMathText(ctx, 'O', O.x, O.y + 16, 14, true);

    const C = { x: O.x + R * Math.cos(Math.PI * 0.65), y: O.y - R * Math.sin(Math.PI * 0.65) };

    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();

    drawRightAngleSquareAtAngle(ctx, C, A, B, 14);

    drawMathText(ctx, 'A', A.x - 16, A.y, 14, true);
    drawMathText(ctx, 'B', B.x + 16, B.y, 14, true);
    drawMathText(ctx, 'C', C.x, C.y - 16, 14, true);
    drawMathText(ctx, 'Çapı gören çevre açı 90°', W / 2, 35, 13, true, true);
  }
}

function drawQuad(ctx, W, H, strokeColor, fillColor, arcColor, labelColor) {
  const v = G.quadVariant;
  let A, B, C, D;

  if (v === 'kare') {
    const s = 190;
    A = { x: (W - s) / 2, y: (H - s) / 2 };
    B = { x: (W - s) / 2, y: (H + s) / 2 };
    C = { x: (W + s) / 2, y: (H + s) / 2 };
    D = { x: (W + s) / 2, y: (H - s) / 2 };
  } else if (v === 'dikdortgen') {
    const w = 300, h = 180;
    A = { x: (W - w) / 2, y: (H - h) / 2 };
    B = { x: (W - w) / 2, y: (H + h) / 2 };
    C = { x: (W + w) / 2, y: (H + h) / 2 };
    D = { x: (W + w) / 2, y: (H - h) / 2 };
  } else if (v === 'paralelkenar') {
    A = { x: 170, y: 95 };
    B = { x: 100, y: 285 };
    C = { x: 410, y: 285 };
    D = { x: 480, y: 95 };
  } else if (v === 'yamuk') {
    A = { x: 180, y: 95 };
    B = { x: 90, y: 285 };
    C = { x: 470, y: 285 };
    D = { x: 380, y: 95 };
  } else if (v === 'dik_yamuk') {
    A = { x: 120, y: 95 };
    B = { x: 120, y: 285 };
    C = { x: 460, y: 285 };
    D = { x: 370, y: 95 };
  } else if (v === 'eskenar_dortgen') {
    A = { x: W / 2, y: 75 };
    B = { x: 110, y: H / 2 };
    C = { x: W / 2, y: 305 };
    D = { x: 450, y: H / 2 };
  } else if (v === 'deltoid') {
    A = { x: W / 2, y: 70 };
    B = { x: 130, y: 190 };
    C = { x: W / 2, y: 310 };
    D = { x: 430, y: 190 };
  }

  if (G.quadShade) {
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.lineTo(D.x, D.y);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.lineTo(D.x, D.y);
  ctx.closePath();
  ctx.stroke();

  if (v === 'dikdortgen' || v === 'kare') {
    drawRightAngleSquare(ctx, A.x, A.y, 14, 14);
    drawRightAngleSquare(ctx, B.x, B.y, 14, -14);
    drawRightAngleSquare(ctx, C.x, C.y, -14, -14);
    drawRightAngleSquare(ctx, D.x, D.y, -14, 14);
  } else if (v === 'dik_yamuk') {
    drawRightAngleSquare(ctx, A.x, A.y, 14, 14);
    drawRightAngleSquare(ctx, B.x, B.y, 14, -14);
  }

  if (v === 'eskenar_dortgen' || v === 'deltoid') {
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.moveTo(B.x, B.y);
    ctx.lineTo(D.x, D.y);
    ctx.stroke();
    ctx.restore();
    drawRightAngleSquare(ctx, W / 2, (v === 'deltoid' ? 190 : H / 2), 12, 12);
  }

  if (G.quadDiagonals && v !== 'eskenar_dortgen' && v !== 'deltoid') {
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.moveTo(B.x, B.y);
    ctx.lineTo(D.x, D.y);
    ctx.stroke();
    ctx.restore();
  }

  drawMathText(ctx, G.quadVertexA, A.x - 16, A.y - 12, 15, true);
  drawMathText(ctx, G.quadVertexB, B.x - 16, B.y + 16, 15, true);
  drawMathText(ctx, G.quadVertexC, C.x + 16, C.y + 16, 15, true);
  drawMathText(ctx, G.quadVertexD, D.x + 16, D.y - 12, 15, true);

  if (G.quadSideAB) drawMathText(ctx, G.quadSideAB, (A.x + B.x) / 2 - 24, (A.y + B.y) / 2, 13, false, true);
  if (G.quadSideBC) drawMathText(ctx, G.quadSideBC, (B.x + C.x) / 2, B.y + 20, 13, false, true);
  if (G.quadSideCD) drawMathText(ctx, G.quadSideCD, (C.x + D.x) / 2 + 24, (C.y + D.y) / 2, 13, false, true);
  if (G.quadSideDA) drawMathText(ctx, G.quadSideDA, (D.x + A.x) / 2, A.y - 16, 13, false, true);
}

function drawParallel(ctx, W, H, strokeColor, fillColor, arcColor, labelColor) {
  const pv = G.parVariant;
  const y1 = 120;
  const y2 = 260;
  const xLeft = 60;
  const xRight = 480;

  if (pv === 'z_kurali') {
    ctx.beginPath();
    ctx.moveTo(xLeft, y1);
    ctx.lineTo(xRight, y1);
    ctx.stroke();
    drawParallelArrow(ctx, xRight - 40, y1, 1);
    drawMathText(ctx, G.parLine1, xRight + 16, y1 + 4, 14, true);

    ctx.beginPath();
    ctx.moveTo(xLeft, y2);
    ctx.lineTo(xRight, y2);
    ctx.stroke();
    drawParallelArrow(ctx, xRight - 40, y2, 1);
    drawMathText(ctx, G.parLine2, xRight + 16, y2 + 4, 14, true);

    const tA = { x: 180, y: y1 };
    const tB = { x: 360, y: y2 };
    ctx.beginPath();
    ctx.moveTo(tA.x, tA.y);
    ctx.lineTo(tB.x, tB.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(tA.x, tA.y, 32, 0, Math.atan2(tB.y - tA.y, tB.x - tA.x), false);
    ctx.strokeStyle = arcColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.4;
    drawMathText(ctx, G.parAngle1 || 'α', tA.x + 44, tA.y + 16, 13, true, true);

    ctx.beginPath();
    ctx.arc(tB.x, tB.y, 32, Math.PI, Math.PI + Math.atan2(tA.y - tB.y, tA.x - tB.x), false);
    ctx.strokeStyle = arcColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.4;
    drawMathText(ctx, G.parAngle2 || 'x', tB.x - 44, tB.y - 16, 13, true, true);

    drawMathText(ctx, `${G.parLine1} // ${G.parLine2} (İç Ters Açılar: α = x)`, W / 2, 45, 13, true, true);
  } else if (pv === 'u_kurali') {
    ctx.beginPath();
    ctx.moveTo(xLeft, y1);
    ctx.lineTo(xRight, y1);
    ctx.moveTo(xLeft, y2);
    ctx.lineTo(xRight, y2);
    ctx.stroke();

    drawParallelArrow(ctx, xRight - 40, y1, 1);
    drawParallelArrow(ctx, xRight - 40, y2, 1);
    drawMathText(ctx, G.parLine1, xRight + 16, y1 + 4, 14, true);
    drawMathText(ctx, G.parLine2, xRight + 16, y2 + 4, 14, true);

    const tA = { x: 260, y: y1 };
    const tB = { x: 260, y: y2 };
    ctx.beginPath();
    ctx.moveTo(tA.x, tA.y);
    ctx.lineTo(tB.x, tB.y);
    ctx.stroke();

    drawAngleArc(ctx, tA, { x: tA.x + 60, y: tA.y }, tB, 30, G.parAngle1 || '120°');
    drawAngleArc(ctx, tB, tA, { x: tB.x + 60, y: tB.y }, 30, G.parAngle2 || 'x');

    drawMathText(ctx, `${G.parLine1} // ${G.parLine2} (U Kuralı: a + b = 180°)`, W / 2, 45, 13, true, true);
  } else if (pv === 'm_kurali') {
    ctx.beginPath();
    ctx.moveTo(xLeft, y1);
    ctx.lineTo(xRight, y1);
    ctx.moveTo(xLeft, y2);
    ctx.lineTo(xRight, y2);
    ctx.stroke();

    drawParallelArrow(ctx, xRight - 40, y1, 1);
    drawParallelArrow(ctx, xRight - 40, y2, 1);
    drawMathText(ctx, G.parLine1, xRight + 16, y1 + 4, 14, true);
    drawMathText(ctx, G.parLine2, xRight + 16, y2 + 4, 14, true);

    const P1 = { x: 160, y: y1 };
    const V = { x: 330, y: (y1 + y2) / 2 };
    const P2 = { x: 160, y: y2 };

    ctx.beginPath();
    ctx.moveTo(P1.x, P1.y);
    ctx.lineTo(V.x, V.y);
    ctx.lineTo(P2.x, P2.y);
    ctx.stroke();

    drawAngleArc(ctx, P1, { x: P1.x + 60, y: y1 }, V, 30, G.parMAngA || '40°');
    drawAngleArc(ctx, P2, V, { x: P2.x + 60, y: y2 }, 30, G.parMAngB || '35°');
    drawAngleArc(ctx, V, P2, P1, 32, G.parMAngX || 'x');

    drawMathText(ctx, `${G.parLine1} // ${G.parLine2} (M Kuralı: x = a + b)`, W / 2, 45, 13, true, true);
  } else if (pv === 'yondes') {
    ctx.beginPath();
    ctx.moveTo(xLeft, y1);
    ctx.lineTo(xRight, y1);
    ctx.moveTo(xLeft, y2);
    ctx.lineTo(xRight, y2);
    ctx.stroke();

    drawParallelArrow(ctx, xRight - 40, y1, 1);
    drawParallelArrow(ctx, xRight - 40, y2, 1);
    drawMathText(ctx, G.parLine1, xRight + 16, y1 + 4, 14, true);
    drawMathText(ctx, G.parLine2, xRight + 16, y2 + 4, 14, true);

    ctx.beginPath();
    ctx.moveTo(150, 60);
    ctx.lineTo(380, 320);
    ctx.stroke();

    const t1 = { x: 150 + (230 * (y1 - 60)) / 260, y: y1 };
    const t2 = { x: 150 + (230 * (y2 - 60)) / 260, y: y2 };

    drawAngleArc(ctx, t1, { x: t1.x + 60, y: y1 }, { x: 380, y: 320 }, 30, G.parAngle1 || '65°');
    drawAngleArc(ctx, t2, { x: t2.x + 60, y: y2 }, { x: 380, y: 320 }, 30, G.parAngle2 || 'x');

    drawMathText(ctx, `${G.parLine1} // ${G.parLine2} (Yöndeş Açılar: a = b)`, W / 2, 35, 13, true, true);
  }
}

function drawDot(ctx, x, y, r = 3.5) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
}

function drawRightAngleSquare(ctx, x, y, dx, dy) {
  ctx.save();
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(x + dx, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.lineTo(x, y + dy);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + dx / 2, y + dy / 2, 1.8, 0, Math.PI * 2);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
  ctx.restore();
}

function drawRightAngleSquareAtAngle(ctx, V, P1, P2, s = 14) {
  const a1 = Math.atan2(P1.y - V.y, P1.x - V.x);
  const a2 = Math.atan2(P2.y - V.y, P2.x - V.x);
  const v1 = { x: Math.cos(a1) * s, y: Math.sin(a1) * s };
  const v2 = { x: Math.cos(a2) * s, y: Math.sin(a2) * s };

  ctx.save();
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(V.x + v1.x, V.y + v1.y);
  ctx.lineTo(V.x + v1.x + v2.x, V.y + v1.y + v2.y);
  ctx.lineTo(V.x + v2.x, V.y + v2.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(V.x + (v1.x + v2.x) / 2, V.y + (v1.y + v2.y) / 2, 1.8, 0, Math.PI * 2);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
  ctx.restore();
}

function drawAngleArc(ctx, V, P1, P2, r, label) {
  const ang1 = Math.atan2(P1.y - V.y, P1.x - V.x);
  const ang2 = Math.atan2(P2.y - V.y, P2.x - V.x);
  let diff = ang2 - ang1;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;

  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.8;
  ctx.arc(V.x, V.y, r, ang1, ang1 + diff, diff < 0);
  ctx.stroke();

  if (label) {
    const midAng = ang1 + diff / 2;
    const lx = V.x + (r + 14) * Math.cos(midAng);
    const ly = V.y + (r + 14) * Math.sin(midAng);
    drawMathText(ctx, label, lx, ly, 12, false, true);
  }
  ctx.restore();
}

function drawAngleArcDot(ctx, V, P1, P2, r) {
  const ang1 = Math.atan2(P1.y - V.y, P1.x - V.x);
  const ang2 = Math.atan2(P2.y - V.y, P2.x - V.x);
  let diff = ang2 - ang1;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;

  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.8;
  ctx.arc(V.x, V.y, r, ang1, ang1 + diff, diff < 0);
  ctx.stroke();

  const midAng = ang1 + diff / 2;
  const lx = V.x + (r - 10) * Math.cos(midAng);
  const ly = V.y + (r - 10) * Math.sin(midAng);
  ctx.beginPath();
  ctx.arc(lx, ly, 2.2, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.restore();
}

function drawTickMark(ctx, x, y, len) {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - len / 2, y - len / 2);
  ctx.lineTo(x + len / 2, y + len / 2);
  ctx.stroke();
  ctx.restore();
}

function drawDoubleTickMark(ctx, x, y, len) {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - len / 2 - 2, y - len / 2);
  ctx.lineTo(x + len / 2 - 2, y + len / 2);
  ctx.moveTo(x - len / 2 + 2, y - len / 2);
  ctx.lineTo(x + len / 2 + 2, y + len / 2);
  ctx.stroke();
  ctx.restore();
}

function drawParallelArrow(ctx, x, y, dir = 1) {
  ctx.save();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 7 * dir, y - 5);
  ctx.lineTo(x - 7 * dir, y + 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawMathText(ctx, text, x, y, size = 14, isBold = false, isItalic = false) {
  if (!text) return;
  ctx.save();
  let fontStr = '';
  if (isItalic) fontStr += 'italic ';
  if (isBold) fontStr += 'bold ';
  fontStr += `${size}px "Noto Sans", "Times New Roman", serif`;
  ctx.font = fontStr;
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function exportGeometryAsPNG() {
  const canvas = $('geoCanvas');
  if (!canvas) return null;
  return canvas.toDataURL('image/png');
}

export function initGeometryDrawer() {
  document.querySelectorAll('[data-geo-shape]').forEach(btn => {
    btn.onclick = () => {
      activeShape = btn.dataset.geoShape;
      syncControlsFromState();
      renderGeometryCanvas();
    };
  });

  const triVar = $('geoTriVariant');
  if (triVar) {
    triVar.onchange = (e) => {
      G.triangleVariant = e.target.value;
      if (G.triangleVariant === 'dik_30_60') {
        G.triAngleA = '30°'; G.triAngleB = '90°'; G.triAngleC = '60°';
      } else if (G.triangleVariant === 'dik_45_45') {
        G.triAngleA = '45°'; G.triAngleB = '90°'; G.triAngleC = '45°';
      } else if (G.triangleVariant === 'eskenar') {
        G.triAngleA = '60°'; G.triAngleB = '60°'; G.triAngleC = '60°';
      } else if (G.triangleVariant === 'genis') {
        G.triAngleB = '120°';
      }
      syncControlsFromState();
      renderGeometryCanvas();
    };
  }

  const triInputs = [
    'geoTriVA', 'geoTriVB', 'geoTriVC', 'geoTriSAB', 'geoTriSBC', 'geoTriSAC',
    'geoTriAngA', 'geoTriAngB', 'geoTriAngC', 'geoTriOklidH', 'geoTriOklidP',
    'geoTriOklidK', 'geoTriAciAN', 'geoTriAciBN', 'geoTriAciNC', 'geoTriMedAD',
    'geoTriBenAD', 'geoTriBenDB', 'geoTriBenDE', 'geoTriBenAE', 'geoTriBenEC'
  ];
  triInputs.forEach(id => {
    const el = $(id);
    if (el) {
      el.oninput = () => {
        G.triVertexA = $('geoTriVA') ? $('geoTriVA').value : 'A';
        G.triVertexB = $('geoTriVB') ? $('geoTriVB').value : 'B';
        G.triVertexC = $('geoTriVC') ? $('geoTriVC').value : 'C';
        G.triSideAB = $('geoTriSAB') ? $('geoTriSAB').value : '';
        G.triSideBC = $('geoTriSBC') ? $('geoTriSBC').value : '';
        G.triSideAC = $('geoTriSAC') ? $('geoTriSAC').value : '';
        G.triAngleA = $('geoTriAngA') ? $('geoTriAngA').value : '';
        G.triAngleB = $('geoTriAngB') ? $('geoTriAngB').value : '';
        G.triAngleC = $('geoTriAngC') ? $('geoTriAngC').value : '';
        G.oklidH = $('geoTriOklidH') ? $('geoTriOklidH').value : '';
        G.oklidP = $('geoTriOklidP') ? $('geoTriOklidP').value : '';
        G.oklidK = $('geoTriOklidK') ? $('geoTriOklidK').value : '';
        G.aciAN = $('geoTriAciAN') ? $('geoTriAciAN').value : '';
        G.aciBN = $('geoTriAciBN') ? $('geoTriAciBN').value : '';
        G.aciNC = $('geoTriAciNC') ? $('geoTriAciNC').value : '';
        G.medAD = $('geoTriMedAD') ? $('geoTriMedAD').value : '';
        G.benAD = $('geoTriBenAD') ? $('geoTriBenAD').value : '';
        G.benDB = $('geoTriBenDB') ? $('geoTriBenDB').value : '';
        G.benDE = $('geoTriBenDE') ? $('geoTriBenDE').value : '';
        G.benAE = $('geoTriBenAE') ? $('geoTriBenAE').value : '';
        G.benEC = $('geoTriBenEC') ? $('geoTriBenEC').value : '';
        renderGeometryCanvas();
      };
    }
  });

  if ($('geoTriAltitude')) $('geoTriAltitude').onchange = (e) => { G.triAltitude = e.target.checked; renderGeometryCanvas(); };
  if ($('geoTriShade')) $('geoTriShade').onchange = (e) => { G.triShade = e.target.checked; renderGeometryCanvas(); };
  if ($('geoTriTicks')) $('geoTriTicks').onchange = (e) => { G.triTicks = e.target.checked; renderGeometryCanvas(); };
  if ($('geoTriShowG')) $('geoTriShowG').onchange = (e) => { G.showG = e.target.checked; renderGeometryCanvas(); };

  const cirVar = $('geoCirVariant');
  if (cirVar) {
    cirVar.onchange = (e) => {
      G.circleVariant = e.target.value;
      syncControlsFromState();
      renderGeometryCanvas();
    };
  }

  ['geoCirCenter', 'geoCirRadius', 'geoCirAngleLbl'].forEach(id => {
    const el = $(id);
    if (el) {
      el.oninput = () => {
        G.circleCenter = $('geoCirCenter').value;
        G.circleRadius = $('geoCirRadius').value;
        G.circleAngleLabel = $('geoCirAngleLbl').value;
        renderGeometryCanvas();
      };
    }
  });

  const cirAngle = $('geoCirAngleRange');
  if (cirAngle) {
    cirAngle.oninput = (e) => {
      G.circleAngle = parseInt(e.target.value, 10);
      if ($('geoCirAngleVal')) $('geoCirAngleVal').textContent = G.circleAngle + '°';
      if (!G.circleAngleLabel || G.circleAngleLabel.endsWith('°')) {
        G.circleAngleLabel = G.circleAngle + '°';
        if ($('geoCirAngleLbl')) $('geoCirAngleLbl').value = G.circleAngleLabel;
      }
      renderGeometryCanvas();
    };
  }
  if ($('geoCirSector')) $('geoCirSector').onchange = (e) => { G.circleSector = e.target.checked; renderGeometryCanvas(); };
  if ($('geoCirShade')) $('geoCirShade').onchange = (e) => { G.circleShade = e.target.checked; renderGeometryCanvas(); };
  if ($('geoCirChord')) $('geoCirChord').onchange = (e) => { G.circleChord = e.target.checked; renderGeometryCanvas(); };
  if ($('geoCirTangent')) $('geoCirTangent').onchange = (e) => { G.circleTangent = e.target.checked; renderGeometryCanvas(); };

  const quadVar = $('geoQuadVariant');
  if (quadVar) {
    quadVar.onchange = (e) => {
      G.quadVariant = e.target.value;
      syncControlsFromState();
      renderGeometryCanvas();
    };
  }

  ['geoQuadVA', 'geoQuadVB', 'geoQuadVC', 'geoQuadVD', 'geoQuadSAB', 'geoQuadSBC', 'geoQuadSCD', 'geoQuadSDA'].forEach(id => {
    const el = $(id);
    if (el) {
      el.oninput = () => {
        G.quadVertexA = $('geoQuadVA').value;
        G.quadVertexB = $('geoQuadVB').value;
        G.quadVertexC = $('geoQuadVC').value;
        G.quadVertexD = $('geoQuadVD').value;
        G.quadSideAB = $('geoQuadSAB').value;
        G.quadSideBC = $('geoQuadSBC').value;
        G.quadSideCD = $('geoQuadSCD') ? $('geoQuadSCD').value : '';
        G.quadSideDA = $('geoQuadSDA') ? $('geoQuadSDA').value : '';
        renderGeometryCanvas();
      };
    }
  });

  if ($('geoQuadDiagonals')) $('geoQuadDiagonals').onchange = (e) => { G.quadDiagonals = e.target.checked; renderGeometryCanvas(); };
  if ($('geoQuadShade')) $('geoQuadShade').onchange = (e) => { G.quadShade = e.target.checked; renderGeometryCanvas(); };
  if ($('geoQuadAltitude')) $('geoQuadAltitude').onchange = (e) => { G.quadAltitude = e.target.checked; renderGeometryCanvas(); };

  const parVar = $('geoParVariant');
  if (parVar) {
    parVar.onchange = (e) => {
      G.parVariant = e.target.value;
      syncControlsFromState();
      renderGeometryCanvas();
    };
  }

  ['geoParAng1', 'geoParAng2', 'geoParL1', 'geoParL2', 'geoParMAngA', 'geoParMAngX', 'geoParMAngB'].forEach(id => {
    const el = $(id);
    if (el) {
      el.oninput = () => {
        G.parAngle1 = $('geoParAng1').value;
        G.parAngle2 = $('geoParAng2').value;
        G.parLine1 = $('geoParL1').value;
        G.parLine2 = $('geoParL2').value;
        G.parMAngA = $('geoParMAngA') ? $('geoParMAngA').value : '40°';
        G.parMAngX = $('geoParMAngX') ? $('geoParMAngX').value : 'x';
        G.parMAngB = $('geoParMAngB') ? $('geoParMAngB').value : '35°';
        renderGeometryCanvas();
      };
    }
  });

  const closeBtn = $('geoModalClose');
  if (closeBtn) closeBtn.onclick = () => closeModal('geoModal');
  const cancelBtn = $('geoModalCancel');
  if (cancelBtn) cancelBtn.onclick = () => closeModal('geoModal');

  const insertBtn = $('geoInsertBtn');
  if (insertBtn) {
    insertBtn.onclick = () => {
      const dataUrl = exportGeometryAsPNG();
      if (dataUrl && typeof onInsertCallback === 'function') {
        onInsertCallback(dataUrl);
      }
      closeModal('geoModal');
    };
  }
}

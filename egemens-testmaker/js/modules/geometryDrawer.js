import { $, openModal, closeModal } from '../utils.js';

let activeShape = 'triangle';
let onInsertCallback = null;

// Geometry configuration state
const G = {
  // Triangle
  triangleVariant: 'dik', // 'cesitkenar', 'dik', 'ikizkenar', 'eskenar'
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

  // Circle
  circleCenter: 'O',
  circleRadius: 'r = 6 cm',
  circleAngle: 60,
  circleAngleLabel: '60°',
  circleSector: true,
  circleShade: true,
  circleChord: false,
  circleTangent: false,

  // Quadrilateral
  quadVariant: 'dikdortgen', // 'dikdortgen', 'kare', 'paralelkenar', 'yamuk'
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

  // Parallel lines & angles
  parAngle1: '120°',
  parAngle2: 'x',
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

function syncControlsFromState() {
  // Shape tabs
  document.querySelectorAll('[data-geo-shape]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.geoShape === activeShape);
  });

  // Panels
  if ($('geoTrianglePanel')) $('geoTrianglePanel').classList.toggle('hidden', activeShape !== 'triangle');
  if ($('geoCirclePanel')) $('geoCirclePanel').classList.toggle('hidden', activeShape !== 'circle');
  if ($('geoQuadPanel')) $('geoQuadPanel').classList.toggle('hidden', activeShape !== 'quad');
  if ($('geoParallelPanel')) $('geoParallelPanel').classList.toggle('hidden', activeShape !== 'parallel');

  // Triangle fields
  if ($('geoTriVariant')) $('geoTriVariant').value = G.triangleVariant;
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

  // Circle fields
  if ($('geoCirCenter')) $('geoCirCenter').value = G.circleCenter;
  if ($('geoCirRadius')) $('geoCirRadius').value = G.circleRadius;
  if ($('geoCirAngleRange')) $('geoCirAngleRange').value = G.circleAngle;
  if ($('geoCirAngleVal')) $('geoCirAngleVal').textContent = G.circleAngle + '°';
  if ($('geoCirAngleLbl')) $('geoCirAngleLbl').value = G.circleAngleLabel;
  if ($('geoCirSector')) $('geoCirSector').checked = G.circleSector;
  if ($('geoCirShade')) $('geoCirShade').checked = G.circleShade;
  if ($('geoCirChord')) $('geoCirChord').checked = G.circleChord;
  if ($('geoCirTangent')) $('geoCirTangent').checked = G.circleTangent;

  // Quad fields
  if ($('geoQuadVariant')) $('geoQuadVariant').value = G.quadVariant;
  if ($('geoQuadVA')) $('geoQuadVA').value = G.quadVertexA;
  if ($('geoQuadVB')) $('geoQuadVB').value = G.quadVertexB;
  if ($('geoQuadVC')) $('geoQuadVC').value = G.quadVertexC;
  if ($('geoQuadVD')) $('geoQuadVD').value = G.quadVertexD;
  if ($('geoQuadSAB')) $('geoQuadSAB').value = G.quadSideAB;
  if ($('geoQuadSBC')) $('geoQuadSBC').value = G.quadSideBC;
  if ($('geoQuadDiagonals')) $('geoQuadDiagonals').checked = G.quadDiagonals;
  if ($('geoQuadShade')) $('geoQuadShade').checked = G.quadShade;

  // Parallel fields
  if ($('geoParAng1')) $('geoParAng1').value = G.parAngle1;
  if ($('geoParAng2')) $('geoParAng2').value = G.parAngle2;
  if ($('geoParL1')) $('geoParL1').value = G.parLine1;
  if ($('geoParL2')) $('geoParL2').value = G.parLine2;
}

export function renderGeometryCanvas() {
  const canvas = $('geoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = 2;
  const width = 460;
  const height = 340;

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
  let A, B, C;
  const v = G.triangleVariant;

  if (v === 'dik') {
    // Right triangle at B: B is (80, 260), C is (370, 260), A is (80, 70)
    B = { x: 90, y: 260 };
    C = { x: 380, y: 260 };
    A = { x: 90, y: 70 };
  } else if (v === 'ikizkenar') {
    // Isosceles: Apex A at top center, B and C at bottom
    A = { x: 235, y: 65 };
    B = { x: 80, y: 260 };
    C = { x: 390, y: 260 };
  } else if (v === 'eskenar') {
    // Equilateral: A at top center, side 280
    A = { x: 235, y: 60 };
    B = { x: 95, y: 265 };
    C = { x: 375, y: 265 };
  } else {
    // Scalene
    A = { x: 190, y: 65 };
    B = { x: 70, y: 260 };
    C = { x: 400, y: 240 };
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

  // Altitude line [AH]
  if (G.triAltitude && v !== 'dik') {
    const Hpt = { x: A.x, y: 260 };
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(Hpt.x, Hpt.y);
    ctx.stroke();
    ctx.restore();

    // Right angle mark at H
    drawRightAngleSquare(ctx, Hpt.x, Hpt.y, -14, -14);

    // Label H
    drawMathText(ctx, 'H', Hpt.x - 4, Hpt.y + 18, 13, true);
    drawMathText(ctx, 'h', Hpt.x + 6, (A.y + Hpt.y) / 2, 13, false, true);
  }

  // Right angle symbol at B if right triangle
  if (v === 'dik') {
    drawRightAngleSquare(ctx, B.x, B.y, 16, -16);
  }

  // Angle arc for C
  if (G.triAngleC) {
    drawAngleArc(ctx, C, B, A, 30, G.triAngleC);
  }

  // Angle arc for A
  if (G.triAngleA) {
    drawAngleArc(ctx, A, C, B, 30, G.triAngleA);
  }

  // Angle arc for B if not right
  if (v !== 'dik' && G.triAngleB) {
    drawAngleArc(ctx, B, A, C, 30, G.triAngleB);
  }

  // Side tick marks for isosceles / equilateral
  if (v === 'ikizkenar') {
    drawTickMark(ctx, (A.x + B.x) / 2, (A.y + B.y) / 2, 8);
    drawTickMark(ctx, (A.x + C.x) / 2, (A.y + C.y) / 2, 8);
  } else if (v === 'eskenar') {
    drawTickMark(ctx, (A.x + B.x) / 2, (A.y + B.y) / 2, 8);
    drawTickMark(ctx, (A.x + C.x) / 2, (A.y + C.y) / 2, 8);
    drawTickMark(ctx, (B.x + C.x) / 2, (B.y + C.y) / 2, 8);
  }

  // Vertex Labels
  drawMathText(ctx, G.triVertexA, A.x - 5, A.y - 12, 16, true);
  drawMathText(ctx, G.triVertexB, B.x - 22, B.y + 16, 16, true);
  drawMathText(ctx, G.triVertexC, C.x + 10, C.y + 16, 16, true);

  // Side Labels
  if (G.triSideAB) {
    const midAB = { x: (A.x + B.x) / 2 - 16, y: (A.y + B.y) / 2 };
    drawMathText(ctx, G.triSideAB, midAB.x, midAB.y, 13, false, true);
  }
  if (G.triSideBC) {
    const midBC = { x: (B.x + C.x) / 2, y: B.y + 22 };
    drawMathText(ctx, G.triSideBC, midBC.x, midBC.y, 13, false, true);
  }
  if (G.triSideAC) {
    const midAC = { x: (A.x + C.x) / 2 + 12, y: (A.y + C.y) / 2 };
    drawMathText(ctx, G.triSideAC, midAC.x, midAC.y, 13, false, true);
  }
}

function drawCircle(ctx, W, H, strokeColor, fillColor, arcColor, labelColor) {
  const O = { x: W / 2, y: H / 2 };
  const R = 115;
  const angRad = (G.circleAngle * Math.PI) / 180;

  // Shaded sector if enabled
  if (G.circleShade) {
    ctx.beginPath();
    ctx.moveTo(O.x, O.y);
    ctx.arc(O.x, O.y, R, 0, -angRad, true);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  // Draw main circle
  ctx.beginPath();
  ctx.arc(O.x, O.y, R, 0, Math.PI * 2);
  ctx.stroke();

  // Center point
  ctx.beginPath();
  ctx.arc(O.x, O.y, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = strokeColor;
  ctx.fill();
  drawMathText(ctx, G.circleCenter, O.x - 18, O.y - 8, 15, true);

  // Sector lines [OA] and [OB]
  const ptA = { x: O.x + R, y: O.y };
  const ptB = { x: O.x + R * Math.cos(-angRad), y: O.y + R * Math.sin(-angRad) };

  ctx.beginPath();
  ctx.moveTo(O.x, O.y);
  ctx.lineTo(ptA.x, ptA.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(O.x, O.y);
  ctx.lineTo(ptB.x, ptB.y);
  ctx.stroke();

  // Angle arc at center
  ctx.beginPath();
  ctx.arc(O.x, O.y, 35, 0, -angRad, true);
  ctx.strokeStyle = arcColor;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.4;

  // Angle label
  const midAng = -angRad / 2;
  const lblPos = { x: O.x + 52 * Math.cos(midAng), y: O.y + 52 * Math.sin(midAng) };
  drawMathText(ctx, G.circleAngleLabel || (G.circleAngle + '°'), lblPos.x, lblPos.y, 12, false, true);

  // Radius label
  if (G.circleRadius) {
    drawMathText(ctx, G.circleRadius, O.x + R / 2, O.y + 18, 12, false, true);
  }

  // Optional Chord [AB]
  if (G.circleChord) {
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(ptA.x, ptA.y);
    ctx.lineTo(ptB.x, ptB.y);
    ctx.stroke();
    ctx.restore();
  }

  // Optional Tangent line at A
  if (G.circleTangent) {
    ctx.beginPath();
    ctx.moveTo(ptA.x, ptA.y - 70);
    ctx.lineTo(ptA.x, ptA.y + 70);
    ctx.stroke();
    drawRightAngleSquare(ctx, ptA.x, ptA.y, -14, -14);
    drawMathText(ctx, 'd (teğet)', ptA.x + 10, ptA.y - 50, 11, false, true);
  }

  // Vertex labels A & B
  drawMathText(ctx, 'A', ptA.x + 10, ptA.y + 5, 14, true);
  drawMathText(ctx, 'B', ptB.x + (ptB.x > O.x ? 8 : -16), ptB.y + (ptB.y < O.y ? -10 : 16), 14, true);
}

function drawQuad(ctx, W, H, strokeColor, fillColor, arcColor, labelColor) {
  let A, B, C, D;
  const v = G.quadVariant;

  if (v === 'kare') {
    const s = 170;
    A = { x: (W - s) / 2, y: 70 };
    B = { x: (W - s) / 2, y: 70 + s };
    C = { x: (W + s) / 2, y: 70 + s };
    D = { x: (W + s) / 2, y: 70 };
  } else if (v === 'dikdortgen') {
    const w = 260, h = 150;
    A = { x: (W - w) / 2, y: 85 };
    B = { x: (W - w) / 2, y: 85 + h };
    C = { x: (W + w) / 2, y: 85 + h };
    D = { x: (W + w) / 2, y: 85 };
  } else if (v === 'paralelkenar') {
    A = { x: 140, y: 85 };
    B = { x: 80, y: 245 };
    C = { x: 330, y: 245 };
    D = { x: 390, y: 85 };
  } else {
    // Yamuk (Trapezoid)
    A = { x: 160, y: 85 };
    B = { x: 80, y: 245 };
    C = { x: 380, y: 245 };
    D = { x: 310, y: 85 };
  }

  // Shading if enabled
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

  // Draw main quad
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.lineTo(D.x, D.y);
  ctx.closePath();
  ctx.stroke();

  // Right angle squares for rectangle/square
  if (v === 'dikdortgen' || v === 'kare') {
    drawRightAngleSquare(ctx, A.x, A.y, 14, 14);
    drawRightAngleSquare(ctx, B.x, B.y, 14, -14);
    drawRightAngleSquare(ctx, C.x, C.y, -14, -14);
    drawRightAngleSquare(ctx, D.x, D.y, -14, 14);
  }

  // Optional Diagonals
  if (G.quadDiagonals) {
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

  // Vertex labels
  drawMathText(ctx, G.quadVertexA, A.x - 14, A.y - 10, 15, true);
  drawMathText(ctx, G.quadVertexB, B.x - 16, B.y + 18, 15, true);
  drawMathText(ctx, G.quadVertexC, C.x + 10, C.y + 18, 15, true);
  drawMathText(ctx, G.quadVertexD, D.x + 10, D.y - 10, 15, true);

  // Side labels
  if (G.quadSideAB) drawMathText(ctx, G.quadSideAB, (A.x + B.x) / 2 - 24, (A.y + B.y) / 2, 13, false, true);
  if (G.quadSideBC) drawMathText(ctx, G.quadSideBC, (B.x + C.x) / 2, B.y + 20, 13, false, true);
}

function drawParallel(ctx, W, H, strokeColor, fillColor, arcColor, labelColor) {
  const y1 = 110;
  const y2 = 230;
  const xLeft = 50;
  const xRight = 410;

  // Line 1
  ctx.beginPath();
  ctx.moveTo(xLeft, y1);
  ctx.lineTo(xRight, y1);
  ctx.stroke();
  drawArrow(ctx, xRight - 15, y1, 1, 0);
  drawMathText(ctx, G.parLine1, xRight + 12, y1 + 5, 14, true);

  // Line 2
  ctx.beginPath();
  ctx.moveTo(xLeft, y2);
  ctx.lineTo(xRight, y2);
  ctx.stroke();
  drawArrow(ctx, xRight - 15, y2, 1, 0);
  drawMathText(ctx, G.parLine2, xRight + 12, y2 + 5, 14, true);

  // Transversal line cut
  const tA = { x: 140, y: 50 };
  const tB = { x: 320, y: 290 };
  ctx.beginPath();
  ctx.moveTo(tA.x, tA.y);
  ctx.lineTo(tB.x, tB.y);
  ctx.stroke();

  // Intersection points
  // x = 140 + (tB.x - tA.x)*((y - 50)/(240))
  const int1 = { x: 140 + (180 * (y1 - 50)) / 240, y: y1 }; // (185, 110)
  const int2 = { x: 140 + (180 * (y2 - 50)) / 240, y: y2 }; // (275, 230)

  // Angle 1 arc at int1
  ctx.beginPath();
  ctx.arc(int1.x, int1.y, 28, Math.PI, Math.PI * 1.3, false);
  ctx.strokeStyle = arcColor;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.4;
  drawMathText(ctx, G.parAngle1, int1.x - 38, int1.y - 12, 13, false, true);

  // Angle 2 arc at int2 (Z rule alternate interior or corresponding)
  ctx.beginPath();
  ctx.arc(int2.x, int2.y, 28, 0, Math.PI * 0.3, false);
  ctx.strokeStyle = arcColor;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.4;
  drawMathText(ctx, G.parAngle2, int2.x + 36, int2.y + 14, 13, false, true);

  // Parallel notation
  drawMathText(ctx, `${G.parLine1} // ${G.parLine2}`, W / 2, 40, 13, true, true);
}

// Helper drawing utilities
function drawRightAngleSquare(ctx, x, y, dx, dy) {
  ctx.save();
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(x + dx, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.lineTo(x, y + dy);
  ctx.stroke();
  // Central dot
  ctx.beginPath();
  ctx.arc(x + dx / 2, y + dy / 2, 1.8, 0, Math.PI * 2);
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

function drawTickMark(ctx, x, y, len) {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - len / 2, y - len / 2);
  ctx.lineTo(x + len / 2, y + len / 2);
  ctx.stroke();
  ctx.restore();
}

function drawArrow(ctx, x, y, dirX, dirY) {
  ctx.save();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 8, y - 5);
  ctx.lineTo(x - 8, y + 5);
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
  // Shape tab selection
  document.querySelectorAll('[data-geo-shape]').forEach(btn => {
    btn.onclick = () => {
      activeShape = btn.dataset.geoShape;
      syncControlsFromState();
      renderGeometryCanvas();
    };
  });

  // Triangle controls
  const triVar = $('geoTriVariant');
  if (triVar) triVar.onchange = (e) => { G.triangleVariant = e.target.value; renderGeometryCanvas(); };
  ['geoTriVA', 'geoTriVB', 'geoTriVC', 'geoTriSAB', 'geoTriSBC', 'geoTriSAC', 'geoTriAngA', 'geoTriAngB', 'geoTriAngC'].forEach(id => {
    const el = $(id);
    if (el) el.oninput = () => {
      G.triVertexA = $('geoTriVA').value;
      G.triVertexB = $('geoTriVB').value;
      G.triVertexC = $('geoTriVC').value;
      G.triSideAB = $('geoTriSAB').value;
      G.triSideBC = $('geoTriSBC').value;
      G.triSideAC = $('geoTriSAC').value;
      G.triAngleA = $('geoTriAngA').value;
      G.triAngleB = $('geoTriAngB').value;
      G.triAngleC = $('geoTriAngC').value;
      renderGeometryCanvas();
    };
  });
  if ($('geoTriAltitude')) $('geoTriAltitude').onchange = (e) => { G.triAltitude = e.target.checked; renderGeometryCanvas(); };
  if ($('geoTriShade')) $('geoTriShade').onchange = (e) => { G.triShade = e.target.checked; renderGeometryCanvas(); };

  // Circle controls
  ['geoCirCenter', 'geoCirRadius', 'geoCirAngleLbl'].forEach(id => {
    const el = $(id);
    if (el) el.oninput = () => {
      G.circleCenter = $('geoCirCenter').value;
      G.circleRadius = $('geoCirRadius').value;
      G.circleAngleLabel = $('geoCirAngleLbl').value;
      renderGeometryCanvas();
    };
  });
  const cirAngle = $('geoCirAngleRange');
  if (cirAngle) cirAngle.oninput = (e) => {
    G.circleAngle = parseInt(e.target.value, 10);
    if ($('geoCirAngleVal')) $('geoCirAngleVal').textContent = G.circleAngle + '°';
    if (!G.circleAngleLabel || G.circleAngleLabel.endsWith('°')) {
      G.circleAngleLabel = G.circleAngle + '°';
      if ($('geoCirAngleLbl')) $('geoCirAngleLbl').value = G.circleAngleLabel;
    }
    renderGeometryCanvas();
  };
  if ($('geoCirSector')) $('geoCirSector').onchange = (e) => { G.circleSector = e.target.checked; renderGeometryCanvas(); };
  if ($('geoCirShade')) $('geoCirShade').onchange = (e) => { G.circleShade = e.target.checked; renderGeometryCanvas(); };
  if ($('geoCirChord')) $('geoCirChord').onchange = (e) => { G.circleChord = e.target.checked; renderGeometryCanvas(); };
  if ($('geoCirTangent')) $('geoCirTangent').onchange = (e) => { G.circleTangent = e.target.checked; renderGeometryCanvas(); };

  // Quad controls
  const quadVar = $('geoQuadVariant');
  if (quadVar) quadVar.onchange = (e) => { G.quadVariant = e.target.value; renderGeometryCanvas(); };
  ['geoQuadVA', 'geoQuadVB', 'geoQuadVC', 'geoQuadVD', 'geoQuadSAB', 'geoQuadSBC'].forEach(id => {
    const el = $(id);
    if (el) el.oninput = () => {
      G.quadVertexA = $('geoQuadVA').value;
      G.quadVertexB = $('geoQuadVB').value;
      G.quadVertexC = $('geoQuadVC').value;
      G.quadVertexD = $('geoQuadVD').value;
      G.quadSideAB = $('geoQuadSAB').value;
      G.quadSideBC = $('geoQuadSBC').value;
      renderGeometryCanvas();
    };
  });
  if ($('geoQuadDiagonals')) $('geoQuadDiagonals').onchange = (e) => { G.quadDiagonals = e.target.checked; renderGeometryCanvas(); };
  if ($('geoQuadShade')) $('geoQuadShade').onchange = (e) => { G.quadShade = e.target.checked; renderGeometryCanvas(); };

  // Parallel controls
  ['geoParAng1', 'geoParAng2', 'geoParL1', 'geoParL2'].forEach(id => {
    const el = $(id);
    if (el) el.oninput = () => {
      G.parAngle1 = $('geoParAng1').value;
      G.parAngle2 = $('geoParAng2').value;
      G.parLine1 = $('geoParL1').value;
      G.parLine2 = $('geoParL2').value;
      renderGeometryCanvas();
    };
  });

  // Close modal
  const closeBtn = $('geoModalClose');
  if (closeBtn) closeBtn.onclick = () => closeModal('geoModal');

  // Insert button
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

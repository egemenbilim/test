import { $, openModal, closeModal } from '../utils.js';

/**
 * Vektörel Geometri Çizim Aracı ve KaTeX Denklem Tuvali
 * - 'Şekil Çiz' (Otomatik Açı Tespiti & $90^\circ$ Diklik Sembolü)
 * - Açı Yazılarını Açma / Kapatma (Sadece Yay Gösterme Modu)
 * - Şekil Üstüne Çizim & Manyetik Köşe/Kenar Yakalama (Vertex Snap)
 * - KaTeX Formül Tuvali & 2x Retina PNG Export
 */

let fabricCanvas = null;
let onInsertCallback = null;
let activeTool = 'select';

// Çizim & Stil Durumu
const currentStyle = {
  strokeColor: '#0f172a',
  fillColor: 'transparent',
  strokeWidth: 2,
  isDashed: false,
  fontSize: 20,
  angleDisplayMode: 'all' // 'all' | 'arc_only' | 'hidden'
};

let gridEnabled = true;
let snapEnabled = true;
let zoomLevel = 100;

// Geri Al / İleri Al Yığını
const historyStack = [];
let historyIndex = -1;
let isHistoryUpdating = false;

// Şekil Çiz (Shape / Polygon) Durumu
let shapePoints = [];
let shapeTempLine = null;
let shapeMarkers = [];

// Doğru Çizim Durumu
let drawingLine = null;
let isDrawingLine = false;

// Manyetik Kilitlenme Göstergesi
let snapIndicator = null;

// Renk Paletleri
const STROKE_COLORS = [
  '#0f172a', '#475569', '#94a3b8', '#1e3a8a',
  '#2563eb', '#0284c7', '#16a34a', '#059669',
  '#ca8a04', '#ea580c', '#dc2626', '#7c3aed'
];

const FILL_COLORS = [
  'transparent', '#ffffff', '#f8fafc', '#fef3c7',
  '#dbeafe', '#dcfce7', '#fee2e2', '#f3e8ff',
  '#ffedd5', '#cffafe', '#f1f5f9', '#e2e8f0'
];

// KaTeX Formül Sekmeleri
const FORMULA_TABS = {
  basic: [
    { latex: '\\sqrt{x}', display: '√x' },
    { latex: '\\sqrt[n]{x}', display: 'ⁿ√x' },
    { latex: '\\frac{a}{b}', display: 'a/b' },
    { latex: 'x^{2}', display: 'x²' },
    { latex: 'x_{1}', display: 'x₁' },
    { latex: 'x^{n}', display: 'xⁿ' },
    { latex: '\\pm', display: '±' },
    { latex: '\\cdot', display: '·' },
    { latex: '2\\sqrt{3}', display: '2√3' },
    { latex: 'x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}', display: 'Kök Formülü' }
  ],
  symbols: [
    { latex: '\\pi', display: 'π' },
    { latex: '\\alpha', display: 'α' },
    { latex: '\\beta', display: 'β' },
    { latex: '\\theta', display: 'θ' },
    { latex: '\\Delta', display: 'Δ' },
    { latex: '60^\\circ', display: '60°' },
    { latex: '90^\\circ', display: '90°' },
    { latex: '\\perp', display: '⊥' },
    { latex: '\\parallel', display: '∥' },
    { latex: '\\le', display: '≤' },
    { latex: '\\ge', display: '≥' },
    { latex: '\\ne', display: '≠' },
    { latex: '\\approx', display: '≈' },
    { latex: '\\infty', display: '∞' }
  ],
  placeholders: [
    { latex: '\\vec{v}', display: 'v⃗' },
    { latex: '|x|', display: '|x|' },
    { latex: '\\overline{AB}', display: 'AB̄' },
    { latex: '\\widehat{ABC}', display: 'ABĈ' },
    { latex: '\\left( \\frac{a}{b} \\right)', display: '(a/b)' }
  ],
  calculus: [
    { latex: '\\int f(x) dx', display: '∫ f(x)dx' },
    { latex: '\\int_{a}^{b} f(x) dx', display: '∫ₐᵇ f(x)dx' },
    { latex: '\\sum_{i=1}^{n} x_i', display: '∑ xᵢ' },
    { latex: '\\lim_{x \\to \\infty}', display: 'lim x→∞' },
    { latex: '\\frac{dy}{dx}', display: 'dy/dx' }
  ]
};

let activeFormulaTab = 'basic';
let formulaColor = '#0f172a';
let formulaSize = 26;

// ============================================================================
// MODAL AÇILIŞ VE DIŞA AKTARIM FONKSİYONLARI
// ============================================================================

export function setOnGeometryInsertCallback(fn) {
  onInsertCallback = fn;
}

export function openGeometryModal(callback) {
  if (typeof callback === 'function') {
    onInsertCallback = callback;
  }
  openModal('geoModal');

  setTimeout(() => {
    initFabricCanvasIfNeeded();
    resetToolState();
  }, 50);
}

export function syncControlsFromState() {}

// ============================================================================
// FABRIC.JS TUVAL BAŞLATMA VE YÖNETİMİ
// ============================================================================

function initFabricCanvasIfNeeded() {
  const canvasEl = $('geoFabricCanvas');
  if (!canvasEl) return;

  const fabric = window.fabric;
  if (!fabric) {
    console.error('Fabric.js kütüphanesi yüklenemedi!');
    return;
  }

  if (fabricCanvas) {
    fabricCanvas.calcOffset();
    return;
  }

  fabricCanvas = new fabric.Canvas('geoFabricCanvas', {
    width: 760,
    height: 490,
    selection: true,
    preserveObjectStacking: true,
    fireRightClick: true,
    stopContextMenu: true
  });

  updateGridBackground(gridEnabled);
  saveHistoryState();

  // Seçim Olayları
  fabricCanvas.on('selection:created', (e) => onObjectSelected(e.selected ? e.selected[0] : null));
  fabricCanvas.on('selection:updated', (e) => onObjectSelected(e.selected ? e.selected[0] : null));
  fabricCanvas.on('selection:cleared', () => onObjectSelected(null));
  fabricCanvas.on('object:modified', () => {
    onObjectSelected(fabricCanvas.getActiveObject());
    saveHistoryState();
  });

  // Fare Olayları
  fabricCanvas.on('mouse:down', onCanvasMouseDown);
  fabricCanvas.on('mouse:move', onCanvasMouseMove);
  fabricCanvas.on('mouse:up', onCanvasMouseUp);

  window.addEventListener('keydown', onGlobalKeyDown);
}

function updateGridBackground(enabled) {
  if (!fabricCanvas) return;
  const fabric = window.fabric;
  if (!fabric) return;

  if (!enabled) {
    fabricCanvas.setBackgroundColor('#ffffff', fabricCanvas.renderAll.bind(fabricCanvas));
    return;
  }

  const gridSize = 20;
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = gridSize;
  patternCanvas.height = gridSize;
  const pctx = patternCanvas.getContext('2d');
  if (pctx) {
    pctx.strokeStyle = '#e2e8f0';
    pctx.lineWidth = 0.8;
    pctx.beginPath();
    pctx.moveTo(gridSize, 0);
    pctx.lineTo(gridSize, gridSize);
    pctx.lineTo(0, gridSize);
    pctx.stroke();
  }

  const pattern = new fabric.Pattern({
    source: patternCanvas,
    repeat: 'repeat'
  });
  fabricCanvas.setBackgroundColor(pattern, fabricCanvas.renderAll.bind(fabricCanvas));
}

// ============================================================================
// MANYETİK KÖŞE / TEPE YAKALAMA (VERTEX SNAPPING)
// ============================================================================

function getAllCanvasVertices() {
  if (!fabricCanvas) return [];
  const fabric = window.fabric;
  const vertices = [];

  fabricCanvas.forEachObject((obj) => {
    if (obj.isHelper || obj === snapIndicator) return;

    if (obj.type === 'polygon' && Array.isArray(obj.points)) {
      const matrix = obj.calcTransformMatrix();
      obj.points.forEach((pt) => {
        const trans = fabric.util.transformPoint(
          new fabric.Point(pt.x - obj.pathOffset.x, pt.y - obj.pathOffset.y),
          matrix
        );
        vertices.push({ x: trans.x, y: trans.y });
      });
    } else if (obj.type === 'group' && Array.isArray(obj._objects)) {
      // Grup içindeki poligonları bul
      const groupMatrix = obj.calcTransformMatrix();
      obj._objects.forEach((sub) => {
        if (sub.type === 'polygon' && Array.isArray(sub.points)) {
          const subMatrix = sub.calcTransformMatrix();
          sub.points.forEach((pt) => {
            const localTrans = fabric.util.transformPoint(
              new fabric.Point(pt.x - sub.pathOffset.x, pt.y - sub.pathOffset.y),
              subMatrix
            );
            const worldTrans = fabric.util.transformPoint(localTrans, groupMatrix);
            vertices.push({ x: worldTrans.x, y: worldTrans.y });
          });
        }
      });
    } else if (obj.type === 'line') {
      vertices.push({ x: obj.x1, y: obj.y1 });
      vertices.push({ x: obj.x2, y: obj.y2 });
    }
  });

  return vertices;
}

function getSnappedPoint(rawPt, threshold = 16) {
  let pt = {
    x: snapEnabled ? Math.round(rawPt.x / 10) * 10 : rawPt.x,
    y: snapEnabled ? Math.round(rawPt.y / 10) * 10 : rawPt.y
  };

  if (!snapEnabled) return pt;

  // Mevcut şekillerin köşelerine bak
  const vertices = getAllCanvasVertices();
  let minDist = threshold;
  let snapped = null;

  for (const v of vertices) {
    const d = Math.hypot(rawPt.x - v.x, rawPt.y - v.y);
    if (d < minDist) {
      minDist = d;
      snapped = { x: v.x, y: v.y };
    }
  }

  if (snapped) {
    showSnapIndicator(snapped.x, snapped.y);
    return snapped;
  } else {
    hideSnapIndicator();
    return pt;
  }
}

function showSnapIndicator(x, y) {
  if (!fabricCanvas) return;
  const fabric = window.fabric;
  if (!snapIndicator) {
    snapIndicator = new fabric.Circle({
      radius: 6,
      fill: 'rgba(16, 185, 129, 0.3)',
      stroke: '#10b981',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      isHelper: true
    });
    fabricCanvas.add(snapIndicator);
  }
  snapIndicator.set({ left: x, top: y });
  snapIndicator.bringToFront();
}

function hideSnapIndicator() {
  if (snapIndicator && fabricCanvas) {
    fabricCanvas.remove(snapIndicator);
    snapIndicator = null;
  }
}

// ============================================================================
// OTOMATİK AÇI VE DİKLİK HESAPLAMA ÇEKİRDEĞİ
// ============================================================================

function calculatePolygonAngles(points, arcRadius = 26) {
  const n = points.length;
  if (n < 3) return [];

  // Shoelace signed area ile çokgenin yönü
  let signedArea = 0;
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    signedArea += p1.x * p2.y - p2.x * p1.y;
  }
  const isClockwise = signedArea < 0;

  const results = [];

  for (let i = 0; i < n; i++) {
    const pPrev = points[(i - 1 + n) % n];
    const pCurr = points[i];
    const pNext = points[(i + 1) % n];

    const vPrev = { x: pPrev.x - pCurr.x, y: pPrev.y - pCurr.y };
    const vNext = { x: pNext.x - pCurr.x, y: pNext.y - pCurr.y };

    const lenPrev = Math.hypot(vPrev.x, vPrev.y);
    const lenNext = Math.hypot(vNext.x, vNext.y);

    if (lenPrev === 0 || lenNext === 0) continue;

    const thPrev = Math.atan2(vPrev.y, vPrev.x);
    const thNext = Math.atan2(vNext.y, vNext.x);

    let diff = thNext - thPrev;
    while (diff < 0) diff += 2 * Math.PI;
    while (diff >= 2 * Math.PI) diff -= 2 * Math.PI;

    let sweepAngle = isClockwise ? 2 * Math.PI - diff : diff;
    if (sweepAngle < 0) sweepAngle += 2 * Math.PI;
    if (sweepAngle > 2 * Math.PI) sweepAngle -= 2 * Math.PI;

    const angleDegrees = Math.round((sweepAngle * 180) / Math.PI);
    const isRightAngle = Math.abs(angleDegrees - 90) <= 2;

    const boxSize = 16;
    if (isRightAngle) {
      // 90° Diklik Sembolü: Köşede kare + nokta
      const u1 = { x: vPrev.x / lenPrev, y: vPrev.y / lenPrev };
      const u2 = { x: vNext.x / lenNext, y: vNext.y / lenNext };

      const corner1 = { x: pCurr.x + u1.x * boxSize, y: pCurr.y + u1.y * boxSize };
      const corner2 = {
        x: pCurr.x + (u1.x + u2.x) * boxSize,
        y: pCurr.y + (u1.y + u2.y) * boxSize
      };
      const corner3 = { x: pCurr.x + u2.x * boxSize, y: pCurr.y + u2.y * boxSize };

      const dotPos = {
        x: pCurr.x + (u1.x + u2.x) * (boxSize * 0.5),
        y: pCurr.y + (u1.y + u2.y) * (boxSize * 0.5)
      };

      results.push({
        vertex: pCurr,
        angleDegrees: 90,
        isRightAngle: true,
        rightAngleBoxPoints: [corner1, corner2, corner3],
        dotPosition: dotPos
      });
    } else {
      // Standart Açı Yayı ve Derece
      const startAngle = isClockwise ? thNext : thPrev;
      const endAngle = isClockwise ? thPrev : thNext;

      const sX = pCurr.x + arcRadius * Math.cos(startAngle);
      const sY = pCurr.y + arcRadius * Math.sin(startAngle);
      const eX = pCurr.x + arcRadius * Math.cos(endAngle);
      const eY = pCurr.y + arcRadius * Math.sin(endAngle);

      let aDiff = endAngle - startAngle;
      while (aDiff < 0) aDiff += 2 * Math.PI;
      const largeArc = aDiff > Math.PI ? 1 : 0;

      const arcPath = `M ${sX.toFixed(1)} ${sY.toFixed(1)} A ${arcRadius} ${arcRadius} 0 ${largeArc} 1 ${eX.toFixed(1)} ${eY.toFixed(1)}`;

      const bisector = startAngle + sweepAngle / 2;
      const labelDist = arcRadius + 15;
      const labelPos = {
        x: pCurr.x + Math.cos(bisector) * labelDist,
        y: pCurr.y + Math.sin(bisector) * labelDist
      };

      results.push({
        vertex: pCurr,
        angleDegrees,
        isRightAngle: false,
        arcPathString: arcPath,
        labelPosition: labelPos
      });
    }
  }

  return results;
}

// ============================================================================
// ARAÇ YÖNETİMİ & REHBER METİNLERİ
// ============================================================================

function setTool(tool) {
  // 'polygon' isteklerini 'shape' ile eşleştir
  if (tool === 'polygon') tool = 'shape';
  activeTool = tool;

  document.querySelectorAll('[data-tool]').forEach((btn) => {
    const isAct = btn.dataset.tool === tool || (btn.dataset.tool === 'polygon' && tool === 'shape');
    if (isAct) {
      btn.className = 'active flex h-12 w-full flex-col items-center justify-center rounded-xl transition bg-blue-50 text-blue-600 font-bold border border-blue-200 shadow-sm dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400';
    } else {
      btn.className = 'flex h-12 w-full flex-col items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition';
    }
  });

  const guidanceEl = $('geoGuidanceText');
  const shapeFinishBtn = $('geoPolygonFinishBtn');

  if (shapeFinishBtn) {
    shapeFinishBtn.classList.toggle('hidden', tool !== 'shape');
    shapeFinishBtn.classList.toggle('flex', tool === 'shape');
  }

  if (guidanceEl) {
    switch (tool) {
      case 'select':
        guidanceEl.textContent = 'Nesneleri seçmek, taşımak, boyutlandırmak ve açı modunu değiştirmek için tıklayın.';
        break;
      case 'shape':
        guidanceEl.textContent = 'Köşeleri sırayla tıklayarak şekli çizin. Bittiğinde iç açılar (90° diklik kutusu veya yay) otomatik oluşturulur.';
        break;
      case 'line':
        guidanceEl.textContent = 'Yükseklik, açıortay veya doğru çizmek için sürükleyin. Köşelere manyetik kenetlenir.';
        break;
      case 'circle':
        guidanceEl.textContent = 'Merkez noktasını belirleyip dışa sürükleyerek çember oluşturun.';
        break;
      case 'text':
        guidanceEl.textContent = 'Metin veya köşe harfi (A, B, C) eklemek istediğiniz konuma tıklayın.';
        break;
      default:
        guidanceEl.textContent = 'Vektörel çizim aracını kullanmaya hazırsınız.';
    }
  }

  if (fabricCanvas) {
    if (tool === 'select') {
      fabricCanvas.selection = true;
      fabricCanvas.defaultCursor = 'default';
      fabricCanvas.forEachObject((obj) => {
        if (!obj.isHelper) {
          obj.selectable = true;
          obj.evented = true;
        }
      });
    } else {
      fabricCanvas.selection = false;
      fabricCanvas.defaultCursor = 'crosshair';
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
    }
  }
}

function resetToolState() {
  cleanupShapeDrawing();
  hideSnapIndicator();
  setTool('select');
  hideFloatingToolbar();
}

// ============================================================================
// ÇİZİM ETKİLEŞİMLERİ (CANVAS MOUSE EVENTS)
// ============================================================================

function onCanvasMouseDown(opt) {
  if (!fabricCanvas) return;
  const fabric = window.fabric;
  const pointer = fabricCanvas.getPointer(opt.e);
  const pt = getSnappedPoint(pointer);

  if (activeTool === 'shape') {
    // İlk noktaya yakın tıklandıysa şekli tamamla
    if (shapePoints.length >= 3) {
      const firstPt = shapePoints[0];
      const dist = Math.hypot(pt.x - firstPt.x, pt.y - firstPt.y);
      if (dist < 20) {
        finishShape();
        return;
      }
    }

    shapePoints.push(pt);

    // Kırmızı köşe işareti
    const marker = new fabric.Circle({
      left: pt.x,
      top: pt.y,
      radius: 4.5,
      fill: '#ef4444',
      stroke: '#ffffff',
      strokeWidth: 1.5,
      originX: 'center',
      originY: 'center',
      selectable: false,
      isHelper: true
    });
    fabricCanvas.add(marker);
    shapeMarkers.push(marker);

    // Canlı kauçuk bant çizgi
    if (!shapeTempLine) {
      shapeTempLine = new fabric.Line([pt.x, pt.y, pt.x, pt.y], {
        stroke: currentStyle.strokeColor,
        strokeWidth: currentStyle.strokeWidth,
        strokeDashArray: [4, 4],
        selectable: false,
        isHelper: true
      });
      fabricCanvas.add(shapeTempLine);
    } else {
      shapeTempLine.set({ x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y });
    }
    fabricCanvas.renderAll();
  } else if (activeTool === 'line') {
    isDrawingLine = true;
    drawingLine = new fabric.Line([pt.x, pt.y, pt.x, pt.y], {
      stroke: currentStyle.strokeColor,
      strokeWidth: currentStyle.strokeWidth,
      strokeDashArray: currentStyle.isDashed ? [6, 6] : null,
      selectable: true,
      cornerColor: '#2563eb',
      cornerSize: 8,
      transparentCorners: false
    });
    fabricCanvas.add(drawingLine);
  } else if (activeTool === 'circle') {
    const circle = new fabric.Circle({
      left: pt.x,
      top: pt.y,
      radius: 45,
      fill: currentStyle.fillColor,
      stroke: currentStyle.strokeColor,
      strokeWidth: currentStyle.strokeWidth,
      originX: 'center',
      originY: 'center',
      selectable: true,
      cornerColor: '#2563eb',
      cornerSize: 8,
      transparentCorners: false
    });
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    fabricCanvas.renderAll();
    saveHistoryState();
    setTool('select');
  } else if (activeTool === 'text') {
    const text = new fabric.IText('A', {
      left: pt.x,
      top: pt.y,
      fontSize: currentStyle.fontSize,
      fontFamily: 'Noto Sans, sans-serif',
      fontWeight: 'bold',
      fill: currentStyle.strokeColor,
      selectable: true
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    text.enterEditing();
    fabricCanvas.renderAll();
    saveHistoryState();
    setTool('select');
  }
}

function onCanvasMouseMove(opt) {
  if (!fabricCanvas) return;
  const pointer = fabricCanvas.getPointer(opt.e);
  const pt = getSnappedPoint(pointer);

  if (isDrawingLine && drawingLine) {
    drawingLine.set({ x2: pt.x, y2: pt.y });
    fabricCanvas.renderAll();
  } else if (activeTool === 'shape' && shapeTempLine) {
    shapeTempLine.set({ x2: pt.x, y2: pt.y });
    fabricCanvas.renderAll();
  }
}

function onCanvasMouseUp() {
  hideSnapIndicator();

  if (isDrawingLine && drawingLine) {
    isDrawingLine = false;
    drawingLine.setCoords();
    fabricCanvas.setActiveObject(drawingLine);
    fabricCanvas.renderAll();
    saveHistoryState();
    setTool('select');
    drawingLine = null;
  }
}

// ============================================================================
// ŞEKİL BİTİRME & OTOMATİK AÇI OLUŞTURMA
// ============================================================================

function finishShape() {
  if (!fabricCanvas || shapePoints.length < 3) {
    cleanupShapeDrawing();
    return;
  }

  const fabric = window.fabric;
  const pts = [...shapePoints];
  cleanupShapeDrawing();

  // 1. Ana Poligon Şekli
  const polygon = new fabric.Polygon(pts, {
    fill: currentStyle.fillColor,
    stroke: currentStyle.strokeColor,
    strokeWidth: currentStyle.strokeWidth,
    strokeDashArray: currentStyle.isDashed ? [6, 6] : null,
    selectable: true
  });

  // 2. Otomatik Açıları Hesapla
  const angles = calculatePolygonAngles(pts, 26);
  const angleElements = [];

  angles.forEach((ang) => {
    if (ang.isRightAngle && ang.rightAngleBoxPoints && ang.dotPosition) {
      // 90° Diklik Karesi
      const box = new fabric.Polyline(ang.rightAngleBoxPoints, {
        fill: 'transparent',
        stroke: currentStyle.strokeColor,
        strokeWidth: 1.5,
        selectable: false,
        isAngleComponent: true
      });

      const dot = new fabric.Circle({
        left: ang.dotPosition.x,
        top: ang.dotPosition.y,
        radius: 2,
        fill: currentStyle.strokeColor,
        originX: 'center',
        originY: 'center',
        selectable: false,
        isAngleComponent: true
      });

      angleElements.push(box, dot);
    } else if (ang.arcPathString) {
      // Açı Yayı
      const arc = new fabric.Path(ang.arcPathString, {
        stroke: currentStyle.strokeColor,
        strokeWidth: 1.5,
        fill: 'transparent',
        selectable: false,
        isAngleComponent: true,
        isAngleArc: true
      });

      // Açı Derecesi Metni
      const lbl = new fabric.IText(`${ang.angleDegrees}°`, {
        left: ang.labelPosition.x,
        top: ang.labelPosition.y,
        fontSize: 14,
        fontFamily: 'Noto Sans, sans-serif',
        fontWeight: 'bold',
        fill: currentStyle.strokeColor,
        originX: 'center',
        originY: 'center',
        selectable: false,
        isAngleComponent: true,
        isAngleLabel: true
      });

      angleElements.push(arc, lbl);
    }
  });

  // Ana şekil ve açı elemanlarını tek bir grup olarak tuvale ekle
  const group = new fabric.Group([polygon, ...angleElements], {
    selectable: true,
    cornerColor: '#2563eb',
    cornerSize: 8,
    transparentCorners: false,
    hasAutoAngles: true,
    angleDisplayMode: currentStyle.angleDisplayMode || 'all'
  });

  fabricCanvas.add(group);
  fabricCanvas.setActiveObject(group);
  fabricCanvas.renderAll();
  saveHistoryState();
  setTool('select');
}

function cleanupShapeDrawing() {
  if (!fabricCanvas) return;
  if (shapeTempLine) {
    fabricCanvas.remove(shapeTempLine);
    shapeTempLine = null;
  }
  shapeMarkers.forEach((m) => fabricCanvas.remove(m));
  shapeMarkers = [];
  shapePoints = [];
  fabricCanvas.renderAll();
}

// ============================================================================
// AÇI GÖSTERİM MODU KONTROLÜ (TÜMÜ / SADECE YAY / GİZLİ)
// ============================================================================

function setAngleDisplayMode(mode) {
  currentStyle.angleDisplayMode = mode;
  if (!fabricCanvas) return;

  const active = fabricCanvas.getActiveObject();
  if (active && active.type === 'group' && Array.isArray(active._objects)) {
    active.angleDisplayMode = mode;

    active._objects.forEach((obj) => {
      if (obj.isAngleLabel) {
        // Derece yazısı: sadece 'all' modunda görünür
        obj.set('visible', mode === 'all');
      } else if (obj.isAngleArc || obj.isAngleComponent) {
        // Yay veya diklik kutusu: 'all' veya 'arc_only' modunda görünür
        obj.set('visible', mode !== 'hidden');
      }
    });

    fabricCanvas.renderAll();
    saveHistoryState();
  }

  // Floating toolbar etiketini güncelle
  updateAngleButtonLabel(mode);
}

function updateAngleButtonLabel(mode) {
  const lbl = $('geoFloatAngleLabel');
  if (!lbl) return;

  if (mode === 'all') {
    lbl.textContent = 'Açı: Değerli';
  } else if (mode === 'arc_only') {
    lbl.textContent = 'Açı: Sadece Yay';
  } else {
    lbl.textContent = 'Açı: Gizli';
  }
}

// ============================================================================
// KAYAN ŞEKİL BİÇİMLENDİRME ARAÇ ÇUBUĞU (FLOATING TOOLBAR)
// ============================================================================

function onObjectSelected(target) {
  const toolbar = $('geoFloatingToolbar');
  if (!toolbar) return;

  if (!target) {
    hideFloatingToolbar();
    return;
  }

  const bound = target.getBoundingRect(true);
  const container = $('geoCanvasContainer');
  if (!container) return;

  const top = Math.max(10, bound.top - 50);
  const left = Math.max(10, bound.left + bound.width / 2);

  toolbar.style.top = `${top}px`;
  toolbar.style.left = `${left}px`;
  toolbar.style.transform = 'translateX(-50%)';
  toolbar.classList.remove('hidden');
  toolbar.classList.add('flex');

  // Açı kontrol butonunu göster / gizle
  const angleWrapper = $('geoAngleControlWrapper');
  const hasAngles = target.hasAutoAngles || (target.type === 'group' && target._objects?.some((o) => o.isAngleComponent));
  if (angleWrapper) {
    angleWrapper.classList.toggle('hidden', !hasAngles);
    if (hasAngles) {
      const mode = target.angleDisplayMode || 'all';
      updateAngleButtonLabel(mode);
    }
  }

  // Renk ve kalınlık önizlemeleri
  const strokeColor = target.stroke || currentStyle.strokeColor;
  const fillColor = target.fill || currentStyle.fillColor;
  const strokeW = target.strokeWidth || currentStyle.strokeWidth;
  const isDashed = Array.isArray(target.strokeDashArray) && target.strokeDashArray.length > 0;

  const strokePreview = $('geoFloatStrokePreview');
  if (strokePreview) strokePreview.style.backgroundColor = strokeColor;

  const fillPreview = $('geoFloatFillPreview');
  if (fillPreview) {
    if (fillColor === 'transparent') {
      fillPreview.textContent = '✕';
      fillPreview.parentElement.style.backgroundColor = 'transparent';
    } else {
      fillPreview.textContent = '';
      fillPreview.parentElement.style.backgroundColor = fillColor;
    }
  }

  const widthLabel = $('geoFloatWidthLabel');
  if (widthLabel) widthLabel.textContent = `${strokeW}px`;

  const dashedCheck = $('geoFloatDashed');
  if (dashedCheck) dashedCheck.checked = isDashed;
}

function hideFloatingToolbar() {
  const toolbar = $('geoFloatingToolbar');
  if (toolbar) {
    toolbar.classList.add('hidden');
    toolbar.classList.remove('flex');
  }
  closeAllFloatingPopovers();
}

function closeAllFloatingPopovers() {
  const p0 = $('geoFloatAnglePopover');
  const p1 = $('geoFloatStrokePopover');
  const p2 = $('geoFloatFillPopover');
  const p3 = $('geoFloatWidthPopover');
  if (p0) p0.classList.add('hidden');
  if (p1) p1.classList.add('hidden');
  if (p2) p2.classList.add('hidden');
  if (p3) p3.classList.add('hidden');
}

function updateActiveObjectStyle(updates) {
  if (!fabricCanvas) return;
  const activeObjs = fabricCanvas.getActiveObjects();
  if (!activeObjs || activeObjs.length === 0) return;

  activeObjs.forEach((obj) => {
    if (obj.type === 'group' && Array.isArray(obj._objects)) {
      // Grup içindeki ana çokgene stili uygula
      const mainPoly = obj._objects.find((o) => o.type === 'polygon' || o.type === 'rect' || o.type === 'circle');
      if (mainPoly) {
        if (updates.stroke !== undefined) mainPoly.set('stroke', updates.stroke);
        if (updates.fill !== undefined) mainPoly.set('fill', updates.fill);
        if (updates.strokeWidth !== undefined) mainPoly.set('strokeWidth', updates.strokeWidth);
        if (updates.strokeDashArray !== undefined) mainPoly.set('strokeDashArray', updates.strokeDashArray);
      }
    } else {
      if (updates.stroke !== undefined) obj.set('stroke', updates.stroke);
      if (updates.fill !== undefined) obj.set('fill', updates.fill);
      if (updates.strokeWidth !== undefined) obj.set('strokeWidth', updates.strokeWidth);
      if (updates.strokeDashArray !== undefined) obj.set('strokeDashArray', updates.strokeDashArray);
    }
    obj.setCoords();
  });

  fabricCanvas.renderAll();
  saveHistoryState();
  onObjectSelected(fabricCanvas.getActiveObject());
}

function duplicateActiveObject() {
  if (!fabricCanvas) return;
  const active = fabricCanvas.getActiveObject();
  if (!active) return;

  active.clone((cloned) => {
    fabricCanvas.discardActiveObject();
    cloned.set({
      left: cloned.left + 20,
      top: cloned.top + 20,
      evented: true
    });
    if (cloned.type === 'activeSelection') {
      cloned.canvas = fabricCanvas;
      cloned.forEachObject((obj) => fabricCanvas.add(obj));
      cloned.setCoords();
    } else {
      fabricCanvas.add(cloned);
    }
    fabricCanvas.setActiveObject(cloned);
    fabricCanvas.renderAll();
    saveHistoryState();
  });
}

function deleteActiveObjects() {
  if (!fabricCanvas) return;
  const activeObjs = fabricCanvas.getActiveObjects();
  if (!activeObjs || activeObjs.length === 0) return;

  activeObjs.forEach((obj) => fabricCanvas.remove(obj));
  fabricCanvas.discardActiveObject();
  fabricCanvas.renderAll();
  saveHistoryState();
  hideFloatingToolbar();
}

// ============================================================================
// HAZIR GEOMETRİ ŞABLONLARI
// ============================================================================

function insertTemplate(tplName) {
  const fabric = window.fabric;
  if (!fabric || !fabricCanvas) return;

  if (tplName === 'dik_ucgen') {
    // 3-4-5 Dik Üçgen (Otomatik Açılı)
    const pts = [
      { x: 260, y: 150 },
      { x: 260, y: 350 },
      { x: 520, y: 350 }
    ];
    shapePoints = pts;
    finishShape();
  } else if (tplName === 'ozel_30_60') {
    // 30-60-90 Üçgeni
    const pts = [
      { x: 280, y: 140 },
      { x: 280, y: 360 },
      { x: 490, y: 360 }
    ];
    shapePoints = pts;
    finishShape();
  } else if (tplName === 'eskenar') {
    // Eşkenar Üçgen (60°-60°-60°)
    const pts = [
      { x: 380, y: 150 },
      { x: 260, y: 358 },
      { x: 500, y: 358 }
    ];
    shapePoints = pts;
    finishShape();
  } else if (tplName === 'oklid') {
    // Öklid Dik Üçgeni + Hipotenüs Dikmesi [AH]
    const pts = [
      { x: 350, y: 150 },
      { x: 220, y: 360 },
      { x: 540, y: 360 }
    ];
    shapePoints = pts;
    finishShape();

    // Dikme h çizgisi ekle
    setTimeout(() => {
      const hLine = new fabric.Line([350, 150, 350, 360], {
        stroke: '#4f46e5',
        strokeWidth: 2,
        strokeDashArray: [4, 4],
        selectable: true
      });
      const hLbl = new fabric.IText('h', {
        left: 360,
        top: 240,
        fontSize: 16,
        fontWeight: 'bold',
        fill: '#4f46e5'
      });
      fabricCanvas.add(hLine, hLbl);
      fabricCanvas.renderAll();
      saveHistoryState();
    }, 50);
  } else if (tplName === 'cember_dilim') {
    const circle = new fabric.Circle({
      left: 380,
      top: 240,
      radius: 90,
      fill: 'transparent',
      stroke: '#0f172a',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center'
    });

    const centerPoint = new fabric.Circle({
      left: 380,
      top: 240,
      radius: 3.5,
      fill: '#0f172a',
      originX: 'center',
      originY: 'center'
    });

    const centerLbl = new fabric.IText('O', { left: 365, top: 245, fontSize: 16, fontWeight: 'bold' });
    const rLine1 = new fabric.Line([380, 240, 470, 240], { stroke: '#0f172a', strokeWidth: 1.8 });
    const rLine2 = new fabric.Line([380, 240, 425, 162], { stroke: '#0f172a', strokeWidth: 1.8 });

    const group = new fabric.Group([circle, centerPoint, centerLbl, rLine1, rLine2], {
      left: 280,
      top: 140,
      selectable: true
    });
    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
    fabricCanvas.renderAll();
    saveHistoryState();
  } else if (tplName === 'dikdortgen') {
    const pts = [
      { x: 240, y: 160 },
      { x: 520, y: 160 },
      { x: 520, y: 320 },
      { x: 240, y: 320 }
    ];
    shapePoints = pts;
    finishShape();
  } else {
    // 3'gen şablonu
    const pts = [
      { x: 380, y: 160 },
      { x: 260, y: 340 },
      { x: 500, y: 340 }
    ];
    shapePoints = pts;
    finishShape();
  }

  $('geoTemplateDrawer')?.classList.add('hidden');
}

// ============================================================================
// KATEX DENKLEM MODÜLÜ ENTEGRASYONU
// ============================================================================

function setupKatexFormulaModule() {
  const tabsContainer = $('geoFormulaTabs');
  const buttonsGrid = $('geoFormulaButtonsGrid');
  const inputEl = $('geoFormulaInput');
  const previewEl = $('geoFormulaPreview');
  const sizeSelect = $('geoFormulaSize');

  if (!tabsContainer || !buttonsGrid || !inputEl || !previewEl) return;

  tabsContainer.querySelectorAll('[data-ftab]').forEach((btn) => {
    btn.onclick = () => {
      activeFormulaTab = btn.dataset.ftab;
      tabsContainer.querySelectorAll('[data-ftab]').forEach((b) => {
        b.className = 'ftab-btn rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800';
      });
      btn.className = 'ftab-btn active rounded-lg px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white shadow-sm';
      renderFormulaButtons();
    };
  });

  function renderFormulaButtons() {
    buttonsGrid.innerHTML = '';
    const items = FORMULA_TABS[activeFormulaTab] || [];
    items.forEach((item) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50/80 px-2 text-xs font-semibold text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-800 transition shadow-sm active:scale-95';
      b.textContent = item.display;
      b.onclick = () => {
        const val = inputEl.value;
        inputEl.value = val ? `${val} ${item.latex}` : item.latex;
        updateFormulaPreview();
        inputEl.focus();
      };
      buttonsGrid.appendChild(b);
    });
  }

  function updateFormulaPreview() {
    const latex = inputEl.value.trim() || ' ';
    const katex = window.katex;
    if (katex) {
      try {
        katex.render(latex, previewEl, {
          displayMode: true,
          throwOnError: false
        });
      } catch (err) {
        previewEl.innerText = latex;
      }
    } else {
      previewEl.innerText = latex;
    }
    previewEl.style.color = formulaColor;
  }

  inputEl.oninput = updateFormulaPreview;

  const colorOptions = $('geoFormulaColorOptions');
  if (colorOptions) {
    colorOptions.querySelectorAll('[data-color]').forEach((btn) => {
      btn.onclick = () => {
        formulaColor = btn.dataset.color;
        colorOptions.querySelectorAll('[data-color]').forEach((b) => b.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-1'));
        btn.classList.add('ring-2', 'ring-blue-500', 'ring-offset-1');
        updateFormulaPreview();
      };
    });
  }

  if (sizeSelect) {
    sizeSelect.onchange = (e) => {
      formulaSize = parseInt(e.target.value, 10) || 26;
    };
  }

  const closeBtn = $('geoFormulaClose');
  const cancelBtn = $('geoFormulaCancel');
  if (closeBtn) closeBtn.onclick = () => closeModal('geoFormulaModal');
  if (cancelBtn) cancelBtn.onclick = () => closeModal('geoFormulaModal');

  const insertBtn = $('geoFormulaInsertBtn');
  if (insertBtn) {
    insertBtn.onclick = async () => {
      const latex = inputEl.value.trim();
      if (!latex) return;
      await addKatexFormulaToCanvas(latex, formulaColor, formulaSize);
      closeModal('geoFormulaModal');
    };
  }

  renderFormulaButtons();
  updateFormulaPreview();
}

async function addKatexFormulaToCanvas(latex, color = '#0f172a', fontSize = 26) {
  const fabric = window.fabric;
  const katex = window.katex;
  if (!fabric || !fabricCanvas || !katex) return;

  try {
    const htmlString = katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false
    });

    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.fontSize = `${fontSize}px`;
    wrapper.style.color = color;
    wrapper.style.fontFamily = 'KaTeX_Main, Times New Roman, serif';
    wrapper.style.padding = '8px 12px';
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '-9999px';
    wrapper.innerHTML = htmlString;
    document.body.appendChild(wrapper);

    const rect = wrapper.getBoundingClientRect();
    const width = Math.max(Math.ceil(rect.width) + 8, 30);
    const height = Math.max(Math.ceil(rect.height) + 8, 24);
    document.body.removeChild(wrapper);

    const scale = 2;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width * scale}" height="${height * scale}" viewBox="0 0 ${width} ${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:${fontSize}px; color:${color}; font-family: KaTeX_Main, Times New Roman, serif; display:flex; align-items:center; justify-content:center; height:100%;">
            ${htmlString}
          </div>
        </foreignObject>
      </svg>
    `;

    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

    const imgEl = new Image();
    imgEl.onload = () => {
      const c = document.createElement('canvas');
      c.width = width * scale;
      c.height = height * scale;
      const ctx = c.getContext('2d');
      ctx.drawImage(imgEl, 0, 0);
      const pngUrl = c.toDataURL('image/png');

      fabric.Image.fromURL(pngUrl, (fImg) => {
        fImg.set({
          left: 380,
          top: 240,
          originX: 'center',
          originY: 'center',
          selectable: true,
          hasControls: true,
          hasBorders: true,
          transparentCorners: false,
          cornerColor: '#2563eb',
          cornerSize: 8,
          scaleX: 0.5,
          scaleY: 0.5
        });
        fabricCanvas.add(fImg);
        fabricCanvas.setActiveObject(fImg);
        fabricCanvas.renderAll();
        saveHistoryState();
        setTool('select');
      });
    };
    imgEl.src = svgDataUrl;
  } catch (err) {
    console.error('KaTeX to Canvas hatası:', err);
  }
}

// ============================================================================
// TARİHÇE VE KLAVYE KISAYOLLARI
// ============================================================================

function saveHistoryState() {
  if (!fabricCanvas || isHistoryUpdating) return;
  const json = JSON.stringify(fabricCanvas.toJSON());
  if (historyIndex < historyStack.length - 1) {
    historyStack.splice(historyIndex + 1);
  }
  historyStack.push(json);
  historyIndex++;
}

function handleUndo() {
  if (!fabricCanvas || historyIndex <= 0) return;
  isHistoryUpdating = true;
  historyIndex--;
  fabricCanvas.loadFromJSON(historyStack[historyIndex], () => {
    fabricCanvas.renderAll();
    isHistoryUpdating = false;
    hideFloatingToolbar();
  });
}

function handleRedo() {
  if (!fabricCanvas || historyIndex >= historyStack.length - 1) return;
  isHistoryUpdating = true;
  historyIndex++;
  fabricCanvas.loadFromJSON(historyStack[historyIndex], () => {
    fabricCanvas.renderAll();
    isHistoryUpdating = false;
    hideFloatingToolbar();
  });
}

function onGlobalKeyDown(e) {
  const modal = $('geoModal');
  if (!modal || modal.classList.contains('hidden')) return;
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

  if (e.key === 'Escape') {
    resetToolState();
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    deleteActiveObjects();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    if (e.shiftKey) handleRedo();
    else handleUndo();
    e.preventDefault();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
    handleRedo();
    e.preventDefault();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
    duplicateActiveObject();
    e.preventDefault();
  }
}

// ============================================================================
// DIŞA AKTARMA (2X RETINA PNG EXPORT)
// ============================================================================

export function exportGeometryAsPNG() {
  if (!fabricCanvas) return null;
  hideSnapIndicator();
  fabricCanvas.discardActiveObject();
  fabricCanvas.renderAll();

  return fabricCanvas.toDataURL({
    format: 'png',
    multiplier: 2
  });
}

// ============================================================================
// EVENT LISTENERS KURULUMU
// ============================================================================

export function setupGeometryEventListeners() {
  // Araç Butonları
  const toolBtns = [
    { id: 'geoToolSelect', tool: 'select' },
    { id: 'geoToolShape', tool: 'shape' },
    { id: 'geoToolPolygon', tool: 'shape' },
    { id: 'geoToolLine', tool: 'line' },
    { id: 'geoToolCircle', tool: 'circle' },
    { id: 'geoToolText', tool: 'text' }
  ];

  toolBtns.forEach(({ id, tool }) => {
    const btn = $(id);
    if (btn) {
      btn.onclick = () => setTool(tool);
    }
  });

  // Şekli Tamamla Butonu
  const polyFinishBtn = $('geoPolygonFinishBtn');
  if (polyFinishBtn) {
    polyFinishBtn.onclick = () => finishShape();
  }

  // KaTeX Aç Butonu
  const openFormulaBtn = $('geoOpenFormulaBtn');
  if (openFormulaBtn) {
    openFormulaBtn.onclick = () => openModal('geoFormulaModal');
  }

  // Şablon Çekmecesini Aç/Kapat
  const toggleTplBtn = $('geoToggleTplBtn');
  const tplDrawer = $('geoTemplateDrawer');
  const closeDrawerBtn = $('geoCloseDrawerBtn');
  if (toggleTplBtn && tplDrawer) {
    toggleTplBtn.onclick = () => tplDrawer.classList.toggle('hidden');
  }
  if (closeDrawerBtn && tplDrawer) {
    closeDrawerBtn.onclick = () => tplDrawer.classList.add('hidden');
  }

  if (tplDrawer) {
    tplDrawer.querySelectorAll('[data-tpl]').forEach((btn) => {
      btn.onclick = () => insertTemplate(btn.dataset.tpl);
    });
  }

  // Floating Toolbar Kurulumu
  setupFloatingToolbarPalettes();

  // Zoom
  const zoomIn = $('geoZoomIn');
  const zoomOut = $('geoZoomOut');
  const zoomLbl = $('geoZoomLabel');
  if (zoomIn && zoomOut) {
    zoomIn.onclick = () => {
      if (!fabricCanvas) return;
      zoomLevel = Math.min(200, zoomLevel + 10);
      fabricCanvas.setZoom(zoomLevel / 100);
      fabricCanvas.renderAll();
      if (zoomLbl) zoomLbl.textContent = `%${zoomLevel}`;
    };
    zoomOut.onclick = () => {
      if (!fabricCanvas) return;
      zoomLevel = Math.max(50, zoomLevel - 10);
      fabricCanvas.setZoom(zoomLevel / 100);
      fabricCanvas.renderAll();
      if (zoomLbl) zoomLbl.textContent = `%${zoomLevel}`;
    };
  }

  // Izgara & Snap
  const toggleGridBtn = $('geoToggleGrid');
  if (toggleGridBtn) {
    toggleGridBtn.onclick = () => {
      gridEnabled = !gridEnabled;
      updateGridBackground(gridEnabled);
      toggleGridBtn.className = gridEnabled
        ? 'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300 transition'
        : 'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 transition';
    };
  }

  const toggleSnapBtn = $('geoToggleSnap');
  if (toggleSnapBtn) {
    toggleSnapBtn.onclick = () => {
      snapEnabled = !snapEnabled;
      toggleSnapBtn.className = snapEnabled
        ? 'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300 transition'
        : 'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 transition';
    };
  }

  // Geri Al / İleri Al / Temizle
  const undoBtn = $('geoBtnUndo');
  const redoBtn = $('geoBtnRedo');
  const clearBtn = $('geoBtnClear');
  if (undoBtn) undoBtn.onclick = handleUndo;
  if (redoBtn) redoBtn.onclick = handleRedo;
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (!fabricCanvas) return;
      fabricCanvas.clear();
      updateGridBackground(gridEnabled);
      saveHistoryState();
      hideFloatingToolbar();
    };
  }

  // Kapatma & İptal
  const closeBtn = $('geoModalClose');
  const cancelBtn = $('geoModalCancel');
  if (closeBtn) closeBtn.onclick = () => closeModal('geoModal');
  if (cancelBtn) cancelBtn.onclick = () => closeModal('geoModal');

  // Soruya Ekle Butonu
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

  setupKatexFormulaModule();
}

function setupFloatingToolbarPalettes() {
  const angleBtn = $('geoFloatAngleBtn');
  const anglePop = $('geoFloatAnglePopover');

  const strokeBtn = $('geoFloatStrokeBtn');
  const strokePop = $('geoFloatStrokePopover');
  const strokeGrid = $('geoStrokeGrid');

  const fillBtn = $('geoFloatFillBtn');
  const fillPop = $('geoFloatFillPopover');
  const fillGrid = $('geoFillGrid');

  const widthBtn = $('geoFloatWidthBtn');
  const widthPop = $('geoFloatWidthPopover');
  const dashedCheck = $('geoFloatDashed');

  const dupBtn = $('geoFloatDupBtn');
  const delBtn = $('geoFloatDelBtn');

  // Açı Gösterim Popover
  if (angleBtn && anglePop) {
    angleBtn.onclick = (e) => {
      e.stopPropagation();
      anglePop.classList.toggle('hidden');
      if (strokePop) strokePop.classList.add('hidden');
      if (fillPop) fillPop.classList.add('hidden');
      if (widthPop) widthPop.classList.add('hidden');
    };

    anglePop.querySelectorAll('[data-angle-mode]').forEach((b) => {
      b.onclick = () => {
        setAngleDisplayMode(b.dataset.angleMode);
        anglePop.classList.add('hidden');
      };
    });
  }

  // Çizgi Rengi Grid
  if (strokeGrid) {
    strokeGrid.innerHTML = '';
    STROKE_COLORS.forEach((color) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'h-5 w-5 rounded-full border border-black/10 transition hover:scale-125';
      b.style.backgroundColor = color;
      b.onclick = () => {
        currentStyle.strokeColor = color;
        updateActiveObjectStyle({ stroke: color });
        strokePop.classList.add('hidden');
      };
      strokeGrid.appendChild(b);
    });
  }

  // Dolgu Rengi Grid
  if (fillGrid) {
    fillGrid.innerHTML = '';
    FILL_COLORS.forEach((color) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'h-5 w-5 rounded-full border border-slate-300 transition hover:scale-125 relative flex items-center justify-center';
      b.style.backgroundColor = color === 'transparent' ? '#ffffff' : color;
      if (color === 'transparent') {
        b.innerHTML = '<span class="text-[10px] text-red-500 font-bold">✕</span>';
      }
      b.onclick = () => {
        currentStyle.fillColor = color;
        updateActiveObjectStyle({ fill: color });
        fillPop.classList.add('hidden');
      };
      fillGrid.appendChild(b);
    });
  }

  if (strokeBtn && strokePop) {
    strokeBtn.onclick = (e) => {
      e.stopPropagation();
      strokePop.classList.toggle('hidden');
      if (anglePop) anglePop.classList.add('hidden');
      if (fillPop) fillPop.classList.add('hidden');
      if (widthPop) widthPop.classList.add('hidden');
    };
  }

  if (fillBtn && fillPop) {
    fillBtn.onclick = (e) => {
      e.stopPropagation();
      fillPop.classList.toggle('hidden');
      if (anglePop) anglePop.classList.add('hidden');
      if (strokePop) strokePop.classList.add('hidden');
      if (widthPop) widthPop.classList.add('hidden');
    };
  }

  if (widthBtn && widthPop) {
    widthBtn.onclick = (e) => {
      e.stopPropagation();
      widthPop.classList.toggle('hidden');
      if (anglePop) anglePop.classList.add('hidden');
      if (strokePop) strokePop.classList.add('hidden');
      if (fillPop) fillPop.classList.add('hidden');
    };
  }

  const widthContainer = $('geoWidthButtons');
  if (widthContainer) {
    widthContainer.querySelectorAll('[data-w]').forEach((btn) => {
      btn.onclick = () => {
        const w = parseInt(btn.dataset.w, 10);
        currentStyle.strokeWidth = w;
        updateActiveObjectStyle({ strokeWidth: w });
        widthContainer.querySelectorAll('[data-w]').forEach((b) => {
          b.className = 'flex-1 rounded-md py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800';
        });
        btn.className = 'flex-1 rounded-md py-1 text-xs font-bold bg-blue-600 text-white';
      };
    });
  }

  if (dashedCheck) {
    dashedCheck.onchange = (e) => {
      currentStyle.isDashed = e.target.checked;
      updateActiveObjectStyle({
        strokeDashArray: e.target.checked ? [6, 6] : null
      });
    };
  }

  if (dupBtn) dupBtn.onclick = duplicateActiveObject;
  if (delBtn) delBtn.onclick = deleteActiveObjects;
}

export const initGeometryDrawer = setupGeometryEventListeners;

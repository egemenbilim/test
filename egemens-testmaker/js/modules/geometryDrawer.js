import { $, openModal, closeModal } from '../utils.js';

/**
 * Vektörel Geometri Çizim Aracı ve KaTeX Denklem Tuvali (Geometry & Math Canvas Component)
 * Motor: Fabric.js v5/v6 + KaTeX
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
  fontSize: 20
};

let gridEnabled = true;
let snapEnabled = true;
let zoomLevel = 100;

// Geri Al / İleri Al Yığını
const historyStack = [];
let historyIndex = -1;
let isHistoryUpdating = false;

// Çokgen Çizim Durumu
let polygonPoints = [];
let polygonTempLine = null;
let polygonMarkers = [];

// Doğru Çizim Durumu
let drawingLine = null;
let isDrawingLine = false;

// 3 Noktalı Açı Çizim Durumu
const angleState = {
  step: 1,
  p1: null,
  p2: null, // Vertex (Köşe)
  p3: null,
  tempMarkers: []
};

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

  // Canvas'ı gecikmeli başlat
  setTimeout(() => {
    initFabricCanvasIfNeeded();
    resetToolState();
  }, 50);
}

export function syncControlsFromState() {
  // Uyumluluk için boş tutuldu
}

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

  // Olay Dinleyicileri
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

  // Pencere / Klavye Dinleyicileri
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

function snap(val, step = 10) {
  if (!snapEnabled) return val;
  return Math.round(val / step) * step;
}

// ============================================================================
// ARAÇ YÖNETİMİ & REHBER METİNLERİ
// ============================================================================

function setTool(tool) {
  activeTool = tool;

  // Buton aktiflik sınıfları
  document.querySelectorAll('[data-tool]').forEach((btn) => {
    const isAct = btn.dataset.tool === tool;
    if (isAct) {
      btn.className = 'active flex h-11 w-11 flex-col items-center justify-center rounded-xl transition bg-blue-50 text-blue-600 font-bold border border-blue-200 shadow-sm dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400';
    } else {
      btn.className = 'flex h-11 w-11 flex-col items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition';
    }
  });

  // İpucu Toast Metni
  const guidanceEl = $('geoGuidanceText');
  const polygonBtn = $('geoPolygonFinishBtn');

  if (polygonBtn) {
    polygonBtn.classList.toggle('hidden', tool !== 'polygon');
    polygonBtn.classList.toggle('flex', tool === 'polygon');
  }

  if (guidanceEl) {
    switch (tool) {
      case 'select':
        guidanceEl.textContent = 'Nesneleri seçmek, taşımak, döndürmek veya boyutlandırmak için tıklayın / sürükleyin.';
        break;
      case 'point':
        guidanceEl.textContent = 'Tuvalde nokta eklemek istediğiniz yere tıklayın.';
        break;
      case 'line':
        guidanceEl.textContent = 'Doğru parçasını oluşturmak için başlangıç noktasından bitişe doğru sürükleyin.';
        break;
      case 'polygon':
        guidanceEl.textContent = 'Çokgenin köşelerine sırayla tıklayın. Kapatmak için ilk noktaya tıklayın veya [Çokgeni Tamamla] butonuna basın.';
        break;
      case 'circle':
        guidanceEl.textContent = 'Merkez noktasını belirleyip sürükleyerek çember oluşturun.';
        break;
      case 'angle':
        guidanceEl.textContent = 'Açıyı oluşturmak için sırayla 3 nokta seçin: 1. Kol Noktası ➔ 2. Köşe (Vertex) ➔ 3. Kol Noktası.';
        break;
      case 'text':
        guidanceEl.textContent = 'Metin veya köşe harfi (A, B, C) eklemek istediğiniz konuma tıklayın.';
        break;
      default:
        guidanceEl.textContent = 'Vektörel çizim aracını kullanmaya hazırsınız.';
    }
  }

  // Fabric canvas cursor & selection
  if (fabricCanvas) {
    if (tool === 'select') {
      fabricCanvas.selection = true;
      fabricCanvas.defaultCursor = 'default';
      fabricCanvas.forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;
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
  cleanupPolygonDrawing();
  cleanupAngleDrawing();
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
  const pt = { x: snap(pointer.x), y: snap(pointer.y) };

  if (activeTool === 'point') {
    const point = new fabric.Circle({
      left: pt.x,
      top: pt.y,
      radius: 4,
      fill: currentStyle.strokeColor,
      originX: 'center',
      originY: 'center',
      selectable: true,
      cornerColor: '#2563eb',
      cornerSize: 8,
      transparentCorners: false
    });
    fabricCanvas.add(point);
    fabricCanvas.renderAll();
    saveHistoryState();
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
  } else if (activeTool === 'polygon') {
    // İlk noktaya yakın tıklandıysa bitir
    if (polygonPoints.length >= 3) {
      const firstPt = polygonPoints[0];
      const dist = Math.hypot(pt.x - firstPt.x, pt.y - firstPt.y);
      if (dist < 15) {
        finishPolygon();
        return;
      }
    }

    polygonPoints.push(pt);

    // Kırmızı köşe işareti
    const marker = new fabric.Circle({
      left: pt.x,
      top: pt.y,
      radius: 4,
      fill: '#ef4444',
      stroke: '#ffffff',
      strokeWidth: 1.5,
      originX: 'center',
      originY: 'center',
      selectable: false
    });
    fabricCanvas.add(marker);
    polygonMarkers.push(marker);

    // Kauçuk kılavuz çizgi
    if (!polygonTempLine) {
      polygonTempLine = new fabric.Line([pt.x, pt.y, pt.x, pt.y], {
        stroke: currentStyle.strokeColor,
        strokeWidth: currentStyle.strokeWidth,
        strokeDashArray: [4, 4],
        selectable: false
      });
      fabricCanvas.add(polygonTempLine);
    } else {
      polygonTempLine.set({ x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y });
    }
    fabricCanvas.renderAll();
  } else if (activeTool === 'circle') {
    const circle = new fabric.Circle({
      left: pt.x,
      top: pt.y,
      radius: 45,
      fill: currentStyle.fillColor,
      stroke: currentStyle.strokeColor,
      strokeWidth: currentStyle.strokeWidth,
      strokeDashArray: currentStyle.isDashed ? [6, 6] : null,
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
  } else if (activeTool === 'angle') {
    // 3 Noktalı İnteraktif Açı Aracı
    const marker = new fabric.Circle({
      left: pt.x,
      top: pt.y,
      radius: 5,
      fill: angleState.step === 2 ? '#2563eb' : '#dc2626',
      stroke: '#ffffff',
      strokeWidth: 1.5,
      originX: 'center',
      originY: 'center',
      selectable: false
    });
    fabricCanvas.add(marker);
    angleState.tempMarkers.push(marker);

    if (angleState.step === 1) {
      angleState.p1 = pt;
      angleState.step = 2;
    } else if (angleState.step === 2) {
      angleState.p2 = pt; // Vertex (Köşe)
      angleState.step = 3;
    } else if (angleState.step === 3) {
      angleState.p3 = pt;
      // Hesapla ve oluştur
      createAngleObject(angleState.p1, angleState.p2, angleState.p3);
    }
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
  const pt = { x: snap(pointer.x), y: snap(pointer.y) };

  if (isDrawingLine && drawingLine) {
    drawingLine.set({ x2: pt.x, y2: pt.y });
    fabricCanvas.renderAll();
  } else if (activeTool === 'polygon' && polygonTempLine) {
    polygonTempLine.set({ x2: pt.x, y2: pt.y });
    fabricCanvas.renderAll();
  }
}

function onCanvasMouseUp() {
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
// ÇOKGEN & AÇI BİTİRME MEKANİZMALARI
// ============================================================================

function finishPolygon() {
  if (!fabricCanvas || polygonPoints.length < 3) {
    cleanupPolygonDrawing();
    return;
  }

  const fabric = window.fabric;
  const pts = [...polygonPoints];
  cleanupPolygonDrawing();

  const poly = new fabric.Polygon(pts, {
    fill: currentStyle.fillColor,
    stroke: currentStyle.strokeColor,
    strokeWidth: currentStyle.strokeWidth,
    strokeDashArray: currentStyle.isDashed ? [6, 6] : null,
    selectable: true,
    cornerColor: '#2563eb',
    cornerSize: 8,
    transparentCorners: false
  });

  fabricCanvas.add(poly);
  fabricCanvas.setActiveObject(poly);
  fabricCanvas.renderAll();
  saveHistoryState();
  setTool('select');
}

function cleanupPolygonDrawing() {
  if (!fabricCanvas) return;
  if (polygonTempLine) {
    fabricCanvas.remove(polygonTempLine);
    polygonTempLine = null;
  }
  polygonMarkers.forEach((m) => fabricCanvas.remove(m));
  polygonMarkers = [];
  polygonPoints = [];
  fabricCanvas.renderAll();
}

function createAngleObject(p1, p2, p3) {
  const fabric = window.fabric;
  if (!fabric || !fabricCanvas) return;

  const v1x = p1.x - p2.x;
  const v1y = p1.y - p2.y;
  const v2x = p3.x - p2.x;
  const v2y = p3.y - p2.y;

  let theta1 = Math.atan2(v1y, v1x);
  let theta2 = Math.atan2(v2y, v2x);

  let diff = theta2 - theta1;
  while (diff < 0) diff += 2 * Math.PI;
  while (diff >= 2 * Math.PI) diff -= 2 * Math.PI;

  let startAngle = theta1;
  let sweepAngle = diff;
  let isClockwise = true;

  if (diff > Math.PI) {
    startAngle = theta2;
    sweepAngle = 2 * Math.PI - diff;
    isClockwise = false;
  }

  const angleDegrees = Math.round((sweepAngle * 180) / Math.PI);
  const arcR = 30;

  // Arc path üretimi
  const sX = p2.x + arcR * Math.cos(startAngle);
  const sY = p2.y + arcR * Math.sin(startAngle);
  const endAngle = isClockwise ? startAngle + sweepAngle : startAngle - sweepAngle;
  const eX = p2.x + arcR * Math.cos(endAngle);
  const eY = p2.y + arcR * Math.sin(endAngle);

  const pathStr = `M ${sX.toFixed(1)} ${sY.toFixed(1)} A ${arcR} ${arcR} 0 0 1 ${eX.toFixed(1)} ${eY.toFixed(1)}`;

  const arcPath = new fabric.Path(pathStr, {
    stroke: currentStyle.strokeColor,
    strokeWidth: currentStyle.strokeWidth,
    fill: 'transparent',
    selectable: true
  });

  // Açıortay yönünde etiket konumu
  const bisectorAngle = isClockwise ? startAngle + sweepAngle / 2 : startAngle - sweepAngle / 2;
  const labelDist = arcR + 18;
  const lblX = p2.x + Math.cos(bisectorAngle) * labelDist;
  const lblY = p2.y + Math.sin(bisectorAngle) * labelDist;

  const angleLabel = new fabric.IText(`${angleDegrees}°`, {
    left: lblX,
    top: lblY,
    fontSize: 16,
    fontFamily: 'Noto Sans, sans-serif',
    fontWeight: 'bold',
    fill: currentStyle.strokeColor,
    originX: 'center',
    originY: 'center',
    selectable: true
  });

  const group = new fabric.Group([arcPath, angleLabel], {
    selectable: true,
    cornerColor: '#2563eb',
    cornerSize: 8,
    transparentCorners: false
  });

  cleanupAngleDrawing();
  fabricCanvas.add(group);
  fabricCanvas.setActiveObject(group);
  fabricCanvas.renderAll();
  saveHistoryState();
  setTool('select');
}

function cleanupAngleDrawing() {
  if (!fabricCanvas) return;
  angleState.tempMarkers.forEach((m) => fabricCanvas.remove(m));
  angleState.tempMarkers = [];
  angleState.step = 1;
  angleState.p1 = null;
  angleState.p2 = null;
  angleState.p3 = null;
  fabricCanvas.renderAll();
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

  // Toolbar konumu
  const bound = target.getBoundingRect(true);
  const container = $('geoCanvasContainer');
  if (!container) return;

  const top = Math.max(10, bound.top - 48);
  const left = Math.max(10, bound.left + bound.width / 2);

  toolbar.style.top = `${top}px`;
  toolbar.style.left = `${left}px`;
  toolbar.style.transform = 'translateX(-50%)';
  toolbar.classList.remove('hidden');
  toolbar.classList.add('flex');

  // Preview güncelle
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
  const p1 = $('geoFloatStrokePopover');
  const p2 = $('geoFloatFillPopover');
  const p3 = $('geoFloatWidthPopover');
  if (p1) p1.classList.add('hidden');
  if (p2) p2.classList.add('hidden');
  if (p3) p3.classList.add('hidden');
}

function updateActiveObjectStyle(updates) {
  if (!fabricCanvas) return;
  const activeObjs = fabricCanvas.getActiveObjects();
  if (!activeObjs || activeObjs.length === 0) return;

  activeObjs.forEach((obj) => {
    if (updates.stroke !== undefined) obj.set('stroke', updates.stroke);
    if (updates.fill !== undefined) obj.set('fill', updates.fill);
    if (updates.strokeWidth !== undefined) obj.set('strokeWidth', updates.strokeWidth);
    if (updates.strokeDashArray !== undefined) obj.set('strokeDashArray', updates.strokeDashArray);
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
// DÜZGÜN ÇOKGEN, ELİPS VE ŞABLONLAR
// ============================================================================

function addEllipse() {
  const fabric = window.fabric;
  if (!fabric || !fabricCanvas) return;

  const ellipse = new fabric.Ellipse({
    left: 380,
    top: 245,
    rx: 80,
    ry: 50,
    fill: currentStyle.fillColor,
    stroke: currentStyle.strokeColor,
    strokeWidth: currentStyle.strokeWidth,
    strokeDashArray: currentStyle.isDashed ? [6, 6] : null,
    originX: 'center',
    originY: 'center',
    selectable: true,
    cornerColor: '#2563eb',
    cornerSize: 8,
    transparentCorners: false
  });

  fabricCanvas.add(ellipse);
  fabricCanvas.setActiveObject(ellipse);
  fabricCanvas.renderAll();
  saveHistoryState();
  setTool('select');
}

function addRegularPolygon(sides) {
  const fabric = window.fabric;
  if (!fabric || !fabricCanvas) return;

  const center = { x: 380, y: 245 };
  const radius = 70;
  const points = [];
  const angleStep = (2 * Math.PI) / sides;
  const startOffset = -Math.PI / 2;

  for (let i = 0; i < sides; i++) {
    const ang = startOffset + i * angleStep;
    points.push({
      x: center.x + radius * Math.cos(ang),
      y: center.y + radius * Math.sin(ang)
    });
  }

  const poly = new fabric.Polygon(points, {
    fill: currentStyle.fillColor,
    stroke: currentStyle.strokeColor,
    strokeWidth: currentStyle.strokeWidth,
    strokeDashArray: currentStyle.isDashed ? [6, 6] : null,
    selectable: true,
    cornerColor: '#2563eb',
    cornerSize: 8,
    transparentCorners: false
  });

  fabricCanvas.add(poly);
  fabricCanvas.setActiveObject(poly);
  fabricCanvas.renderAll();
  saveHistoryState();
  setTool('select');
}

function insertTemplate(tplName) {
  const fabric = window.fabric;
  if (!fabric || !fabricCanvas) return;

  if (tplName === 'dik_ucgen') {
    // 3-4-5 Dik üçgen
    const pA = { x: 260, y: 150 };
    const pB = { x: 260, y: 350 };
    const pC = { x: 520, y: 350 };

    const triangle = new fabric.Polygon([pA, pB, pC], {
      fill: 'transparent',
      stroke: '#0f172a',
      strokeWidth: 2,
      selectable: true
    });

    // 90° Diklik kutusu
    const rightAngleBox = new fabric.Polyline([
      { x: pB.x, y: pB.y - 18 },
      { x: pB.x + 18, y: pB.y - 18 },
      { x: pB.x + 18, y: pB.y }
    ], {
      fill: 'transparent',
      stroke: '#0f172a',
      strokeWidth: 1.5,
      selectable: false
    });

    const dot = new fabric.Circle({
      left: pB.x + 9,
      top: pB.y - 9,
      radius: 2,
      fill: '#0f172a',
      originX: 'center',
      originY: 'center',
      selectable: false
    });

    const lblA = new fabric.IText('A', { left: pA.x - 12, top: pA.y - 25, fontSize: 18, fontWeight: 'bold' });
    const lblB = new fabric.IText('B', { left: pB.x - 22, top: pB.y + 4, fontSize: 18, fontWeight: 'bold' });
    const lblC = new fabric.IText('C', { left: pC.x + 8, top: pC.y + 4, fontSize: 18, fontWeight: 'bold' });

    const group = new fabric.Group([triangle, rightAngleBox, dot, lblA, lblB, lblC], {
      left: 240,
      top: 130,
      selectable: true,
      cornerColor: '#2563eb',
      cornerSize: 8,
      transparentCorners: false
    });

    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
  } else if (tplName === 'eskenar') {
    const pA = { x: 380, y: 140 };
    const pB = { x: 240, y: 360 };
    const pC = { x: 520, y: 360 };

    const triangle = new fabric.Polygon([pA, pB, pC], {
      fill: 'transparent',
      stroke: '#0f172a',
      strokeWidth: 2
    });

    const lblA = new fabric.IText('A', { left: pA.x - 6, top: pA.y - 24, fontSize: 18, fontWeight: 'bold' });
    const lblB = new fabric.IText('B', { left: pB.x - 20, top: pB.y + 2, fontSize: 18, fontWeight: 'bold' });
    const lblC = new fabric.IText('C', { left: pC.x + 8, top: pC.y + 2, fontSize: 18, fontWeight: 'bold' });

    const group = new fabric.Group([triangle, lblA, lblB, lblC], {
      left: 220,
      top: 120,
      selectable: true
    });
    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
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

    const radiusLine1 = new fabric.Line([380, 240, 470, 240], { stroke: '#0f172a', strokeWidth: 1.8 });
    const radiusLine2 = new fabric.Line([380, 240, 425, 162], { stroke: '#0f172a', strokeWidth: 1.8 });

    const group = new fabric.Group([circle, centerPoint, centerLbl, radiusLine1, radiusLine2], {
      left: 280,
      top: 140,
      selectable: true
    });
    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
  } else if (tplName === 'dikdortgen') {
    const rect = new fabric.Rect({
      left: 240,
      top: 160,
      width: 280,
      height: 160,
      fill: 'transparent',
      stroke: '#0f172a',
      strokeWidth: 2,
      selectable: true
    });
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
  } else {
    // Genel üçgen şablonu
    addRegularPolygon(3);
  }

  fabricCanvas.renderAll();
  saveHistoryState();
  setTool('select');
  $('geoTemplateDrawer').classList.add('hidden');
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

  // Sekme değiştirme
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

  // Sembol butonlarını render et
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

  // Canlı KaTeX Önizleme
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

  // Renk seçenekleri
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

  // Boyut seçimi
  if (sizeSelect) {
    sizeSelect.onchange = (e) => {
      formulaSize = parseInt(e.target.value, 10) || 26;
    };
  }

  // Kapatma
  const closeBtn = $('geoFormulaClose');
  const cancelBtn = $('geoFormulaCancel');
  if (closeBtn) closeBtn.onclick = () => closeModal('geoFormulaModal');
  if (cancelBtn) cancelBtn.onclick = () => closeModal('geoFormulaModal');

  // Tuvale Ekle Butonu
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

    const scale = 2; // Retina 2x
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
// TARİHÇE (UNDO / REDO) VE KLAVYE KISAYOLLARI
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
    if (e.shiftKey) {
      handleRedo();
    } else {
      handleUndo();
    }
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
  fabricCanvas.discardActiveObject();
  fabricCanvas.renderAll();

  return fabricCanvas.toDataURL({
    format: 'png',
    multiplier: 2 // 2x Retina Yüksek Çözünürlük
  });
}

// ============================================================================
// TÜM ARAYÜZ ETKİNLİK DİNLEYİCİLERİNİ BAĞLAMA (SETUP)
// ============================================================================

export function setupGeometryEventListeners() {
  // Sol Dikey Araç Çubuğu Butonları
  const toolBtns = [
    { id: 'geoToolSelect', tool: 'select' },
    { id: 'geoToolPoint', tool: 'point' },
    { id: 'geoToolLine', tool: 'line' },
    { id: 'geoToolPolygon', tool: 'polygon' },
    { id: 'geoToolCircle', tool: 'circle' },
    { id: 'geoToolAngle', tool: 'angle' },
    { id: 'geoToolText', tool: 'text' }
  ];

  toolBtns.forEach(({ id, tool }) => {
    const btn = $(id);
    if (btn) {
      btn.onclick = () => {
        closeMorePopover();
        setTool(tool);
      };
    }
  });

  // Çokgeni Tamamla Butonu
  const polyFinishBtn = $('geoPolygonFinishBtn');
  if (polyFinishBtn) {
    polyFinishBtn.onclick = () => finishPolygon();
  }

  // Daha Fazla Şekil & Formül Popover
  const moreBtn = $('geoMoreBtn');
  const morePopover = $('geoMorePopover');
  if (moreBtn && morePopover) {
    moreBtn.onclick = (e) => {
      e.stopPropagation();
      morePopover.classList.toggle('hidden');
    };
  }

  function closeMorePopover() {
    if (morePopover) morePopover.classList.add('hidden');
  }

  // KaTeX Aç Butonu
  const openFormulaBtn = $('geoOpenFormulaBtn');
  if (openFormulaBtn) {
    openFormulaBtn.onclick = () => {
      closeMorePopover();
      openModal('geoFormulaModal');
    };
  }

  // Hazır Şablonlar Çekmecesini Aç/Kapat
  const toggleTplBtn = $('geoToggleTplBtn');
  const tplDrawer = $('geoTemplateDrawer');
  const closeDrawerBtn = $('geoCloseDrawerBtn');
  if (toggleTplBtn && tplDrawer) {
    toggleTplBtn.onclick = () => {
      closeMorePopover();
      tplDrawer.classList.toggle('hidden');
    };
  }
  if (closeDrawerBtn && tplDrawer) {
    closeDrawerBtn.onclick = () => tplDrawer.classList.add('hidden');
  }

  // Şablon Tıklamaları
  if (tplDrawer) {
    tplDrawer.querySelectorAll('[data-tpl]').forEach((btn) => {
      btn.onclick = () => insertTemplate(btn.dataset.tpl);
    });
  }

  // Elips ve Çokgen Ekle Butonları
  const addEllipseBtn = $('geoAddEllipseBtn');
  if (addEllipseBtn) {
    addEllipseBtn.onclick = () => {
      closeMorePopover();
      addEllipse();
    };
  }

  const addPentagonBtn = $('geoAddPentagonBtn');
  if (addPentagonBtn) {
    addPentagonBtn.onclick = () => {
      closeMorePopover();
      addRegularPolygon(5);
    };
  }

  const addHexagonBtn = $('geoAddHexagonBtn');
  if (addHexagonBtn) {
    addHexagonBtn.onclick = () => {
      closeMorePopover();
      addRegularPolygon(6);
    };
  }

  const addOctagonBtn = $('geoAddOctagonBtn');
  if (addOctagonBtn) {
    addOctagonBtn.onclick = () => {
      closeMorePopover();
      addRegularPolygon(8);
    };
  }

  // Kayan Toolbar Paletleri (Floating Style Toolbar)
  setupFloatingToolbarPalettes();

  // Alt Kontrol Çubuğu: Zoom
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

  // Izgara & Snap Butonları
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

  // KaTeX Formül Modülü Başlatma
  setupKatexFormulaModule();
}

function setupFloatingToolbarPalettes() {
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

  // Çizgi Rengi Grid Doldur
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

  // Dolgu Rengi Grid Doldur
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

  // Popover Aç/Kapa
  if (strokeBtn && strokePop) {
    strokeBtn.onclick = (e) => {
      e.stopPropagation();
      strokePop.classList.toggle('hidden');
      if (fillPop) fillPop.classList.add('hidden');
      if (widthPop) widthPop.classList.add('hidden');
    };
  }

  if (fillBtn && fillPop) {
    fillBtn.onclick = (e) => {
      e.stopPropagation();
      fillPop.classList.toggle('hidden');
      if (strokePop) strokePop.classList.add('hidden');
      if (widthPop) widthPop.classList.add('hidden');
    };
  }

  if (widthBtn && widthPop) {
    widthBtn.onclick = (e) => {
      e.stopPropagation();
      widthPop.classList.toggle('hidden');
      if (strokePop) strokePop.classList.add('hidden');
      if (fillPop) fillPop.classList.add('hidden');
    };
  }

  // Kalınlık Butonları
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

  // Kesikli Çizgi
  if (dashedCheck) {
    dashedCheck.onchange = (e) => {
      currentStyle.isDashed = e.target.checked;
      updateActiveObjectStyle({
        strokeDashArray: e.target.checked ? [6, 6] : null
      });
    };
  }

  // Klonla & Sil
  if (dupBtn) dupBtn.onclick = duplicateActiveObject;
  if (delBtn) delBtn.onclick = deleteActiveObjects;
}

export const initGeometryDrawer = setupGeometryEventListeners;


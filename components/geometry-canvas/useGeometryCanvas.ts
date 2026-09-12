'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ToolType,
  ShapeStyle,
  Point2D,
  AngleCreationState,
  GeometryExportOptions,
} from './types';
import {
  calculateAngle,
  generateArcPath,
  generateRegularPolygonPoints,
  snapToGrid,
  katexToImage,
} from './geometryMath';

export function useGeometryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<any>(null);

  // Durum Yönetimi
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [style, setStyle] = useState<ShapeStyle>({
    strokeColor: '#0f172a',
    fillColor: 'transparent',
    strokeWidth: 2,
    isDashed: false,
    fontSize: 18,
  });

  const [gridEnabled, setGridEnabled] = useState<boolean>(true);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Kayan Araç Çubuğu Durumu
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(false);

  // Tarihçe (Undo / Redo)
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isHistoryUpdatingRef = useRef<boolean>(false);

  // İnteraktif Çizim Durumları
  const drawingLineRef = useRef<any>(null);
  const isDrawingLineRef = useRef<boolean>(false);

  // Serbest Çokgen Durumu
  const polygonPointsRef = useRef<Point2D[]>([]);
  const polygonTempLineRef = useRef<any>(null);
  const polygonMarkersRef = useRef<any[]>([]);

  // 3 Noktalı Açı Durumu
  const angleStateRef = useRef<AngleCreationState>({
    step: 1,
    p1: null,
    p2: null,
    p3: null,
    tempMarkers: [],
  });

  // Tarihçeye kaydet
  const saveState = useCallback(() => {
    if (!fabricCanvasRef.current || isHistoryUpdatingRef.current) return;
    const json = JSON.stringify(fabricCanvasRef.current.toJSON());
    // İlerideki adımları kırp
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(json);
    historyIndexRef.current++;
  }, []);

  // Geri Al
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0 && fabricCanvasRef.current) {
      isHistoryUpdatingRef.current = true;
      historyIndexRef.current--;
      const json = historyRef.current[historyIndexRef.current];
      fabricCanvasRef.current.loadFromJSON(json, () => {
        fabricCanvasRef.current.renderAll();
        isHistoryUpdatingRef.current = false;
      });
    }
  }, []);

  // İleri Al
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1 && fabricCanvasRef.current) {
      isHistoryUpdatingRef.current = true;
      historyIndexRef.current++;
      const json = historyRef.current[historyIndexRef.current];
      fabricCanvasRef.current.loadFromJSON(json, () => {
        fabricCanvasRef.current.renderAll();
        isHistoryUpdatingRef.current = false;
      });
    }
  }, []);

  // Izgara Arka Planını Güncelleme
  const updateGridBackground = useCallback((canvas: any, showGrid: boolean) => {
    if (!canvas) return;
    if (!showGrid) {
      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
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

    const fabric = (window as any).fabric;
    if (fabric) {
      const pattern = new fabric.Pattern({
        source: patternCanvas,
        repeat: 'repeat',
      });
      canvas.setBackgroundColor(pattern, canvas.renderAll.bind(canvas));
    }
  }, []);

  // Çokgen Çizimini Tamamlama
  const finalizePolygon = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const fabric = (window as any).fabric;
    if (!canvas || !fabric || polygonPointsRef.current.length < 3) {
      // Temizle
      cleanupPolygonDrawing();
      return;
    }

    const points = [...polygonPointsRef.current];
    cleanupPolygonDrawing();

    const polygon = new fabric.Polygon(points, {
      fill: style.fillColor,
      stroke: style.strokeColor,
      strokeWidth: style.strokeWidth,
      strokeDashArray: style.isDashed ? [6, 6] : null,
      selectable: true,
      cornerColor: '#2563eb',
      cornerSize: 8,
      transparentCorners: false,
      hasBorders: true,
    });

    canvas.add(polygon);
    canvas.setActiveObject(polygon);
    canvas.renderAll();
    saveState();
    setActiveTool('select');
  }, [style, saveState]);

  // Çokgen geçici elemanlarını temizle
  const cleanupPolygonDrawing = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    if (polygonTempLineRef.current) {
      canvas.remove(polygonTempLineRef.current);
      polygonTempLineRef.current = null;
    }
    polygonMarkersRef.current.forEach((m) => canvas.remove(m));
    polygonMarkersRef.current = [];
    polygonPointsRef.current = [];
    canvas.renderAll();
  };

  // Açı geçici işaretlerini temizle
  const cleanupAngleMarkers = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    angleStateRef.current.tempMarkers.forEach((m) => canvas.remove(m));
    angleStateRef.current = {
      step: 1,
      p1: null,
      p2: null,
      p3: null,
      tempMarkers: [],
    };
    canvas.renderAll();
  };

  // Canvas Başlatma
  useEffect(() => {
    if (!canvasRef.current) return;
    const fabric = (window as any).fabric;
    if (!fabric) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 760,
      height: 520,
      selection: true,
      preserveObjectStacking: true,
    });
    fabricCanvasRef.current = canvas;

    updateGridBackground(canvas, gridEnabled);
    saveState();

    // Seçim Olayları -> Kayan Araç Çubuğu Konumu
    const updateToolbar = (target: any) => {
      if (!target) {
        setIsToolbarVisible(false);
        setSelectedObject(null);
        return;
      }
      setSelectedObject(target);
      const bound = target.getBoundingRect(true);
      setToolbarPosition({
        top: bound.top,
        left: bound.left + bound.width / 2,
      });
      setIsToolbarVisible(true);

      // Stili güncelle
      setStyle((prev) => ({
        ...prev,
        strokeColor: target.stroke || prev.strokeColor,
        fillColor: target.fill || prev.fillColor,
        strokeWidth: target.strokeWidth || prev.strokeWidth,
        isDashed: Array.isArray(target.strokeDashArray) && target.strokeDashArray.length > 0,
      }));
    };

    canvas.on('selection:created', (e: any) => updateToolbar(e.selected?.[0]));
    canvas.on('selection:updated', (e: any) => updateToolbar(e.selected?.[0]));
    canvas.on('selection:cleared', () => updateToolbar(null));
    canvas.on('object:modified', () => {
      updateToolbar(canvas.getActiveObject());
      saveState();
    });

    // Mouse Tıklama ve Çizim Olayları
    canvas.on('mouse:down', (opt: any) => {
      const pointer = canvas.getPointer(opt.e);
      const pt: Point2D = snapToGrid({ x: pointer.x, y: pointer.y }, 10, snapEnabled);

      if (activeTool === 'point') {
        const circle = new fabric.Circle({
          left: pt.x,
          top: pt.y,
          radius: 4,
          fill: style.strokeColor,
          originX: 'center',
          originY: 'center',
          selectable: true,
        });
        canvas.add(circle);
        canvas.renderAll();
        saveState();
      } else if (activeTool === 'line') {
        isDrawingLineRef.current = true;
        const line = new fabric.Line([pt.x, pt.y, pt.x, pt.y], {
          stroke: style.strokeColor,
          strokeWidth: style.strokeWidth,
          strokeDashArray: style.isDashed ? [6, 6] : null,
          selectable: true,
          cornerColor: '#2563eb',
          cornerSize: 8,
          transparentCorners: false,
        });
        drawingLineRef.current = line;
        canvas.add(line);
      } else if (activeTool === 'polygon') {
        // Başlangıç noktasına yakın tıklandıysa kapat
        if (polygonPointsRef.current.length >= 3) {
          const firstPt = polygonPointsRef.current[0];
          const dist = Math.hypot(pt.x - firstPt.x, pt.y - firstPt.y);
          if (dist < 15) {
            finalizePolygon();
            return;
          }
        }

        polygonPointsRef.current.push(pt);
        // Vertex kırmızı mini nokta ekle
        const marker = new fabric.Circle({
          left: pt.x,
          top: pt.y,
          radius: 4,
          fill: '#ef4444',
          stroke: '#ffffff',
          strokeWidth: 1.5,
          originX: 'center',
          originY: 'center',
          selectable: false,
        });
        canvas.add(marker);
        polygonMarkersRef.current.push(marker);

        // Canlı kauçuk bant çizgisini hazırla
        if (!polygonTempLineRef.current) {
          const rubberLine = new fabric.Line([pt.x, pt.y, pt.x, pt.y], {
            stroke: style.strokeColor,
            strokeWidth: style.strokeWidth,
            strokeDashArray: [4, 4],
            selectable: false,
          });
          polygonTempLineRef.current = rubberLine;
          canvas.add(rubberLine);
        } else {
          polygonTempLineRef.current.set({ x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y });
        }
        canvas.renderAll();
      } else if (activeTool === 'circle') {
        const circle = new fabric.Circle({
          left: pt.x,
          top: pt.y,
          radius: 40,
          fill: style.fillColor,
          stroke: style.strokeColor,
          strokeWidth: style.strokeWidth,
          strokeDashArray: style.isDashed ? [6, 6] : null,
          originX: 'center',
          originY: 'center',
          cornerColor: '#2563eb',
          cornerSize: 8,
          transparentCorners: false,
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.renderAll();
        saveState();
        setActiveTool('select');
      } else if (activeTool === 'angle') {
        // 3 Aşamalı Açı Oluşturucu
        const state = angleStateRef.current;
        const marker = new fabric.Circle({
          left: pt.x,
          top: pt.y,
          radius: 4.5,
          fill: state.step === 2 ? '#2563eb' : '#dc2626',
          stroke: '#ffffff',
          strokeWidth: 1.5,
          originX: 'center',
          originY: 'center',
          selectable: false,
        });
        canvas.add(marker);
        state.tempMarkers.push(marker);

        if (state.step === 1) {
          state.p1 = pt;
          state.step = 2;
        } else if (state.step === 2) {
          state.p2 = pt; // Vertex
          state.step = 3;
        } else if (state.step === 3) {
          state.p3 = pt;
          // Hesapla
          if (state.p1 && state.p2 && state.p3) {
            const res = calculateAngle(state.p1, state.p2, state.p3, 30);
            const pathStr = generateArcPath(state.p2, 30, res.startAngleRad, res.endAngleRad);

            const arcPath = new fabric.Path(pathStr, {
              stroke: style.strokeColor,
              strokeWidth: style.strokeWidth,
              fill: 'transparent',
              selectable: true,
            });

            const angleText = new fabric.IText(`${res.angleDegrees}°`, {
              left: res.labelPosition.x,
              top: res.labelPosition.y,
              fontSize: 16,
              fontFamily: 'Noto Sans, sans-serif',
              fontWeight: 'bold',
              fill: style.strokeColor,
              originX: 'center',
              originY: 'center',
              selectable: true,
            });

            const group = new fabric.Group([arcPath, angleText], {
              selectable: true,
              cornerColor: '#2563eb',
              cornerSize: 8,
              transparentCorners: false,
            });

            cleanupAngleMarkers();
            canvas.add(group);
            canvas.setActiveObject(group);
            canvas.renderAll();
            saveState();
            setActiveTool('select');
          }
        }
        canvas.renderAll();
      } else if (activeTool === 'text') {
        const text = new fabric.IText('A', {
          left: pt.x,
          top: pt.y,
          fontSize: 20,
          fontFamily: 'Noto Sans, sans-serif',
          fontWeight: 'bold',
          fill: style.strokeColor,
          selectable: true,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        canvas.renderAll();
        saveState();
        setActiveTool('select');
      }
    });

    // Mouse Move Olayı
    canvas.on('mouse:move', (opt: any) => {
      const pointer = canvas.getPointer(opt.e);
      const pt: Point2D = snapToGrid({ x: pointer.x, y: pointer.y }, 10, snapEnabled);

      if (isDrawingLineRef.current && drawingLineRef.current) {
        drawingLineRef.current.set({ x2: pt.x, y2: pt.y });
        canvas.renderAll();
      } else if (activeTool === 'polygon' && polygonTempLineRef.current) {
        polygonTempLineRef.current.set({ x2: pt.x, y2: pt.y });
        canvas.renderAll();
      }
    });

    // Mouse Up Olayı
    canvas.on('mouse:up', () => {
      if (isDrawingLineRef.current && drawingLineRef.current) {
        isDrawingLineRef.current = false;
        drawingLineRef.current.setCoords();
        canvas.setActiveObject(drawingLineRef.current);
        canvas.renderAll();
        saveState();
        setActiveTool('select');
        drawingLineRef.current = null;
      }
    });

    // Klavye Kısayolları (Delete, ESC, Geri Al, Çoğalt)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        cleanupPolygonDrawing();
        cleanupAngleMarkers();
        setActiveTool('select');
        canvas.discardActiveObject();
        canvas.renderAll();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjs = canvas.getActiveObjects();
        if (activeObjs && activeObjs.length > 0) {
          activeObjs.forEach((obj: any) => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.renderAll();
          saveState();
        }
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
        // Duplicate
        handleDuplicate();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, []);

  // Aktif Araç Değiştiğinde Canvas Seçilebilirlik Ayarları
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (activeTool === 'select') {
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      canvas.forEachObject((obj: any) => {
        obj.selectable = true;
        obj.evented = true;
      });
    } else {
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, [activeTool]);

  // Izgara Değişikliği
  useEffect(() => {
    updateGridBackground(fabricCanvasRef.current, gridEnabled);
  }, [gridEnabled, updateGridBackground]);

  // Stil Güncelleme
  const updateStyle = (updates: Partial<ShapeStyle>) => {
    setStyle((prev) => ({ ...prev, ...updates }));
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObjs = canvas.getActiveObjects();
    if (activeObjs && activeObjs.length > 0) {
      activeObjs.forEach((obj: any) => {
        if (updates.strokeColor !== undefined) obj.set('stroke', updates.strokeColor);
        if (updates.fillColor !== undefined) obj.set('fill', updates.fillColor);
        if (updates.strokeWidth !== undefined) obj.set('strokeWidth', updates.strokeWidth);
        if (updates.isDashed !== undefined) {
          obj.set('strokeDashArray', updates.isDashed ? [6, 6] : null);
        }
        obj.setCoords();
      });
      canvas.renderAll();
      saveState();
    }
  };

  // Klonla
  const handleDuplicate = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    active.clone((cloned: any) => {
      canvas.discardActiveObject();
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
        evented: true,
      });
      if (cloned.type === 'activeSelection') {
        cloned.canvas = canvas;
        cloned.forEachObject((obj: any) => canvas.add(obj));
        cloned.setCoords();
      } else {
        canvas.add(cloned);
      }
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      saveState();
    });
  };

  // Sil
  const handleDelete = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const activeObjs = canvas.getActiveObjects();
    if (activeObjs && activeObjs.length > 0) {
      activeObjs.forEach((obj: any) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
      saveState();
    }
  };

  // Düzgün Çokgen Ekle
  const addRegularPolygon = (sides: number) => {
    const canvas = fabricCanvasRef.current;
    const fabric = (window as any).fabric;
    if (!canvas || !fabric) return;

    const points = generateRegularPolygonPoints(sides, 60, { x: 380, y: 260 });
    const poly = new fabric.Polygon(points, {
      fill: style.fillColor,
      stroke: style.strokeColor,
      strokeWidth: style.strokeWidth,
      strokeDashArray: style.isDashed ? [6, 6] : null,
      selectable: true,
      cornerColor: '#2563eb',
      cornerSize: 8,
      transparentCorners: false,
    });
    canvas.add(poly);
    canvas.setActiveObject(poly);
    canvas.renderAll();
    saveState();
    setActiveTool('select');
  };

  // Elips Ekle
  const addEllipse = () => {
    const canvas = fabricCanvasRef.current;
    const fabric = (window as any).fabric;
    if (!canvas || !fabric) return;

    const ellipse = new fabric.Ellipse({
      left: 380,
      top: 260,
      rx: 70,
      ry: 45,
      fill: style.fillColor,
      stroke: style.strokeColor,
      strokeWidth: style.strokeWidth,
      strokeDashArray: style.isDashed ? [6, 6] : null,
      originX: 'center',
      originY: 'center',
      selectable: true,
      cornerColor: '#2563eb',
      cornerSize: 8,
      transparentCorners: false,
    });
    canvas.add(ellipse);
    canvas.setActiveObject(ellipse);
    canvas.renderAll();
    saveState();
    setActiveTool('select');
  };

  // KaTeX Formül Görseli Ekle
  const addKatexFormula = async (latex: string, options: { color: string; fontSize: number }) => {
    const canvas = fabricCanvasRef.current;
    const fabric = (window as any).fabric;
    if (!canvas || !fabric) return;

    try {
      const { dataUrl } = await katexToImage(latex, {
        color: options.color,
        fontSize: options.fontSize,
      });

      fabric.Image.fromURL(dataUrl, (img: any) => {
        img.set({
          left: 380,
          top: 260,
          originX: 'center',
          originY: 'center',
          selectable: true,
          hasControls: true,
          hasBorders: true,
          transparentCorners: false,
          cornerColor: '#2563eb',
          cornerSize: 8,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveState();
      });
    } catch (err) {
      console.error('KaTeX ekleme hatası:', err);
    }
  };

  // Dışa Aktar (2x Retina PNG DataURL)
  const exportCanvas = (options: GeometryExportOptions = {}): string | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;

    canvas.discardActiveObject();
    canvas.renderAll();

    const dataUrl = canvas.toDataURL({
      format: options.format || 'png',
      multiplier: options.multiplier || 2, // 2x Retina scale
    });

    return dataUrl;
  };

  // Zoom Ayarı
  const setZoom = (percent: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const scale = Math.max(0.5, Math.min(2.5, percent / 100));
    canvas.setZoom(scale);
    canvas.renderAll();
    setZoomLevel(Math.round(scale * 100));
  };

  return {
    canvasRef,
    activeTool,
    setActiveTool,
    style,
    updateStyle,
    gridEnabled,
    setGridEnabled,
    snapEnabled,
    setSnapEnabled,
    zoomLevel,
    setZoom,
    isToolbarVisible,
    toolbarPosition,
    handleUndo,
    handleRedo,
    handleDuplicate,
    handleDelete,
    finalizePolygon,
    addRegularPolygon,
    addEllipse,
    addKatexFormula,
    exportCanvas,
  };
}

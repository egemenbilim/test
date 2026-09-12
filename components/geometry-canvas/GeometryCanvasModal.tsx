'use client';

import React, { useState } from 'react';
import {
  MousePointer2,
  Dot,
  Slash,
  PenTool,
  Circle,
  RotateCw,
  Compass,
  Type,
  MoreHorizontal,
  Plus,
  Minus,
  RotateCcw,
  Grid,
  Magnet,
  Check,
  X,
  Sparkles,
  HelpCircle,
  Shapes,
  Maximize2,
} from 'lucide-react';
import { ToolType } from './types';
import { useGeometryCanvas } from './useGeometryCanvas';
import { FloatingStyleToolbar } from './FloatingStyleToolbar';
import { KatexFormulaModal } from './KatexFormulaModal';

interface GeometryCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (dataUrl: string) => void;
  title?: string;
}

export const GeometryCanvasModal: React.FC<GeometryCanvasModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  title = 'Vektörel Geometri & KaTeX Matematik Tuvali',
}) => {
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const {
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
  } = useGeometryCanvas();

  if (!isOpen) return null;

  // Aktif araca göre dinamik rehber metin
  const getGuidanceText = () => {
    switch (activeTool) {
      case 'select':
        return 'Nesneleri seçmek, taşımak, döndürmek veya boyutlandırmak için tıklayın / sürükleyin.';
      case 'point':
        return 'Tuvalde nokta eklemek istediğiniz yere tıklayın.';
      case 'line':
        return 'Doğru parçasını oluşturmak için başlangıç noktasından bitişe doğru sürükleyin.';
      case 'polygon':
        return 'Çokgenin köşelerine sırayla tıklayın. Şekli kapatmak için ilk noktaya tıklayın veya Enter tuşuna basın.';
      case 'circle':
        return 'Merkez noktasını belirleyip sürükleyerek çember oluşturun.';
      case 'arc':
        return 'Belirli yarıçap ve açıda yay oluşturun.';
      case 'angle':
        return 'Açıyı oluşturmak için sırayla 3 nokta seçin: 1. Kol Noktası ➔ 2. Köşe (Vertex) ➔ 3. Kol Noktası.';
      case 'text':
        return 'Metin veya köşe harfi (A, B, C) eklemek istediğiniz konuma tıklayın.';
      default:
        return 'Vektörel çizim aracını kullanmaya hazırsınız.';
    }
  };

  const handleExportAndInsert = () => {
    const dataUrl = exportCanvas({ format: 'png', multiplier: 2 });
    if (dataUrl) {
      onInsert(dataUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 sm:p-4 backdrop-blur-md select-none animate-in fade-in">
      <div className="flex h-[92vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 dark:text-slate-100 overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {title}
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  Fabric.js & KaTeX
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Hassas vektörel çizimler yapın, açılar ölçün ve LaTeX formüllerini tuvale serbestçe yerleştirin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
              title="Kapat (ESC)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Üst Bilgi / İpucu Çubuğu (Guidance Toast) */}
        <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/70 px-5 py-1.5 text-xs text-blue-900 dark:border-blue-950 dark:bg-blue-950/40 dark:text-blue-200">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium">{getGuidanceText()}</span>
          </div>

          {activeTool === 'polygon' && (
            <button
              type="button"
              onClick={finalizePolygon}
              className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white hover:bg-blue-700 transition shadow-sm"
            >
              <Check className="h-3 w-3" /> Çokgeni Tamamla
            </button>
          )}
        </div>

        {/* Ana Gövde: Sol Araç Çubuğu + Merkezi Tuval */}
        <div className="relative flex flex-1 overflow-hidden bg-slate-100 dark:bg-slate-950">
          {/* Sol Dikey Araç Çubuğu (Toolbox) */}
          <div className="z-10 flex w-16 flex-col items-center gap-1.5 border-r border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            {/* 1. Seçim Aracı */}
            <button
              type="button"
              onClick={() => setActiveTool('select')}
              title="Seçim Aracı (V)"
              className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl transition ${
                activeTool === 'select'
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200 shadow-sm dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <MousePointer2 className="h-5 w-5" />
              <span className="text-[9px] mt-0.5">Seç</span>
            </button>

            {/* 2. Nokta Aracı */}
            <button
              type="button"
              onClick={() => setActiveTool('point')}
              title="Nokta Aracı (P)"
              className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl transition ${
                activeTool === 'point'
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200 shadow-sm dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <div className="h-3 w-3 rounded-full bg-current shadow-sm" />
              <span className="text-[9px] mt-1">Nokta</span>
            </button>

            {/* 3. Doğru Parçası */}
            <button
              type="button"
              onClick={() => setActiveTool('line')}
              title="Doğru Parçası (L)"
              className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl transition ${
                activeTool === 'line'
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200 shadow-sm dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Slash className="h-5 w-5" />
              <span className="text-[9px] mt-0.5">Doğru</span>
            </button>

            {/* 4. Serbest Çokgen Aracı */}
            <button
              type="button"
              onClick={() => setActiveTool('polygon')}
              title="Serbest Çokgen Aracı (Üçgen, Dörtgen vb.)"
              className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl transition ${
                activeTool === 'polygon'
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200 shadow-sm dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <PenTool className="h-5 w-5" />
              <span className="text-[9px] mt-0.5">Çokgen</span>
            </button>

            {/* 5. Çember Aracı */}
            <button
              type="button"
              onClick={() => setActiveTool('circle')}
              title="Çember / Daire Aracı (C)"
              className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl transition ${
                activeTool === 'circle'
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200 shadow-sm dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Circle className="h-5 w-5" />
              <span className="text-[9px] mt-0.5">Çember</span>
            </button>

            {/* 6. Açı Ölçer / Oluşturucu */}
            <button
              type="button"
              onClick={() => setActiveTool('angle')}
              title="3 Noktalı İnteraktif Açı Oluşturucu"
              className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl transition ${
                activeTool === 'angle'
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200 shadow-sm dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <RotateCw className="h-5 w-5" />
              <span className="text-[9px] mt-0.5">Açı</span>
            </button>

            {/* 7. Metin Aracı */}
            <button
              type="button"
              onClick={() => setActiveTool('text')}
              title="Metin / Harf Kutusu (T)"
              className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl transition ${
                activeTool === 'text'
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200 shadow-sm dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Type className="h-5 w-5" />
              <span className="text-[9px] mt-0.5">Metin</span>
            </button>

            {/* 8. Daha Fazla Şekil & KaTeX */}
            <div className="relative mt-auto">
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                title="Daha Fazla Şekil & Formül"
                className="flex h-11 w-11 flex-col items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition shadow-sm"
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-[9px] mt-0.5">Daha</span>
              </button>

              {isMoreMenuOpen && (
                <div className="absolute bottom-0 left-14 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Özel Şekiller & Araçlar
                  </div>

                  {/* KaTeX Formül Butonu */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormulaModalOpen(true);
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50 transition"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Matematiksel Formül (KaTeX)</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  {/* Elips */}
                  <button
                    type="button"
                    onClick={() => {
                      addEllipse();
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                  >
                    <div className="h-3 w-4 rounded-full border-2 border-current" />
                    <span>Elips Ekle</span>
                  </button>

                  {/* Düzgün Çokgenler */}
                  <button
                    type="button"
                    onClick={() => {
                      addRegularPolygon(5);
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                  >
                    <Shapes className="h-4 w-4" />
                    <span>Düzgün Beşgen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addRegularPolygon(6);
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                  >
                    <Shapes className="h-4 w-4" />
                    <span>Düzgün Altıgen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addRegularPolygon(8);
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                  >
                    <Shapes className="h-4 w-4" />
                    <span>Düzgün Sekizgen</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Merkezi Tuval Alanı */}
          <div className="relative flex flex-1 items-center justify-center overflow-auto p-4">
            <div className="relative rounded-2xl border border-slate-300 bg-white shadow-xl dark:border-slate-700 overflow-hidden">
              <canvas ref={canvasRef} />

              {/* Kayan Şekil Biçimlendirme Araç Çubuğu */}
              <FloatingStyleToolbar
                visible={isToolbarVisible}
                position={toolbarPosition}
                currentStyle={style}
                onStyleChange={updateStyle}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>

        {/* Alt Kontrol Çubuğu */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900 shadow-md">
          {/* Sol: Zoom & Grid & Snap Kontrolleri */}
          <div className="flex items-center gap-2">
            {/* Zoom Butonları */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800/60">
              <button
                type="button"
                onClick={() => setZoom(zoomLevel - 10)}
                title="Küçült"
                className="rounded-lg p-1 text-slate-600 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-700 transition"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(100)}
                className="px-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                %{zoomLevel}
              </button>
              <button
                type="button"
                onClick={() => setZoom(zoomLevel + 10)}
                title="Büyüt"
                className="rounded-lg p-1 text-slate-600 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-700 transition"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Izgara Aç/Kapat */}
            <button
              type="button"
              onClick={() => setGridEnabled(!gridEnabled)}
              title="Izgarayı Göster/Gizle"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                gridEnabled
                  ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400'
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              <span>Izgara</span>
            </button>

            {/* Snap to Grid */}
            <button
              type="button"
              onClick={() => setSnapEnabled(!snapEnabled)}
              title="Izgaraya Manyetik Hizala (Snap-to-Grid)"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                snapEnabled
                  ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400'
              }`}
            >
              <Magnet className="h-3.5 w-3.5" />
              <span>Snap</span>
            </button>

            {/* Undo / Redo */}
            <div className="flex items-center gap-1 ml-1 border-l border-slate-200 pl-2 dark:border-slate-800">
              <button
                type="button"
                onClick={handleUndo}
                title="Geri Al (Ctrl+Z)"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                title="İleri Al (Ctrl+Y)"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sağ: İptal ve [Soruya Ekle] Butonları */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
            >
              İptal
            </button>

            <button
              type="button"
              onClick={handleExportAndInsert}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2 text-xs font-bold text-white shadow-lg hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition active:scale-95"
            >
              <Check className="h-4 w-4" />
              <span>Şekli Soruya Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* KaTeX Denklem Modalı */}
      <KatexFormulaModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        onInsertFormula={addKatexFormula}
      />
    </div>
  );
};

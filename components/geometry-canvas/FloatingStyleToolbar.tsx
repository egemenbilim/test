'use client';

import React, { useState } from 'react';
import { Palette, Trash2, Copy, Minus, GripHorizontal } from 'lucide-react';
import { ShapeStyle } from './types';

interface FloatingStyleToolbarProps {
  position: { top: number; left: number };
  visible: boolean;
  currentStyle: ShapeStyle;
  onStyleChange: (updates: Partial<ShapeStyle>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const STROKE_COLORS = [
  '#0f172a', // Siyah / Slate-900
  '#475569', // Koyu Gri
  '#94a3b8', // Açık Gri
  '#1e3a8a', // Lacivert
  '#2563eb', // Canlı Mavi
  '#0284c7', // Açık Mavi / Sky
  '#16a34a', // Yeşil
  '#059669', // Zümrüt
  '#ca8a04', // Altın Sarısı
  '#ea580c', // Turuncu
  '#dc2626', // Kırmızı
  '#7c3aed', // Mor
];

const FILL_COLORS = [
  'transparent', // Şeffaf
  '#ffffff',    // Beyaz
  '#f8fafc',    // Açık Slate
  '#fef3c7',    // Pastel Sarı
  '#dbeafe',    // Pastel Mavi
  '#dcfce7',    // Pastel Yeşil
  '#fee2e2',    // Pastel Kırmızı
  '#f3e8ff',    // Pastel Mor
  '#ffedd5',    // Pastel Turuncu
  '#cffafe',    // Pastel Cyan
  '#f1f5f9',    // Nötr Açık
  '#e2e8f0',    // Nötr Orta
];

export const FloatingStyleToolbar: React.FC<FloatingStyleToolbarProps> = ({
  position,
  visible,
  currentStyle,
  onStyleChange,
  onDuplicate,
  onDelete,
}) => {
  const [activePopover, setActivePopover] = useState<'none' | 'stroke' | 'fill' | 'width'>('none');

  if (!visible) return null;

  return (
    <div
      className="absolute z-30 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 px-2 py-1.5 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95 transition-all select-none animate-in fade-in zoom-in-95"
      style={{
        top: Math.max(12, position.top - 54),
        left: Math.max(20, position.left),
        transform: 'translateX(-50%)',
      }}
    >
      {/* Çizgi Rengi Seçici */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setActivePopover(activePopover === 'stroke' ? 'none' : 'stroke')}
          title="Çizgi Rengi (Stroke)"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 p-1 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 transition"
        >
          <span
            className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: currentStyle.strokeColor }}
          />
        </button>

        {activePopover === 'stroke' && (
          <div className="absolute left-0 top-10 z-40 w-48 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-700 dark:bg-slate-900 animate-in fade-in">
            <div className="mb-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Çizgi Rengi</div>
            <div className="grid grid-cols-6 gap-2">
              {STROKE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onStyleChange({ strokeColor: c });
                    setActivePopover('none');
                  }}
                  className={`h-5 w-5 rounded-full border border-black/10 transition hover:scale-125 ${
                    currentStyle.strokeColor === c ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dolgu Rengi Seçici */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setActivePopover(activePopover === 'fill' ? 'none' : 'fill')}
          title="Dolgu Rengi (Fill)"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 p-1 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 transition"
        >
          <div className="flex items-center justify-center h-4 w-4 rounded-sm border border-slate-400 relative overflow-hidden">
            {currentStyle.fillColor === 'transparent' ? (
              <span className="text-[10px] text-red-500 font-bold leading-none">✕</span>
            ) : (
              <span className="w-full h-full" style={{ backgroundColor: currentStyle.fillColor }} />
            )}
          </div>
        </button>

        {activePopover === 'fill' && (
          <div className="absolute left-0 top-10 z-40 w-48 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-700 dark:bg-slate-900 animate-in fade-in">
            <div className="mb-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Dolgu Rengi</div>
            <div className="grid grid-cols-6 gap-2">
              {FILL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onStyleChange({ fillColor: c });
                    setActivePopover('none');
                  }}
                  className={`h-5 w-5 rounded-full border border-slate-300 transition hover:scale-125 relative flex items-center justify-center ${
                    currentStyle.fillColor === c ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                  }`}
                  style={{ backgroundColor: c === 'transparent' ? '#ffffff' : c }}
                >
                  {c === 'transparent' && <span className="text-[10px] text-red-500 font-bold">✕</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Çizgi Kalınlığı Seçici */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setActivePopover(activePopover === 'width' ? 'none' : 'width')}
          title="Çizgi Kalınlığı ve Stili"
          className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-xs font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 transition"
        >
          <Minus className="h-4 w-4" style={{ strokeWidth: currentStyle.strokeWidth * 1.5 }} />
          <span>{currentStyle.strokeWidth}px</span>
        </button>

        {activePopover === 'width' && (
          <div className="absolute left-0 top-10 z-40 w-44 space-y-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-700 dark:bg-slate-900 animate-in fade-in">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Kalınlık</div>
            <div className="flex items-center justify-between gap-1">
              {[1, 2, 3, 4].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onStyleChange({ strokeWidth: w })}
                  className={`flex-1 rounded-md py-1 text-xs font-bold transition ${
                    currentStyle.strokeWidth === w
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
              <label className="flex cursor-pointer items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                <span>Kesikli Çizgi</span>
                <input
                  type="checkbox"
                  checked={currentStyle.isDashed}
                  onChange={(e) => onStyleChange({ isDashed: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5" />

      {/* Klonla Butonu */}
      <button
        type="button"
        onClick={onDuplicate}
        title="Klonla (Duplicate - Ctrl+D)"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition"
      >
        <Copy className="h-4 w-4" />
      </button>

      {/* Sil Butonu */}
      <button
        type="button"
        onClick={onDelete}
        title="Sil (Delete)"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

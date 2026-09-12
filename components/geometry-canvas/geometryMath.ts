import { Point2D, AngleCalculationResult } from './types';

/**
 * 3 Noktadan açı, yay koordinatları ve etiket konumunu hassas olarak hesaplar.
 * P1: Başlangıç kolu noktası
 * P2: Açının tepe noktası (Vertex)
 * P3: Bitiş kolu noktası
 */
export function calculateAngle(
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  arcRadius: number = 28
): AngleCalculationResult {
  const v1x = p1.x - p2.x;
  const v1y = p1.y - p2.y;
  const v2x = p3.x - p2.x;
  const v2y = p3.y - p2.y;

  let theta1 = Math.atan2(v1y, v1x); // radyan [-PI, PI]
  let theta2 = Math.atan2(v2y, v2x);

  // İki açı arasındaki pozitif açı farkı
  let diff = theta2 - theta1;
  while (diff < 0) diff += 2 * Math.PI;
  while (diff >= 2 * Math.PI) diff -= 2 * Math.PI;

  let startAngleRad = theta1;
  let sweepAngleRad = diff;
  let isClockwise = true;

  // İç açıyı (<= 180°) seçme kuralı
  if (diff > Math.PI) {
    // Diğer yönden ölçülen açı iç açıdır
    startAngleRad = theta2;
    sweepAngleRad = 2 * Math.PI - diff;
    isClockwise = false;
  }

  const angleDegrees = Math.round((sweepAngleRad * 180) / Math.PI);

  // Açıortay açısı (etiket yerleşimi için)
  const bisectorAngleRad = isClockwise
    ? startAngleRad + sweepAngleRad / 2
    : startAngleRad - sweepAngleRad / 2;

  const labelDist = arcRadius + 16;
  const labelPosition: Point2D = {
    x: p2.x + Math.cos(bisectorAngleRad) * labelDist,
    y: p2.y + Math.sin(bisectorAngleRad) * labelDist,
  };

  return {
    angleDegrees,
    startAngleRad,
    endAngleRad: isClockwise ? startAngleRad + sweepAngleRad : startAngleRad - sweepAngleRad,
    sweepAngleRad,
    bisectorAngleRad,
    labelPosition,
  };
}

/**
 * Verilen merkez, yarıçap, başlangıç ve süpürme açısına göre SVG Arc Path string'i üretir.
 */
export function generateArcPath(
  center: Point2D,
  radius: number,
  startAngleRad: number,
  endAngleRad: number
): string {
  const startX = center.x + radius * Math.cos(startAngleRad);
  const startY = center.y + radius * Math.sin(startAngleRad);
  const endX = center.x + radius * Math.cos(endAngleRad);
  const endY = center.y + radius * Math.sin(endAngleRad);

  // Açı farkı
  let diff = endAngleRad - startAngleRad;
  while (diff < 0) diff += 2 * Math.PI;
  const largeArcFlag = diff > Math.PI ? 1 : 0;
  const sweepFlag = 1; // Saat yönü

  return `M ${startX.toFixed(2)} ${startY.toFixed(2)} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX.toFixed(2)} ${endY.toFixed(2)}`;
}

/**
 * Düzgün çokgen köşe noktalarını üretir.
 */
export function generateRegularPolygonPoints(
  sides: number,
  radius: number,
  center: Point2D
): Point2D[] {
  const points: Point2D[] = [];
  const angleStep = (2 * Math.PI) / sides;
  const startOffset = -Math.PI / 2; // Üst tepe noktası yukarı baksın

  for (let i = 0; i < sides; i++) {
    const angle = startOffset + i * angleStep;
    points.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    });
  }

  return points;
}

/**
 * Grid snap hesaplama
 */
export function snapToGrid(point: Point2D, gridSize: number = 10, enabled: boolean = true): Point2D {
  if (!enabled || gridSize <= 0) return point;
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
}

/**
 * KaTeX formülünü SVG/DataURL görüntüsüne dönüştürür.
 * Fabric.js Image nesnesi olarak tuvale eklemek için kullanılır.
 */
export async function katexToImage(
  latex: string,
  options: { color?: string; fontSize?: number; scale?: number } = {}
): Promise<{ dataUrl: string; width: number; height: number }> {
  const { color = '#0f172a', fontSize = 24, scale = 2 } = options;

  // Window'da KaTeX kontrolü
  const katex = (window as any).katex;
  if (!katex) {
    throw new Error('KaTeX kütüphanesi yüklenemedi.');
  }

  // Geçici HTML render
  const htmlString = katex.renderToString(latex, {
    displayMode: true,
    throwOnError: false,
  });

  // SVG ForeignObject oluşturma
  // KaTeX CSS stillerini SVG içine alarak bağımsız hale getiriyoruz
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

  // Ölçüm alalım
  const rect = wrapper.getBoundingClientRect();
  const width = Math.max(Math.ceil(rect.width) + 8, 30);
  const height = Math.max(Math.ceil(rect.height) + 8, 24);
  document.body.removeChild(wrapper);

  // SVG Data URI üretimi
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

  // Bir Image objesi ile PNG'ye çevirip en yüksek kalitede DataURL döndür
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL('image/png'),
          width,
          height,
        });
      } else {
        resolve({ dataUrl: svgDataUrl, width, height });
      }
    };
    img.onerror = () => {
      // SVG fallback
      resolve({ dataUrl: svgDataUrl, width, height });
    };
    img.src = svgDataUrl;
  });
}

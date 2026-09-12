/**
 * Geometry & Math Canvas Component - TypeScript Interfaces & Types
 */

export type ToolType =
  | 'select'
  | 'point'
  | 'line'
  | 'polygon'
  | 'circle'
  | 'arc'
  | 'angle'
  | 'text'
  | 'ellipse'
  | 'regularPolygon'
  | 'image'
  | 'formula';

export interface Point2D {
  x: number;
  y: number;
}

export interface ShapeStyle {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  isDashed: boolean;
  fontSize: number;
}

export interface AngleCreationState {
  step: 1 | 2 | 3;
  p1: Point2D | null;
  p2: Point2D | null; // Vertex
  p3: Point2D | null;
  tempMarkers: any[];
}

export interface FormulaSymbolItem {
  latex: string;
  display: string;
  tooltip?: string;
}

export interface FormulaTabGroup {
  id: 'basic' | 'symbols' | 'placeholders' | 'calculus';
  label: string;
  items: FormulaSymbolItem[];
}

export interface GeometryExportOptions {
  format?: 'png' | 'svg';
  multiplier?: number;
  backgroundColor?: string;
}

export interface AngleCalculationResult {
  angleDegrees: number;
  startAngleRad: number;
  endAngleRad: number;
  sweepAngleRad: number;
  bisectorAngleRad: number;
  labelPosition: Point2D;
}

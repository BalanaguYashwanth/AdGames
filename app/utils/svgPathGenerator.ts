import { EdgeType } from '../types/puzzle';

export function generatePiecePath(
  top: EdgeType,
  right: EdgeType,
  bottom: EdgeType,
  left: EdgeType,
  size: number
): string {
  const knobHeightRatio = 0.22;
  const knobWidthRatio = 0.35;
  const neckRatio = 0.15;

  const knobHeight = size * knobHeightRatio;
  const knobWidth = size * knobWidthRatio;
  const neckWidth = knobWidth * neckRatio;
  
  const offset = knobHeight;
  
  let path = `M ${offset},${offset}`;

  // Top Edge
  if (top === 'flat') {
    path += ` h ${size}`;
  } else {
    const side = top === 'tab' ? -1 : 1; // -1 for tab (out), 1 for blank (in)
    const firstStraight = (size - knobWidth) / 2;
    path += ` l ${firstStraight},0`; // Line to the start of the knob
    // "Neck" curve leading into the knob
    path += ` c ${neckWidth},0 ${neckWidth},${side * knobHeight * 0.8} ${knobWidth / 2},${side * knobHeight * 0.8}`;
    // "Head" of the knob and back to the neck
    path += ` c ${knobWidth / 2 - neckWidth},0 ${knobWidth / 2 - neckWidth},${-side * knobHeight * 0.8} ${knobWidth / 2},${-side * knobHeight * 0.8}`;
    path += ` l ${firstStraight},0`; // Line to the end of the edge
  }

  // Right Edge
  if (right === 'flat') {
    path += ` v ${size}`;
  } else {
    const side = right === 'tab' ? 1 : -1;
    const firstStraight = (size - knobWidth) / 2;
    path += ` l 0,${firstStraight}`;
    path += ` c 0,${neckWidth} ${side * knobHeight * 0.8},${neckWidth} ${side * knobHeight * 0.8},${knobWidth / 2}`;
    path += ` c 0,${knobWidth / 2 - neckWidth} ${-side * knobHeight * 0.8},${knobWidth / 2 - neckWidth} ${-side * knobHeight * 0.8},${knobWidth / 2}`;
    path += ` l 0,${firstStraight}`;
  }

  // Bottom Edge
  if (bottom === 'flat') {
    path += ` h ${-size}`;
  } else {
    const side = bottom === 'tab' ? 1 : -1;
    const firstStraight = (size - knobWidth) / 2;
    path += ` l ${-firstStraight},0`;
    path += ` c ${-neckWidth},0 ${-neckWidth},${side * knobHeight * 0.8} ${-knobWidth / 2},${side * knobHeight * 0.8}`;
    path += ` c ${-(knobWidth / 2 - neckWidth)},0 ${-(knobWidth / 2 - neckWidth)},${-side * knobHeight * 0.8} ${-knobWidth / 2},${-side * knobHeight * 0.8}`;
    path += ` l ${-firstStraight},0`;
  }

  // Left Edge
  if (left === 'flat') {
    path += ` v ${-size}`;
  } else {
    const side = left === 'tab' ? -1 : 1;
    const firstStraight = (size - knobWidth) / 2;
    path += ` l 0,${-firstStraight}`;
    path += ` c 0,${-neckWidth} ${side * knobHeight * 0.8},${-neckWidth} ${side * knobHeight * 0.8},${-knobWidth / 2}`;
    path += ` c 0,${-(knobWidth / 2 - neckWidth)} ${-side * knobHeight * 0.8},${-(knobWidth / 2 - neckWidth)} ${-side * knobHeight * 0.8},${-knobWidth / 2}`;
    path += ` l 0,${-firstStraight}`;
  }

  path += ' Z';
  return path;
}
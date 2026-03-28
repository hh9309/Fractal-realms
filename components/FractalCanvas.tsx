
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { FractalType, FractalParams } from '../types';

interface Props {
  params: FractalParams;
  onPan: (dx: number, dy: number) => void;
  onZoom: (delta: number) => void;
}

const FractalCanvas: React.FC<Props> = ({ params, onPan, onZoom }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    
    const canvas = canvasRef.current;
    if (canvas) {
      // 计算平移量
      const zoomFactor = 1 / (params.zoom * 100);
      onPan(-dx * zoomFactor, dy * zoomFactor);
    }
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    onZoom(-e.deltaY * 0.001 * params.zoom);
  };

  const drawTree = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    const drawBranch = (x: number, y: number, length: number, angle: number, depth: number) => {
      if (depth === 0) return;
      const x2 = x + length * Math.cos(angle * Math.PI / 180);
      const y2 = y + length * Math.sin(angle * Math.PI / 180);
      
      ctx.strokeStyle = `rgba(34, 197, 94, ${depth / 10 + 0.4})`;
      ctx.lineWidth = depth * 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
      
      drawBranch(x2, y2, length * params.treeLengthRatio, angle - params.treeAngle, depth - 1);
      drawBranch(x2, y2, length * params.treeLengthRatio, angle + params.treeAngle, depth - 1);
    };
    const startX = width / 2 + params.offsetX * width;
    const startY = height * 0.9 - params.offsetY * height;
    drawBranch(startX, startY, 120 * params.zoom, -90, 10);
  }, [params]);

  const drawKoch = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;

    const drawLine = (x1: number, y1: number, x2: number, y2: number, depth: number) => {
      if (depth === 0) {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        return;
      }
      const dx = (x2 - x1) / 3, dy = (y2 - y1) / 3;
      const p1x = x1 + dx, p1y = y1 + dy;
      const p2x = x1 + 2 * dx, p2y = y1 + 2 * dy;
      const h = Math.sqrt(3) / 2;
      const midx = (x1 + x2) / 2 - h * dy, midy = (y1 + y2) / 2 + h * dx;
      drawLine(x1, y1, p1x, p1y, depth - 1);
      drawLine(p1x, p1y, midx, midy, depth - 1);
      drawLine(midx, midy, p2x, p2y, depth - 1);
      drawLine(p2x, p2y, x2, y2, depth - 1);
    };

    const side = 400 * params.zoom;
    const h = side * (Math.sqrt(3) / 2);
    const x = width / 2 - side / 2 + params.offsetX * width;
    const y = height / 2 + h / 3 - params.offsetY * height;
    const depth = Math.min(Math.floor(params.maxIterations / 20), 5);
    drawLine(x, y, x + side, y, depth);
    drawLine(x + side, y, x + side / 2, y - h, depth);
    drawLine(x + side / 2, y - h, x, y, depth);
  }, [params]);

  const drawBarnsley = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
    let x = 0, y = 0;
    const iterations = Math.min(params.maxIterations * 800, 100000);
    for (let i = 0; i < iterations; i++) {
      let nextX, nextY;
      const r = Math.random();
      if (r < 0.01) { nextX = 0; nextY = 0.16 * y; }
      else if (r < 0.86) { nextX = 0.85 * x + 0.04 * y; nextY = -0.04 * x + 0.85 * y + 1.6; }
      else if (r < 0.93) { nextX = 0.2 * x - 0.26 * y; nextY = 0.23 * x + 0.22 * y + 1.6; }
      else { nextX = -0.15 * x + 0.28 * y; nextY = 0.26 * x + 0.24 * y + 0.44; }
      x = nextX; y = nextY;
      const px = x * 80 * params.zoom + width / 2 + params.offsetX * width;
      const py = height - (y * 80 * params.zoom + 50 + params.offsetY * height);
      ctx.fillRect(px, py, 1.5, 1.5);
    }
  }, [params]);

  const drawLorenz = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.7)';
    ctx.lineWidth = 1;
    let x = 0.1, y = 0, z = 0;
    const dt = 0.01, sigma = 10, rho = 28, beta = 8/3;
    ctx.beginPath();
    const centerX = width / 2 + params.offsetX * width;
    const centerY = height / 2 - params.offsetY * height;
    const scale = 12 * params.zoom;
    const iterations = Math.min(params.maxIterations * 100, 20000);
    for (let i = 0; i < iterations; i++) {
      const dx = sigma * (y - x) * dt;
      const dy = (x * (rho - z) - y) * dt;
      const dz = (x * y - beta * z) * dt;
      x += dx; y += dy; z += dz;
      const px = centerX + x * scale;
      const py = centerY - y * scale;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }, [params]);

  const drawCantor = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f43f5e';
    const drawSet = (x: number, y: number, w: number, depth: number) => {
      if (depth === 0) {
        ctx.fillRect(x, y, w, 20);
        return;
      }
      ctx.fillRect(x, y, w, 20);
      drawSet(x, y + 50, w / 3, depth - 1);
      drawSet(x + (w * 2) / 3, y + 50, w / 3, depth - 1);
    };
    const startW = width * 0.8 * params.zoom;
    const startX = width / 2 - startW / 2 + params.offsetX * width;
    const startY = 100 - params.offsetY * height;
    const depth = Math.min(Math.floor(params.maxIterations / 15), 7);
    drawSet(startX, startY, startW, depth);
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const { width, height } = rect;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    switch (params.type) {
      case FractalType.FractalTree: drawTree(ctx, width, height); break;
      case FractalType.BarnsleyFern: drawBarnsley(ctx, width, height); break;
      case FractalType.KochSnowflake: drawKoch(ctx, width, height); break;
      case FractalType.Lorenz: drawLorenz(ctx, width, height); break;
      case FractalType.CantorSet: drawCantor(ctx, width, height); break;
    }
  }, [params, drawTree, drawBarnsley, drawKoch, drawLorenz, drawCantor]);

  return (
    <canvas 
      ref={canvasRef} 
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="w-full h-full block drag-cursor bg-white"
    />
  );
};

export default FractalCanvas;

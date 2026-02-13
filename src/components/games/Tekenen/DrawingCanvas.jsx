// HTML5 Canvas drawing surface with touch/mouse support
// Supports free drawing and coloring mode (template outline rendered on top)

import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { drawTemplate } from '../../../utils/drawingTemplates';
import { TEKENEN_CONFIG } from '../../../constants/gameConfig';

export const DrawingCanvas = forwardRef(function DrawingCanvas(
  { templateId, currentColor, brushSize, tool },
  ref
) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const strokeHistoryRef = useRef([]);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);

  // Redraw entire canvas from stroke history
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // White background
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = TEKENEN_CONFIG.CANVAS_BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Replay all strokes
    for (const stroke of strokeHistoryRef.current) {
      if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.points.length === 1) {
        // Single dot
        ctx.beginPath();
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.tool === 'eraser' ? '#000' : stroke.color;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      }
    }

    // Restore composite operation
    ctx.globalCompositeOperation = 'source-over';

    // Re-render template outline on top (coloring mode)
    if (templateId) {
      drawTemplate(ctx, templateId, canvas.width, canvas.height);
    }
  }, [templateId]);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    toDataURL: () => {
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL('image/png') : null;
    },
    clear: () => {
      strokeHistoryRef.current = [];
      redraw();
    },
    undo: () => {
      strokeHistoryRef.current.pop();
      redraw();
      return strokeHistoryRef.current.length;
    },
    getStrokeCount: () => strokeHistoryRef.current.length,
  }), [redraw]);

  // Get canvas-relative coordinates from pointer event
  const getCanvasPoint = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  // Draw a line segment immediately (for smooth real-time drawing)
  const drawSegment = useCallback((from, to, color, size, currentTool) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';
  }, []);

  // Pointer event handlers
  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (!point) return;

    isDrawingRef.current = true;
    currentStrokeRef.current = {
      points: [point],
      color: currentColor,
      size: brushSize,
      tool: tool,
    };

    // Draw a dot for single click
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    }
    ctx.fillStyle = tool === 'eraser' ? '#000' : currentColor;
    ctx.beginPath();
    ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }, [currentColor, brushSize, tool, getCanvasPoint]);

  const handlePointerMove = useCallback((e) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    e.preventDefault();

    const point = getCanvasPoint(e);
    if (!point) return;

    const stroke = currentStrokeRef.current;
    const prevPoint = stroke.points[stroke.points.length - 1];
    stroke.points.push(point);

    drawSegment(prevPoint, point, stroke.color, stroke.size, stroke.tool);
  }, [getCanvasPoint, drawSegment]);

  const handlePointerUp = useCallback(() => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;

    isDrawingRef.current = false;
    strokeHistoryRef.current.push(currentStrokeRef.current);
    currentStrokeRef.current = null;

    // Redraw with template on top (in coloring mode the outline re-renders)
    if (templateId) {
      redraw();
    }
  }, [templateId, redraw]);

  // Initialize canvas size
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        redraw();
      }
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [redraw]);

  // Initial draw (white bg + template if present)
  useEffect(() => {
    redraw();
  }, [redraw]);

  return (
    <div
      ref={containerRef}
      className="w-full flex-1 rounded-2xl overflow-hidden shadow-lg bg-white"
      style={{ touchAction: 'none', minHeight: 200 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  );
});

import React, { useRef, useState, useEffect, useCallback } from 'react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { useTranslation } from '../../i18n';
import { Eraser, Brush, Paintbrush, Download, Save, FolderOpen, RotateCcw, RotateCw } from 'lucide-react';

// Demo SVG templates (in a real app, load from file or CDN)
const browTemplates = [
  {
    id: 'natural',
    name: 'Natural',
    svg: (color: string, thickness: number, opacity: number) => (
      <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 30 Q 60 10 190 20" stroke={color} strokeWidth={thickness} strokeLinecap="round" fill="none" opacity={opacity} />
      </svg>
    ),
    refPoints: [
      { x: 10, y: 30 },
      { x: 60, y: 10 },
      { x: 190, y: 20 }
    ]
  },
  {
    id: 'defined',
    name: 'Defined',
    svg: (color: string, thickness: number, opacity: number) => (
      <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 35 Q 80 5 190 25" stroke={color} strokeWidth={thickness} strokeLinecap="round" fill="none" opacity={opacity} />
      </svg>
    ),
    refPoints: [
      { x: 10, y: 35 },
      { x: 80, y: 5 },
      { x: 190, y: 25 }
    ]
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    svg: (color: string, thickness: number, opacity: number) => (
      <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 38 Q 100 0 190 30" stroke={color} strokeWidth={thickness} strokeLinecap="round" fill="none" opacity={opacity} />
      </svg>
    ),
    refPoints: [
      { x: 10, y: 38 },
      { x: 100, y: 0 },
      { x: 190, y: 30 }
    ]
  },
  {
    id: 'softarch',
    name: 'Soft Arch',
    svg: (color: string, thickness: number, opacity: number) => (
      <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 32 Q 80 20 185 28" stroke={color} strokeWidth={thickness} strokeLinecap="round" fill="none" opacity={opacity} />
      </svg>
    ),
    refPoints: [
      { x: 15, y: 32 },
      { x: 80, y: 20 },
      { x: 185, y: 28 }
    ]
  },
  {
    id: 'flat',
    name: 'Flat',
    svg: (color: string, thickness: number, opacity: number) => (
      <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 25 Q 100 22 180 25" stroke={color} strokeWidth={thickness} strokeLinecap="round" fill="none" opacity={opacity} />
      </svg>
    ),
    refPoints: [
      { x: 20, y: 25 },
      { x: 100, y: 22 },
      { x: 180, y: 25 }
    ]
  },
  {
    id: 's-shape',
    name: 'S-Shape',
    svg: (color: string, thickness: number, opacity: number) => (
      <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 30 Q 60 10 100 30 Q 140 50 190 20" stroke={color} strokeWidth={thickness} strokeLinecap="round" fill="none" opacity={opacity} />
      </svg>
    ),
    refPoints: [
      { x: 10, y: 30 },
      { x: 100, y: 30 },
      { x: 190, y: 20 }
    ]
  }
];

const colorPresets = [
  { name: 'Black', value: '#222' },
  { name: 'Dark Brown', value: '#5B3A29' },
  { name: 'Brown', value: '#8B5C2A' },
  { name: 'Blonde', value: '#E2C290' }
];

interface BrowSimulatorProps {
  image: HTMLImageElement | HTMLVideoElement;
  landmarks: Array<{ x: number; y: number }>;
  onClose: () => void;
}

const BrowSimulator: React.FC<BrowSimulatorProps> = ({ image, landmarks, onClose }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(browTemplates[0].id);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [frozen, setFrozen] = useState<string | null>(null); // base64 of simulated image
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [color, setColor] = useState(colorPresets[0].value);
  const [opacity, setOpacity] = useState(1);
  const [thickness, setThickness] = useState(8);
  const [mode, setMode] = useState<'edit' | 'erase' | 'shade'>('edit');
  const [brushSize, setBrushSize] = useState(16);
  const [eraserSize, setEraserSize] = useState(24);
  const [shadeOpacity, setShadeOpacity] = useState(0.4);
  const [undoStack, setUndoStack] = useState<{ mask: string | null; shading: string | null }[]>([]);
  const [redoStack, setRedoStack] = useState<{ mask: string | null; shading: string | null }[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<{ name: string; mask: string | null; shading: string | null; template: string; color: string; thickness: number; opacity: number }[]>([]);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const shadingCanvasRef = useRef<HTMLCanvasElement>(null);
  const CANVAS_W = 200, CANVAS_H = 40;
  const [realisticFit, setRealisticFit] = useState(true);
  const [blurAmount, setBlurAmount] = useState(2);

  // Initialize mask and shading canvases
  useEffect(() => {
    if (maskCanvasRef.current) {
      const ctx = maskCanvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, CANVAS_W, CANVAS_H);
    }
    if (shadingCanvasRef.current) {
      const ctx = shadingCanvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, CANVAS_W, CANVAS_H);
    }
  }, [selected]);

  // Multi-level undo/redo
  const pushUndo = useCallback(() => {
    setUndoStack((stack) => [
      {
        mask: maskCanvasRef.current?.toDataURL() || null,
        shading: shadingCanvasRef.current?.toDataURL() || null
      },
      ...stack.slice(0, 19)
    ]);
    setRedoStack([]);
  }, []);
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const last = undoStack[0];
    setRedoStack((stack) => [{
      mask: maskCanvasRef.current?.toDataURL() || null,
      shading: shadingCanvasRef.current?.toDataURL() || null
    }, ...stack.slice(0, 19)]);
    if (maskCanvasRef.current && last.mask) {
      const img = new window.Image();
      img.onload = () => {
        const ctx = maskCanvasRef.current!.getContext('2d');
        ctx?.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx?.drawImage(img, 0, 0);
      };
      img.src = last.mask;
    }
    if (shadingCanvasRef.current && last.shading) {
      const img = new window.Image();
      img.onload = () => {
        const ctx = shadingCanvasRef.current!.getContext('2d');
        ctx?.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx?.drawImage(img, 0, 0);
      };
      img.src = last.shading;
    }
    setUndoStack((stack) => stack.slice(1));
  }, [undoStack]);
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setUndoStack((stack) => [{
      mask: maskCanvasRef.current?.toDataURL() || null,
      shading: shadingCanvasRef.current?.toDataURL() || null
    }, ...stack.slice(0, 19)]);
    if (maskCanvasRef.current && next.mask) {
      const img = new window.Image();
      img.onload = () => {
        const ctx = maskCanvasRef.current!.getContext('2d');
        ctx?.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx?.drawImage(img, 0, 0);
      };
      img.src = next.mask;
    }
    if (shadingCanvasRef.current && next.shading) {
      const img = new window.Image();
      img.onload = () => {
        const ctx = shadingCanvasRef.current!.getContext('2d');
        ctx?.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx?.drawImage(img, 0, 0);
      };
      img.src = next.shading;
    }
    setRedoStack((stack) => stack.slice(1));
  }, [redoStack]);
  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undoStack, redoStack, handleUndo, handleRedo]);

  // Save/load designs (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem('browDesigns');
    if (saved) setSavedDesigns(JSON.parse(saved));
  }, []);
  const saveDesign = () => {
    const name = prompt('Name your design:');
    if (!name) return;
    const newDesign = {
      name,
      mask: maskCanvasRef.current?.toDataURL() || null,
      shading: shadingCanvasRef.current?.toDataURL() || null,
      template: selected,
      color,
      thickness,
      opacity
    };
    const updated = [newDesign, ...savedDesigns].slice(0, 10);
    setSavedDesigns(updated);
    localStorage.setItem('browDesigns', JSON.stringify(updated));
  };
  const loadDesign = (design: typeof savedDesigns[0]) => {
    setSelected(design.template);
    setColor(design.color);
    setThickness(design.thickness);
    setOpacity(design.opacity);
    if (maskCanvasRef.current && design.mask) {
      const img = new window.Image();
      img.onload = () => {
        const ctx = maskCanvasRef.current!.getContext('2d');
        ctx?.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx?.drawImage(img, 0, 0);
      };
      img.src = design.mask;
    }
    if (shadingCanvasRef.current && design.shading) {
      const img = new window.Image();
      img.onload = () => {
        const ctx = shadingCanvasRef.current!.getContext('2d');
        ctx?.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx?.drawImage(img, 0, 0);
      };
      img.src = design.shading;
    }
    setShowLoadModal(false);
  };

  // Drawing logic for mouse/touch
  const drawOnCanvas = (canvas: HTMLCanvasElement, x: number, y: number, size: number, color: string, composite: GlobalCompositeOperation) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = composite;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  };
  const handlePointer = (e: React.PointerEvent, type: 'erase' | 'shade') => {
    const canvas = type === 'erase' ? maskCanvasRef.current : shadingCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
    const y = ((e.clientY - rect.top) / rect.height) * CANVAS_H;
    if (e.type === 'pointerdown') pushUndo();
    if (type === 'erase') {
      drawOnCanvas(canvas, x, y, eraserSize, '#000', 'destination-out');
    } else {
      drawOnCanvas(canvas, x, y, brushSize, `rgba(139,92,246,${shadeOpacity})`, 'source-over');
    }
  };

  // Touch support
  const handleTouch = (e: React.TouchEvent, type: 'erase' | 'shade') => {
    const canvas = type === 'erase' ? maskCanvasRef.current : shadingCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * CANVAS_W;
    const y = ((touch.clientY - rect.top) / rect.height) * CANVAS_H;
    if (e.type === 'touchstart') pushUndo();
    if (type === 'erase') {
      drawOnCanvas(canvas, x, y, eraserSize, '#000', 'destination-out');
    } else {
      drawOnCanvas(canvas, x, y, brushSize, `rgba(139,92,246,${shadeOpacity})`, 'source-over');
    }
  };

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPosition({ x: e.clientX - lastPos.current.x, y: e.clientY - lastPos.current.y });
  };
  const onMouseUp = () => {
    dragging.current = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  // Auto-align overlay to detected brow landmarks
  const autoAlign = () => {
    if (!landmarks || landmarks.length < 108) return;
    // Detected points
    const detected = [landmarks[70], landmarks[105], landmarks[107]];
    // Template reference points
    const tpl = browTemplates.find(t => t.id === selected);
    if (!tpl) return;
    const ref = tpl.refPoints;
    // Calculate scale: ratio of brow length (start to end)
    const detectedLen = Math.sqrt(
      (detected[2].x - detected[0].x) ** 2 + (detected[2].y - detected[0].y) ** 2
    );
    const refLen = Math.sqrt(
      (ref[2].x - ref[0].x) ** 2 + (ref[2].y - ref[0].y) ** 2
    );
    const newScale = detectedLen / refLen;
    // Calculate angle
    const detectedAngle = Math.atan2(detected[2].y - detected[0].y, detected[2].x - detected[0].x);
    const refAngle = Math.atan2(ref[2].y - ref[0].y, ref[2].x - ref[0].x);
    const newRotation = ((detectedAngle - refAngle) * 180) / Math.PI;
    // Position: align template start to detected start
    setPosition({ x: detected[0].x - ref[0].x * newScale, y: detected[0].y - ref[0].y * newScale });
    setScale(newScale);
    setRotation(newRotation);
  };

  // Render symmetry/measurement guides
  const renderGuides = () => {
    if (!landmarks || landmarks.length === 0) return null;
    // Eye landmarks
    const leftEye = landmarks[133];
    const rightEye = landmarks[362];
    // Brow landmarks (left)
    const browStart = landmarks[70];
    const browArch = landmarks[105];
    const browEnd = landmarks[107];
    // Calculate vertical symmetry line (midpoint between eyes)
    let symmetryX = null;
    if (leftEye && rightEye) {
      symmetryX = (leftEye.x + rightEye.x) / 2;
    }
    // Golden ratio points along the brow (from start to end)
    let golden1 = null, golden2 = null;
    if (browStart && browEnd) {
      const dx = browEnd.x - browStart.x;
      const dy = browEnd.y - browStart.y;
      golden1 = {
        x: browStart.x + dx * 0.618,
        y: browStart.y + dy * 0.618
      };
      golden2 = {
        x: browStart.x + dx * 1.0,
        y: browStart.y + dy * 1.0
      };
    }
    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {/* Vertical symmetry line */}
        {symmetryX && (
          <line x1={symmetryX} y1={0} x2={symmetryX} y2={1000} stroke="#0ff" strokeWidth={1.5} strokeDasharray="6,4" />
        )}
        {/* Eye-to-eye line */}
        {leftEye && rightEye && (
          <line x1={leftEye.x} y1={leftEye.y} x2={rightEye.x} y2={rightEye.y} stroke="#00f" strokeWidth={2} />
        )}
        {/* Brow start, arch, end markers */}
        {browStart && (
          <circle cx={browStart.x} cy={browStart.y} r={6} fill="#fff" stroke="#8b5cf6" strokeWidth={2} />
        )}
        {browArch && (
          <circle cx={browArch.x} cy={browArch.y} r={6} fill="#fff" stroke="#f59e0b" strokeWidth={2} />
        )}
        {browEnd && (
          <circle cx={browEnd.x} cy={browEnd.y} r={6} fill="#fff" stroke="#ef4444" strokeWidth={2} />
        )}
        {/* Golden ratio guides */}
        {golden1 && (
          <circle cx={golden1.x} cy={golden1.y} r={5} fill="#fde68a" stroke="#f59e0b" strokeWidth={1.5} />
        )}
        {golden2 && (
          <circle cx={golden2.x} cy={golden2.y} r={4} fill="#fca5a5" stroke="#ef4444" strokeWidth={1.2} />
        )}
        {/* Optionally: right brow overlay (for symmetry) */}
        {landmarks[336] && landmarks[334] && landmarks[276] && (
          <polyline
            points={
              `${landmarks[336].x},${landmarks[336].y} ` +
              `${landmarks[334].x},${landmarks[334].y} ` +
              `${landmarks[276].x},${landmarks[276].y}`
            }
            fill="none"
            stroke="#22d3ee"
            strokeWidth={2}
            strokeDasharray="4,3"
          />
        )}
      </svg>
    );
  };


  // Helper: Render the current view to a canvas and return base64
  const captureSimulated = async () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Draw the base image
    if (image instanceof HTMLVideoElement) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    // Draw brow template overlay
    const tpl = browTemplates.find(t => t.id === selected);
    if (tpl) {
      // Render SVG to image
      const svgString = new XMLSerializer().serializeToString(
        tpl.svg(color, thickness, opacity).props.children.type === 'svg' ? tpl.svg(color, thickness, opacity).props.children : tpl.svg(color, thickness, opacity)
      );
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='40'>${svgString}</svg>`;
      const img = new window.Image();
      await new Promise(resolve => {
        img.onload = resolve;
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
      });
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, 200, 40);
      ctx.restore();
    }
    // Draw guides (optional: skip for clean export)
    // ...
    // Export as base64
    setFrozen(canvas.toDataURL('image/png'));
    setShowBeforeAfter(true);
  };

  // Helper: Export before/after as a single image
  const exportComparison = () => {
    if (!canvasRef.current || !frozen) return;
    const canvas = document.createElement('canvas');
    canvas.width = (canvasRef.current.width || 640) * 2;
    canvas.height = canvasRef.current.height || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Draw original
    if (image instanceof HTMLVideoElement) {
      ctx.drawImage(image, 0, 0, canvas.width / 2, canvas.height);
    } else {
      ctx.drawImage(image, 0, 0, canvas.width / 2, canvas.height);
    }
    // Draw simulated
    const simImg = new window.Image();
    simImg.onload = () => {
      ctx.drawImage(simImg, canvas.width / 2, 0, canvas.width / 2, canvas.height);
      // Download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'brows-before-after.png';
      link.click();
    };
    simImg.src = frozen;
  };

  // Export as image
  const exportImage = () => {
    // Merge SVG, mask, and shading into a single canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = CANVAS_W;
    exportCanvas.height = CANVAS_H;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;
    // Draw SVG brow
    const svg = browTemplates.find(t => t.id === selected)?.svg(color, thickness, opacity);
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
      // Draw mask (erased parts)
      if (maskCanvasRef.current) ctx.drawImage(maskCanvasRef.current, 0, 0);
      // Draw shading
      if (shadingCanvasRef.current) ctx.drawImage(shadingCanvasRef.current, 0, 0);
      // Download
      const link = document.createElement('a');
      link.download = 'brow-design.png';
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Set up canvas size to match image
  const width = image instanceof HTMLVideoElement ? image.videoWidth || 640 : image.width || 640;
  const height = image instanceof HTMLVideoElement ? image.videoHeight || 480 : image.height || 480;

  // Helper: compute affine transform from 3 points
  function getAffineTransform(src: Array<{x: number, y: number}>, dst: Array<{x: number, y: number}>) {
    // src/dst: [start, arch, end]
    // Returns SVG matrix(a,b,c,d,e,f)
    // See: https://math.stackexchange.com/questions/296794
    const [[x1, y1], [x2, y2], [x3, y3]] = src.map(p => [p.x, p.y]);
    const [[u1, v1], [u2, v2], [u3, v3]] = dst.map(p => [p.x, p.y]);
    const det = (x1-x3)*(y2-y3)-(x2-x3)*(y1-y3);
    if (Math.abs(det) < 1e-8) return null;
    const a = ((u1-u3)*(y2-y3)-(u2-u3)*(y1-y3))/det;
    const b = ((u2-u3)*(x1-x3)-(u1-u3)*(x2-x3))/det;
    const c = u1 - a*x1 - b*y1;
    const d = ((v1-v3)*(y2-y3)-(v2-v3)*(y1-y3))/det;
    const e = ((v2-v3)*(x1-x3)-(v1-v3)*(x2-x3))/det;
    const f = v1 - d*x1 - e*y1;
    return { a, b, c, d, e, f };
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <GlassCard className="relative p-6 w-[90vw] max-w-3xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{t('browsim.simulatorTitle')}</h2>
          <Button onClick={onClose} variant="secondary">{t('browsim.close')}</Button>
        </div>
        {!showBeforeAfter && (
          <>
            <div className="flex gap-4 mb-4 flex-wrap">
              <span className="text-white/70 self-center">{t('browsim.selectTemplate')}:</span>
              {browTemplates.map(tpl => (
                <Button
                  key={tpl.id}
                  variant={selected === tpl.id ? 'primary' : 'secondary'}
                  onClick={() => setSelected(tpl.id)}
                  size="sm"
                >
                  {tpl.name}
                </Button>
              ))}
              <Button onClick={autoAlign} variant="ghost" size="sm" title={t('browsim.autoAlign')}>{t('browsim.autoAlign')}</Button>
              <Button onClick={captureSimulated} variant="primary" size="sm" title={t('browsim.freeze')}>{t('browsim.freeze')}</Button>
            </div>
            <div className="flex gap-4 mb-4 flex-wrap items-center">
              <span className="text-white/70">Color:</span>
              {colorPresets.map((c) => (
                <button
                  key={c.value}
                  className={`w-8 h-8 rounded-full border-2 ${color === c.value ? 'border-purple-400' : 'border-white/20'} mr-1`}
                  style={{ background: c.value }}
                  onClick={() => setColor(c.value)}
                  title={c.name}
                />
              ))}
              <span className="text-white/70 ml-4">{t('browsim.opacity') || 'Opacity'}:</span>
              <input type="range" min={0.2} max={1} step={0.01} value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-24" />
              <span className="text-white/70 ml-4">{t('browsim.thickness') || 'Thickness'}:</span>
              <input type="range" min={4} max={14} step={1} value={thickness} onChange={e => setThickness(Number(e.target.value))} className="w-24" />
            </div>
            <div className="flex gap-2 mb-4 flex-wrap items-center">
              <Button onClick={() => setMode('edit')} variant={mode === 'edit' ? 'primary' : 'secondary'} size="sm" title={t('browsim.editTip')} aria-label={t('browsim.editTip')}><Brush className="w-4 h-4 mr-1" />{t('browsim.edit')}</Button>
              <Button onClick={() => setMode('erase')} variant={mode === 'erase' ? 'primary' : 'secondary'} size="sm" title={t('browsim.eraseTip')} aria-label={t('browsim.eraseTip')}><Eraser className="w-4 h-4 mr-1" />{t('browsim.erase')}</Button>
              <Button onClick={() => setMode('shade')} variant={mode === 'shade' ? 'primary' : 'secondary'} size="sm" title={t('browsim.shadeTip')} aria-label={t('browsim.shadeTip')}><Paintbrush className="w-4 h-4 mr-1" />{t('browsim.shade')}</Button>
              <Button onClick={handleUndo} variant="ghost" size="sm" disabled={undoStack.length === 0} aria-label="Undo"><RotateCcw className="w-4 h-4" /></Button>
              <Button onClick={handleRedo} variant="ghost" size="sm" disabled={redoStack.length === 0} aria-label="Redo"><RotateCw className="w-4 h-4" /></Button>
              <Button onClick={saveDesign} variant="secondary" size="sm" aria-label="Save"><Save className="w-4 h-4 mr-1" />Save</Button>
              <Button onClick={() => setShowLoadModal(true)} variant="secondary" size="sm" aria-label="Load"><FolderOpen className="w-4 h-4 mr-1" />Load</Button>
              <Button onClick={exportImage} variant="primary" size="sm" aria-label="Export"><Download className="w-4 h-4 mr-1" />Export</Button>
              {mode === 'erase' && (
                <><span className="text-white/70 ml-4">{t('browsim.eraserSize')}:</span><input type="range" min={8} max={48} step={1} value={eraserSize} onChange={e => setEraserSize(Number(e.target.value))} className="w-24" /></>
              )}
              {mode === 'shade' && (
                <>
                  <span className="text-white/70 ml-4">{t('browsim.brushSize')}:</span><input type="range" min={8} max={48} step={1} value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-24" />
                  <span className="text-white/70 ml-4">{t('browsim.shadingOpacity')}:</span><input type="range" min={0.1} max={1} step={0.01} value={shadeOpacity} onChange={e => setShadeOpacity(Number(e.target.value))} className="w-24" />
                </>
              )}
            </div>
            <div className="flex gap-4 mb-4 items-center">
              <label className="flex items-center text-white/80 cursor-pointer">
                <input type="checkbox" checked={realisticFit} onChange={e => setRealisticFit(e.target.checked)} className="mr-2" />
                Realistic Fit
              </label>
              {realisticFit && (
                <>
                  <span className="ml-4 text-white/70">Feather:</span>
                  <input type="range" min={0} max={8} step={0.1} value={blurAmount} onChange={e => setBlurAmount(Number(e.target.value))} className="w-24" />
                  <span className="text-white/60 ml-2">{blurAmount}px</span>
                </>
              )}
            </div>
            <div className="relative flex-1 bg-black rounded-xl overflow-hidden flex items-center justify-center">
              {/* Show the image or video frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                {image instanceof HTMLVideoElement ? (
                  <video ref={el => { if (el && image.srcObject) el.srcObject = image.srcObject; }} autoPlay muted playsInline className="w-full h-full object-contain" />
                ) : (
                  <img src={image.src} alt="Face" className="w-full h-full object-contain" />
                )}
              </div>
              {/* Overlay brow template and editing canvases */}
              <div
                ref={dragRef}
                className="absolute"
                style={{
                  left: position.x,
                  top: position.y,
                  transform: mode === 'edit' && !realisticFit ? `scale(${scale}) rotate(${rotation}deg)` : undefined,
                  cursor: mode === 'edit' ? 'move' : 'crosshair',
                  zIndex: 2
                }}
                onMouseDown={mode === 'edit' && !realisticFit ? onMouseDown : undefined}
                title={t('browsim.selectTemplate')}
              >
                {(() => {
                  const tpl = browTemplates.find(t => t.id === selected);
                  if (!tpl) return null;
                  if (realisticFit && landmarks && landmarks.length > 107) {
                    const src = tpl.refPoints;
                    const dst = [landmarks[70], landmarks[105], landmarks[107]];
                    const tf = getAffineTransform(src, dst);
                    if (!tf) return tpl.svg(color, thickness, opacity);
                    return (
                      <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
                        <defs>
                          <filter id="brow-blur" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation={blurAmount} />
                          </filter>
                        </defs>
                        <g transform={`matrix(${tf.a},${tf.d},${tf.b},${tf.e},${tf.c},${tf.f})`}>
                          {React.cloneElement(tpl.svg(color, thickness, opacity).props.children, {
                            filter: blurAmount > 0 ? 'url(#brow-blur)' : undefined
                          })}
                        </g>
                      </svg>
                    );
                  } else {
                    return tpl.svg(color, thickness, opacity);
                  }
                })()}
                {/* Mask canvas (for erasing) */}
                <canvas
                  ref={maskCanvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  className="absolute top-0 left-0 w-full h-full pointer-events-auto"
                  style={{ pointerEvents: mode === 'erase' ? 'auto' : 'none', opacity: 1 }}
                  onPointerDown={mode === 'erase' ? (e) => handlePointer(e, 'erase') : undefined}
                  onPointerMove={mode === 'erase' ? (e) => { if (e.buttons === 1) handlePointer(e, 'erase'); } : undefined}
                  onTouchStart={mode === 'erase' ? (e) => handleTouch(e, 'erase') : undefined}
                  onTouchMove={mode === 'erase' ? (e) => handleTouch(e, 'erase') : undefined}
                />
                {/* Shading canvas */}
                <canvas
                  ref={shadingCanvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  className="absolute top-0 left-0 w-full h-full pointer-events-auto"
                  style={{ pointerEvents: mode === 'shade' ? 'auto' : 'none', opacity: 1 }}
                  onPointerDown={mode === 'shade' ? (e) => handlePointer(e, 'shade') : undefined}
                  onPointerMove={mode === 'shade' ? (e) => { if (e.buttons === 1) handlePointer(e, 'shade'); } : undefined}
                  onTouchStart={mode === 'shade' ? (e) => handleTouch(e, 'shade') : undefined}
                  onTouchMove={mode === 'shade' ? (e) => handleTouch(e, 'shade') : undefined}
                />
              </div>
              {/* Guides */}
              {renderGuides()}
              {/* Hidden canvas for export */}
              <canvas ref={canvasRef} width={width} height={height} style={{ display: 'none' }} />
            </div>
            <div className="flex gap-4 mt-4 items-center flex-wrap">
              <label className="text-white">{t('browsim.scale')}</label>
              <input type="range" min={0.5} max={2} step={0.01} value={scale} onChange={e => setScale(Number(e.target.value))} />
              <label className="text-white">{t('browsim.rotate')}</label>
              <input type="range" min={-45} max={45} step={1} value={rotation} onChange={e => setRotation(Number(e.target.value))} />
            </div>
          </>
        )}
        {showBeforeAfter && frozen && (
          <>
            <div className="flex-1 flex items-center justify-center gap-8 flex-wrap">
              <div className="flex flex-col items-center">
                <span className="text-white/70 mb-2">{t('browsim.before')}</span>
                {image instanceof HTMLVideoElement ? (
                  <video ref={el => { if (el && image.srcObject) el.srcObject = image.srcObject; }} autoPlay muted playsInline className="w-[320px] h-[240px] object-contain rounded-lg border border-white/10" />
                ) : (
                  <img src={image.src} alt="Before" className="w-[320px] h-[240px] object-contain rounded-lg border border-white/10" />
                )}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white/70 mb-2">{t('browsim.after')}</span>
                <img src={frozen} alt="After" className="w-[320px] h-[240px] object-contain rounded-lg border border-white/10" />
              </div>
            </div>
            <div className="flex gap-4 mt-6 justify-center flex-wrap">
              <Button onClick={() => setShowBeforeAfter(false)} variant="secondary">{t('browsim.backToEdit')}</Button>
              <Button onClick={exportComparison} variant="primary">{t('browsim.export')}</Button>
            </div>
          </>
        )}
        {showLoadModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-white/10 p-6 rounded-xl max-w-md w-full">
              <h3 className="text-lg font-bold text-white mb-4">Load Design</h3>
              <ul className="space-y-2">
                {savedDesigns.length === 0 && <li className="text-white/70">No saved designs</li>}
                {savedDesigns.map((d, i) => (
                  <li key={i} className="flex items-center justify-between bg-white/5 rounded p-2">
                    <span className="text-white/90">{d.name}</span>
                    <Button onClick={() => loadDesign(d)} size="sm" variant="primary">Load</Button>
                  </li>
                ))}
              </ul>
              <Button onClick={() => setShowLoadModal(false)} className="mt-4 w-full" variant="secondary">Close</Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default BrowSimulator; 
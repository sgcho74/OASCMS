import React, { useRef, useEffect, useState } from 'react';

interface SignaturePadProps {
    onEnd: (dataUrl: string | null) => void;
    className?: string;
}

export default function SignaturePad({ onEnd, className = '' }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set high resolution
        const ratio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(ratio, ratio);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, []);

    const getTouchPos = (canvas: HTMLCanvasElement, touchEvent: React.TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    };

    const getMousePos = (canvas: HTMLCanvasElement, mouseEvent: React.MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        let pos;
        if ('touches' in e) {
            pos = getTouchPos(canvas, e as React.TouchEvent);
        } else {
            pos = getMousePos(canvas, e as React.MouseEvent);
        }
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let pos;
        if ('touches' in e) {
            pos = getTouchPos(canvas, e as React.TouchEvent);
        } else {
            pos = getMousePos(canvas, e as React.MouseEvent);
        }
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        if (!hasSignature) setHasSignature(true);
    };

    const endDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            onEnd(canvas.toDataURL());
        }
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setHasSignature(false);
        onEnd(null);
    };

    return (
        <div className={`relative ${className}`}>
            <canvas
                ref={canvasRef}
                className="w-full h-full border rounded-md bg-white cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
                style={{ touchAction: 'none' }}
            />
            <button
                type="button"
                onClick={clear}
                className="absolute top-2 right-2 text-xs text-red-500 bg-white border border-red-200 px-2 py-1 rounded shadow-sm hover:bg-red-50"
            >
                Clear
            </button>
        </div>
    );
}

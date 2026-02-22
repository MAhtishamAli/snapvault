import React, { useRef, useState, useEffect } from 'react';

/**
 * Overlay canvas that allows users to draw rectangular "blur zones".
 * Passes an array of { x, y, w, h } objects to the parent.
 */
export default function ManualBlurCanvas({ width, height, onZonesChange }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
    const [zones, setZones] = useState([]);

    const drawAll = React.useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw confirmed zones
        ctx.fillStyle = 'rgba(79, 70, 229, 0.4)'; // Primary color, semitransparent
        ctx.strokeStyle = 'rgba(79, 70, 229, 1)';
        ctx.lineWidth = 2;

        zones.forEach(z => {
            ctx.fillRect(z.x, z.y, z.w, z.h);
            ctx.strokeRect(z.x, z.y, z.w, z.h);
        });

        // Draw current dragging zone
        if (isDrawing) {
            const x = Math.min(startPos.x, currentPos.x);
            const y = Math.min(startPos.y, currentPos.y);
            const w = Math.abs(currentPos.x - startPos.x);
            const h = Math.abs(currentPos.y - startPos.y);

            ctx.fillStyle = 'rgba(6, 182, 212, 0.4)'; // Teal for drawing
            ctx.strokeStyle = 'rgba(6, 182, 212, 1)';
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
        }
    }, [zones, isDrawing, startPos, currentPos]);

    useEffect(() => {
        drawAll();
    }, [drawAll]);

    const getMousePos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handleMouseDown = (e) => {
        const pos = getMousePos(e);
        setIsDrawing(true);
        setStartPos(pos);
        setCurrentPos(pos);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        setCurrentPos(getMousePos(e));
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const x = Math.min(startPos.x, currentPos.x);
        const y = Math.min(startPos.y, currentPos.y);
        const w = Math.abs(currentPos.x - startPos.x);
        const h = Math.abs(currentPos.y - startPos.y);

        if (w > 10 && h > 10) {
            const newZones = [...zones, { x, y, w, h }];
            setZones(newZones);
            onZonesChange(newZones);
        }
    };

    const clearLast = () => {
        const newZones = zones.slice(0, -1);
        setZones(newZones);
        onZonesChange(newZones);
    };

    const clearAll = () => {
        setZones([]);
        onZonesChange([]);
    };

    return (
        <div className="absolute inset-0 z-10 w-full h-full group">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full h-full cursor-crosshair touch-none"
            />

            {zones.length > 0 && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.preventDefault(); clearLast(); }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-raised border border-border-subtle text-text-primary hover:bg-surface-overlay backdrop-blur-md"
                    >
                        Undo Last
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); clearAll(); }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-crimson/20 border border-crimson/30 text-crimson hover:bg-crimson/30 backdrop-blur-md"
                    >
                        Clear All
                    </button>
                </div>
            )}
        </div>
    );
}

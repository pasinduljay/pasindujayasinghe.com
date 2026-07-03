"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function DigitalHorizon() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const themeRef = useRef(theme);

    // Update ref when theme changes without re-triggering main effect
    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Configuration
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        // Grid Parameters
        const gridSize = 40; // Size of grid squares
        const speed = 0.5; // Scroll speed
        let offset = 0;

        // Perspective Parameters
        const fov = 300;
        const viewDist = 100;
        const horizonY = h * 0.4; // Horizon line height (0 = top, 1 = bottom)

        // Data Beams (Active server instances)
        const beams: { x: number; z: number; height: number; speed: number }[] = [];
        const beamCount = 15;

        // Initialize Beams
        for (let i = 0; i < beamCount; i++) {
            beams.push({
                x: (Math.random() - 0.5) * w * 2, // Random X spread
                z: Math.random() * 1000 + 100, // Random Z depth
                height: Math.random() * 100 + 50, // Random height
                speed: Math.random() * 2 + 0.5
            });
        }

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);

        const drawLine = (x1: number, y1: number, x2: number, y2: number, opacity: number) => {
            if (!ctx) return;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            // Theme-aware green
            const currentTheme = themeRef.current;
            const color = currentTheme === "dark" || currentTheme === "system" ? "34, 197, 94" : "22, 163, 74";
            ctx.strokeStyle = `rgba(${color}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        };

        const animate = () => {
            if (!ctx) return;
            // Stop if not visible
            if (canvas.getAttribute('data-visible') === 'false') {
                requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, w, h);

            offset = (offset + speed) % gridSize;

            const currentTheme = themeRef.current;
            const color = currentTheme === "dark" || currentTheme === "system" ? "34, 197, 94" : "22, 163, 74";

            // Draw Beams (Background Layer)
            beams.forEach(beam => {
                beam.z -= speed * 2; // Move toward camera
                if (beam.z < viewDist) {
                    beam.z = 1000;
                    beam.x = (Math.random() - 0.5) * w * 2;
                }

                const scale = fov / (fov + beam.z);
                const x2d = w / 2 + beam.x * scale;
                const y2d = horizonY + 200 * scale; // Ground level projection
                const yTop = y2d - beam.height * scale;

                const opacity = Math.max(0, 1 - beam.z / 1000);

                // Draw Beam
                ctx.beginPath();
                ctx.moveTo(x2d, y2d);
                ctx.lineTo(x2d, yTop);
                ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                ctx.lineWidth = 2 * scale;
                ctx.stroke();

                // Draw Base
                ctx.beginPath();
                ctx.arc(x2d, y2d, 5 * scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${opacity})`;
                ctx.fill();
            });


            // Draw Floor Grid (Vertical Lines)
            for (let x = -w; x < w; x += gridSize) {
                // Perspective projection for vertical lines is tricky without full 3D.
                // Simplified: Radiating lines from vanishing point
                // Actually, let's just do a flat 3D plane effect.

                // We'll stick to a simpler scanning grid effect which is clearer.

                // Vertical Lines (Z-axis lines in 3D, vertical on screen? No, converging.)
                // Let's do a pure horizontal scanline moving down + perspective vertical lines.
            }

            // Retry: Standard Retro Grid
            // Vertical Lines (Converging to center)
            const centerX = w / 2;
            const vanishingPointY = horizonY;

            // Draw diverse vertical lines fanning out
            const numVLines = 40;
            for (let i = -numVLines / 2; i <= numVLines / 2; i++) {
                const xWorld = i * gridSize * 4;
                // Simple projection: Line from vanishing point to bottom of screen
                // x_screen = center + xWorld * scale

                // Bottom point (z = 0 relative to cam)
                const xBottom = centerX + xWorld * 2;

                drawLine(centerX, vanishingPointY, xBottom, h, 0.15); // Very faint
            }

            // Horizontal Lines (Moving towards user)
            // z goes from far (1000) to near (0)
            for (let z = 0; z < 1000; z += gridSize) {
                const currentZ = z - (offset * 10); // Move texture
                const visibleZ = currentZ % 1000; // Loop within 1000 range
                const actualZ = visibleZ < 0 ? visibleZ + 1000 : visibleZ; // Handle negative wrap

                if (actualZ < 10) continue; // Clip near camera

                const scale = fov / (fov + actualZ);
                const yScreen = vanishingPointY + (200 * scale); // 200 is camera height

                // Fade out at distance
                const opacity = Math.max(0, 1 - actualZ / 800) * 0.3;

                drawLine(0, yScreen, w, yScreen, opacity);
            }

            // Matrix/Data Rain Overlay (Subtle)
            // Just a few random characters dropping to add "Hacker" feel

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []); // Removed theme dependency

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                canvas.setAttribute('data-visible', entry.isIntersecting ? 'true' : 'false');
            },
            { threshold: 0 }
        );

        observer.observe(canvas);
        return () => observer.disconnect();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-60"
        />
    );
}

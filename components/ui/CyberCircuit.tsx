"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function CyberCircuit() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            init();
        };
        window.addEventListener("resize", resize);

        // Parameters
        const gridSize = 30; // Spacing for the invisible grid
        // We'll snap everything to this grid to make it look like a circuit
        const particleCount = 40;
        const particles: Particle[] = [];

        // Static component: The Circuit Grid (dots)
        // Dynamic component: The Signals (moving lines)

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            history: { x: number, y: number }[];
            pathLength: number;
            speed: number;
            colorLightness: number;

            constructor() {
                // Snap to grid
                this.x = Math.floor(Math.random() * (w / gridSize)) * gridSize;
                this.y = Math.floor(Math.random() * (h / gridSize)) * gridSize;

                // Random initial direction (Up, Down, Left, Right)
                const dir = Math.floor(Math.random() * 4);
                this.vx = 0;
                this.vy = 0;
                if (dir === 0) this.vx = 1; // Right
                else if (dir === 1) this.vx = -1; // Left
                else if (dir === 2) this.vy = 1; // Down
                else if (dir === 3) this.vy = -1; // Up

                this.speed = gridSize / 10; // Speed relative to grid
                this.history = [];
                this.pathLength = Math.random() * 20 + 10;
                this.colorLightness = Math.random() * 0.5 + 0.5; // Flicker
            }

            update() {
                // Determine movement
                // We move in sub-steps or continuous? 
                // Let's do continuous but chance to turn at grid intersection

                this.x += this.vx * this.speed;
                this.y += this.vy * this.speed;

                // Check if we hit a grid point (tolerance)
                const onGridX = Math.abs(this.x % gridSize) < this.speed;
                const onGridY = Math.abs(this.y % gridSize) < this.speed;

                if (onGridX && onGridY) {
                    // Chance to turn 90 degrees
                    if (Math.random() < 0.2) {
                        if (this.vx !== 0) { // Moving Horz -> Turn Vert
                            this.vx = 0;
                            this.vy = Math.random() > 0.5 ? 1 : -1;
                        } else { // Moving Vert -> Turn Horz
                            this.vy = 0;
                            this.vx = Math.random() > 0.5 ? 1 : -1;
                        }
                    }
                }

                // History (Tail)
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > this.pathLength) this.history.shift();

                // Bounds wraparound
                if (this.x > w) { this.x = 0; this.history = []; }
                if (this.x < 0) { this.x = w; this.history = []; }
                if (this.y > h) { this.y = 0; this.history = []; }
                if (this.y < 0) { this.y = h; this.history = []; }
            }
        }

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        init();

        let animationFrameId: number;
        const animate = () => {
            if (!ctx) return;

            // Clear with fade for scanner effect? No, simpler to clear.
            ctx.clearRect(0, 0, w, h);

            // Draw Grid Dots (The "Board")
            const baseColor = theme === "dark" || theme === "system" ? "34, 197, 94" : "22, 163, 74";
            ctx.fillStyle = `rgba(${baseColor}, 0.1)`;

            // Only draw some random sections of grid to avoid clutter
            // Optimized: Draw static dots? 
            // Let's just draw the active signals, it's cleaner for a background

            // Draw Signals (The "AI thought")
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${baseColor}, 0.6)`; // Bright head
            ctx.lineWidth = 2;

            particles.forEach(p => {
                p.update();

                if (p.history.length > 1) {
                    // Draw trail
                    ctx.beginPath();
                    ctx.moveTo(p.history[0].x, p.history[0].y);
                    for (let i = 1; i < p.history.length; i++) {
                        ctx.lineTo(p.history[i].x, p.history[i].y);
                    }

                    // Gradient trail
                    // Actually just solid for "circuit" look is better
                    ctx.strokeStyle = `rgba(${baseColor}, ${0.3 * p.colorLightness})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Draw Head (The Pulse packet)
                    ctx.fillStyle = `rgba(${baseColor}, 1)`;
                    ctx.beginPath();
                    ctx.rect(p.x - 2, p.y - 2, 4, 4); // Square packet
                    ctx.fill();

                    // Glow
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = `rgba(${baseColor}, 1)`;
                }
            });
            ctx.shadowBlur = 0; // Reset

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-40 bg-[url('/grid-pattern.png')]" // Fallback pattern?
        />
    );
}

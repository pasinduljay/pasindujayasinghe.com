"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function QuantumFlow() {
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

        // Configuration
        const particleCount = 100; // Reduced for performance
        const particles: Particle[] = [];
        const noiseScale = 0.005;

        // Simple customized Pseudo-Noise interactively or precalc? 
        // We'll use a simple Math.sin/cos based field that evolves over time.

        // Particle Class
        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            history: { x: number, y: number }[];
            maxHistory: number;
            speed: number;
            age: number;
            life: number;

            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = 0;
                this.vy = 0;
                this.history = [];
                this.maxHistory = Math.random() * 10 + 5; // Shorter trails
                this.speed = Math.random() * 1.5 + 0.5;
                this.age = 0;
                this.life = Math.random() * 100 + 100;
            }

            update(time: number) {
                this.age++;
                if (this.age > this.life) {
                    this.reset();
                }

                // Calculate position in flow grid
                // Simple flow evolution
                // Angle based on position + time
                const angle = (Math.cos(this.x * noiseScale) + Math.sin(this.y * noiseScale) + time * 0.001) * Math.PI * 2;

                this.vx = Math.cos(angle) * this.speed;
                this.vy = Math.sin(angle) * this.speed;

                this.x += this.vx;
                this.y += this.vy;

                // History for trails
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > this.maxHistory) {
                    this.history.shift();
                }

                // Wrap around
                if (this.x > w) { this.x = 0; this.history = []; }
                if (this.x < 0) { this.x = w; this.history = []; }
                if (this.y > h) { this.y = 0; this.history = []; }
                if (this.y < 0) { this.y = h; this.history = []; }
            }

            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.history = [];
                this.age = 0;
            }
        }

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        init();

        let time = 0;
        let animationFrameId: number;

        const animate = () => {
            if (!ctx) return;

            ctx.clearRect(0, 0, w, h);

            const baseColor = theme === "dark" || theme === "system" ? "34, 197, 94" : "22, 163, 74";

            // BATCH RENDER: Trails
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${baseColor}, 0.15)`;
            ctx.lineWidth = 1;

            particles.forEach(p => {
                p.update(time); // Update physics

                if (p.history.length > 1) {
                    ctx.moveTo(p.history[0].x, p.history[0].y);
                    for (let i = 1; i < p.history.length; i++) {
                        ctx.lineTo(p.history[i].x, p.history[i].y);
                    }
                }
            });
            ctx.stroke(); // Single draw call for all trails

            // BATCH RENDER: Heads
            ctx.beginPath();
            ctx.fillStyle = `rgba(${baseColor}, 0.8)`;
            particles.forEach(p => {
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            });
            ctx.fill(); // Single draw call for all heads

            time++;
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
            className="fixed inset-0 z-0 pointer-events-none opacity-50"
        />
    );
}

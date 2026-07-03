"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function Singularity() {
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

        // Constants
        const particleCount = 400; // Dense
        const fov = 400;
        const Z_Limit = 1000;

        const particles: Star[] = [];

        class Star {
            x: number = 0;
            y: number = 0;
            z: number;
            theta: number; // Angle for spiral
            radius: number; // Distance from center axis
            speed: number;
            size: number;

            constructor(randomZ = true) {
                // Initialize in a cylinder/tube volume around center
                this.theta = Math.random() * Math.PI * 2;
                // Distribute more particles towards the center for accretion disk look
                // Power distribution for radius
                this.radius = (Math.random() ** 1.5) * (Math.min(w, h));

                this.z = randomZ ? Math.random() * Z_Limit : Z_Limit;

                // Speed depends on radius (inner stars move faster - Keplerian orbit style)
                this.speed = 0.01 + (100 / (this.radius + 10));
                this.size = Math.random() * 1.5 + 0.5;

                // Scatter x/y based on polar coords
                this.updateCoords();
            }

            updateCoords() {
                this.x = Math.cos(this.theta) * this.radius;
                this.y = Math.sin(this.theta) * this.radius;
            }

            update() {
                // Move towards camera or rotate?
                // Visual One: Flying INTO the tunnel
                this.z -= 4; // Forward speed

                // Rotation (Swirl)
                this.theta += this.speed * 0.1;
                this.updateCoords();

                // Respawn if passed camera
                if (this.z < 10) {
                    this.z = Z_Limit;
                    this.radius = (Math.random() ** 1.5) * (Math.min(w, h)); // New random position
                    this.speed = 0.01 + (100 / (this.radius + 10));
                }
            }

            draw() {
                if (!ctx) return;

                // 3D Projection
                const scale = fov / (fov + this.z);
                const x2d = (w / 2) + this.x * scale;
                const y2d = (h / 2) + this.y * scale;

                // Alpha fades with distance
                const alpha = Math.min(1, (1 - this.z / Z_Limit) * 2);

                const baseColor = theme === "dark" || theme === "system" ? "34, 197, 94" : "22, 163, 74";

                ctx.beginPath();
                ctx.arc(x2d, y2d, this.size * scale * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${baseColor}, ${alpha})`;
                ctx.fill();

                // Optional: Trail for "fast" look
                // Simple motion blur approximation: previous position?
                // Let's keep it clean points for now, "Space" look.
            }
        }

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Star());
            }
        };

        init();

        let animationFrameId: number;
        const animate = () => {
            if (!ctx) return;

            // Soft trails?
            // ctx.fillStyle = `rgba(${theme==='dark'?'18,18,18':'255,255,255'}, 0.3)`;
            // ctx.fillRect(0, 0, w, h);
            ctx.clearRect(0, 0, w, h);

            // Sort particles by Z so we draw distant ones first (painters algo)
            // Not strictly necessary for additive dots but good for lines
            // particles.sort((a,b) => b.z - a.z); // Expensive each frame, skip for 400 particles

            // Draw Center "Event Horizon" Glow
            // A subtle gradient in the middle
            const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 300);
            const baseColor = theme === "dark" || theme === "system" ? "34, 197, 94" : "22, 163, 74";
            gradient.addColorStop(0, `rgba(${baseColor}, 0.1)`);
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

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
            className="fixed inset-0 z-0 pointer-events-none opacity-80"
        />
    );
}

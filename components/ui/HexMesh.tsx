"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function HexMesh() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const themeRef = useRef(theme);

    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        // Hexagon Geometry
        const radius = 30; // Radius of single hex
        const _glowRadius = 500; // Mouse interaction radius
        const a = 2 * Math.PI / 6;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);

        // Grid calculation
        // Hex width = sqrt(3) * radius
        // Hex height = 2 * radius
        // Horizontal spacing = sqrt(3) * radius
        // Vertical spacing = radius * 3/2
        const r = radius;
        const width = Math.sqrt(3) * r;
        const height = 2 * r;

        let cols = Math.ceil(w / width) + 2;
        let rows = Math.ceil(h / (height * 0.75)) + 2;

        const hexagons: Hexagon[] = [];

        class Hexagon {
            x: number;
            y: number;
            active: boolean;
            opacity: number;
            pulseSpeed: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.active = Math.random() < 0.1; // 10% base activity
                this.opacity = 0;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
            }

            draw() {
                if (!ctx) return;

                // Draw path
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    ctx.lineTo(this.x + r * Math.cos(a * i), this.y + r * Math.sin(a * i));
                }
                ctx.closePath();

                // Base stroke (always visible mesh)
                const currentTheme = themeRef.current;
                const baseColor = currentTheme === "dark" || currentTheme === "system" ? "34, 197, 94" : "22, 163, 74";
                ctx.strokeStyle = `rgba(${baseColor}, 0.05)`; // Very faint grid
                ctx.lineWidth = 1;
                ctx.stroke();

                // Active Pulse state
                if (this.active) {
                    this.opacity += this.pulseSpeed;
                    if (this.opacity > 0.4 || this.opacity < 0) this.pulseSpeed *= -1;

                    ctx.fillStyle = `rgba(${baseColor}, ${Math.max(0, this.opacity)})`;
                    ctx.fill();
                }
            }
        }

        // Initialize Grid
        // Offsets for honeycomb pattern
        const init = () => {
            hexagons.length = 0;
            cols = Math.ceil(w / width) + 2;
            rows = Math.ceil(h / (height * 0.75)) + 2;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    let xOffset = (col * width) + (row % 2 === 1 ? width / 2 : 0);
                    let yOffset = row * (height * 0.75);
                    hexagons.push(new Hexagon(xOffset, yOffset));
                }
            }
        };

        const onMouseMove = (e: MouseEvent) => {
            mx = e.clientX;
            my = e.clientY;
        };

        init();
        window.addEventListener("resize", init);

        // Mouse Tracker
        let mx = -1000;
        let my = -1000;
        window.addEventListener("mousemove", onMouseMove);

        const animate = () => {
            if (!ctx) return;
            // Stop if not visible
            if (canvas.getAttribute('data-visible') === 'false') {
                requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, w, h);

            hexagons.forEach(hex => {
                // Mouse Interaction
                const dx = hex.x - mx;
                const dy = hex.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Highlight hexes near mouse
                if (dist < 150) {
                    const intensity = 1 - dist / 150;
                    const currentTheme = themeRef.current;
                    const baseColor = currentTheme === "dark" || currentTheme === "system" ? "34, 197, 94" : "22, 163, 74";

                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        ctx.lineTo(hex.x + r * Math.cos(a * i), hex.y + r * Math.sin(a * i));
                    }
                    ctx.closePath();
                    ctx.fillStyle = `rgba(${baseColor}, ${intensity * 0.2})`;
                    ctx.fill();
                    ctx.strokeStyle = `rgba(${baseColor}, ${intensity * 0.5})`;
                    ctx.stroke();
                }

                hex.draw();
            });

            // Dynamic "Data Packets" - Randomly activating new cells
            if (Math.random() < 0.05) {
                const randHex = hexagons[Math.floor(Math.random() * hexagons.length)];
                if (randHex && !randHex.active) {
                    randHex.active = true;
                    randHex.opacity = 0;
                    // Auto-deactivate after one pulse roughly or just let it pulse? 
                    // Let's keep it simplish.
                }
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", init);
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

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
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
}

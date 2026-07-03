"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Point {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    connections: number[];
    flash: number;
}

interface Signal {
    fromIdx: number;
    toIdx: number;
    progress: number;
    speed: number;
    trail: { x: number, y: number }[];
}

export default function CyberNetworkBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isVisibleRef = useRef<boolean>(true);
    const animationFrameRef = useRef<number | null>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Visibility Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisibleRef.current = entry.isIntersecting;
            });
        }, { threshold: 0 });
        observer.observe(container);

        const ctx = canvas.getContext("2d"); // alpha: false might be faster if we clear fully, but we need transparency. actually standard is fine.
        // re-get context without alpha optimization for now as we need transparency over background? 
        // Actually we are an overlay, so we need alpha.
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let points: Point[] = [];
        let signals: Signal[] = [];

        // Grid Config
        const SPACING = 55;

        const initPoints = () => {
            points = [];
            const cols = Math.ceil(width / SPACING) + 2;
            const rows = Math.ceil(height / (SPACING * 0.866)) + 2;

            for (let r = -1; r < rows; r++) {
                for (let c = -1; c < cols; c++) {
                    const xOffset = (r % 2) * (SPACING / 2);
                    const x = c * SPACING + xOffset;
                    const y = r * (SPACING * 0.866);

                    // 50% chance for node to exist -> creates nice "tech mazes"
                    if (Math.random() > 0.5) {
                        points.push({
                            x, y,
                            baseX: x, baseY: y,
                            connections: [],
                            flash: 0
                        });
                    }
                }
            }

            // Neighbors
            points.forEach((p1, i) => {
                points.forEach((p2, j) => {
                    if (i === j) return;
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < SPACING * 1.2) {
                        p1.connections.push(j);
                    }
                });
            });
        };

        const resize = () => {
            width = container.clientWidth;
            height = container.clientHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            initPoints();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);
        resize();

        const spawnSignal = () => {
            if (points.length === 0) return;
            const startIdx = Math.floor(Math.random() * points.length);
            const startNode = points[startIdx];
            if (startNode.connections.length === 0) return;

            const endIdx = startNode.connections[Math.floor(Math.random() * startNode.connections.length)];

            signals.push({
                fromIdx: startIdx,
                toIdx: endIdx,
                progress: 0,
                speed: 0.04 + Math.random() * 0.04,
                trail: []
            });
        };

        const MAX_SIGNALS = 50;

        const animate = () => {
            if (!isVisibleRef.current) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            const isDark = theme !== 'light';
            // Polished Colors: Subtle grid, bright signals
            const colorLine = isDark ? "rgba(0, 255, 200, 0.07)" : "rgba(0, 100, 100, 0.08)";
            const colorNode = isDark ? "rgba(0, 255, 200, 0.3)" : "rgba(0, 100, 100, 0.3)";
            const colorSignal = isDark ? "#00ffcc" : "#00aa99";

            // Interaction
            const mouse = mouseRef.current;
            points.forEach(p => {
                const dx = mouse.x - p.baseX;
                const dy = mouse.y - p.baseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 250;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    // Smooth repulsion
                    const angle = Math.atan2(dy, dx);
                    const push = 30 * force * force;
                    p.x = p.baseX + Math.cos(angle) * push;
                    p.y = p.baseY + Math.sin(angle) * push;
                } else {
                    p.x += (p.baseX - p.x) * 0.05; // Elastic return
                    p.y += (p.baseY - p.y) * 0.05;
                }
                if (p.flash > 0) p.flash *= 0.92;
            });

            // Draw Grid Lines
            ctx.lineWidth = 1; // Crisp lines
            ctx.strokeStyle = colorLine;
            ctx.beginPath();
            points.forEach(p => {
                p.connections.forEach(connIdx => {
                    // Optimization: check index to avoid double draw?
                    // Let's rely on opacity accumulation for depth
                    const p2 = points[connIdx];
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                });
            });
            ctx.stroke();

            // Draw Nodes
            points.forEach(p => {
                ctx.fillStyle = colorNode;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2); // Smaller, sharper nodes
                ctx.fill();

                // Flash Logic
                if (p.flash > 0.01) {
                    // Bright Core
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.flash})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                    ctx.fill();

                    // Shockwave
                    ctx.strokeStyle = `rgba(0, 255, 204, ${p.flash * 0.6})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 2 + (1 - p.flash) * 12, 0, Math.PI * 2);
                    ctx.stroke();
                }
            });

            // Process Signals
            ctx.lineCap = 'round';
            for (let i = signals.length - 1; i >= 0; i--) {
                const sig = signals[i];
                sig.progress += sig.speed;

                const p1 = points[sig.fromIdx];
                const p2 = points[sig.toIdx];

                // Safety Check: Points might be missing after resize
                if (!p1 || !p2) {
                    signals.splice(i, 1);
                    continue;
                }

                const curX = p1.x + (p2.x - p1.x) * sig.progress;
                const curY = p1.y + (p2.y - p1.y) * sig.progress;

                sig.trail.push({ x: curX, y: curY });
                if (sig.trail.length > 10) sig.trail.shift(); // Longer, smoother trails

                // Optimized Trail Drawing
                if (sig.trail.length > 1) {
                    const startP = sig.trail[0];
                    const endP = sig.trail[sig.trail.length - 1];

                    const grad = ctx.createLinearGradient(startP.x, startP.y, endP.x, endP.y);
                    grad.addColorStop(0, "rgba(0, 255, 204, 0)");
                    grad.addColorStop(1, "rgba(0, 255, 204, 1)");

                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(startP.x, startP.y);
                    for (let t = 1; t < sig.trail.length; t++) {
                        ctx.lineTo(sig.trail[t].x, sig.trail[t].y);
                    }
                    ctx.stroke();
                }

                // Draw Head
                ctx.shadowBlur = 8;
                ctx.shadowColor = colorSignal;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                if (sig.progress >= 1) {
                    points[sig.toIdx].flash = 1.0;
                    const nextNode = points[sig.toIdx];
                    if (nextNode.connections.length > 0 && Math.random() > 0.15) {
                        const nextConnIdx = nextNode.connections[Math.floor(Math.random() * nextNode.connections.length)];
                        if (nextConnIdx !== sig.fromIdx) {
                            sig.fromIdx = sig.toIdx;
                            sig.toIdx = nextConnIdx;
                            sig.progress = 0;
                            sig.trail = [];
                        } else signals.splice(i, 1);
                    } else signals.splice(i, 1);
                }
            }

            if (signals.length < MAX_SIGNALS && Math.random() > 0.85) spawnSignal();

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [theme]);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none -z-0">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ willChange: 'transform' }} // Hint for compositor
            />
            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"></div>
        </div>
    );
}


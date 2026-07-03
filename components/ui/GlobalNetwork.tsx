"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function GlobalNetwork() {
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
            // No full re-init needed, just let loop handle it
        };
        window.addEventListener("resize", resize);

        // Parameters
        const globeRadius = Math.min(w, h) * 0.35;
        const dotsCount = 400; // Fibonacci sphere points
        const rotationSpeed = 0.001;
        let rotation = 0;

        // Points
        const points: { x: number; y: number; z: number; lat: number; lon: number }[] = [];

        // Initialize Fibonacci Sphere
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
        for (let i = 0; i < dotsCount; i++) {
            const y = 1 - (i / (dotsCount - 1)) * 2; // y goes from 1 to -1
            const radiusAtY = Math.sqrt(1 - y * y); // radius at y
            const theta = phi * i;

            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            points.push({ x: x * globeRadius, y: y * globeRadius, z: z * globeRadius, lat: 0, lon: 0 });
        }

        // Data Packets (Signals)
        // They travel between random nearby points
        const packets: {
            startIdx: number,
            endIdx: number,
            progress: number,
            speed: number,
            color: string // "green" or "white"
        }[] = [];

        // Spawn packet helper
        const spawnPacket = () => {
            if (packets.length > 20) return;
            const startIdx = Math.floor(Math.random() * points.length);
            // Find a neighbor
            let endIdx = -1;
            let _minDst = Infinity;

            // Just pick random closeness
            // Optimization: pre-calculate neighbors? 
            // Calculated dynamically for variety
            for (let i = 0; i < points.length; i++) {
                if (i === startIdx) continue;
                // Dist in 3D space
                const dx = points[startIdx].x - points[i].x;
                const dy = points[startIdx].y - points[i].y;
                const dz = points[startIdx].z - points[i].z;
                const dst = Math.sqrt(dx * dx + dy * dy + dz * dz);

                // Connect if reasonably close but not too close
                if (dst < globeRadius * 0.5 && dst > globeRadius * 0.1) {
                    if (Math.random() > 0.5) { endIdx = i; break; }
                }
            }

            if (endIdx !== -1) {
                packets.push({
                    startIdx,
                    endIdx,
                    progress: 0,
                    speed: Math.random() * 0.02 + 0.01,
                    color: Math.random() > 0.8 ? "white" : "green"
                });
            }
        };

        const animate = () => {
            if (!ctx) return;

            ctx.clearRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;

            // Rotate Sphere
            rotation += rotationSpeed;

            // Project and Draw Points
            // Sort by Z to draw back-to-front (depth)
            // To do this efficiently, we map points to projected 2D first, store Z

            const projectedVecs = points.map(p => {
                // Rotate around Y axis
                const rotX = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
                const rotZ = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);

                // Simple perspective
                const _scale = 800 / (800 - rotZ); // z goes from -radius to radius
                const _x2d = cx + rotX; // Orthographic-ish for globe? No, let's use flat projection for clean look
                // Actually, Perspective is better
                const _xProj = cx + rotX; // Simplified rotation
                const _yProj = cy + p.y;

                // Real 3D rotation
                return {
                    x: cx + rotX,
                    y: cy + p.y,
                    z: rotZ,
                    r: 1.5, // Dot radius
                    alpha: (rotZ + globeRadius) / (2 * globeRadius) // Fade back dots
                };
            });

            // Sort by Z
            projectedVecs.sort((a, b) => a.z - b.z);

            const baseColor = theme === "dark" || theme === "system" ? "34, 197, 94" : "22, 163, 74";

            projectedVecs.forEach(p => {
                const alpha = Math.max(0.1, (p.z + globeRadius) / (2.5 * globeRadius)); // Z-fade
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${baseColor}, ${alpha})`;
                ctx.fill();
            });

            // Update and Draw Packets
            if (Math.random() < 0.05) spawnPacket();

            for (let i = packets.length - 1; i >= 0; i--) {
                const pkt = packets[i];
                pkt.progress += pkt.speed;
                if (pkt.progress >= 1) {
                    packets.splice(i, 1);
                    continue;
                }

                // Get current start/end pos (need to rotate them too!)
                const p1 = points[pkt.startIdx];
                const p2 = points[pkt.endIdx];

                // Rotate p1
                const p1x_rot = p1.x * Math.cos(rotation) - p1.z * Math.sin(rotation);
                const p1z_rot = p1.x * Math.sin(rotation) + p1.z * Math.cos(rotation);

                // Rotate p2
                const p2x_rot = p2.x * Math.cos(rotation) - p2.z * Math.sin(rotation);
                const p2z_rot = p2.x * Math.sin(rotation) + p2.z * Math.cos(rotation);

                // If both are in back, don't draw (occlusion)
                if (p1z_rot < -globeRadius * 0.5 && p2z_rot < -globeRadius * 0.5) continue;

                const x1 = cx + p1x_rot;
                const y1 = cy + p1.y;
                const x2 = cx + p2x_rot;
                const y2 = cy + p2.y;

                // Interpolate
                const currX = x1 + (x2 - x1) * pkt.progress;
                const currY = y1 + (y2 - y1) * pkt.progress;

                // Draw Packet
                ctx.beginPath();
                ctx.arc(currX, currY, 2, 0, Math.PI * 2);
                const isWhite = pkt.color === "white";
                ctx.fillStyle = isWhite
                    ? (theme === "dark" || theme === "system" ? "#ffffff" : "#121212")
                    : `rgb(${baseColor})`;

                // Trail
                ctx.fill();

                // Draw faint line connecting them?
                // ctx.beginPath();
                // ctx.moveTo(x1, y1);
                // ctx.lineTo(x2, y2);
                // ctx.strokeStyle = `rgba(${baseColor}, 0.1)`;
                // ctx.stroke();
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-60"
        />
    );
}

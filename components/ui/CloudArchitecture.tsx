"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function CloudArchitecture() {
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
        };
        window.addEventListener("resize", resize);

        // --- Configuration ---
        const globeRadius = Math.min(w, h) * 0.4;
        const cx = w / 2;
        const cy = h / 2;

        // Interaction State
        let rotation = 0;
        let _targetRotation = 0;
        const _rotationVelocity = 0.002; // Auto-rotate speed
        let isDragging = false;
        let lastMouseX = 0;
        let dragVelocity = 0;

        // Mouse Handling
        const handleMouseDown = (e: MouseEvent | TouchEvent) => {
            isDragging = true;
            lastMouseX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            // canvas.style.cursor = 'grabbing';
            if (canvas) canvas.style.cursor = 'grabbing';
        };

        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const delta = clientX - lastMouseX;
            lastMouseX = clientX;

            // Apply drag to rotation
            // Sensitivity
            dragVelocity = delta * 0.005;
            rotation += dragVelocity;
        };

        const handleMouseUp = () => {
            isDragging = false;
            if (canvas) canvas.style.cursor = 'grab';
        };

        // Attach listeners
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchstart", handleMouseDown);
        window.addEventListener("touchmove", handleMouseMove);
        window.addEventListener("touchend", handleMouseUp);


        // Locations (Lat, Lon)
        // Lat: -90 to 90, Lon: -180 to 180
        const locations = [
            { name: "Sri Lanka (HQ)", lat: 7.8731, lon: 80.7718, type: "home" }, // Sri Lanka
            { name: "us-east-1", lat: 38.0336, lon: -78.5080, type: "region" }, // N. Virginia
            { name: "us-west-1", lat: 37.7749, lon: -122.4194, type: "region" }, // California
            { name: "eu-west-1", lat: 53.3498, lon: -6.2603, type: "region" }, // Ireland
            { name: "eu-central-1", lat: 50.1109, lon: 8.6821, type: "region" }, // Frankfurt
            { name: "ap-southeast-1", lat: 1.3521, lon: 103.8198, type: "region" }, // Singapore
            { name: "ap-northeast-1", lat: 35.6762, lon: 139.6503, type: "region" }, // Tokyo
            { name: "sa-east-1", lat: -23.5505, lon: -46.6333, type: "region" }, // Sao Paulo
            { name: "ap-southeast-2", lat: -33.8688, lon: 151.2093, type: "region" }, // Sydney
            { name: "af-south-1", lat: -33.9249, lon: 18.4241, type: "region" }, // Cape Town
        ];

        // Edge Nodes (Approximation for density)
        // Just adding more random dots roughly around major landmasses would take too much data.
        // We will generate a "cloud" of minor edge nodes.
        const edgeNodes: { lat: number, lon: number }[] = [];
        for (let i = 0; i < 150; i++) {
            edgeNodes.push({
                lat: (Math.random() - 0.5) * 160, // Keep away from poles
                lon: (Math.random() - 0.5) * 360
            });
        }

        const packets: {
            start: { lat: number, lon: number },
            end: { lat: number, lon: number },
            progress: number,
            speed: number,
            color: string
        }[] = [];

        // Convert Lat/Lon to 3D Sphere Point
        const getSpherePoint = (lat: number, lon: number, radius: number) => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);

            const x = -(radius * Math.sin(phi) * Math.cos(theta));
            const z = (radius * Math.sin(phi) * Math.sin(theta));
            const y = (radius * Math.cos(phi));

            return { x, y, z };
        };

        const spawnPacket = () => {
            // Pick random region to random region
            const l1 = locations[Math.floor(Math.random() * locations.length)];
            const l2 = locations[Math.floor(Math.random() * locations.length)];
            if (l1 === l2) return;

            packets.push({
                start: l1,
                end: l2,
                progress: 0,
                speed: 0.015,
                color: l1.type === 'home' || l2.type === 'home' ? 'green' : 'white'
            });
        };

        const drawMap = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);

            // Physics
            if (!isDragging) {
                // Inertia & Auto-rotate
                // Decaying drag velocity
                dragVelocity *= 0.95;

                // If drag stops, return to base auto-speed
                if (Math.abs(dragVelocity) < 0.0001) dragVelocity = 0;

                // Combined speed
                rotation += dragVelocity + 0.001; // Base speed
            }

            // Smooth infinite rotation
            // rotation is simple float.

            const baseColor = theme === "dark" || theme === "system" ? "34, 197, 94" : "22, 163, 74";

            // Draw "Globe Wireframe" (Faint)
            ctx.beginPath();
            ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${baseColor}, 0.15)`;
            ctx.stroke();

            // Render Nodes
            const renderPoint = (lat: number, lon: number, _size: number, _color: string, _label?: string, _pulse?: boolean) => {
                const p = getSpherePoint(lat, lon, globeRadius);

                // Rotate around Y axis
                // rotation is adding to theta? No, just rotate vectors.
                const rotX = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
                const rotZ = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);
                const rotY = p.y;

                const _zScale = rotZ; // for depth check

                // If behind globe, don't draw (or draw faint)
                if (rotZ < -globeRadius * 0.2) return null; // Occlusion

                // Perspective proj
                const scale = 1000 / (1000 - rotZ);
                const x2d = cx + rotX * scale;
                const y2d = cy + rotY * scale;

                return { x: x2d, y: y2d, scale, z: rotZ };
            };

            // 1. Draw Edge Nodes (Faint background traffic)
            edgeNodes.forEach(node => {
                const pt = renderPoint(node.lat, node.lon, 1, `rgba(${baseColor}, 0.3)`);
                if (pt) {
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, 1 * pt.scale, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${baseColor}, 0.4)`;
                    ctx.fill();
                }
            });

            // 2. Draw Regions (Major Hubs)
            locations.forEach(loc => {
                const isHome = loc.type === "home";
                const pt = renderPoint(loc.lat, loc.lon, isHome ? 4 : 2, isHome ? "#fff" : baseColor);

                if (pt) {
                    // Draw node
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, (isHome ? 6 : 3) * pt.scale, 0, Math.PI * 2);
                    ctx.fillStyle = isHome ? "#ef4444" : `rgb(${baseColor})`; // SL is Red/Highlighted
                    ctx.fill();

                    // Ripple effect for Sri Lanka
                    if (isHome) {
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, 12 * pt.scale, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(239, 68, 68, 0.5)`;
                        ctx.stroke();

                        // Label
                        ctx.font = `bold ${10 * pt.scale}px "JetBrains Mono"`;
                        ctx.fillStyle = 'white';
                        ctx.fillText(loc.name, pt.x + 10, pt.y);
                    } else {
                        // Region label
                        ctx.fillStyle = `rgba(${baseColor}, 0.7)`;
                        ctx.font = `${8 * pt.scale}px "JetBrains Mono"`;
                        ctx.fillText(loc.name, pt.x + 8, pt.y);
                    }
                }
            });

            // 3. Draw Packets (Arcs)
            if (Math.random() < 0.1) spawnPacket();

            for (let i = packets.length - 1; i >= 0; i--) {
                const pkt = packets[i];
                pkt.progress += pkt.speed;
                if (pkt.progress >= 1) {
                    packets.splice(i, 1);
                    continue;
                }

                // Calculate 3D Arc
                const startP = getSpherePoint(pkt.start.lat, pkt.start.lon, globeRadius);
                const endP = getSpherePoint(pkt.end.lat, pkt.end.lon, globeRadius);

                // Rotate both
                const r1 = {
                    x: startP.x * Math.cos(rotation) - startP.z * Math.sin(rotation),
                    y: startP.y,
                    z: startP.x * Math.sin(rotation) + startP.z * Math.cos(rotation)
                };
                const r2 = {
                    x: endP.x * Math.cos(rotation) - endP.z * Math.sin(rotation),
                    y: endP.y,
                    z: endP.x * Math.sin(rotation) + endP.z * Math.cos(rotation)
                };

                // Interpolate 3D position (Slerp-like or just linear + height bump?)
                // Linear 3D interp is fine, but we want an ARC (going out from surface)

                const currX_raw = r1.x + (r2.x - r1.x) * pkt.progress;
                const currY_raw = r1.y + (r2.y - r1.y) * pkt.progress;
                const currZ_raw = r1.z + (r2.z - r1.z) * pkt.progress;

                // Add Arc Height (Simple parabola)
                // Height peak at 0.5
                const arcH = Math.sin(pkt.progress * Math.PI) * (globeRadius * 0.2);

                // Normal vector from center?
                // Simplified: just add length to vector length
                // Normalize current vector
                const len = Math.sqrt(currX_raw * currX_raw + currY_raw * currY_raw + currZ_raw * currZ_raw);
                const norm = { x: currX_raw / len, y: currY_raw / len, z: currZ_raw / len };

                const finalPos = {
                    x: norm.x * (len + arcH),
                    y: norm.y * (len + arcH),
                    z: norm.z * (len + arcH)
                };

                // Occlusion check
                if (finalPos.z < -globeRadius * 0.1) continue;

                // Project
                const scale = 1000 / (1000 - finalPos.z);
                const x2d = cx + finalPos.x * scale;
                const y2d = cy + finalPos.y * scale;

                ctx.beginPath();
                ctx.arc(x2d, y2d, 2 * scale, 0, Math.PI * 2);
                ctx.fillStyle = pkt.color === 'white' ? 'white' : `rgb(${baseColor})`;
                ctx.fill();
            }

            requestAnimationFrame(drawMap);
        };

        drawMap();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchstart", handleMouseDown);
            window.removeEventListener("touchmove", handleMouseMove);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 cursor-grab active:cursor-grabbing opacity-80"
        />
    );
}

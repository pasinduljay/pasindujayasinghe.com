"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function SignalWaves() {
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

        // Configuration
        const lines = 12; // Number of waves
        // const step = 10;

        let time = 0;

        const animate = () => {
            if (!ctx) return;

            // Clear
            ctx.clearRect(0, 0, w, h);

            const baseColor = theme === "dark" || theme === "system" ? "34, 197, 94" : "22, 163, 74";

            // Draw Waves
            // We want multiple overlapping waves to create an interference pattern aka "Moiré"
            // representing signal analysis

            for (let i = 0; i < lines; i++) {
                ctx.beginPath();

                // Varied parameters for each line to create organic "net"
                const amplitude = h / 8 + (i * 10);
                const frequency = 0.005 + (i * 0.001);
                const speed = 0.01 + (i * 0.002);
                const phase = i * 2;

                const yOffset = h / 2;

                ctx.lineWidth = 1.5;
                // Fade out outer lines
                const alpha = 0.3 - (i * 0.02);
                ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;

                for (let x = 0; x <= w; x += 10) { // Step 10px for performance
                    // y = A * sin(kx + wt + phi)
                    // Complex wave: modulation
                    const y = yOffset +
                        Math.sin(x * frequency + time * speed + phase) * amplitude *
                        Math.sin(x * 0.001 + time * 0.005); // Amplitude modulation

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            // Draw "Data Points" on the main carrier wave
            // Just a few bright dots traveling along one of the waves
            const mainWaveIndex = Math.floor(lines / 2);
            const amplitude = h / 8 + (mainWaveIndex * 10);
            const frequency = 0.005 + (mainWaveIndex * 0.001);
            const speed = 0.01 + (mainWaveIndex * 0.002);
            const phase = mainWaveIndex * 2;

            // A moving signal packet
            const packetX = (time * 100) % (w + 200) - 100;
            const packetY = (h / 2) + Math.sin(packetX * frequency + time * speed + phase) * amplitude * Math.sin(packetX * 0.001 + time * 0.005);

            if (packetX > 0 && packetX < w) {
                ctx.beginPath();
                ctx.arc(packetX, packetY, 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${baseColor}, 1)`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(${baseColor}, 1)`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            time++;
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
            className="fixed inset-0 z-0 pointer-events-none opacity-50"
        />
    );
}

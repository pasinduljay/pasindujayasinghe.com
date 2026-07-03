"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function CipherCascade() {
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
        const fontSize = 14;
        let columns = Math.floor(w / fontSize);
        const drops: number[] = []; // Y position of drop for each column

        // "Decryption" Chars: Hex + Binary + Special
        const chars = "0123456789ABCDEF$#@%&";

        const init = () => {
            columns = Math.floor(w / fontSize);
            drops.length = 0;
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100; // Start above screen randomly
            }
        };

        init();

        const animate = () => {
            if (!ctx) return;

            // Trail Effect:
            // Instead of clearing, draw a semi-transparent black rect over the screen
            // This makes previous frames "fade out" slowly, creating the trail

            const isDark = theme === "dark" || theme === "system";

            // Background Fade
            // Use very low opacity for long trails
            ctx.fillStyle = isDark ? "rgba(18, 18, 18, 0.05)" : "rgba(255, 255, 255, 0.1)";
            ctx.fillRect(0, 0, w, h);

            ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

            // Loop through drops
            for (let i = 0; i < drops.length; i++) {
                // Random char
                const text = chars[Math.floor(Math.random() * chars.length)];

                // Color Logic:
                // Head of the stream is White (Processing/Hot)
                // Body is Green (Decrypted/Stable)

                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Only draw if on screen
                // Using fillText is expensive if done thousands of times, but standard matrix effect usually handles it ok.
                // Optimization: we only draw the *new* character at the bottom of the stream.
                // But wait, the fade rectangle clears previous chars.
                // So we are rewriting the head.

                // Draw the "Head" (White/Bright)
                ctx.fillStyle = isDark ? "#ffffff" : "#000000"; // White head in dark mode
                ctx.fillText(text, x, y);

                // Draw the "Tail" segment just above it (Green)
                // Actually the fade rect handles the color fade if we just draw White?
                // No, white fades to grey. We need green.
                // Let's manually draw the character above us in Green to "overwrite" the previous white head?
                // That's complex.

                // Standard Matrix Algo:
                // Draw new char at X,Y.
                // Render it Green usually. Randomly White?

                // Let's try:
                // 1. Draw Green Character at current spot.
                ctx.fillStyle = isDark ? "#22c55e" : "#16a34a";
                ctx.fillText(text, x, y);

                // 2. Occasionally draw a White/Highlighted character to simulate "Activity"
                if (Math.random() > 0.95) {
                    ctx.fillStyle = isDark ? "#ffffff" : "#121212";
                    ctx.fillText(text, x, y);
                }

                // Increment Y
                drops[i]++;

                // Reset randomly after clearing screen or random chance
                if (drops[i] * fontSize > h && Math.random() > 0.975) {
                    drops[i] = 0;
                }
            }

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-40"
        />
    );
}

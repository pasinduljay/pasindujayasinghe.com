"use client";

import { useEffect, useState } from "react";

export default function DotGrid() {
    const [dots, setDots] = useState<any[]>([]);

    useEffect(() => {
        const generateDots = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const spacing = 40;
            const cols = Math.ceil(width / spacing);
            const rows = Math.ceil(height / spacing);
            const newDots = [];

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (Math.random() > 0.85) { // Only show 15% of dots for subtlety
                        newDots.push({
                            cx: i * spacing,
                            cy: j * spacing,
                            r: Math.random() * 1.5 + 0.5,
                            opacity: Math.random() * 0.3 + 0.1
                        });
                    }
                }
            }
            setDots(newDots);
        };

        generateDots();
        window.addEventListener("resize", generateDots);
        return () => window.removeEventListener("resize", generateDots);
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <svg className="w-full h-full">
                {dots.map((dot, i) => (
                    <circle
                        key={i}
                        cx={dot.cx}
                        cy={dot.cy}
                        r={dot.r}
                        className="fill-current text-gray-500 dark:text-gray-700"
                        style={{ opacity: dot.opacity }}
                    />
                ))}
            </svg>
            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-background" />
        </div>
    );
}

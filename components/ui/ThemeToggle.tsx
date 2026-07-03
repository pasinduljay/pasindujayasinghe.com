"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        
        // If View Transitions API is supported, use it for fluid, hardware-accelerated fading
        if (typeof document !== "undefined" && (document as any).startViewTransition) {
            (document as any).startViewTransition(() => {
                // Force synchronous DOM update so the browser captures the transition states correctly
                import("react-dom").then(({ flushSync }) => {
                    flushSync(() => {
                        setTheme(newTheme);
                    });
                });
            });
            return;
        }

        // Fallback for browsers that do not support View Transitions:
        if (typeof document !== "undefined") {
            document.documentElement.classList.add("theme-transitioning");
        }
        
        setTheme(newTheme);
        
        setTimeout(() => {
            if (typeof document !== "undefined") {
                document.documentElement.classList.remove("theme-transitioning");
            }
        }, 350);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-white fill-current" />
            ) : (
                <Moon className="w-5 h-5 text-gray-800" />
            )}
        </button>
    );
}

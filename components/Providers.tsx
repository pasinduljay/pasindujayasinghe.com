"use client";

import { ThemeProvider } from "next-themes";
import { SystemStatusProvider } from "@/context/SystemStatusContext";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const originalError = console.error;
    console.error = (...args: any[]) => {
        if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
            return;
        }
        originalError.apply(console, args);
    };
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SystemStatusProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={true}>
                {children}
            </ThemeProvider>
        </SystemStatusProvider>
    );
}

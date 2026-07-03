"use client";

import { useEffect, useState } from "react";

export default function Typewriter({ text, speed = 50 }: { text: string; speed?: number }) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText("");
        const timer = setInterval(() => {
            setDisplayedText((prev) => {
                if (prev.length >= text.length) {
                    clearInterval(timer);
                    return prev;
                }
                return prev + text.charAt(prev.length);
            });
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return <span>{displayedText}</span>;
}

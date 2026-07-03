import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    variant?: "glass" | "alert" | "solid";
    className?: string;
}

export default function Card({ children, variant = "glass", className = "" }: CardProps) {
    const variants = {
        glass: "bg-card/90 backdrop-blur-sm border border-border rounded-xl shadow-lg",
        alert: "bg-cyber-orange/5 border-l-4 border-cyber-orange rounded-lg p-6 relative overflow-hidden backdrop-blur-sm",
        solid: "bg-card border border-border rounded-xl shadow-md"
    };

    return (
        <div className={`${variants[variant]} ${className}`}>
            {children}
        </div>
    );
}

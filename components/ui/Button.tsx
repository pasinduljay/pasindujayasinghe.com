import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
    icon?: "arrow" | ReactNode;
    className?: string;
    target?: string;
    rel?: string;
}

export default function Button({
    children,
    href,
    onClick,
    variant = "primary",
    size = "md",
    icon,
    className = "",
    target,
    rel
}: ButtonProps) {
    const baseClasses = "group relative font-bold tracking-widest transition-all duration-300 inline-flex items-center justify-center";

    const sizeClasses = {
        sm: "px-6 py-3 text-xs min-w-[140px]",
        md: "px-8 py-4 text-sm min-w-[180px]",
        lg: "px-10 py-5 text-base min-w-[200px]"
    };

    const variantClasses = {
        primary: "-skew-x-12 bg-[#000000] text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 border-2 border-transparent",
        secondary: "rounded-xl bg-white text-black border-[#000000]/10 dark:bg-black dark:text-white dark:border-white/20 border hover:border-black/30 dark:hover:border-cyber-green/50"
    };

    const content = (
        <>
            {variant === "secondary" && (
                <div className="absolute inset-0 bg-cyber-green/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            )}
            <span className={`${variant === "primary" ? "skew-x-12" : ""} inline-flex items-center gap-2 relative z-10`}>
                {children}
                {icon === "arrow" && (
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                )}
                {icon && icon !== "arrow" && icon}
            </span>
        </>
    );

    const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

    if (href) {
        return (
            <a
                href={href}
                target={target}
                rel={rel}
                className={combinedClasses}
            >
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={combinedClasses}>
            {content}
        </button>
    );
}

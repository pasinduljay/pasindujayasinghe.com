"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function InteractiveGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener('resize', onResize);
        onResize();

        if (!canvasRef.current) return;

        // Sri Lanka Coordinates
        const _HQ = { lat: 7.8731, long: 80.7718 };

        // AWS Nodes
        const _AWS_NODES = [
            { location: [39.04, -77.48], size: 0.05 }, // N. Virginia (US East)
            { location: [51.50, -0.12], size: 0.05 },  // London (EU West)
            { location: [50.11, 8.68], size: 0.05 },   // Frankfurt (EU Central)
            { location: [1.35, 103.81], size: 0.05 },  // Singapore (Asia Pacific)
            { location: [35.67, 139.65], size: 0.05 }, // Tokyo (Asia Pacific)
            { location: [-33.86, 151.20], size: 0.05 },// Sydney (Asia Pacific)
            { location: [-23.55, -46.63], size: 0.05 },// São Paulo (SA East)
            { location: [37.77, -122.41], size: 0.05 },// N. California (US West)
            { location: [19.07, 72.87], size: 0.05 },  // Mumbai (Asia Pacific)
            { location: [55.75, 37.61], size: 0.05 },  // Stockholm/Europe (Proxy)
        ];

        // Interaction State
        let currentPhi = 0;
        let currentTheta = 0;
        let isDragging = false;
        let startX = 0;
        let momentumPhi = 0;
        let momentumTheta = 0;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            scale: 1.0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 4,
            baseColor: [0.3, 0.3, 0.3], // Dark Grey
            markerColor: [0.9, 0.9, 1], // Platinum White
            glowColor: [0.4, 0.4, 0.5], // Metallic Silver Glow
            markers: [
                { location: [7.8731, 80.7718], size: 0.05 }, // Sri Lanka - main marker
                { location: [7.8731, 80.7718], size: 0.08 }, // Halo ring 1
                { location: [7.8731, 80.7718], size: 0.11 }, // Halo ring 2
            ],
            onRender: (state) => {
                const w = canvasRef.current ? canvasRef.current.offsetWidth : width;

                // Only render if visible
                if (canvasRef.current && canvasRef.current.getAttribute('data-process') === 'false') {
                    return;
                }

                if (!isDragging) {
                    // Auto-rotation (horizontal only) + momentum decay
                    currentPhi += 0.005;
                    momentumPhi *= 0.95;
                    momentumTheta *= 0.95;

                    // Add momentum
                    currentPhi += momentumPhi;
                    currentTheta += momentumTheta;
                }

                state.phi = currentPhi;
                state.theta = Math.min(Math.max(0.3 + currentTheta, -1), 1);
                state.width = w * 2;
                state.height = w * 2;
            },
        });

        const canvas = canvasRef.current;

        const onPointerDown = (e: PointerEvent | TouchEvent) => {
            isDragging = true;
            canvas.style.cursor = 'grabbing';
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
            startX = clientX;
            momentumPhi = 0;
            momentumTheta = 0;
        };

        const onPointerUp = () => {
            isDragging = false;
            canvas.style.cursor = 'grab';
        };

        const onPointerMove = (e: PointerEvent | TouchEvent) => {
            if (!isDragging) return;

            e.preventDefault();
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX;

            const deltaX = clientX - startX;
            // deltaY ignored for vertical lock

            // Rotation steps
            const rotationStepPhi = deltaX / 75;
            const _rotationStepTheta = 0; // Lock vertical rotation (user request)

            currentPhi += rotationStepPhi;
            // currentTheta += rotationStepTheta; // Disabled

            momentumPhi = rotationStepPhi;
            momentumTheta = 0; // No vertical momentum

            startX = clientX;
        };

        // Event listeners (passive: false for touch to allow preventDefault)
        canvas.addEventListener('pointerdown', onPointerDown as any);
        canvas.addEventListener('pointerup', onPointerUp);
        canvas.addEventListener('pointerout', onPointerUp);
        canvas.addEventListener('pointermove', onPointerMove as any);

        // Touch specific for mobile
        canvas.addEventListener('touchstart', onPointerDown as any, { passive: false });
        canvas.addEventListener('touchend', onPointerUp);
        canvas.addEventListener('touchmove', onPointerMove as any, { passive: false });

        setTimeout(() => {
            if (canvasRef.current) {
                canvasRef.current.style.opacity = '1';
            }
        });

        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
            canvas.removeEventListener('pointerdown', onPointerDown as any);
            canvas.removeEventListener('pointerup', onPointerUp);
            canvas.removeEventListener('pointerout', onPointerUp);
            canvas.removeEventListener('pointermove', onPointerMove as any);
            canvas.removeEventListener('touchstart', onPointerDown as any);
            canvas.removeEventListener('touchend', onPointerUp);
            canvas.removeEventListener('touchmove', onPointerMove as any);
            canvas.removeEventListener('touchmove', onPointerMove as any);
        };
    }, []);

    // Visibility Observer to pause rendering
    useEffect(() => {
        if (!canvasRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (canvasRef.current) {
                    // Store visibility state in data attribute to be read inside render loop
                    canvasRef.current.setAttribute('data-process', entry.isIntersecting ? 'true' : 'false');
                }
            });
        }, { threshold: 0 });

        observer.observe(canvasRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="w-full max-w-[300px] aspect-square relative flex items-center justify-center cursor-grab active:cursor-grabbing">
            {/* Theme-aware outer glow - Metallic Silver */}
            <div className="absolute inset-0 bg-zinc-400/10 dark:bg-zinc-400/10 blur-3xl rounded-full dark:opacity-30 opacity-10 pointer-events-none transform scale-90" />

            <canvas
                ref={canvasRef}
                data-process="true"
                style={{ width: '100%', height: '100%', contain: 'layout paint size' }}
                className="opacity-0 transition-opacity duration-1000"
            />
        </div>
    );
}

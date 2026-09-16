import React, { useEffect, useState, useCallback } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const WaterAtmosphere: React.FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handlePointerDown = useCallback((e: MouseEvent | TouchEvent) => {
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
      }
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
    };

    setRipples((prev) => {
      // Keep max 8 active ripples to preserve performance
      const updated = prev.length > 7 ? prev.slice(prev.length - 7) : prev;
      return [...updated, newRipple];
    });

    // Auto-remove ripple after animation (650ms)
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 650);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Users with prefers-reduced-motion enabled should never get the tap
    // ripple effect, matching how the ambient background layer already
    // disables its own animation for the same media query (see index.css).
    if (motionQuery.matches) return;

    window.addEventListener('pointerdown', handlePointerDown as EventListener, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown as EventListener);
    };
  }, [handlePointerDown]);

  return (
    <>
      {/* 1. Ultra-subtle Animated Water-Light Caustic Atmosphere in Background (Reduced >80%) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        <div className="water-atmosphere-layer absolute -inset-[10%] w-[120%] h-[120%]">
          {/* Oceanic liquid glass caustics: Deep Navy & Royal Blue reflections with Cyan light */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 25% 30%, rgba(2, 132, 199, 0.04) 0%, transparent 50%),
                radial-gradient(ellipse at 75% 65%, rgba(29, 78, 216, 0.035) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 85%, rgba(11, 25, 44, 0.03) 0%, transparent 45%),
                radial-gradient(ellipse at 80% 20%, rgba(56, 189, 248, 0.035) 0%, transparent 45%)
              `,
            }}
          />
          {/* Faint oceanic refraction overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-multiply"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="waterCausticFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.015 0.012"
                numOctaves="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="15"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <rect width="100%" height="100%" fill="#0B192C" filter="url(#waterCausticFilter)" />
          </svg>
        </div>
      </div>

      {/* 2. Delicate Pointer/Tap Water Ripple Layer */}
      <div
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none"
        aria-hidden="true"
      >
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: '48px',
              height: '48px',
            }}
          >
            {/* Primary expanding oceanic water ring */}
            <div
              className="water-ripple-ring absolute inset-0 rounded-full border border-sky-400/50 bg-radial from-sky-400/15 via-blue-600/5 to-transparent"
              style={{
                boxShadow: '0 0 12px rgba(2, 132, 199, 0.25)',
              }}
            />
            {/* Secondary delayed inner concentric ripple */}
            <div
              className="water-ripple-ring absolute inset-2 rounded-full border border-sky-300/35"
              style={{
                animationDelay: '90ms',
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

import React, { useState, useEffect, useRef, type HTMLAttributes } from 'react';

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export interface GalleryItem {
  common: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
  };
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 850, autoRotateSpeed = 0.018, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const lastPointerX = useRef(0);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastScrollY = useRef(0);

    // Scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        const delta = window.scrollY - lastScrollY.current;
        lastScrollY.current = window.scrollY;
        setRotation((prev) => prev + delta * 0.04);
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, []);

    // Pointer-based rotation (Drag/Swipe)
    const handlePointerDown = (e: React.PointerEvent) => {
      setIsDragging(true);
      lastPointerX.current = e.clientX;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      // Sensitivity factor: 0.15 for smooth drag
      setRotation((prev) => prev + deltaX * 0.15);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    };

    // Auto-rotate when not interacting
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling && !isDragging) {
          setRotation((prev) => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };
      animationFrameRef.current = requestAnimationFrame(autoRotate);
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }, [isScrolling, isDragging, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn('relative w-full h-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing', className)}
        style={{ perspective: '2500px', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        {...props}
      >
        <div
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
            width: '180px',
            height: '260px',
            position: 'relative',
            pointerEvents: 'none', // Allow events to pass to parent for dragging
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.25, 1 - normalizedAngle / 180);

            return (
              <div
                key={i}
                role="group"
                aria-label={item.common}
                style={{
                  position: 'absolute',
                  width: '180px',
                  height: '260px',
                  top: 0,
                  left: 0,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  opacity,
                  transition: 'opacity 0.3s linear',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
                    border: '2px solid rgba(255,255,255,0.1)',
                    pointerEvents: 'auto', // Re-enable pointer events for hover/click on cards if needed
                  }}
                >
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    draggable={false}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: item.photo.pos || 'center',
                      display: 'block',
                      userSelect: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '12px 16px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
                      color: 'white',
                    }}
                  >
                    <p style={{ fontSize: '12px', fontWeight: 600, margin: 0 }}>{item.common}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

  }
);

CircularGallery.displayName = 'CircularGallery';
export { CircularGallery };

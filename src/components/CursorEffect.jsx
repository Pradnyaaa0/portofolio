import { useEffect, useRef } from 'react';

export default function CursorEffect() {
  const mouseRef = useRef({ x: -100, y: -100 });
  const isVisibleRef = useRef(false);

  // Track trail states for lerp interpolation
  const trailRef = useRef({
    x: -100,
    y: -100,
    width: 32,
    height: 32,
    borderRadius: '50%',
    bg: 'rgba(99, 102, 241, 0)',
    border: '1.5px solid rgba(99, 102, 241, 0.4)',
    boxShadow: 'none',
    labelOpacity: 0,
  });

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse/trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    let animFrameId;
    let cachedTime = 0;

    const updateCursor = () => {
      const mouse = mouseRef.current;
      const trail = trailRef.current;

      let targetWidth = 32;
      let targetHeight = 32;
      let targetX = mouse.x - targetWidth / 2;
      let targetY = mouse.y - targetHeight / 2;

      let targetBorderRadius = '50%';
      let targetBg = 'rgba(99, 102, 241, 0)';
      let targetBorder = '1.5px solid rgba(99, 102, 241, 0.4)';
      let targetBoxShadow = 'none';
      let targetLabelOpacity = 0;
      let currentLabel = '';
      let dotScale = 1;

      // 1. Efficient pointer target check (without forced full-page querySelector reflow)
      if (isVisibleRef.current && mouse.x >= 0 && mouse.y >= 0) {
        const elementUnderMouse = document.elementFromPoint(mouse.x, mouse.y);

        if (elementUnderMouse) {
          const labelEl = elementUnderMouse.closest('[data-cursor-label]');
          const interactive = elementUnderMouse.closest('button, a, .hover-target, [role="button"]');
          const heading = elementUnderMouse.closest('h1, h2, h3');

          if (labelEl) {
            currentLabel = labelEl.getAttribute('data-cursor-label') || '';
            const isGithub = currentLabel.toLowerCase().includes('repo') || currentLabel.toLowerCase().includes('github');
            targetWidth = isGithub ? 90 : 100;
            targetHeight = isGithub ? 90 : 100;
            targetX = mouse.x - targetWidth / 2;
            targetY = mouse.y - targetHeight / 2;
            targetBorderRadius = '50%';
            targetBg = isGithub ? 'rgba(15, 23, 42, 0.95)' : 'rgba(99, 102, 241, 0.9)';
            targetBorder = isGithub ? '1.5px solid rgba(99, 102, 241, 0.4)' : 'none';
            targetBoxShadow = isGithub ? '0 10px 25px rgba(15, 23, 42, 0.5)' : '0 10px 25px rgba(99, 102, 241, 0.4)';
            targetLabelOpacity = 1;
            dotScale = 0;
          } else if (interactive) {
            const rect = interactive.getBoundingClientRect();
            const padMag = 4;
            targetWidth = rect.width + padMag * 2;
            targetHeight = rect.height + padMag * 2;
            targetX = rect.left - padMag;
            targetY = rect.top - padMag;
            targetBorderRadius = '12px';
            targetBg = 'rgba(99, 102, 241, 0.08)';
            targetBorder = '1.5px solid rgba(99, 102, 241, 0.7)';
            targetBoxShadow = '0 0 15px rgba(99, 102, 241, 0.2)';
            dotScale = 0;
          } else if (heading) {
            const rect = heading.getBoundingClientRect();
            const padText = 6;
            targetWidth = Math.min(rect.width + padText * 2, 400);
            targetHeight = rect.height + padText * 2;
            targetX = rect.left - padText;
            targetY = rect.top - padText;
            targetBorderRadius = '8px';
            targetBg = 'rgba(99, 102, 241, 0.03)';
            targetBorder = '1.5px dashed rgba(99, 102, 241, 0.3)';
            dotScale = 0.8;
          } else {
            // Organic fluid morphing calculation
            cachedTime += 0.02;
            const r1 = 50 + Math.sin(cachedTime) * 4;
            const r2 = 50 + Math.cos(cachedTime * 0.8) * 4;
            const r3 = 50 + Math.sin(cachedTime * 1.2) * 4;
            const r4 = 50 + Math.cos(cachedTime * 1.5) * 4;
            targetBorderRadius = `${r1}% ${100 - r1}% ${r2}% ${100 - r2}% / ${r3}% ${r4}% ${100 - r4}% ${100 - r3}%`;
          }
        }
      }

      // 2. Smooth GPU interpolation (lerp)
      trail.x = lerp(trail.x, targetX, 0.18);
      trail.y = lerp(trail.y, targetY, 0.18);
      trail.width = lerp(trail.width, targetWidth, 0.18);
      trail.height = lerp(trail.height, targetHeight, 0.18);
      trail.labelOpacity = lerp(trail.labelOpacity, targetLabelOpacity, 0.2);

      // 3. Direct GPU-accelerated styling (translate3d)
      ring.style.transform = `translate3d(${trail.x.toFixed(2)}px, ${trail.y.toFixed(2)}px, 0)`;
      ring.style.width = `${trail.width.toFixed(1)}px`;
      ring.style.height = `${trail.height.toFixed(1)}px`;
      ring.style.borderRadius = targetBorderRadius;
      ring.style.backgroundColor = targetBg;
      ring.style.border = targetBorder;
      ring.style.boxShadow = targetBoxShadow;

      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;

      if (label.textContent !== currentLabel) {
        label.textContent = currentLabel;
      }
      label.style.opacity = trail.labelOpacity.toFixed(2);

      animFrameId = requestAnimationFrame(updateCursor);
    };

    animFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <>
      {/* Small dot exactly at the cursor — 100% GPU translated */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-indigo-500 rounded-full pointer-events-none z-[9999] hidden lg:block opacity-0 will-change-transform"
        style={{
          transition: 'opacity 0.2s ease',
        }}
      />
      {/* Trail ring — 100% GPU translated */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] hidden lg:flex items-center justify-center text-center select-none opacity-0 will-change-transform"
        style={{
          transition: 'border-radius 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s, border 0.25s, box-shadow 0.25s, opacity 0.2s ease',
        }}
      >
        <span
          ref={labelRef}
          className="text-[9px] font-black text-white dark:text-neutral-100 uppercase tracking-widest pointer-events-none whitespace-nowrap px-2 animate-pulse"
        />
      </div>
    </>
  );
}

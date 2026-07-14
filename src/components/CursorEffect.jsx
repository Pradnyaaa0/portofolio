import { useEffect, useRef, useState } from 'react';

export default function CursorEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [label, setLabel] = useState('');

  // Track mouse coordinates
  const mouseRef = useRef({ x: 0, y: 0 });

  // Track trail states for lerp interpolation (representing top-left positions)
  const trailRef = useRef({
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    borderRadius: '50%',
    bg: 'rgba(99, 102, 241, 0)',
    border: '1.5px solid rgba(99, 102, 241, 0.4)',
    boxShadow: 'none',
    labelOpacity: 0
  });

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    // Only enable on device with fine pointer (mouse/trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) {
      return;
    }

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      if (hidden) setHidden(false);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    // Animation frame loop
    let animFrameId;
    const updateCursor = () => {
      const mouse = mouseRef.current;
      const trail = trailRef.current;

      let targetWidth = 32;
      let targetHeight = 32;
      // Default: Center coordinates, meaning we calculate top-left from mouse
      let targetX = mouse.x - targetWidth / 2;
      let targetY = mouse.y - targetHeight / 2;

      let targetBorderRadius = '50%';
      let targetBg = 'rgba(99, 102, 241, 0)';
      let targetBorder = '1.5px solid rgba(99, 102, 241, 0.4)';
      let targetBoxShadow = 'none';
      let targetLabelOpacity = 0;
      let currentLabel = '';
      let dotScale = 1;

      // 1. Get precise element under mouse pointer
      const elementUnderMouse = document.elementFromPoint(mouse.x, mouse.y);

      let hoveredEl = null;
      let hoverType = 'default';

      if (elementUnderMouse) {
        // Walk up ancestor tree to check if anything has data-cursor-label
        const labelEl = elementUnderMouse.closest('[data-cursor-label]');
        const magnetic = elementUnderMouse.closest('button') || elementUnderMouse.closest('a') || elementUnderMouse.closest('.hover-target') || elementUnderMouse.closest('[role="button"]');
        const card = elementUnderMouse.closest('.glass-card');
        const heading = elementUnderMouse.closest('h1') || elementUnderMouse.closest('h2') || elementUnderMouse.closest('h3');

        if (labelEl) {
          hoveredEl = labelEl;
          hoverType = 'label';
          currentLabel = labelEl.getAttribute('data-cursor-label');
        } else if (magnetic) {
          hoveredEl = magnetic;
          hoverType = 'magnetic';
        } else if (card) {
          hoveredEl = card;
          hoverType = 'card';
        } else if (heading) {
          hoveredEl = heading;
          hoverType = 'text';
        }
      }

      // 2. Magnetic Attraction Search (if not hovering anything, search nearby elements)
      if (hoverType === 'default') {
        const magneticElements = document.querySelectorAll('button, a, .hover-target, [role="button"]');
        let minDistance = 75; // snapping distance in pixels
        let nearest = null;

        magneticElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(mouse.x - cx, mouse.y - cy);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = el;
          }
        });

        if (nearest) {
          hoveredEl = nearest;
          hoverType = 'magnetic';
        }
      }

      // 3. Process hover styles & top-left coordinates in real-time
      if (hoveredEl) {
        const rect = hoveredEl.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(hoveredEl);
        const radius = computedStyle.borderRadius !== '50%' ? computedStyle.borderRadius : '12px';

        switch (hoverType) {
          case 'magnetic': {
            // Wrap the button snugly
            const padMag = 4;
            targetWidth = rect.width + padMag * 2;
            targetHeight = rect.height + padMag * 2;
            targetX = rect.left - padMag;
            targetY = rect.top - padMag;
            targetBorderRadius = radius || '12px';
            targetBg = 'rgba(99, 102, 241, 0.08)';
            targetBorder = '1.5px solid rgba(99, 102, 241, 0.7)';
            targetBoxShadow = '0 0 15px rgba(99, 102, 241, 0.2)';
            dotScale = 0; // hide dot
            break;
          }

          case 'card': {
            // Wrap the glass card with a glowing frame outline
            const padCard = 8;
            targetWidth = rect.width + padCard * 2;
            targetHeight = rect.height + padCard * 2;
            targetX = rect.left - padCard;
            targetY = rect.top - padCard;
            targetBorderRadius = radius || '24px';
            targetBg = 'rgba(99, 102, 241, 0.015)';
            targetBorder = '2px solid rgba(99, 102, 241, 0.6)';
            targetBoxShadow = '0 0 25px rgba(99, 102, 241, 0.2)';
            dotScale = 0.5; // shrink dot
            break;
          }

          case 'text': {
            // Wrap the header
            const padText = 6;
            targetWidth = rect.width + padText * 2;
            targetHeight = rect.height + padText * 2;
            targetX = rect.left - padText;
            targetY = rect.top - padText;
            targetBorderRadius = '8px';
            targetBg = 'rgba(99, 102, 241, 0.03)';
            targetBorder = '1.5px dashed rgba(99, 102, 241, 0.3)';
            dotScale = 1;
            break;
          }

          default:
            break;
        }
      }

      // 4. Custom Label view (follows mouse, displays custom label text)
      if (hoverType === 'label') {
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
      }

      // 5. Default floating blob (organic fluid shape morphing)
      if (hoverType === 'default') {
        const time = Date.now() * 0.003;
        const r1 = 50 + Math.sin(time) * 4;
        const r2 = 50 + Math.cos(time * 0.8) * 4;
        const r3 = 50 + Math.sin(time * 1.2) * 4;
        const r4 = 50 + Math.cos(time * 1.5) * 4;
        targetBorderRadius = `${r1}% ${100 - r1}% ${r2}% ${100 - r2}% / ${r3}% ${r4}% ${100 - r4}% ${100 - r3}%`;
      }

      // 6. Smooth linear interpolation (lerp)
      trail.x = lerp(trail.x, targetX, 0.15);
      trail.y = lerp(trail.y, targetY, 0.15);
      trail.width = lerp(trail.width, targetWidth, 0.15);
      trail.height = lerp(trail.height, targetHeight, 0.15);
      trail.labelOpacity = lerp(trail.labelOpacity, targetLabelOpacity, 0.15);

      // 7. Update text label
      if (labelRef.current) {
        if (currentLabel !== label) {
          setLabel(currentLabel);
        }
        labelRef.current.style.opacity = trail.labelOpacity;
      }

      // 8. Apply calculated styles directly to DOM nodes
      if (ringRef.current) {
        ringRef.current.style.left = `${trail.x}px`;
        ringRef.current.style.top = `${trail.y}px`;
        ringRef.current.style.width = `${trail.width}px`;
        ringRef.current.style.height = `${trail.height}px`;
        ringRef.current.style.borderRadius = targetBorderRadius;
        ringRef.current.style.backgroundColor = targetBg;
        ringRef.current.style.border = targetBorder;
        ringRef.current.style.boxShadow = targetBoxShadow;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(-50%, -50%) scale(${dotScale})`;
      }

      animFrameId = requestAnimationFrame(updateCursor);
    };

    animFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animFrameId);
    };
  }, [hidden, label]);

  if (hidden) return null;

  return (
    <>
      {/* Small dot exactly at the cursor */}
      <div
        ref={dotRef}
        className="fixed w-2.5 h-2.5 bg-indigo-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:block pointer-events-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
      {/* Trail ring (positioned via top-left coordinate directly) */}
      <div
        ref={ringRef}
        className="fixed rounded-full pointer-events-none z-[9998] hidden lg:flex items-center justify-center pointer-events-none text-center select-none"
        style={{
          transition: 'border-radius 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s, border 0.25s, box-shadow 0.25s'
        }}
      >
        <span
          ref={labelRef}
          className="text-[9px] font-black text-white dark:text-neutral-100 uppercase tracking-widest pointer-events-none whitespace-nowrap px-2 animate-pulse"
        >
          {label}
        </span>
      </div>
    </>
  );
}

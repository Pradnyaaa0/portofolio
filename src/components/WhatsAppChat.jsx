import { useState, useEffect, useRef } from 'react';

export default function WhatsAppChat() {
  // Initial position: bottom-right corner (using absolute offset or coordinate states)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const elementPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const buttonRef = useRef(null);

  // Set default initial position on mount (bottom-right offset)
  useEffect(() => {
    const handleResize = () => {
      const margin = 24;
      const btnSize = 60;
      const initialX = window.innerWidth - btnSize - margin;
      const initialY = window.innerHeight - btnSize - margin;
      
      // Only set position if it hasn't been dragged yet or on initial mount
      if (!hasMoved.current) {
        setPosition({ x: initialX, y: initialY });
        elementPos.current = { x: initialX, y: initialY };
      } else {
        // Keep within bounds if screen resized
        const maxX = window.innerWidth - btnSize - margin;
        const maxY = window.innerHeight - btnSize - margin;
        const newX = Math.min(Math.max(margin, elementPos.current.x), maxX);
        const newY = Math.min(Math.max(margin, elementPos.current.y), maxY);
        setPosition({ x: newX, y: newY });
        elementPos.current = { x: newX, y: newY };
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e) => {
    // Only drag with left click
    if (e.button !== 0) return;
    startDrag(e.clientX, e.clientY);
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY };
    hasMoved.current = true;
    
    // Add event listeners for move & end
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = (e) => {
    performDrag(e.clientX, e.clientY);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      performDrag(e.touches[0].clientX, e.touches[0].clientY);
      // Prevent screen scrolling while dragging
      if (e.cancelable) e.preventDefault();
    }
  };

  const performDrag = (clientX, clientY) => {
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    
    const margin = 16;
    const btnSize = 60;
    const maxX = window.innerWidth - btnSize - margin;
    const maxY = window.innerHeight - btnSize - margin;

    const newX = Math.min(Math.max(margin, elementPos.current.x + dx), maxX);
    const newY = Math.min(Math.max(margin, elementPos.current.y + dy), maxY);

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = (e) => {
    endDrag(e.clientX, e.clientY);
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  const endDrag = (clientX, clientY) => {
    setIsDragging(false);
    
    // Update local base position reference
    elementPos.current = { x: position.x, y: position.y };
    
    // Clean up listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);

    // If mouse moved very little, treat as click
    let distance = 0;
    if (clientX !== undefined && clientY !== undefined) {
      distance = Math.hypot(clientX - dragStart.current.x, clientY - dragStart.current.y);
    }
    
    if (distance < 5) {
      // Use the actual user's phone number or fall back to portfolio contact number
      const phoneNumber = '6285737036100'; // Phone from App.jsx: +62 857-3703-6100
      const message = encodeURIComponent('Halo Pradnya! Saya tertarik untuk bekerja sama atau berdiskusi mengenai proyek.');
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      ref={buttonRef}
      className={`hover-target fixed z-[999] w-[60px] h-[60px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:shadow-[0_12px_40px_rgb(37,211,102,0.6)] select-none transition-transform duration-300 hover:scale-110 active:scale-95 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Speech Bubble floating above */}
      <div 
        className="absolute bottom-full mb-3 right-0 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 text-[11px] font-bold px-3.5 py-2 rounded-2xl shadow-[0_6px_25px_rgba(0,0,0,0.12)] dark:shadow-[0_6px_25px_rgba(0,0,0,0.4)] border border-neutral-200/80 dark:border-neutral-800/85 whitespace-nowrap pointer-events-none z-20 flex items-center gap-1.5"
        style={{
          animation: 'bounce 2s infinite'
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
        Ada yang bisa dibantu? Chat yuk!
        {/* Tiny arrow pointing down */}
        <div className="absolute top-full right-[23px] w-2.5 h-2.5 bg-white dark:bg-neutral-900 border-r border-b border-neutral-200/80 dark:border-neutral-800/85 transform rotate-45 -translate-y-1.5" />
      </div>

      {/* Pulsing rings decoration */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping opacity-75 pointer-events-none" />
      <span className="absolute -inset-1.5 rounded-full border-2 border-[#25D366]/25 animate-pulse pointer-events-none" />

      {/* WhatsApp SVG Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 drop-shadow-md relative z-10"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.887-6.979C16.578 1.898 14.1 .874 11.465.872 6.03.872 1.606 5.29 1.602 10.728c-.001 1.707.453 3.373 1.317 4.825L1.87 21.05l5.777-1.514zm11.23-5.263c-.303-.153-1.8-.886-2.077-.988-.278-.102-.48-.153-.68.153-.2.305-.778.988-.953 1.192-.177.204-.354.229-.657.076-.304-.153-1.282-.472-2.44-1.506-.902-.806-1.51-1.802-1.687-2.107-.177-.305-.019-.47.133-.621.137-.137.304-.356.457-.534.153-.178.204-.305.304-.51.102-.204.05-.382-.025-.534-.076-.153-.68-1.637-.932-2.242-.246-.59-.496-.51-.68-.52-.176-.008-.378-.01-.58-.01-.2 0-.526.076-.8.382-.276.305-1.056 1.033-1.056 2.521 0 1.488 1.08 2.922 1.23 3.126.153.204 2.128 3.25 5.157 4.56.72.31 1.28.496 1.72.637.724.23 1.383.197 1.903.12.58-.087 1.8-.737 2.05-1.45.25-.713.25-1.324.176-1.45-.075-.127-.277-.203-.58-.356z" />
      </svg>
    </div>
  );
}

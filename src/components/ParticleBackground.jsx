import { useEffect, useRef } from 'react';

export default function ParticleBackground({ isLightMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: null,
      y: null,
      radius: 120, // Interaction radius
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.baseRadius = this.radius;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interactive effect
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            // Push particles away gently
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.5;
            this.y -= Math.sin(angle) * force * 1.5;
            this.radius = this.baseRadius + force * 2;
          } else {
            if (this.radius > this.baseRadius) {
              this.radius -= 0.1;
            }
          }
        } else {
          if (this.radius > this.baseRadius) {
            this.radius -= 0.1;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // Subtle blue/purple color based on mode
        if (isLightMode) {
          ctx.fillStyle = `rgba(99, 102, 241, ${0.15 + (this.radius - this.baseRadius) * 0.15})`;
        } else {
          ctx.fillStyle = `rgba(129, 140, 248, ${0.2 + (this.radius - this.baseRadius) * 0.2})`;
        }
        ctx.fill();
      }
    }

    // Initialize particles (optimized count)
    const particleCount = Math.min(Math.floor((width * height) / 25000), 50);
    particles = Array.from({ length: particleCount }, () => new Particle());

    // Connect particles with single batch draw call (10x faster)
    const strokeColor = isLightMode ? 'rgba(99, 102, 241, 0.08)' : 'rgba(129, 140, 248, 0.12)';
    const drawLines = () => {
      const maxDistance = 110;
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 0.8;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
          }
        }
      }
      ctx.stroke();
    };

    // Animation Loop (auto-pauses when tab is hidden)
    const animate = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLightMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

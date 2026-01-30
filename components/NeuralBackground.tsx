import React, { useEffect, useRef } from 'react';

const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Move Particle class definition here
  class Particle {
    x: number;

    y: number;

    vx: number;

    vy: number;

    size: number;

    constructor(width: number, height: number) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2.5 + 1.5;
    }

    update(width: number, height: number, mouse: { x: number; y: number; }) {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 220) { // Using 220 as mouseDistance constant
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (220 - distance) / 220; // Using 220 as mouseDistance constant

        // Gently push away
        this.vx -= forceDirectionX * force * 0.05;
        this.vy -= forceDirectionY * force * 0.05;
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      // Increased opacity for better visibility (0.4 -> 0.6)
      ctx.fillStyle = 'rgba(224, 194, 110, 0.6)';
      ctx.fill();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = canvas.parentElement?.offsetWidth || window.innerWidth;
    canvas.width = width;
    let height = canvas.parentElement?.offsetHeight || window.innerHeight;
    canvas.height = height;

    let particles: Particle[] = [];
    // Adjusted density for better visibility
    const particleCount = Math.min(Math.floor((width * height) / 10000), 140);
    const connectionDistance = 160;

    const mouse = { x: -1000, y: -1000 };

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i += 1) {
        particles.push(new Particle(width, height));
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle, i) => {
        particle.update(width, height, mouse);
        particle.draw(ctx);

        // Draw connections
        for (let j = i; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            // Increased connection opacity (0.35 -> 0.40)
            const opacity = 0.40 - (distance / connectionDistance) * 0.40;
            ctx.strokeStyle = `rgba(224, 194, 110, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const newWidth = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.width = newWidth;
      const newHeight = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.height = newHeight;
      width = newWidth;
      height = newHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
};

export default NeuralBackground;

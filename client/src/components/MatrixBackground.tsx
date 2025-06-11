import React, { useEffect, useRef } from 'react';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - more financial/tech focused
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$€£¥₿@#%^&*()_+-=[]{}|;:,.<>?';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
    }

    const draw = () => {
      // Create fade effect with darker background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties with emerald green
      ctx.fillStyle = '#10b981';
      ctx.font = `${fontSize}px 'Inter', monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Add some variation in opacity
        const opacity = Math.random() * 0.8 + 0.2;
        ctx.fillStyle = `rgba(16, 185, 129, ${opacity})`;
        ctx.fillText(char, x, y);

        // Reset drop randomly or when it reaches bottom
        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }

        drops[i] += Math.random() * 1.5 + 0.3;
      }
    };

    const interval = setInterval(draw, 60);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} id="matrix-canvas" className="fixed inset-0 -z-10" />;
};

export default MatrixBackground;
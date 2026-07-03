import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, FileText, Sparkles, Shield, BarChart3 } from 'lucide-react';

interface ColorTheme {
  border: string;
  bg: string;
  glow: string;
  accent: string;
  name: string;
}

const themes: ColorTheme[] = [
  {
    name: 'Cyber Purple',
    border: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.16)',
    glow: 'rgba(139, 92, 246, 0.4)',
    accent: '#C4B5FD'
  },
  {
    name: 'Neon Cyan',
    border: '#00F0FF',
    bg: 'rgba(0, 240, 255, 0.16)',
    glow: 'rgba(0, 240, 255, 0.4)',
    accent: '#00B8D9'
  },
  {
    name: 'Acid Emerald',
    border: '#10B981',
    bg: 'rgba(16, 185, 129, 0.16)',
    glow: 'rgba(16, 185, 129, 0.4)',
    accent: '#059669'
  },
  {
    name: 'Hot Pink',
    border: '#FF007F',
    bg: 'rgba(255, 0, 127, 0.16)',
    glow: 'rgba(255, 0, 127, 0.4)',
    accent: '#D0006F'
  },
  {
    name: 'Solar Gold',
    border: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.16)',
    glow: 'rgba(245, 158, 11, 0.4)',
    accent: '#D97706'
  }
];

export const Interactive3DObject: React.FC = () => {
  const [autoRotation, setAutoRotation] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [clickSpin, setClickSpin] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [clicks, setClicks] = useState(0);

  // Slow continuous rotation when not hovered/dragging
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const tick = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      // Rotate slower on hover to emphasize user control
      const speed = isHovered ? 0.015 : 0.035;
      setAutoRotation(prev => (prev + delta * speed) % 360);
      
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    
    // Tilt the cube face relative to cursor
    setMouseOffset({
      x: x * 35, // up to 35 deg horizontal tilt
      y: y * -35 // up to 35 deg vertical tilt
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  const handleClick = () => {
    // Increment rotational spin by a large angle (between 360 and 720 deg)
    const spinAmount = 360 + Math.floor(Math.random() * 360);
    setClickSpin(prev => prev + spinAmount);
    
    // Cycle the color theme
    setThemeIndex(prev => (prev + 1) % themes.length);
    
    // Trigger neon shockwave pulse
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 800);
    
    setClicks(prev => prev + 1);
  };

  const currentTheme = themes[themeIndex];

  // Helper for applying face styles
  const getFaceStyle = (transformValue: string) => ({
    transform: transformValue,
    borderColor: currentTheme.border,
    background: currentTheme.bg,
    boxShadow: `inset 0 0 15px rgba(255,255,255,0.03), 0 0 20px ${currentTheme.glow}`,
  });

  return (
    <div className="relative flex items-center justify-center w-48 h-48 md:w-56 md:h-56 select-none shrink-0">
      {/* Dynamic Background Blur Glow */}
      <motion.div 
        className="absolute rounded-full blur-[90px] pointer-events-none"
        style={{
          width: '320px',
          height: '320px',
          background: `radial-gradient(circle, ${currentTheme.border} 0%, transparent 70%)`,
          opacity: isHovered ? 0.16 : 0.08,
        }}
        animate={{ scale: isHovered ? 1.15 : 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Neon Shockwave Ring Pulse */}
      <AnimatePresence>
        {showPulse && (
          <motion.div
            className="absolute rounded-full border pointer-events-none"
            style={{
              borderColor: currentTheme.border,
              boxShadow: `0 0 30px ${currentTheme.border}`,
              width: '120px',
              height: '120px',
            }}
            initial={{ scale: 0.6, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Floating 3D Scene Wrapper */}
      <motion.div 
        className="scene-3d w-full h-full flex items-center justify-center"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        {/* The 3D Cube */}
        <motion.div
          className="cube-3d"
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{
            // Base orientation + auto rotation + cursor hover tilt + rapid click spins
            rotateX: 12 + mouseOffset.y + (clickSpin * 0.6) + (autoRotation * 0.5),
            rotateY: 35 + mouseOffset.x + clickSpin + autoRotation,
            rotateZ: (clickSpin * 0.3) + (autoRotation * 0.2),
          }}
          transition={isHovered ? {
            type: 'spring',
            stiffness: 140,
            damping: 24,
            mass: 0.8
          } : {
            type: 'spring',
            stiffness: 65,
            damping: 18
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {/* FACE 1: FRONT (Logo/Title) */}
          <div className="cube-face-3d" style={getFaceStyle('rotateY(0deg) translateZ(70px)')}>
            <div className="flex flex-col items-center">
              <span className="font-mono text-3xl font-extrabold tracking-widest text-white drop-shadow-md">IQ</span>
              <span className="text-[8px] uppercase tracking-wider text-textSecondary font-semibold mt-1">Resume AI</span>
            </div>
            <div className="absolute bottom-3 text-[7px] text-textSecondary font-mono opacity-60">
              CLICK ME
            </div>
          </div>

          {/* FACE 2: BACK (CPU) */}
          <div className="cube-face-3d" style={getFaceStyle('rotateY(180deg) translateZ(70px)')}>
            <Cpu size={32} className="text-white drop-shadow-lg" />
            <span className="text-[9px] uppercase tracking-widest font-heading text-textSecondary mt-2">Analysis</span>
          </div>

          {/* FACE 3: RIGHT (File Text) */}
          <div className="cube-face-3d" style={getFaceStyle('rotateY(90deg) translateZ(70px)')}>
            <FileText size={32} className="text-white drop-shadow-lg" />
            <span className="text-[9px] uppercase tracking-widest font-heading text-textSecondary mt-2">Resume</span>
          </div>

          {/* FACE 4: LEFT (Shield/Security) */}
          <div className="cube-face-3d" style={getFaceStyle('rotateY(-90deg) translateZ(70px)')}>
            <Shield size={32} className="text-white drop-shadow-lg" />
            <span className="text-[9px] uppercase tracking-widest font-heading text-textSecondary mt-2">Secure</span>
          </div>

          {/* FACE 5: TOP (Sparkles/AI) */}
          <div className="cube-face-3d" style={getFaceStyle('rotateX(90deg) translateZ(70px)')}>
            <Sparkles size={32} className="text-white drop-shadow-lg" />
            <span className="text-[9px] uppercase tracking-widest font-heading text-textSecondary mt-2">AI Core</span>
          </div>

          {/* FACE 6: BOTTOM (Analytics) */}
          <div className="cube-face-3d" style={getFaceStyle('rotateX(-90deg) translateZ(70px)')}>
            <BarChart3 size={32} className="text-white drop-shadow-lg" />
            <span className="text-[9px] uppercase tracking-widest font-heading text-textSecondary mt-2">Score</span>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Small interactive floating indicators */}
      <div className="absolute -bottom-4 bg-[#181828] border border-white border-opacity-5 rounded-full px-3 py-1 text-[9px] text-textSecondary font-mono shadow-md backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: currentTheme.border }} />
        <span>Mode: <span className="text-white font-bold">{currentTheme.name}</span></span>
        {clicks > 0 && <span className="text-textSecondary/60">({clicks})</span>}
      </div>
    </div>
  );
};

export default Interactive3DObject;

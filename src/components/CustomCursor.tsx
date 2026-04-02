import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Initial position off-screen
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    const moveCursor = (e: MouseEvent) => {
      // Immediate move for the central dot
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      // Smoothed move for the outer ring
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power3.out'
      });
    };

    const handleHoverStart = () => setIsHovered(true);
    const handleHoverEnd = () => setIsHovered(false);

    window.addEventListener('mousemove', moveCursor);

    // Attach hover listeners to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .hover-target');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  return (
    <>
      {/* Outer Ring (Follower) */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] rounded-full border border-white/30 mix-blend-difference transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${isHovered ? 2.5 : 1})`,
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          backdropFilter: isHovered ? 'blur(2px)' : 'none'
        }}
      />
      
      {/* Inner Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white pointer-events-none z-[9999] rounded-full mix-blend-difference"
      />
    </>
  );
};

export default CustomCursor;

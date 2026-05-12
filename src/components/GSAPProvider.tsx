import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const GSAPProvider = () => {
  useEffect(() => {
    // Register GSAP plugins only when needed
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.config({
      nullTargetWarn: false,
    });

    gsap.defaults({
      ease: 'expo.out',
    });

    ScrollTrigger.refresh();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(0);
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return null;
};

export default GSAPProvider;

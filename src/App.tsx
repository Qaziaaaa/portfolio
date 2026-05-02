import { lazy, Suspense, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Lazy-load the chatbot widget so it doesn't impact initial page load
const ChatbotWidget = lazy(() => import('./components/chatbot/ChatbotWidget'));

import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Work from './sections/Work';
import About from './sections/About';
import Skills from './sections/Skills';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import Experience from './sections/Experience';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);



function App() {
  useEffect(() => {
    // Configure GSAP defaults
    gsap.config({
      nullTargetWarn: false,
    });

    // Set default ease
    gsap.defaults({
      ease: 'expo.out',
    });

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    // Handle reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(0);
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative bg-[#010101] min-h-screen custom-scrollbar overflow-x-hidden">

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Work/Projects Section */}
        <Work />

        {/* About Section */}
        <About />

        {/* Experience Section */}
        <Experience />

        {/* Skills Section */}
        <Skills />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Contact CTA Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* RAG Chatbot Widget — lazy-loaded, zero impact on initial page load */}
      <Suspense fallback={null}>
        <ChatbotWidget />
      </Suspense>
    </div>
  );
}

export default App;

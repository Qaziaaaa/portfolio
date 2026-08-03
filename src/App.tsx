import { lazy, Suspense, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Lazy-load all sections for optimal initial bundle size
const Navigation = lazy(() => import('./sections/Navigation'));
const Hero = lazy(() => import('./sections/Hero'));
const Work = lazy(() => import('./sections/Work'));
const About = lazy(() => import('./sections/About'));
const Experience = lazy(() => import('./sections/Experience'));
const Skills = lazy(() => import('./sections/Skills'));
const Testimonials = lazy(() => import('./sections/Testimonials'));
const Contact = lazy(() => import('./sections/Contact'));
const Footer = lazy(() => import('./sections/Footer'));

// Lazy-load the chatbot widget so it doesn't impact initial page load
const ChatbotWidget = lazy(() => import('./components/chatbot/ChatbotWidget'));

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Torn = () => <div className="torn" style={{ margin: '8px auto' }} />;

function App() {
  useEffect(() => {
    gsap.config({ nullTargetWarn: false });
    ScrollTrigger.refresh();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(0);
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>

      <main id="main-content">
        <Suspense fallback={null}>
          <Hero />
        </Suspense>

        <Torn />

        <Suspense fallback={null}>
          <Work />
        </Suspense>

        <Torn />

        <Suspense fallback={null}>
          <About />
        </Suspense>

        <Torn />

        <Suspense fallback={null}>
          <Experience />
        </Suspense>

        <Torn />

        <Suspense fallback={null}>
          <Skills />
        </Suspense>

        <Torn />

        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>

        <Torn />

        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      </main>

      <Torn />

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <Suspense fallback={null}>
        <ChatbotWidget />
      </Suspense>
    </div>
  );
}

export default App;

import { lazy, Suspense } from 'react';

// Lazy-load GSAP to reduce initial bundle
const GSAPProvider = lazy(() => import('./components/GSAPProvider'));

// Lazy-load all sections for optimal initial bundle size
const Navigation = lazy(() => import('./sections/Navigation'));
const Hero = lazy(() => import('./sections/Hero'));
const Work = lazy(() => import('./sections/Work'));
const About = lazy(() => import('./sections/About'));
const Skills = lazy(() => import('./sections/Skills'));
const Testimonials = lazy(() => import('./sections/Testimonials'));
const Contact = lazy(() => import('./sections/Contact'));
const Footer = lazy(() => import('./sections/Footer'));
const Experience = lazy(() => import('./sections/Experience'));

// Lazy-load the chatbot widget so it doesn't impact initial page load
const ChatbotWidget = lazy(() => import('./components/chatbot/ChatbotWidget'));

function App() {
  return (
    <div className="relative bg-[#010101] min-h-screen custom-scrollbar overflow-x-hidden">
      <Suspense fallback={null}>
        <GSAPProvider />
      </Suspense>
      
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>

      <main id="main-content">
        <Suspense fallback={null}>
          <Hero />
        </Suspense>
        <Suspense fallback={null}>
          <Work />
        </Suspense>
        <Suspense fallback={null}>
          <About />
        </Suspense>
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
        <Suspense fallback={null}>
          <Skills />
        </Suspense>
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      </main>

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

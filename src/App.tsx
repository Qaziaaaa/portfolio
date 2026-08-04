import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Services = lazy(() => import('./pages/Services'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Lazy-load the chatbot widget so it doesn't impact initial page load
const ChatbotWidget = lazy(() => import('./components/chatbot/ChatbotWidget'));

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Torn = () => <div className="torn" style={{ margin: '8px auto' }} />;

const Landing = () => (
  <>
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
  </>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Qazi Farhan Ahmad | AI Web Developer & MERN Stack Expert',
    description: 'Qazi Farhan Ahmad is an AI Web Developer and MERN Stack Expert specializing in high-performance websites, AI-powered web applications, and scalable digital products.',
  },
  '/projects': {
    title: 'Projects | Qazi Farhan Ahmad',
    description: 'Explore 36+ web projects by Qazi Farhan Ahmad — frontend, full-stack, and AI-powered applications built with the MERN stack.',
  },
  '/services': {
    title: 'Services & Hire | Qazi Farhan Ahmad',
    description: 'Web development and AI integration services by Qazi Farhan Ahmad — custom websites, MERN apps, AI features, and consulting.',
  },
  '/contact': {
    title: 'Contact | Qazi Farhan Ahmad',
    description: 'Get in touch with Qazi Farhan Ahmad for freelance projects, internships, or full-time opportunities.',
  },
};

function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = ROUTE_META[pathname]
      ?? (pathname.startsWith('/projects/') ? ROUTE_META['/projects'] : ROUTE_META['/']);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [pathname]);

  return null;
}

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
    <BrowserRouter>
      <ScrollToTop />
      <PageMeta />
      <div className="min-h-screen overflow-x-clip">
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>

        <main id="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/projects"
              element={
                <Suspense fallback={null}>
                  <Projects />
                </Suspense>
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <Suspense fallback={null}>
                  <ProjectDetail />
                </Suspense>
              }
            />
            <Route
              path="/services"
              element={
                <Suspense fallback={null}>
                  <Services />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={null}>
                  <ContactPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Landing />} />
          </Routes>
        </main>

        <Torn />

        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        <Suspense fallback={null}>
          <ChatbotWidget />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Database, Layout } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
    {
        title: 'Full Stack Developer',
        company: 'Freelance & Open Source',
        period: '2023 - Present',
        description: 'Designing and shipping production-grade full-stack applications independently — including a complete e-commerce platform with Stripe payments, OTP auth, real-time stock management, and an admin panel. Focused on security-first architecture, performance optimization, and clean TypeScript codebases.',
        icon: Code,
    },
    {
        title: 'BS Software Engineering',
        company: 'University of Peshawar',
        period: '2023 - Present',
        description: 'Currently in 4th Semester, building a strong foundation in software engineering principles, data structures, algorithms, and system design. Applying academic knowledge directly to real-world projects and open source contributions.',
        icon: Database,
    },
    {
        title: 'Self-Taught Frontend Developer',
        company: 'Independent Learning',
        period: '2022 - 2023',
        description: 'Mastered React, TypeScript, and modern frontend tooling through hands-on project building. Built multiple portfolio sites, agency landing pages, and UI-heavy applications — developing a strong eye for design, animation, and responsive layouts.',
        icon: Layout,
    },
];

const ExperienceCard = ({ exp }: { exp: any }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        // Calculate mouse position relative to card center (-0.5 to 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        // Apply tilt (inverted Y for natural feel, x multiplied for exaggerated effect)
        setTilt({ x: y * -10, y: x * 10 });
    };

    const handleMouseLeave = () => {
        // Create a smooth reset animation instead of snapping back immediately
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
        setTilt({ x: 0, y: 0 });
    };

    const Icon = exp.icon;

    // Combine GSAP scroll animation transforms with our interactive hover transforms
    // We use GSAP for the scroll effect which is applied automatically to the 'experience-card' class, 
    // and we overlay our hover transform directly via style.
    return (
        <div
            ref={cardRef}
            className="experience-card relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-8 md:p-10 hover:bg-white/10 transition-colors duration-300 transform-gpu cursor-pointer"
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out',
                zIndex: tilt.x !== 0 || tilt.y !== 0 ? 10 : 1 // Elevate card when hovered
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center pointer-events-none">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" />
                </div>
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-lg sm:text-2xl font-semibold text-white">{exp.title}</h3>
                        <span className="text-sm font-medium text-white/50 px-3 py-1 bg-white/5 rounded-full mt-2 md:mt-0 w-fit">
                            {exp.period}
                        </span>
                    </div>
                    <h4 className="text-lg text-white/70 mb-4">{exp.company}</h4>
                    <p className="text-white/60 leading-relaxed max-w-2xl">
                        {exp.description}
                    </p>
                </div>
            </div>

            {/* Subtle glow effect on hover */}
            <div
                className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-300 rounded-2xl pointer-events-none"
                style={{ opacity: tilt.x !== 0 || tilt.y !== 0 ? 1 : 0 }}
            />
        </div>
    );
};

const Experience = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const mm = gsap.matchMedia();

        mm.add('(min-width: 1024px)', () => {
            // Headline word animation
            const headlineTrigger = ScrollTrigger.create({
                trigger: section,
                start: 'top 75%',
                onEnter: () => {
                    gsap.fromTo('.experience-word',
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'expo.out' }
                    );
                },
                once: true
            });

            // 3D Cards scroll animation
            const cards = gsap.utils.toArray('.experience-card');

            cards.forEach((card: any) => {
                ScrollTrigger.create({
                    trigger: card,
                    start: 'top bottom-=100',
                    end: 'bottom top+=100',
                    scrub: 1,
                    onUpdate: (self) => {
                        // Only apply scroll animations if the user isn't hovering on the card
                        // This prevents GSAP from fighting with our React state transform
                        if (!card.matches(':hover')) {
                            const progress = self.progress;
                            const rotationProgress = (progress - 0.5) * 2; // -1 to 1

                            gsap.to(card, {
                                rotateX: -rotationProgress * 5, // Reduced scroll rotation to make hover pop more
                                y: progress * -30,
                                duration: 0.5,
                                ease: 'power1.out',
                                overwrite: 'auto'
                            });
                        }
                    }
                });

                // Entrance animation
                gsap.fromTo(card,
                    { opacity: 0, y: 100, rotateX: 30, z: -200 },
                    {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        z: 0,
                        duration: 1,
                        ease: 'expo.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            once: true
                        }
                    }
                );
            });

            return () => {
                headlineTrigger.kill();
            };
        });

        return () => {
            mm.revert();
        };
    }, []);

    const headlineWords = ['Education', '&', 'Experience'];

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="relative bg-[#010101] py-20 md:py-32 overflow-hidden"
        >
            <div className="relative z-10 w-[95%] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 md:mb-20">
                    <div className="experience-label overflow-hidden whitespace-nowrap mb-6 inline-flex justify-center w-full">
                        <span className="text-sm font-medium text-white/50 uppercase tracking-widest">
                            Journey
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight">
                        {headlineWords.map((word, index) => (
                            <span key={index} className="experience-word inline-block mr-[0.25em]">
                                {word}
                            </span>
                        ))}
                    </h2>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {experiences.map((exp, index) => (
                        <ExperienceCard key={index} exp={exp} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;

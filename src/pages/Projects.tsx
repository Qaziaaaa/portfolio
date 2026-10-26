import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, displayTitle, type ProjectCategory } from '../data/projects';
import Doodle from '../components/Doodle';

type Filter = 'all' | ProjectCategory;

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'fullstack', label: 'Full Stack' },
  { key: 'ai', label: 'AI' },
];

const categoryLabel: Record<ProjectCategory, string> = {
  frontend: 'Frontend',
  fullstack: 'Full Stack',
  ai: 'AI',
};

const Projects = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const chipsRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ x: 0, w: 0 });

  const measure = () => {
    const chips = chipsRef.current;
    if (!chips) return;
    const idx = filters.findIndex(f => f.key === filter);
    const btn = chips.querySelectorAll<HTMLElement>('.chip')[idx];
    if (!btn) return;
    const cr = chips.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setThumb({ x: br.left - cr.left - 4, w: br.width });
  };

  useLayoutEffect(() => { measure(); }, [filter]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <section style={{ paddingTop: 56, paddingBottom: 40 }}>
      <div className="wrap">
        <div className="pagehead">
          <span className="eyebrow">the whole library</span>
          <h1>Projects</h1>
          <p>Every build has its own page — details, stack, and a live demo. Click any card to open it.</p>
        </div>

        <div className="filters">
          <span className="flabel">filter by type</span>
          <div className="chips" ref={chipsRef}>
            <span
              className="chips-thumb"
              style={{ transform: `translateX(${thumb.x}px)`, width: thumb.w }}
            />
            {filters.map(f => (
              <button
                key={f.key}
                className={`chip${filter === f.key ? ' active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="gcount">
          {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          {filter === 'all' ? ' in the library' : ` in ${categoryLabel[filter].toLowerCase()}`} — more shipped regularly.
        </p>

        <div className="glib">
          {visible.map(project => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="gcard"
              aria-label={`View ${displayTitle(project.title)}`}
            >
              <span className="ic"><Doodle emoji={project.emoji} /></span>
              <h3>{displayTitle(project.title)}</h3>
              <p>{project.description}</p>
              <div className="gtags">
                {project.tech.slice(0, 3).map((tag, i) => (
                  <span key={i} className="gtag tool">{tag}</span>
                ))}
              </div>
              <span className="read">View project →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

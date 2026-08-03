import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, displayTitle, type ProjectCategory } from '../data/projects';

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
          <div className="chips">
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
          {filter === 'all' ? ' in the library' : ` in ${categoryLabel[filter].toLowerCase()}`} — more shipped regularly ✨
        </p>

        <div className="glib">
          {visible.map(project => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="gcard"
              aria-label={`View ${displayTitle(project.title)}`}
            >
              <span className="ic" style={{ fontSize: '1.6rem', marginBottom: 10 }}>{project.emoji}</span>
              <h3>{displayTitle(project.title)}</h3>
              <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', marginBottom: 14, flex: 1 }}>{project.description}</p>
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

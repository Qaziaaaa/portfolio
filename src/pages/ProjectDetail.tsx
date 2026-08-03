import { Link, Navigate, useParams } from 'react-router-dom';
import { projects, displayTitle, type ProjectCategory } from '../data/projects';

const categoryLabel: Record<ProjectCategory, string> = {
  frontend: 'Frontend',
  fullstack: 'Full Stack',
  ai: 'AI',
};

const fallbackDeliverables: Record<ProjectCategory, string[]> = {
  frontend: ['Responsive UI', 'CSS wireframes', 'Layout design'],
  fullstack: ['Responsive UI', 'REST APIs', 'Authentication'],
  ai: ['AI model integration', 'RAG pipeline', 'Vector database'],
};

const fallbackHighlights: string[] = [
  'Dynamic hero and category sections',
  'Smooth interactions and layout animations',
  'Mobile-first responsive architecture',
  'Optimized asset loading and performance',
];

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find(p => p.slug === slug);

  if (!project) return <Navigate to="/projects" replace />;

  const deliverables = project.deliverables?.length
    ? project.deliverables
    : fallbackDeliverables[project.category];
  const highlights = project.highlights?.length
    ? project.highlights
    : fallbackHighlights;

  return (
    <section style={{ paddingTop: 44, paddingBottom: 40 }}>
      <div className="wrap">
        <Link className="backchip" to="/projects">
          ← Back to Projects
        </Link>

        <div className="pagehead">
          <span className="eyebrow">{categoryLabel[project.category]} project</span>
          <h1>{displayTitle(project.title)}</h1>
          <p style={{ maxWidth: 640 }}>{project.description}</p>
        </div>

        <div className="dchips">
          <span className="m"><b>Client</b> — {project.client || 'Personal brand'}</span>
          <span className="m"><b>Role</b> — {project.role || 'Developer'}</span>
          <span className="m"><b>Timeline</b> — {project.timeline || 'Shipped'}</span>
        </div>

        <div className="cta-row" style={{ justifyContent: 'center', marginBottom: 30 }}>
          {project.live ? (
            <a
              className="btn"
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo →
            </a>
          ) : (
            <span className="note" style={{ margin: 0 }}>
              No live demo yet — the code is below 🚧
            </span>
          )}
          {project.github && (
            <a
              className="btn ghost"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repo
            </a>
          )}
        </div>

        <div className="dgrid">
          <div className="fcard">
            <h3 style={{ marginBottom: 6 }}>What it includes</h3>
            <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', marginBottom: 6 }}>
              Key building blocks and deliverables.
            </p>
            <ul className="dlist">
              {deliverables.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="fcard">
            <h3 style={{ marginBottom: 6 }}>Tools &amp; technologies</h3>
            <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', marginBottom: 14 }}>
              Frameworks, libraries, and tooling used.
            </p>
            <div className="gtags">
              {project.tech.map(tech => (
                <span key={tech} className="gtag tool">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="fcard" style={{ marginTop: 22 }}>
          <h3 style={{ marginBottom: 6 }}>What was built</h3>
          <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', marginBottom: 6 }}>
            A quick breakdown of the most important features.
          </p>
          <ul className="dlist">
            {highlights.map((highlight, i) => (
              <li key={i}>{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;

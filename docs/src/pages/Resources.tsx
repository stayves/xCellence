import './Resources.css';

type ResourceItem = {
  name: string;
  description: string;
  href: string;
  type: 'guide' | 'video' | 'tool' | 'template';
};

type ResourceSection = {
  title: string;
  summary: string;
  items: ResourceItem[];
};

const resourceSections: ResourceSection[] = [
  {
    title: 'Programming & Control Systems',
    summary:
      'Build reliable autonomous routines and iterative tele-op control with our essential software stack, documentation, and tutorials.',
    items: [
      {
        name: 'FTC SDK Documentation',
        description: 'Official FIRST documentation covering the Android Studio SDK, configuration, and control system APIs.',
        href: 'https://ftc-docs.firstinspires.org/',
        type: 'guide',
      },
      {
        name: 'Road Runner Quickstart',
        description: 'Motion planning template that powers our autonomous navigation with spline paths and feedforward tuning tools.',
        href: 'https://github.com/acmerobotics/road-runner-quickstart',
        type: 'template',
      },
      {
        name: 'OnBot Java Cheatsheet',
        description: 'Concise syntax and lifecycle summary for teams programming directly from the REV Control Hub browser.',
        href: 'https://gm0.org/en/latest/docs/software/tutorial-onbot.html',
        type: 'guide',
      },
      {
        name: 'PID Tuning Masterclass',
        description: 'Recorded workshop focused on tuning PIDF loops for drive, slides, and turrets with dashboard telemetry.',
        href: 'https://www.youtube.com/watch?v=XRdK5OZFJ1Y',
        type: 'video',
      },
    ],
  },
  {
    title: 'Mechanical Design & Fabrication',
    summary:
      'From CAD to custom manufacturing, these resources accelerate the process of prototyping robust mechanisms.',
    items: [
      {
        name: 'GrabCAD xCellence Library',
        description: 'Downloadable models of our drivetrain, linear slides, and modular intake plates ready for remixing.',
        href: 'https://grabcad.com/library',
        type: 'template',
      },
      {
        name: 'Design for Manufacturability Checklist',
        description: 'Our internal DFM checklist that covers tolerances, fastener selection, and assembly serviceability.',
        href: 'https://docs.google.com/document/d/dfm-checklist',
        type: 'tool',
      },
      {
        name: 'Into the Deep Game Elements CAD',
        description: 'Official field element STEP files for the 2025-2026 season to support virtual prototyping.',
        href: 'https://www.firstinspires.org/resource-library/ftc/game-and-season-info',
        type: 'template',
      },
      {
        name: 'Gearing & Torque Calculator',
        description: 'Spreadsheet calculator that models torque, speed, and current draw for custom mechanisms.',
        href: 'https://www.revolverworks.com/ftc-calculators',
        type: 'tool',
      },
    ],
  },
  {
    title: 'Strategy, Outreach & Team Operations',
    summary:
      'Resources that help us stay organized, scout intelligently, and share STEM with the community.',
    items: [
      {
        name: 'xCellence Scouting Portal',
        description: 'Notion workspace template for match scouting, pit interviews, and remote collaboration.',
        href: 'https://www.notion.so/templates',
        type: 'template',
      },
      {
        name: 'Grant Writing Starter Pack',
        description: 'Sample sponsorship deck, thank-you letters, and budget tracker from our outreach toolkit.',
        href: 'https://www.firstinspires.org/resource-library/frc/first-robotics-funding-resources',
        type: 'guide',
      },
      {
        name: 'Event Playbook',
        description: 'Step-by-step checklist to run community workshops, scrimmages, and robot reveal livestreams.',
        href: 'https://docs.google.com/document/d/event-playbook',
        type: 'guide',
      },
      {
        name: 'Scoring Analysis Dashboard',
        description: 'Google Sheets tool for win probability, cycle times, and alliance partner selection ranking.',
        href: 'https://docs.google.com/spreadsheets/d/xcellence-scouting',
        type: 'tool',
      },
    ],
  },
];

const Resources = () => {
  return (
    <div className="resources-page">
      <section className="resources-hero">
        <div className="resources-hero-content">
          <span className="section-tag">Toolbox</span>
          <h1>Resources for Teams & Mentors</h1>
          <p>
            Explore our curated library of technical guides, CAD templates, and outreach playbooks that power the
            xCellence workflow throughout the FIRST Tech Challenge season.
          </p>
        </div>
      </section>

      <section className="resources-section">
        <div className="resources-container">
          {resourceSections.map((section) => (
            <article key={section.title} className="resource-block">
              <header>
                <h2>{section.title}</h2>
                <p>{section.summary}</p>
              </header>

              <ul className="resource-list">
                {section.items.map((item) => (
                  <li key={item.name} className="resource-item">
                    <div className="resource-item-meta">
                      <span className={`resource-type ${item.type}`}>{item.type}</span>
                      <h3>{item.name}</h3>
                    </div>
                    <p>{item.description}</p>
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      Open resource
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Resources;




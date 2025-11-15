import './HallOfFame.css';

type Award = {
  title: string;
  event: string;
  year: string;
  description: string;
};

type Milestone = {
  title: string;
  value: string;
  detail: string;
};

const awards: Award[] = [
  {
    title: 'Design Award Winner',
    event: 'Central Asia Championship',
    year: '2025',
    description:
      'Recognized for excellence in engineering documentation, innovative robot design, and systematic development process.',
  },
  {
    title: 'Think Award Winner',
    event: 'India Regional Championship',
    year: '2023',
    description:
      'Awarded for outstanding engineering notebook documenting our analytical approach, iterative design process, and strategic innovation.',
  },
  {
    title: 'Social Media Award',
    event: 'Central Asia Championship',
    year: '2024',
    description:
      'Honored for exceptional online presence reaching 29,000+ people, managing KZ Robotics community (250 members), and inspiring youth across Kazakhstan.',
  },
  {
    title: 'Team Achievements',
    event: 'Multiple Competitions & Projects',
    year: '2022-2025',
    description:
      'Members won $25k at FAP with Digital Bridge, participated in WRO international stage, won Technovation Girls republican stage, and created MindShield (Discovery of the Year - Steppe Awards).',
  },
];

const milestones: Milestone[] = [
  {
    title: 'People Reached Offline',
    value: '190',
    detail: 'Through workshops, masterclasses, forums, hackathons, and continuous education programs.',
  },
  {
    title: 'People Engaged Online',
    value: '29,000',
    detail: 'Via social media (Instagram 800+ followers, 150K views), KZ Robotics Telegram (250 members), YouTube & TikTok.',
  },
  {
    title: 'Event Hours Delivered',
    value: '105+',
    detail: 'Across 7 cities and 2 rural towns in Kazakhstan, including training camps, forums, courses, and masterclasses.',
  },
  {
    title: 'Teams Supported',
    value: '16',
    detail: 'Started and mentored 6 teams (FTC & FLL), assisted 10+ teams with technical guidance and resources.',
  },
];

const alumniHighlights = [
  {
    name: 'Asylbek Myrzakhmetov',
    role: 'Director of USTEM Robotics Development Fund',
    achievement: 'Member of the Robotics, STEAM and Programming Development Council at the Ministry of Education of Kazakhstan. Oversees Smart Sarbaz / Zhas Sarbaz patriotic program for military-engineering education through robotics.',
  },
  {
    name: 'Daniyar Ermatov',
    role: 'FIRST Program Delivery Partner',
    achievement: 'Over 6 years with FIRST as program delivery partner. Electrical and electronics engineer supporting FTC teams across the region.',
  },
];

const HallOfFame = () => {
  return (
    <div className="hall-page">
      <section className="hall-hero">
        <div className="hall-hero-content">
          <span className="section-tag">Legacy</span>
          <h1>xCellence Hall of Fame</h1>
          <p>
            Celebrating the moments, mentors, and alumni who transformed our program and inspired the next generation of
            innovators.
          </p>
        </div>
      </section>

      <section className="hall-section achievements">
        <div className="hall-container">
          <div className="section-header">
            <span className="section-tag">Accolades</span>
            <h2 className="section-title">Signature Awards</h2>
            <div className="title-underline"></div>
          </div>

          <div className="hall-grid">
            {awards.map((award) => (
              <article key={`${award.title}-${award.year}`} className="hall-card">
                <header>
                  <span className="hall-year">{award.year}</span>
                  <h3>{award.title}</h3>
                  <p className="hall-event">{award.event}</p>
                </header>
                <p>{award.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hall-section metrics">
        <div className="hall-container">
          <div className="metrics-grid">
            {milestones.map((milestone) => (
              <div key={milestone.title} className="metric-card">
                <span className="metric-value">{milestone.value}</span>
                <h3>{milestone.title}</h3>
                <p>{milestone.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hall-section alumni">
        <div className="hall-container">
          <div className="section-header">
            <span className="section-tag">Community Leaders</span>
            <h2 className="section-title">Hall of Fame Honorees</h2>
            <div className="title-underline"></div>
            <p style={{ maxWidth: '800px', margin: '1rem auto', textAlign: 'center', opacity: 0.9 }}>
              Recognizing leaders in Kazakhstan's robotics ecosystem who inspire and guide the next generation.
            </p>
          </div>

          <div className="alumni-grid">
            {alumniHighlights.map((alumni) => (
              <div key={alumni.name} className="alumni-highlight-card">
                <h3>{alumni.name}</h3>
                <span className="alumni-role">{alumni.role}</span>
                <p>{alumni.achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HallOfFame;




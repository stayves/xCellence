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
    title: 'World Championship Finalists',
    event: 'FIRST Championship Houston',
    year: '2024',
    description:
      'Alliance finalists on the Daly field with the highest autonomous score of the division and top 3 Inspire Award ranking.',
  },
  {
    title: 'Inspire Award Winners',
    event: 'Central Asia Regional Championship',
    year: '2023',
    description:
      'Recognized for outstanding engineering portfolio, outreach impact, and gracious professionalism across the region.',
  },
  {
    title: 'Think Award Champions',
    event: 'Kazakhstan National Championship',
    year: '2022',
    description:
      'Awarded for analytics-driven design notebooks capturing our iterative development and data-informed game strategy.',
  },
  {
    title: 'Connect Award Winners',
    event: 'Eurasia Invitational',
    year: '2021',
    description:
      'Honored for bridging industry mentors with local schools and expanding access to competitive robotics programs.',
  },
];

const milestones: Milestone[] = [
  {
    title: 'Awards Earned',
    value: '37',
    detail: 'Across Inspire, Think, Innovate, and Design awards over nine competitive seasons.',
  },
  {
    title: 'Worlds Appearances',
    value: '4',
    detail: 'Represented Kazakhstan on the global stage with alliances from five continents.',
  },
  {
    title: 'Community Hours',
    value: '1,800+',
    detail: 'Delivered STEM workshops, mentorship, and demos to students aged 6-18 every season.',
  },
];

const alumniHighlights = [
  {
    name: 'Aida Beketova',
    role: 'Mechanical Lead 2019-2022',
    achievement: 'Now a mechanical engineering major at MIT focusing on autonomous underwater vehicles.',
  },
  {
    name: 'Timur Saparov',
    role: 'Programming Captain 2020-2023',
    achievement: 'Founded a startup developing vision systems for agricultural robotics in Central Asia.',
  },
  {
    name: 'Dana Ryskul',
    role: 'Outreach Director 2018-2021',
    achievement: 'Coordinates nationwide STEM policy initiatives at the Ministry of Education.',
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
            <span className="section-tag">Beyond FTC</span>
            <h2 className="section-title">Alumni Trailblazers</h2>
            <div className="title-underline"></div>
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




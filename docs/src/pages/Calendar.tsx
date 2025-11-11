import './Calendar.css';

type Competition = {
  title: string;
  date: string;
  location: string;
  level: string;
  description: string;
  registrationLink?: string;
};

type Highlight = {
  season: string;
  theme: string;
  summary: string;
};

const upcomingCompetitions: Competition[] = [
  {
    title: 'FTC Kazakhstan Regional Championship',
    date: 'November 22-24, 2025',
    location: 'Astana, Kazakhstan',
    level: 'Regional Qualifier',
    description:
      'Three-day regional event featuring qualification matches, alliance selection, and a high-energy playoff bracket.',
    registrationLink: 'https://www.firstinspires.org/robotics/ftc',
  },
  {
    title: 'Central Asia Invitational',
    date: 'December 12-14, 2025',
    location: 'Almaty, Kazakhstan',
    level: 'Invitational',
    description:
      'Cross-border invitational bringing together the top FTC teams from Kazakhstan, Kyrgyzstan, and Uzbekistan for scrimmage-style learning.',
    registrationLink: 'https://ftc-events.firstinspires.org/',
  },
  {
    title: 'FIRST Tech Challenge World Championship',
    date: 'April 22-25, 2026',
    location: 'Houston, Texas, USA',
    level: 'World Championship',
    description:
      'The championship event that concludes the INTO THE DEEP season with global alliances, judging, and industry showcases.',
    registrationLink: 'https://www.firstchampionship.org/',
  },
];

const preseasonEvents: Competition[] = [
  {
    title: 'Off-Season Scrimmage: Robot Refresh',
    date: 'August 16, 2025',
    location: 'xCellence Lab, Astana',
    level: 'Team Hosted',
    description:
      'Hands-on scrimmage focused on testing new mechanisms, autonomous code, and scouting practice with partner teams.',
  },
  {
    title: 'FTC Kickoff Watch Party',
    date: 'September 7, 2025',
    location: 'Nazarbayev University, Astana',
    level: 'Community Event',
    description:
      'Season launch viewing party accompanied by game manual breakdown, strategy workshop, and mentor Q&A.',
  },
];

const seasonHighlights: Highlight[] = [
  {
    season: '2025-2026',
    theme: 'INTO THE DEEP',
    summary:
      'Exploring underwater-inspired challenges that test drivetrain agility, precise manipulation, and collaborative scoring strategies.',
  },
  {
    season: '2024-2025',
    theme: 'CENTERSTAGE',
    summary:
      'A creative production-themed season dedicated to stage automation, pixel precision, and spotlight-worthy autonomous routines.',
  },
  {
    season: '2023-2024',
    theme: 'POWERPLAY',
    summary:
      'Rapid cone-stacking gameplay that pushed our scoring optimization, end-game consistency, and outreach presence.',
  },
];

const Calendar = () => {
  return (
    <div className="calendar-page">
      <section className="calendar-hero">
        <div className="calendar-hero-content">
          <span className="section-tag">Plan Ahead</span>
          <h1>Robotics Competition Calendar</h1>
          <p>
            Stay ahead of the season with our curated timeline of robotics events, scrimmages, and international
            competitions we are preparing for.
          </p>
        </div>
      </section>

      <section className="calendar-section">
        <div className="calendar-container">
          <div className="section-header">
            <span className="section-tag">Upcoming</span>
            <h2 className="section-title">Key Competitions</h2>
            <div className="title-underline"></div>
          </div>

          <div className="calendar-grid">
            {upcomingCompetitions.map((event) => (
              <article key={event.title} className="calendar-card">
                <div className="calendar-card-header">
                  <span className="calendar-event-level">{event.level}</span>
                  <h3>{event.title}</h3>
                </div>
                <dl className="calendar-details">
                  <div>
                    <dt>Date</dt>
                    <dd>{event.date}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{event.location}</dd>
                  </div>
                </dl>
                <p className="calendar-description">{event.description}</p>
                {event.registrationLink && (
                  <a
                    className="calendar-link"
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Event Details
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="calendar-section alt">
        <div className="calendar-container">
          <div className="section-header">
            <span className="section-tag">Off-Season</span>
            <h2 className="section-title">Preseason & Community Events</h2>
            <div className="title-underline"></div>
          </div>

          <div className="calendar-grid compact">
            {preseasonEvents.map((event) => (
              <article key={event.title} className="calendar-card">
                <div className="calendar-card-header">
                  <span className="calendar-event-level">{event.level}</span>
                  <h3>{event.title}</h3>
                </div>
                <dl className="calendar-details">
                  <div>
                    <dt>Date</dt>
                    <dd>{event.date}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{event.location}</dd>
                  </div>
                </dl>
                <p className="calendar-description">{event.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="calendar-section timeline">
        <div className="calendar-container">
          <div className="section-header">
            <span className="section-tag">Season Themes</span>
            <h2 className="section-title">FIRST Tech Challenge Highlights</h2>
            <div className="title-underline"></div>
          </div>

          <div className="timeline-grid">
            {seasonHighlights.map((highlight) => (
              <div key={highlight.season} className="timeline-card">
                <span className="timeline-season">{highlight.season}</span>
                <h3>{highlight.theme}</h3>
                <p>{highlight.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calendar;




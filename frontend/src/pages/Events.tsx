import './Events.css';

const Events = () => {
  const upcomingEvents = [
    {
      title: "World Championship",
      date: "April 17-20, 2025",
      location: "NIS PhM",
      type: "Competition",
      description: "FIRST Tech Challenge World Championship featuring top teams from around the globe.",
    },
    {
      title: "State Championship",
      date: "March 8-9, 2025",
      location: "Principal's room",
      type: "Competition",
      description: "California State Championship - competing for a spot at Worlds.",
    },
    {
      title: "Community STEM Fair",
      date: "February 22, 2025",
      location: "NIS canteen",
      type: "Outreach",
      description: "Showcasing our robot and inspiring young students to pursue STEM careers.",
    },
  ];

  const pastEvents = [
    {
      title: "Regional Championship",
      date: "February 10, 2025",
      achievement: "1st Place Overall",
      type: "Competition",
    },
    {
      title: "Qualifier #2",
      date: "January 27, 2025",
      achievement: "Inspire Award Winner",
      type: "Competition",
    },
    {
      title: "Qualifier #1",
      date: "December 14, 2024",
      achievement: "Design Award",
      type: "Competition",
    },
  ];

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="events-hero-content">
          <h1>Events & Competitions</h1>
          <p>Our journey through the FTC season</p>
        </div>
      </section>

      <section className="events-content">
        <div className="events-container">
          {/* Upcoming Events */}
          <div className="section-header">
            <span className="section-tag">What's Next</span>
            <h2 className="section-title">Upcoming Events</h2>
            <div className="title-underline"></div>
          </div>

          <div className="events-grid">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="event-card upcoming">
                <div className="event-type-badge">{event.type}</div>
                <h3 className="event-title">{event.title}</h3>
                <div className="event-details">
                  <div className="event-detail">
                    <span className="detail-icon">📅</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="event-detail">
                    <span className="detail-icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="event-description">{event.description}</p>
              </div>
            ))}
          </div>

          {/* Past Events */}
          <div className="section-header" style={{ marginTop: '6rem' }}>
            <span className="section-tag">Our Achievements</span>
            <h2 className="section-title">Past Events</h2>
            <div className="title-underline"></div>
          </div>

          <div className="past-events-timeline">
            {pastEvents.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-type">{event.type}</div>
                  <h3 className="timeline-title">{event.title}</h3>
                  <p className="timeline-date">{event.date}</p>
                  <div className="timeline-achievement">
                    <span className="achievement-icon">🏆</span>
                    {event.achievement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;


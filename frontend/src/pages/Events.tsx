import './Events.css';

type EventCard = {
  title: string
  date: string
  location?: string
  type: string
  description?: string
  achievement?: string
  image?: string
}

const Events = () => {
  const upcomingEvents: EventCard[] = [
    {
      title: "NIS School Hackathon",
      date: "January 25, 2026",
      location: "NIS EMN Astana",
      type: "Hackathon",
      description: "School-wide hackathon with business cases from companies, 200,000₸ prize fund for best solutions.",
      image: "/xCellence/news-1.jpg",
    },
    {
      title: "MUN Conference with Robotics Committees",
      date: "Spring 2025",
      location: "TBA",
      type: "Conference",
      description: "Model United Nations conference featuring robotics and STEAM-focused committees.",
      image: "/xCellence/news-2.jpg",
    },
    {
      title: "Fusion 360 Bootcamp",
      date: "TBA",
      location: "American Corner Astana",
      type: "Workshop",
      description: "Week-long comprehensive CAD training bootcamp in partnership with American Corner.",
      image: "/xCellence/American.jpg",
    },
  ];

  const pastEvents: EventCard[] = [
    {
      title: "Meet with NU Robotics Professor",
      date: "November 13, 2024",
      achievement: "Mentorship session with Prof. Azamat Eshmukhambetov",
      type: "Forum",
      image: "/xCellence/xCellenceNU.png",
    },
    {
      title: "Masterclass in Rural School Shortandy",
      date: "November 12, 2024",
      achievement: "15 participants - introduced robotics competitions, started FLL team recruitment",
      type: "Outreach",
      image: "/xCellence/rural.jpg",
    },
    {
      title: "FTC Alumni Q&A",
      date: "October 12, 2024",
      achievement: "2 alumni, 1 mentor, 40+ stories answered",
      type: "Forum",
      image: "/xCellence/alumni1.jpg",
    },
    {
      title: "Alumni Forum",
      date: "October 5, 2024",
      achievement: "45 participants online - FTC & WRO alumni shared career experiences",
      type: "Forum",
      image: "/xCellence/AlumniForum.png",
    },
    {
      title: "Temirqazyq Forum",
      date: "October 2, 2024",
      achievement: "35 participants - STEM startup leaders panel (Karakoz Tasbolatova, Nurdaulet Bazylbekov, Arlan Rakhmetzhanov)",
      type: "Forum",
      image: "/xCellence/Forum.png",
    },
    {
      title: "Kindergarten Robotics Lessons Started",
      date: "September 10, 2024",
      achievement: "24 hours conducted - 15 kids, 2x/week at Triumph Kindergarten",
      type: "Outreach",
      image: "/xCellence/deti.jpg",
    },
    {
      title: "Decode Season Kickoff Livestream",
      date: "September 6, 2024",
      achievement: "100 viewers, 3 hours - supported with QTech",
      type: "Event",
      image: "/xCellence/team.jpg",
    },
    {
      title: "WRO Republican Training Camp",
      date: "August 3, 2024",
      achievement: "45 participants, 1 week - all NIS schools, conferences with mentors & NU professors",
      type: "Training",
      image: "/xCellence/WROKazakhstan.png",
    },
    {
      title: "Astana FIRST Workshop",
      date: "April 10, 2024",
      achievement: "20 participants - joint event with AMD, SlapSeals, BilOrda",
      type: "Workshop",
      image: "/xCellence/robot-main.jpg",
    },
    {
      title: "Arduino & Programming Course",
      date: "February 2, 2024",
      achievement: "30 participants, 8 weeks - Arduino & C++ training, 2x/week",
      type: "Course",
      image: "/xCellence/news-1.jpg",
    },
    {
      title: "SANA Bilim Masterclass",
      date: "November 26, 2023",
      achievement: "20 participants, 3 sessions × 3 hours - EV3 programming & sumo competitions",
      type: "Workshop",
      image: "/xCellence/news-1.jpg",
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
                {event.image && (
                  <div className="event-media">
                    <img src={event.image} alt={event.title} loading="lazy" />
                  </div>
                )}
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

          <div className="past-events-grid">
            {pastEvents.map((event, index) => (
              <div key={index} className="past-event-card">
                <div className="past-event-image">
                  {event.image && (
                    <img src={event.image} alt={event.title} loading="lazy" />
                  )}
                </div>
                <div className="past-event-body">
                  <span className="past-event-type">{event.type}</span>
                  <div className="past-event-text">
                    <h3 className="past-event-title">{event.title}</h3>
                    <p className="past-event-date">{event.date}</p>
                    {event.achievement && (
                      <div className="past-event-achievement">
                        <span className="achievement-icon">🏆</span>
                        <span>{event.achievement}</span>
                      </div>
                    )}
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


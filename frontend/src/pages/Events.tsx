import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const upcomingEvents = t('events.upcoming.items', { returnObjects: true }) as EventCard[];
  const pastEvents = t('events.past.items', { returnObjects: true }) as EventCard[];

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="events-hero-content">
          <h1>{t('events.hero.title')}</h1>
          <p>{t('events.hero.subtitle')}</p>
        </div>
      </section>

      <section className="events-content">
        <div className="events-container">
          {/* Upcoming Events */}
          <div className="section-header">
            <span className="section-tag">{t('events.upcoming.tag')}</span>
            <h2 className="section-title">{t('events.upcoming.title')}</h2>
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
                    <span>{event.location || t('common.status.tba')}</span>
                  </div>
                </div>
                <p className="event-description">{event.description}</p>
              </div>
            ))}
          </div>

          {/* Past Events */}
          <div className="section-header" style={{ marginTop: '6rem' }}>
            <span className="section-tag">{t('events.past.tag')}</span>
            <h2 className="section-title">{t('events.past.title')}</h2>
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


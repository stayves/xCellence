import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import './Calendar.css'

type CategoryId = 'kickoff' | 'regionals' | 'qualifiers' | 'bigEvents' | 'offSeason'
type TrackId = 'FIRST' | 'WRO' | 'Other'

type EventEntry = {
  id: string
  title: string
  city: string
  dates: string
  venue: string
  categories: string[]
  registrationDeadline?: string
  status?: string
  track: 'FIRST' | 'WRO'
}

type CategoryConfig = {
  id: CategoryId
  label: string
  description: string
  logoSrc?: string
  logoAlt?: string
}

type TrackConfig = {
  id: TrackId
  label: string
  description: string
  logoSrc?: string
  logoAlt?: string
}

type Tournament = {
  name: string
  organizer: string
  site?: string
}

const parseEventDate = (rawDate: string | undefined): number | null => {
  if (!rawDate) return null
  const exact = rawDate.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  if (exact) {
    const [, day, month, year] = exact
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
  }

  const yearOnly = rawDate.match(/(20\d{2})/)
  if (yearOnly) {
    return new Date(Number(yearOnly[1]), 0, 1).getTime()
  }

  return null
}

const getTrackConfig = (t: TFunction) => t('calendar.tracks', { returnObjects: true }) as TrackConfig[]
const getCategoryConfig = (t: TFunction) => t('calendar.categories', { returnObjects: true }) as CategoryConfig[]
const getCategoryEvents = (t: TFunction) =>
  t('calendar.categoryEvents', { returnObjects: true }) as Record<CategoryId, EventEntry[]>
const getTournaments = (t: TFunction) => t('calendar.tournaments', { returnObjects: true }) as Tournament[]

const Calendar = () => {
  const { t } = useTranslation()
  const trackConfig = getTrackConfig(t)
  const categoryConfig = getCategoryConfig(t)
  const categoryEvents = getCategoryEvents(t)
  const tournaments = getTournaments(t)

  const [activeTrack, setActiveTrack] = useState<TrackId>('FIRST')
  const [activeCategory, setActiveCategory] = useState<CategoryId>('kickoff')

  const visibleEvents = useMemo(() => {
    if (activeTrack !== 'FIRST') return []
    const events = categoryEvents[activeCategory] ?? []
    return [...events].sort((a, b) => {
      const dateA = parseEventDate(a.dates)
      const dateB = parseEventDate(b.dates)
      if (dateA !== null && dateB !== null) return dateB - dateA
      if (dateA !== null) return -1
      if (dateB !== null) return 1
      return a.title.localeCompare(b.title)
    })
  }, [activeCategory, activeTrack, categoryEvents])

  const activeConfig = categoryConfig.find((cat) => cat.id === activeCategory)
  const activeTrackConfig = trackConfig.find((track) => track.id === activeTrack)

  return (
    <div className="calendar-page">
      <section className="calendar-hero">
        <div className="calendar-hero-content">
          <div className="hero-label">{t('calendar.hero.label')}</div>
          <h1>{t('calendar.hero.title')}</h1>
          <p>{t('calendar.hero.description')}</p>
        </div>
      </section>

      <section className="track-switch">
        <div className="track-grid">
          {trackConfig.map((track) => (
            <button
              key={track.id}
              className={`track-pill ${activeTrack === track.id ? 'active' : ''}`}
              onClick={() => setActiveTrack(track.id)}
            >
              <div className="track-pill-left">
                <span className="tab-label">{track.label}</span>
                <span className="track-desc">{track.description}</span>
              </div>
              {track.logoSrc && (
                <div className="track-logo">
                  <img src={track.logoSrc} alt={track.logoAlt ?? track.label} loading="lazy" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {activeTrack === 'FIRST' && (
        <section className="calendar-categories">
          <div className="category-grid">
            {categoryConfig.map((category) => (
              <button
                key={category.id}
                className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="category-card-top">
                  <span className="tab-label">{category.label}</span>
                  {category.logoSrc && (
                    <div className="category-logo">
                      <img src={category.logoSrc} alt={category.logoAlt ?? category.label} loading="lazy" />
                    </div>
                  )}
                </div>
                <p className="category-description">{category.description}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="calendar-results">
        <header className="calendar-results-header">
          <div>
            <span className="section-tag">{activeTrackConfig?.label ?? t('calendar.results.trackFallback')}</span>
            <h2>
              {activeTrackConfig?.label}
              {activeTrack === 'FIRST' && activeConfig ? ` — ${activeConfig.label}` : ''}
            </h2>
            <p>
              {activeTrackConfig?.description}
              {activeTrack === 'FIRST' && activeConfig ? ` · ${activeConfig.description}` : ''}
            </p>
          </div>
        </header>

        {activeTrack === 'Other' ? (
          <div className="calendar-tournaments">
            <div className="tournaments-header">
              <span className="section-tag">{t('calendar.results.tournaments.tag')}</span>
              <h2>{t('calendar.results.tournaments.title')}</h2>
              <p>{t('calendar.results.tournaments.description')}</p>
            </div>
            <div className="tournaments-table">
              <div className="tournaments-row tournaments-head">
                <span>{t('calendar.results.tournaments.headers.tournament')}</span>
                <span>{t('calendar.results.tournaments.headers.organizer')}</span>
                <span>{t('calendar.results.tournaments.headers.site')}</span>
              </div>
              {tournaments.map((tournament) => (
                <div key={tournament.name} className="tournaments-row">
                  <span>{tournament.name || '—'}</span>
                  <span>{tournament.organizer || '—'}</span>
                  {tournament.site ? (
                    <a href={tournament.site} target="_blank" rel="noreferrer">
                      {tournament.site.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span>—</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="calendar-card-grid">
            {visibleEvents.map((event) => (
              <article key={event.id} className="calendar-card">
                {/*
                  Use status as a "registration closed" signal; otherwise show open.
                */}
                {(() => {
                  const isRegistrationClosed = Boolean(event.status)
                  return (
                    <div className={`status-pill ${isRegistrationClosed ? 'closed' : 'open'}`}>
                      {t(
                        isRegistrationClosed
                          ? 'calendar.results.registrationStatus.closed'
                          : 'calendar.results.registrationStatus.open',
                      )}
                    </div>
                  )
                })()}
                <div className="calendar-card-head">
                  <span className="calendar-city">{event.city || t('calendar.results.cityTba')}</span>
                  <span className={`track-badge ${event.track === 'FIRST' ? 'first' : 'wro'}`}>
                    {event.track === 'FIRST' ? 'FIRST' : 'WRO'}
                  </span>
                </div>
                <h3>{event.title}</h3>
                <div className="calendar-card-dates">
                  <span>{t('calendar.results.datesLabel', { dates: event.dates || t('common.status.tba') })}</span>
                  {event.registrationDeadline && (
                    <span className="deadline">
                      {t('calendar.results.deadlineLabel', { date: event.registrationDeadline })}
                    </span>
                  )}
                </div>
                <div className="calendar-card-meta">
                  <span className="label">{t('calendar.results.venueLabel')}</span>
                  <span className="value">{event.venue || t('common.status.tba')}</span>
                </div>
                {event.categories.length > 0 && (
                  <div className="calendar-card-tags">
                    {event.categories.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {visibleEvents.length === 0 && (
              <div className="empty-state">{t('calendar.results.empty')}</div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Calendar

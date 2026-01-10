import { useMemo, useState } from 'react'
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

const TRACK_CONFIG: TrackConfig[] = [
  { id: 'FIRST', label: 'FIRST', description: 'Kick-offs, Regionals, Qualifiers, Big Events, Off-Season', logoSrc: '/xCellence/FirstLogo.webp', logoAlt: 'FIRST' },
  { id: 'WRO', label: 'WRO', description: 'World Robotics Olympiad schedule', logoSrc: '/xCellence/WROLogo.webp', logoAlt: 'WRO' },
  { id: 'Other', label: 'Other', description: 'Additional circuits & briefings' },
]

const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    id: 'kickoff',
    label: 'Kick-Off',
    description: 'Season launch events and broadcasts.',
    logoSrc: '/xCellence/FirstLogo.webp',
    logoAlt: 'FIRST',
  },
  {
    id: 'regionals',
    label: 'Regionals 2025',
    description: 'City-by-city FIRST Regionals.',
    logoSrc: '/xCellence/FirstLogo.webp',
    logoAlt: 'FIRST',
  },
  {
    id: 'qualifiers',
    label: "Qualifiers '26",
    description: 'Qualifier events by region.',
    logoSrc: '/xCellence/FirstLogo.webp',
    logoAlt: 'FIRST',
  },
  {
    id: 'bigEvents',
    label: 'Big Events',
    description: 'Championships, bridges, and major deadlines.',
    logoSrc: '/xCellence/FirstLogo.webp',
    logoAlt: 'FIRST',
  },
  {
    id: 'offSeason',
    label: 'Off-Season',
    description: 'Post-season FIRST opens.',
    logoSrc: '/xCellence/FirstLogo.webp',
    logoAlt: 'FIRST',
  },
]

const CATEGORY_EVENTS: Record<CategoryId, EventEntry[]> = {
  kickoff: [
    {
      id: 'kickoff-online',
      city: 'Online',
      title: 'FIRST LEGO League Unearthed Season Kick-Off',
      dates: '06.08.2025 15:00',
      venue: 'Instagram (@firstroboticskz) / YouTube (USTEM Foundation)',
      categories: ['FLL-D', 'FLL-E', 'FLL-C'],
      track: 'FIRST',
    },
    {
      id: 'kickoff-astana',
      city: 'Astana + Online',
      title: 'Astana FIRST Kick-off',
      dates: '07.09.2025 11:00',
      venue: 'Quantum Tech School',
      categories: ['FLL-C', 'FTC'],
      track: 'FIRST',
    },
    {
      id: 'kickoff-almaty',
      city: 'Almaty + Online',
      title: 'Almaty FIRST Kick-off',
      dates: '07.09.2025 11:00',
      venue: 'Hybrid / Online',
      categories: ['FLL-C', 'FTC'],
      track: 'FIRST',
    },
  ],
  regionals: [
    {
      id: 'regional-osh',
      city: 'Ош',
      title: 'Osh FIRST Regional 2025',
      dates: '25.10.2025 - 26.10.2025',
      registrationDeadline: '22.10.2025',
      venue: 'Maarif School',
      categories: ['FLL-E', 'FLL-C', 'FTC'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-burabay',
      city: 'Бурабай',
      title: 'Burabay FIRST Regional 2025',
      dates: '08.11.2025 - 09.11.2025',
      registrationDeadline: '02.11.2025',
      venue: 'IQanat High School of Burabay',
      categories: ['FTC'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-qyzylorda',
      city: 'Қызылорда',
      title: 'Qyzylorda FIRST Regional 2025',
      dates: '11.11.2025',
      registrationDeadline: '08.11.2025',
      venue: 'Abai School',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-taraz',
      city: 'Тараз',
      title: 'Taraz FIRST Regional 2025',
      dates: '14.11.2025',
      registrationDeadline: '11.11.2025',
      venue: 'Абай атындағы мектеп- гимназия',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-pavlodar',
      city: 'Павлодар',
      title: 'Ertis FIRST Regional 2025',
      dates: '15.11.2025',
      registrationDeadline: '12.11.2025',
      venue: 'Samgau, Ekibastuz',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-astana',
      city: 'Астана',
      title: 'Astana FIRST Regional 2025',
      dates: '15.11.2025 - 16.11.2025',
      registrationDeadline: '12.11.2025',
      venue: 'Kazakhstan International School Astana',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League', 'FTC'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-qonaev',
      city: 'Қонаев',
      title: 'Qonaev FIRST Regional 2025',
      dates: '17.11.2025',
      registrationDeadline: '14.11.2025',
      venue: 'Esik BIL',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-aktobe',
      city: 'Актөбе',
      title: 'Aktobe FIRST Regional 2025',
      dates: '22.11.2025',
      registrationDeadline: '19.11.2025',
      venue: 'JOO High school',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-almaty',
      city: 'Алматы',
      title: 'Almaty FIRST Regional 2025',
      dates: '22.11.2025 - 23.11.2025',
      registrationDeadline: '17.11.2025',
      venue: 'Общеобразовательная школа № 218',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League', 'FTC'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-oskemen',
      city: 'Өскемен',
      title: 'Oskemen FIRST Regional 2025',
      dates: '28.11.2025',
      registrationDeadline: '25.11.2025',
      venue: 'Областная специализированная IT-школа-лицей',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-atyrau',
      city: 'Атырау',
      title: 'Atyrau FIRST Regional 2025',
      dates: '29.11.2025',
      registrationDeadline: '26.11.2025',
      venue: 'Farabi International School',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-shymkent',
      city: 'Шымкент',
      title: 'Shymkent FIRST Regional 2025',
      dates: '29.11.2025',
      registrationDeadline: '26.11.2025',
      venue: 'Қонаев мектебі',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-oral',
      city: 'Орал',
      title: 'Jaiyq FIRST Regional 2025',
      dates: '29.11.2025',
      registrationDeadline: '26.11.2025',
      venue: 'Дворец школьников',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-semey',
      city: 'Семей',
      title: 'Abay FIRST Regional 2025',
      dates: '29.11.2025 - 30.11.2025',
      registrationDeadline: '25.11.2025',
      venue: 'Средняя общеобразовательная школа №51',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League', 'FTC'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-taldykorgan',
      city: 'Талдықорған',
      title: 'Jetisu FIRST Regional 2025',
      dates: '05.12.2025',
      registrationDeadline: '02.12.2025',
      venue: '27 Мектеп',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-aktau',
      city: 'Ақтау',
      title: 'Mangystau FIRST Regional 2025',
      dates: '06.12.2025 - 07.12.2025',
      registrationDeadline: '03.12.2025',
      venue: 'Жас Қанат мектеп лицейі',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League', 'FTC'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-turkistan',
      city: 'Түркістан',
      title: 'Turkistan FIRST Regional 2025',
      dates: '08.12.2025 - 09.12.2025',
      registrationDeadline: '04.12.2025',
      venue: '№34 жалпы білім беретін мектеп',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-bishkek',
      city: 'Бишкек',
      title: 'Bishkek FIRST Regional 2025',
      dates: '13.12.2025 - 14.12.2025',
      registrationDeadline: '',
      venue: 'Maarif School',
      categories: ['FLL-E', 'FLL-C', 'FTC'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-kokshetau',
      city: 'Көкшетау',
      title: 'Kokshetau FIRST Regional 2025',
      dates: '20.12.2025',
      registrationDeadline: '15.12.2025',
      venue: 'KokshetauBIL',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-karagandy',
      city: 'Қарағанды',
      title: 'Saryarqa FIRST Regional 2025',
      dates: '21.12.2025',
      registrationDeadline: '',
      venue: 'Общеобразовательная школа №24',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League', 'FTC'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-petropavl',
      city: 'Петропавл',
      title: 'Qyzylzhar FIRST Regional 2025',
      dates: '24.12.2025',
      registrationDeadline: '21.12.2025',
      venue: 'Digital Urpaq',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-qostanay',
      city: 'Қостанай',
      title: 'Qostanay FIRST Regional 2025',
      dates: '29.12.2025',
      registrationDeadline: '',
      venue: '',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-zhezkazgan',
      city: 'Жезқазған',
      title: 'Ulytau FIRST Regional 2025',
      dates: 'Желтоқсан, 2025',
      registrationDeadline: '',
      venue: '',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'Keleshek League'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'regional-tashkent',
      city: 'Ташкент',
      title: 'Tashkent FIRST Regional 2025',
      dates: '',
      registrationDeadline: '',
      venue: '',
      categories: [],
      status: '',
      track: 'FIRST',
    },
  ],
  qualifiers: [
    {
      id: 'qualifier-almaty',
      city: 'Алматы',
      title: 'Daryn FIRST Qualifier 2026',
      dates: '04.01.2026 - 06.01.2026',
      registrationDeadline: '22.12.2025',
      venue: 'SDU University',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'FTC'],
      track: 'FIRST',
    },
    {
      id: 'qualifier-turkistan',
      city: 'Түркістан',
      title: 'Ontustik FIRST Qualifier 2026',
      dates: '12.01.2026 - 14.01.2026',
      venue: 'Karavan Saray Arena',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'FTC'],
      track: 'FIRST',
    },
    {
      id: 'qualifier-aktau',
      city: 'Актау',
      title: 'Batys FIRST Qualifier 2026',
      dates: '17.01.2026 - 18.01.2026',
      registrationDeadline: '05.01.2026',
      venue: 'Aqtau International School',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'FTC'],
      track: 'FIRST',
    },
    {
      id: 'qualifier-astana',
      city: 'Астана',
      title: 'Astana FIRST Qualifier 2026',
      dates: '23.01.2026 - 25.01.2026',
      registrationDeadline: '04.01.2026',
      venue: '',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'FTC'],
      track: 'FIRST',
    },
  ],
  bigEvents: [
    {
      id: 'big-digital-bridge',
      city: 'Астана',
      title: 'Digital Bridge 2025',
      dates: '02.10.2025 - 04.10.2025',
      venue: 'Международный выставочный центр Expo',
      categories: ['FTC'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'big-deans-application',
      city: 'Online',
      title: "Dean's List Application Deadline",
      dates: '15.12.2025',
      venue: 'Online',
      categories: ['FTC'],
      status: 'Өтілді',
      track: 'FIRST',
    },
    {
      id: 'big-deans-interview',
      city: 'Online',
      title: "Dean's List Interview 2026",
      dates: '10.01.2026 - 11.01.2026',
      venue: 'Online',
      categories: ['FTC'],
      track: 'FIRST',
    },
    {
      id: 'big-central-asia-championship',
      city: 'Астана',
      title: 'Kazakhstan Central Asia FIRST Championship 2026',
      dates: '10.02.2026 - 13.02.2026',
      venue: 'Международный выставочный центр Expo',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'FTC'],
      track: 'FIRST',
    },
    {
      id: 'big-kyrgyzstan-championship',
      city: 'Бишкек',
      title: 'Kyrgyzstan FIRST Championship 2026',
      dates: 'Late February',
      venue: '',
      categories: ['FLL-E', 'FLL-C', 'FTC'],
      track: 'FIRST',
    },
    {
      id: 'big-uzbekistan-championship',
      city: 'Ташкент',
      title: 'Uzbekistan FIRST Championship 2026',
      dates: '',
      venue: '',
      categories: ['FLL-E', 'FLL-C', 'FTC'],
      track: 'FIRST',
    },
    {
      id: 'big-digital-ministry',
      city: 'Алматы',
      title: 'Digital Ministry Cup 2026',
      dates: '',
      venue: '',
      categories: ['FTC'],
      track: 'FIRST',
    },
  ],
  offSeason: [
    {
      id: 'offseason-astana',
      city: 'Астана',
      title: 'Bilim Shyny FIRST Off-Season',
      dates: '10.04.2026 - 11.04.2026',
      venue: 'Дворец школьников им. Аль-Фараби',
      categories: ['FLL-D', 'FLL-E', 'FLL-C', 'FTC'],
      track: 'FIRST',
    },
    {
      id: 'offseason-zhylandy',
      city: 'Жыланды',
      title: 'Zhylandy International FIRST Off-Season',
      dates: 'Маусым/Июнь 2026',
      venue: 'Жыланды Мәдениет Үйі',
      categories: ['FTC'],
      track: 'FIRST',
    },
  ],
}

const TOURNAMENTS: Tournament[] = [
  { name: 'Robotek Grand Tournament', organizer: 'ТОО Роботек', site: 'https://rgt.robotek.kz/' },
  { name: 'KazRobotics', organizer: 'Федерация Казроботикс', site: 'http://www.kazrobotics.org/KK/' },
  { name: 'RoboLand', organizer: 'Ассоциация Kazdidac', site: 'https://roboland.kz/' },
  { name: 'R:ED FEST', organizer: 'RED Robotics Education', site: 'https://frio.kz/ru/red-fest' },
  { name: 'Fibonacci International Robot Olympiad', organizer: 'AZ Group' },
  { name: 'Robotics for Good Youth Challenge', organizer: 'Hailybury' },
  { name: 'Kazakhstan International Robotics Competition (VEX)', organizer: '' },
  { name: 'NatRoboCom', organizer: '' },
  { name: 'RoboZerde', organizer: '' },
  { name: 'Federation of International Robot-sports association (FIRA)', organizer: '' },
]

const Calendar = () => {
  const [activeTrack, setActiveTrack] = useState<TrackId>('FIRST')
  const [activeCategory, setActiveCategory] = useState<CategoryId>('kickoff')
  const [searchTerm, setSearchTerm] = useState('')

  const visibleEvents = useMemo(() => {
    if (activeTrack !== 'FIRST') return []
    const events = CATEGORY_EVENTS[activeCategory] ?? []
    if (!searchTerm) return events
    const query = searchTerm.toLowerCase()
    return events.filter((event) => {
      const haystack = `${event.title} ${event.city} ${event.venue} ${event.categories.join(' ')}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [activeCategory, activeTrack, searchTerm])

  const activeConfig = CATEGORY_CONFIG.find((cat) => cat.id === activeCategory)
  const activeTrackConfig = TRACK_CONFIG.find((t) => t.id === activeTrack)

  return (
    <div className="calendar-page">
      <section className="calendar-hero">
        <div className="calendar-hero-content">
          <div className="hero-label">Robotics calendar</div>
          <h1>Events in Kazakhstan</h1>
          <p>Select a track, then dive into categories to see competitions and deadlines.</p>
          <div className="calendar-search">
            <input
              type="search"
              placeholder="Search by city, venue, or category tag"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="track-switch">
        <div className="track-grid">
          {TRACK_CONFIG.map((track) => (
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
            {CATEGORY_CONFIG.map((category) => (
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
            <span className="section-tag">{activeTrackConfig?.label ?? 'Track'}</span>
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
              <span className="section-tag">Tournament directory</span>
              <h2>Robotics circuits to bookmark</h2>
              <p>Bookmark the organizers running WRO, FIRST, and other competitions.</p>
            </div>
            <div className="tournaments-table">
              <div className="tournaments-row tournaments-head">
                <span>Турнир</span>
                <span>Организатор</span>
                <span>Сайт</span>
              </div>
              {TOURNAMENTS.map((tournament) => (
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
                <div className="calendar-card-head">
                  <span className="calendar-city">{event.city || 'City TBA'}</span>
                  <span className={`track-badge ${event.track === 'FIRST' ? 'first' : 'wro'}`}>
                    {event.track === 'FIRST' ? 'FIRST' : 'WRO'}
                  </span>
                </div>
                <h3>{event.title}</h3>
                <div className="calendar-card-dates">
                  <span>Dates: {event.dates || 'TBA'}</span>
                  {event.registrationDeadline && <span className="deadline">Reg. deadline: {event.registrationDeadline}</span>}
                </div>
                <div className="calendar-card-meta">
                  <span className="label">Venue</span>
                  <span className="value">{event.venue || 'TBA'}</span>
                </div>
                {event.categories.length > 0 && (
                  <div className="calendar-card-tags">
                    {event.categories.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
                {event.status && <div className="status-pill">{event.status}</div>}
              </article>
            ))}
            {visibleEvents.length === 0 && (
              <div className="empty-state">No events match your search in this category.</div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Calendar

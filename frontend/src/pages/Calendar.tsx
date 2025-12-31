import { useMemo, useState } from 'react'
import './Calendar.css'

type CalendarLink = {
  label: string
  url: string
}

type CalendarEvent = {
  id: string
  title: string
  summary: string
  date: string
  time: string
  category: string
  mode: 'online' | 'offline' | 'hybrid'
  city: string
  venue: string
  image: string
  tags: string[]
  links: CalendarLink[]
}

type Tournament = {
  name: string
  organizer: string
  site: string
}

type CalendarSection = {
  id: string
  title: string
  icon: string
  description: string
  badge: string
  eventIds: string[]
}

const withBase = (path: string) => {
  const base = import.meta.env.BASE_URL?.replace(/\/+$/, '') ?? ''
  const cleanPath = path.replace(/^\/+/, '')
  return `${base}/${cleanPath}`
}

const EVENTS: Record<string, CalendarEvent> = {
  fllKickoff: {
    id: 'fllKickoff',
    title: 'FIRST LEGO League Unearthed Kick-Off',
    summary: 'Season launch stream with Kazakh & Russian commentary, judging checklists, and AMA.',
    date: '2025-08-06',
    time: '15:00',
    category: 'FIRST LEGO League',
    mode: 'online',
    city: 'Instagram + YouTube',
    venue: '@firstroboticskz / USTEM Foundation',
    image: withBase('news-1.jpg'),
    tags: ['FLL-D', 'FLL-E', 'FLL-C'],
    links: [
      { label: '@firstroboticskz', url: 'https://www.instagram.com/firstroboticskz/' },
      { label: 'USTEM Foundation', url: 'https://www.youtube.com/@USTEMFoundation' },
    ],
  },
  astanaKickoff: {
    id: 'astanaKickoff',
    title: 'Astana FIRST Kick-off',
    summary: 'Hybrid meet with field demo, volunteer signups, and FTC/FLL clinics.',
    date: '2025-09-07',
    time: '11:00',
    category: 'FIRST Tech Challenge',
    mode: 'hybrid',
    city: 'Astana',
    venue: 'Quantum Tech School + Zoom',
    image: withBase('news-2.jpg'),
    tags: ['FTC', 'FLL-C', 'Kick-off'],
    links: [{ label: 'Quantum Tech School', url: 'https://quantum.kz/' }],
  },
  almatyKickoff: {
    id: 'almatyKickoff',
    title: 'Almaty FIRST Kick-off',
    summary: 'Community expo with mentor office hours, scrimmage planning, and sponsor booths.',
    date: '2025-09-07',
    time: '11:00',
    category: 'FIRST Tech Challenge',
    mode: 'hybrid',
    city: 'Almaty',
    venue: 'USTEM Hub + Online',
    image: withBase('news-3.jpg'),
    tags: ['FTC', 'Community'],
    links: [{ label: 'USTEM Hub', url: 'https://www.firstrobotics.kz/ru/' }],
  },
  wroCamp: {
    id: 'wroCamp',
    title: 'WRO RoboMission National Camp',
    summary: 'Hands-on XLNC Cyrex labs for Senior RoboMission strategies, tethering, and Pixy pipelines.',
    date: '2025-08-20',
    time: '10:00',
    category: 'WRO',
    mode: 'offline',
    city: 'Astana',
    venue: 'NIS EMN Makerspace',
    image: withBase('robot-gallery-1.jpg'),
    tags: ['RoboMission', 'Bootcamp'],
    links: [{ label: 'KazRobotics', url: 'http://www.kazrobotics.org/KK/' }],
  },
  wroRobosport: {
    id: 'wroRobosport',
    title: 'WRO RoboSport Strategy Lab',
    summary: 'Ball management prototyping, flywheel tuning, and AI camera calibration with XLNC Fury.',
    date: '2025-09-15',
    time: '09:30',
    category: 'WRO',
    mode: 'offline',
    city: 'Almaty',
    venue: 'USTEM Performance Lab',
    image: withBase('robot-gallery-4.jpg'),
    tags: ['RoboSport', 'Clinic'],
    links: [{ label: 'USTEM Events', url: 'https://www.firstrobotics.kz/ru/' }],
  },
  ftcMeet: {
    id: 'ftcMeet',
    title: 'FTC League Meet 1: INTO THE DEEP',
    summary: 'Qualifier with inspection support, autonomous clinic, and volunteer certification session.',
    date: '2025-10-18',
    time: '09:00',
    category: 'FIRST Tech Challenge',
    mode: 'offline',
    city: 'Astana',
    venue: 'NIS IB Campus Arena',
    image: withBase('robot-gallery-2.jpg'),
    tags: ['League Meet', 'FTC'],
    links: [{ label: 'FTC Kazakhstan', url: 'https://www.firstrobotics.kz/ru/' }],
  },
  roboLand: {
    id: 'roboLand',
    title: 'RoboLand Expo & Challenge',
    summary: 'Kazdidac expo featuring FIRA, VEX, and DIY robotics showcases plus teacher training.',
    date: '2025-11-12',
    time: '12:00',
    category: 'International',
    mode: 'offline',
    city: 'Karaganda',
    venue: 'Kazdidac Convention Center',
    image: withBase('robot-gallery-5.jpg'),
    tags: ['FIRA', 'Expo'],
    links: [{ label: 'RoboLand', url: 'https://roboland.kz/' }],
  },
  robotekGrand: {
    id: 'robotekGrand',
    title: 'Robotek Grand Tournament',
    summary: 'Open hardware hackathon with industrial automation cases and jury from Korean partners.',
    date: '2025-11-28',
    time: '10:00',
    category: 'International',
    mode: 'offline',
    city: 'Shymkent',
    venue: 'Robotek Arena',
    image: withBase('robot-gallery-6.jpg'),
    tags: ['RGT', 'Hackathon'],
    links: [{ label: 'Robotek', url: 'https://rgt.robotek.kz/' }],
  },
  natRoboCom: {
    id: 'natRoboCom',
    title: 'NatRoboCom Selection Meet',
    summary: 'National robotics committee sync for VEX + FTC volunteer alignment and judging refreshers.',
    date: '2025-09-30',
    time: '14:00',
    category: 'National Competitions',
    mode: 'online',
    city: 'Hybrid',
    venue: 'Teams + Hailybury Hub',
    image: withBase('team.jpg'),
    tags: ['VEX', 'FTC', 'Briefing'],
    links: [{ label: 'NatRoboCom', url: 'https://www.firstrobotics.kz/ru/' }],
  },
  republicQualifier: {
    id: 'republicQualifier',
    title: 'Republican FTC Qualifier',
    summary: 'Scrimmage for regions outside Almaty/Astana with remote judging and Onshape review.',
    date: '2025-11-02',
    time: '08:30',
    category: 'National Competitions',
    mode: 'hybrid',
    city: 'Kokshetau',
    venue: 'NIS Kokshetau + Discord',
    image: withBase('robot-main.jpg'),
    tags: ['FTC', 'Qualifier'],
    links: [{ label: 'FTC Republic', url: 'https://www.firstrobotics.kz/ru/' }],
  },
}

const SECTIONS: CalendarSection[] = [
  {
    id: 'wro',
    title: 'WRO RoboMission & RoboSport',
    icon: '🤖',
    badge: 'WRO',
    description: 'Bootcamps and challenges powered by XLNC Cyrex & XLNC Fury.',
    eventIds: ['wroCamp', 'wroRobosport'],
  },
  {
    id: 'first',
    title: 'FIRST Tech Challenge & FLL',
    icon: '🚀',
    badge: 'FIRST',
    description: 'Kick-offs, league meets, and FLL launches hosted by USTEM.',
    eventIds: ['fllKickoff', 'astanaKickoff', 'almatyKickoff', 'ftcMeet'],
  },
  {
    id: 'international',
    title: 'International Circuits & Expos',
    icon: '🌍',
    badge: 'Global',
    description: 'RoboLand, Robotek Grand Tournament, and FIRA-aligned showcases.',
    eventIds: ['roboLand', 'robotekGrand'],
  },
  {
    id: 'national',
    title: 'National Competitions & Briefings',
    icon: '🏅',
    badge: 'National',
    description: 'NatRoboCom prep calls and republican FTC qualifiers.',
    eventIds: ['natRoboCom', 'republicQualifier'],
  },
]

const TOURNAMENTS: Tournament[] = [
  { name: 'WRO', organizer: 'АО НИШ', site: 'https://robotics.nis.edu.kz/' },
  { name: 'FIRST (FTC/FLL)', organizer: 'USTEM', site: 'https://www.firstrobotics.kz/ru/' },
  { name: 'Robotek Grand Tournament', organizer: 'TOO Роботек', site: 'https://rgt.robotek.kz/' },
  { name: 'KazRobotics', organizer: 'Федерация Казроботикс', site: 'http://www.kazrobotics.org/KK/' },
  { name: 'RoboLand', organizer: 'Ассоциация Kazdidac', site: 'https://roboland.kz/' },
  { name: 'R:ED FEST', organizer: 'RED Robotics Education', site: 'https://frio.kz/ru/red-fest' },
  { name: 'Fibonacci International Robot Olympiad', organizer: 'AZ Group', site: 'https://fibonacci.kz/' },
  { name: 'Robotics for Good Youth Challenge', organizer: 'Hailybury', site: 'https://hailybury.kz/' },
  { name: 'Kazakhstan International Robotics Competition (VEX)', organizer: 'USTEM', site: 'https://www.firstrobotics.kz/ru/' },
  { name: 'NatRoboCom', organizer: 'USTEM', site: 'https://www.firstrobotics.kz/ru/' },
  { name: 'RoboZerde', organizer: 'USTEM', site: 'https://www.firstrobotics.kz/ru/' },
  { name: 'FIRA Kazakhstan', organizer: 'FIRA', site: 'https://firakz.com/' },
]

const Calendar = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id)
  const [searchTerm, setSearchTerm] = useState('')

  const visibleEvents = useMemo(() => {
    const section = SECTIONS.find((entry) => entry.id === activeSection)
    if (!section) return []
    return section.eventIds
      .map((id) => EVENTS[id])
      .filter((event) => {
        if (!searchTerm) return true
        const haystack = `${event.title} ${event.city} ${event.tags.join(' ')}`.toLowerCase()
        return haystack.includes(searchTerm.toLowerCase())
      })
  }, [activeSection, searchTerm])

  return (
    <div className="calendar-page">
      <section className="calendar-hero">
        <div className="calendar-hero-content">
          <div className="hero-label">Robotics calendar</div>
          <h1>Events in Kazakhstan</h1>
          <p>Pick a track - WRO, FIRST, international expos, or national qualifiers - and see what is coming up.</p>
          <div className="calendar-search">
            <input
              type="search"
              placeholder="Search by city, keyword, or tag"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="calendar-tabs">
        <div className="calendar-tab-row">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              className={`calendar-tab ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="tab-icon" aria-hidden>
                {section.icon}
              </span>
              <span className="tab-label">{section.title}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="calendar-results">
        <header className="calendar-results-header">
          <div>
            <span className="section-tag">
              {SECTIONS.find((section) => section.id === activeSection)?.badge ?? 'Track'}
            </span>
            <h2>{SECTIONS.find((section) => section.id === activeSection)?.title}</h2>
            <p>{SECTIONS.find((section) => section.id === activeSection)?.description}</p>
          </div>
        </header>

        <div className="calendar-card-grid">
          {visibleEvents.map((event) => (
            <article key={event.id} className="calendar-card">
              <div className="calendar-card-media">
                <img src={event.image} alt={event.title} loading="lazy" />
                <span className="calendar-card-mode">{event.mode === 'offline' ? 'In person' : event.mode}</span>
              </div>
              <div className="calendar-card-body">
                <div className="calendar-card-date">
                  {new Date(`${event.date}T${event.time}`).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  · {event.time}
                </div>
                <h3>{event.title}</h3>
                <p>{event.summary}</p>
                <div className="calendar-card-meta">
                  <span>{event.city}</span>
                  <span>•</span>
                  <span>{event.venue}</span>
                </div>
                <div className="calendar-card-tags">
                  {event.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="calendar-card-links">
                    {event.links.map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                        {link.label} →
                      </a>
                    ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="calendar-tournaments">
        <div className="tournaments-header">
          <span className="section-tag">Tournament directory</span>
          <h2>Robotics circuits to bookmark</h2>
          <p>Bookmark the organizers running FLL, FTC, WRO, VEX, FIRA, and community olympiads.</p>
        </div>
        <div className="tournaments-table">
          <div className="tournaments-row tournaments-head">
            <span>Турнир</span>
            <span>Организатор</span>
            <span>Сайт</span>
          </div>
          {TOURNAMENTS.map((tournament) => (
            <div key={tournament.name} className="tournaments-row">
              <span>{tournament.name}</span>
              <span>{tournament.organizer}</span>
              <a href={tournament.site} target="_blank" rel="noreferrer">
                {tournament.site.replace(/^https?:\/\//, '')}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Calendar

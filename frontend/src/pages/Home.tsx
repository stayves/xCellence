import { Fragment, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Picture from '../components/Picture';
import CountUp from '../components/CountUp';
import RobotLogo from '../components/RobotLogo';
import { accentOf, bounce, sprayBurst } from '../utils/motion.ts';
import { getBlogPosts } from '../data/blog.ts';
import './Home.css';

type Team = 'xception' | 'xcellence';
type Program = { tag: string; title: string; text: string; cta: string; to: string };
type Stat = { value: number; suffix: string; label: string };
type Impact = { value: string; label: string; detail: string };
type Sponsor = { name: string; logo: string; tier: string };

const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;

const Home = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState<Team | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const raf = useRef(0);

  const stats = t('home2.stats.items', { returnObjects: true }) as Stat[];
  const programs = t('home2.programs.items', { returnObjects: true }) as Program[];
  const impact = t('home2.impact.items', { returnObjects: true }) as Impact[];
  const milestones = t('home2.impact.milestones', { returnObjects: true }) as string[];
  const awards = {
    xception: t('teams.xception.awards', { returnObjects: true }) as string[],
    xcellence: t('teams.xcellence.awards', { returnObjects: true }) as string[],
  };
  const posts = getBlogPosts(t).filter((p) => p.slug).slice(0, 3);
  const sponsors = (t('home.sponsors.items', { returnObjects: true }) as Sponsor[]) ?? [];

  // Mascots follow the pointer a little. Mouse only, and never under reduced motion.
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = heroRef.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', String(((clientX - r.left) / r.width - 0.5) * 2));
      el.style.setProperty('--my', String(((clientY - r.top) / r.height - 0.5) * 2));
    });
  };

  const hoverTeam = (team: Team) => (e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse') setActive(team);
  };

  // Easter egg: poke a mascot and it hops, spraying paint in its team colour.
  const pokeMascot = (e: ReactMouseEvent<HTMLElement>) => {
    bounce(e.currentTarget.firstElementChild);
    sprayBurst(e.clientX, e.clientY, accentOf(e.currentTarget), 14);
  };

  return (
    <div className="home">
      {/* ---------- Split hero ---------- */}
      <section
        ref={heroRef}
        className="lab-hero"
        data-active={active ?? 'none'}
        aria-labelledby="hero-title"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setActive(null)}
      >
        <div className="lab-hero__center">
          <p className="eyebrow lab-hero__eyebrow">{t('home2.hero.eyebrow')}</p>
          <h1 id="hero-title" className="lab-hero__title">
            {t('home2.hero.title').split(' ').map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                {i > 0 && ' '}
                <span className="lab-hero__word" style={{ ['--i' as string]: i }}>{word}</span>
              </Fragment>
            ))}
          </h1>
          <p className="lab-hero__lead">{t('home2.hero.lead')}</p>
          <p className="lab-hero__hint" aria-hidden="true">{t('home2.hero.scroll')} <span>↓</span></p>
        </div>

        {(['xception', 'xcellence'] as Team[]).map((team) => (
          <div
            key={team}
            className={`lab-hero__panel lab-hero__panel--${team}`}
            data-team={team}
            onPointerEnter={hoverTeam(team)}
          >
            <div className="lab-hero__wall" aria-hidden="true">
              <Picture src="graffiti-cover.png" alt="" fill sizes="100vw" priority={team === 'xception'} eager />
            </div>
            <div className="lab-hero__tint" aria-hidden="true" />
            <div className="lab-hero__specks" aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => <span key={i} style={{ ['--s' as string]: i }} />)}
            </div>

            <div className="lab-hero__mascot" onClick={pokeMascot}>
              <Picture
                src={team === 'xception' ? 'mascot-panda.png' : 'mascot-redpanda.png'}
                alt={t(`home2.hero.${team}.mascot`)}
                fill
                eager
                sizes="(min-width: 900px) 24vmin, 40vw"
                position={team === 'xception' ? '40% 38%' : '58% 34%'}
              />
            </div>

            <div className="lab-hero__team">
              <p className="lab-hero__tag">{t(`home2.hero.${team}.tag`)}</p>
              <h2 className="lab-hero__name">{t(`home2.hero.${team}.name`)}</h2>
              <p className="lab-hero__pitch">{t(`home2.hero.${team}.pitch`)}</p>
              <Link
                to={`/teams/${team}`}
                className="btn lab-hero__cta"
                data-magnetic
                onFocus={() => setActive(team)}
                onBlur={() => setActive(null)}
                viewTransition
              >
                {t(`home2.hero.${team}.cta`)} <Arrow />
              </Link>
            </div>
          </div>
        ))}
        <div className="lab-hero__seam" aria-hidden="true" />
        <div className="lab-hero__spark" aria-hidden="true" />
      </section>

      {/* ---------- Stats ---------- */}
      <section className="stats" aria-label="Numbers">
        <ul className="container stats__list">
          {stats.map((s, i) => (
            <li key={s.label} className="stats__item reveal" style={{ ['--d' as string]: `${i * 80}ms` }}>
              <strong className="stats__value"><CountUp value={s.value} suffix={s.suffix} /></strong>
              <span className="stats__label">{s.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Programs ---------- */}
      <section className="section programs">
        <div className="container">
          <header className="head reveal">
            <p className="eyebrow">{t('home2.programs.eyebrow')}</p>
            <h2>{t('home2.programs.title')}</h2>
            <p>{t('home2.programs.intro')}</p>
          </header>
          <div className="programs__grid">
            {programs.map((p, i) => (
              <article key={p.tag} className="program reveal" data-spotlight style={{ ['--d' as string]: `${i * 90}ms` }}>
                <span className="program__tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <Link to={p.to} className="program__link" viewTransition>
                  {p.cta} <Arrow />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Results ---------- */}
      <section className="section results" id="results">
        <div className="container">
          <header className="head reveal">
            <p className="eyebrow">{t('home2.results.eyebrow')}</p>
            <h2>{t('home2.results.title')}</h2>
            <p>{t('home2.results.intro')}</p>
          </header>
          <div className="results__grid">
            {(['xception', 'xcellence'] as Team[]).map((team, i) => (
              <article key={team} className={`award-card award-card--${team} reveal`} data-team={team} data-spotlight style={{ ['--d' as string]: `${i * 100}ms` }}>
                <div className="award-card__head">
                  <RobotLogo
                    team={team}
                    size={48}
                    interactive
                    label={t('teams.wink', { name: t(`teams.${team}.name`) })}
                    className="award-card__logo"
                  />
                  <div>
                    <h3>{t(`teams.${team}.name`)}</h3>
                    <p>{t(`teams.${team}.tag`)}</p>
                  </div>
                </div>
                <ul>
                  {awards[team].map((a) => <li key={a}>{a}</li>)}
                </ul>
                <Link to={`/teams/${team}`} className="program__link" viewTransition>
                  {t('teams.more')} <Arrow />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Impact ---------- */}
      <section className="section impact">
        <div className="container">
          <header className="head reveal">
            <p className="eyebrow">{t('home2.impact.eyebrow')}</p>
            <h2>{t('home2.impact.title')}</h2>
            <p>{t('home2.impact.intro')}</p>
          </header>

          <div className="polaroids">
            {([
              ['deti 2.jpg', 'kids', '50% 30%'],
              ['xCellenceTeam9.jpg', 'captains', '50% 50%'],
              ['xCellenceTeam5.jpg', 'uniforms', '50% 50%'],
              ['xCellenceTeam6.jpg', 'flags', '50% 45%'],
              ['xCellenceTeam7.jpg', 'bridge', '50% 50%'],
            ] as const).map(([src, key, pos], i) => (
              <figure key={key} className="polaroid reveal" style={{ ['--d' as string]: `${i * 90}ms` }}>
                <div className="polaroid__photo">
                  <Picture src={src} alt={t(`home2.impact.photos.${key}`)} fill sizes="(min-width: 900px) 20vw, 60vw" position={pos} />
                </div>
              </figure>
            ))}
          </div>

          <ul className="impact__grid">
            {impact.map((it, i) => (
              <li key={it.label} className="impact__item reveal" data-spotlight style={{ ['--d' as string]: `${i * 80}ms` }}>
                <strong>{it.value}</strong>
                <span>{it.label}</span>
                <small>{it.detail}</small>
              </li>
            ))}
          </ul>
          <ul className="milestones reveal">
            {milestones.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      </section>

      {/* ---------- Journal ---------- */}
      <section className="section journal">
        <div className="container">
          <header className="head head--row reveal">
            <div>
              <p className="eyebrow">{t('home2.journal.eyebrow')}</p>
              <h2>{t('home2.journal.title')}</h2>
            </div>
            <Link to="/blog" className="btn btn--ghost" viewTransition>{t('home2.journal.cta')} <Arrow /></Link>
          </header>
          <div className="journal__grid">
            {posts.map((post, i) => (
              <article key={post.slug} className="post reveal" data-spotlight style={{ ['--d' as string]: `${i * 90}ms` }}>
                <Link to={`/blog/${post.slug}`} className="post__link" viewTransition>
                  <div className="post__cover">
                    <Picture src={post.coverImage} alt={post.coverAlt} fill sizes="(min-width: 900px) 33vw, 100vw" />
                  </div>
                  <div className="post__body">
                    <span className="post__tag">{post.tag}</span>
                    <h3>{post.title}</h3>
                    <p>{post.summary}</p>
                    <span className="post__meta">{post.readTime}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Partners ---------- */}
      {sponsors.length > 0 && (
        <section className="partners-strip" aria-label={t('home.sponsors.title')}>
          <div className="container">
            <p className="eyebrow">{t('home.sponsors.title')}</p>
          </div>
          <div className="marquee">
            {[0, 1].map((copy) => (
              <ul key={copy} className="marquee__track" aria-hidden={copy === 1 ? true : undefined}>
                {sponsors.map((s) => (
                  <li key={`${copy}-${s.logo}`} className="marquee__item">
                    <Picture src={s.logo} alt={copy === 0 ? s.name : ''} sizes="160px" eager />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Closing CTA ---------- */}
      <section className="section home-cta">
        <div className="container home-cta__box reveal">
          <h2>{t('home2.cta.title')}</h2>
          <p>{t('home2.cta.text')}</p>
          <div className="home-cta__row">
            <Link to="/partners" className="btn" data-magnetic viewTransition>{t('home2.cta.partner')} <Arrow /></Link>
            <Link to="/contact" className="btn btn--ghost" data-magnetic viewTransition>{t('home2.cta.join')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

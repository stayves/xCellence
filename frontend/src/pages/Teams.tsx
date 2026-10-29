import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Picture from '../components/Picture';
import { withBase } from '../utils/asset.ts';
import './Teams.css';

type Slug = 'xcellence' | 'xception';
const SLUGS: Slug[] = ['xception', 'xcellence'];
const isSlug = (v: string | undefined): v is Slug => v === 'xcellence' || v === 'xception';
const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;

const mascotFor = (slug: Slug) => (slug === 'xception' ? 'mascot-panda.png' : 'mascot-redpanda.png');
const mascotPos = (slug: Slug) => (slug === 'xception' ? '40% 38%' : '58% 34%');

/** /teams: both teams side by side */
export const TeamsOverview = () => {
  const { t } = useTranslation();
  return (
    <div className="teams">
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow">{t('teams.hero.eyebrow')}</p>
          <h1>{t('teams.hero.title')}</h1>
          <p className="page-hero__lead">{t('teams.hero.lead')}</p>
        </div>
      </header>

      <section className="container teams__cards">
        {SLUGS.map((slug, i) => {
          const awards = t(`teams.${slug}.awards`, { returnObjects: true }) as string[];
          return (
            <article key={slug} className={`team-card team-card--${slug} reveal`} data-team={slug} style={{ ['--d' as string]: `${i * 100}ms` }}>
              <div className="team-card__wall" aria-hidden="true">
                <Picture src="graffiti-cover.png" alt="" fill sizes="50vw" />
              </div>
              <div className="team-card__mascot">
                <Picture src={mascotFor(slug)} alt={`${t(`teams.${slug}.mascot`)}`} fill sizes="260px" position={mascotPos(slug)} />
              </div>
              <div className="team-card__body">
                <img src={withBase(`brand/logo-${slug}-white.png`)} alt="" width="52" height="52" className="team-card__logo" />
                <p className="team-card__tag">{t(`teams.${slug}.tag`)}</p>
                <h2>{t(`teams.${slug}.name`)}</h2>
                <ul className="team-card__awards">
                  {awards.slice(-3).map((a) => <li key={a}>{a}</li>)}
                </ul>
                <Link to={`/teams/${slug}`} className="btn" viewTransition>
                  {t('teams.more')} <Arrow />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="container people-cta reveal">
        <h2>{t('teams.peopleTitle')}</h2>
        <p>{t('teams.peopleText')}</p>
        <Link to="/team" className="btn btn--ghost" viewTransition>{t('teams.peopleCta')} <Arrow /></Link>
      </section>
    </div>
  );
};

/** /teams/:slug: one team, in its own skin (Layout sets data-team from the route) */
export const TeamPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  if (!isSlug(slug)) return <Navigate to="/teams" replace />;

  const other: Slug = slug === 'xcellence' ? 'xception' : 'xcellence';
  const story = t(`teams.${slug}.story`, { returnObjects: true }) as string[];
  const awards = t(`teams.${slug}.awards`, { returnObjects: true }) as string[];
  const photos: [string, string][] =
    slug === 'xcellence'
      ? [['xCellenceTeam2.jpg', 'captains'], ['xCellenceTeam9.jpg', 'captains']]
      : [];

  return (
    <div className="team-page-v2" data-team={slug}>
      <header className={`tv-hero tv-hero--${slug}`}>
        <div className="tv-hero__wall" aria-hidden="true">
          <Picture src="graffiti-cover.png" alt="" fill priority sizes="100vw" />
        </div>
        <div className="container tv-hero__inner">
          <div className="tv-hero__text">
            <Link to="/teams" className="back-link" viewTransition>← {t('teams.backToTeams')}</Link>
            <p className="eyebrow">{t(`teams.${slug}.tag`)}</p>
            <h1>{t(`teams.${slug}.name`)}</h1>
            <a href={t(`teams.${slug}.url`)} target="_blank" rel="noopener noreferrer" className="handle">
              {t('teams.handleLabel')} · {t(`teams.${slug}.handle`)}
            </a>
          </div>
          <div className="tv-hero__mascot">
            <Picture src={mascotFor(slug)} alt={t(`teams.${slug}.mascot`)} fill eager sizes="(min-width: 900px) 360px, 60vw" position={mascotPos(slug)} />
          </div>
        </div>
      </header>

      <section className="container team-story">
        <div className="team-story__text reveal">
          <h2>{t('teams.storyTitle')}</h2>
          {story.map((p) => <p key={p}>{p}</p>)}
        </div>
        <img src={withBase(`brand/logo-${slug}-white.png`)} alt="" width="220" height="220" className="team-story__logo" />
      </section>

      <section className="container team-awards">
        <h2 className="reveal">{t('teams.awardsTitle')}</h2>
        <ul className="award-list">
          {awards.map((a, i) => (
            <li key={a} className="award-list__item reveal" style={{ ['--d' as string]: `${i * 60}ms` }}>
              <span aria-hidden="true">★</span>
              {a}
            </li>
          ))}
        </ul>
      </section>

      {photos.length > 0 && (
        <section className="container team-photos">
          {photos.map(([src, key], i) => (
            <figure key={src} className="team-photo reveal" style={{ ['--d' as string]: `${i * 100}ms` }}>
              <Picture src={src} alt={t(`home2.impact.photos.${key}`)} fill sizes="(min-width: 900px) 50vw, 100vw" />
            </figure>
          ))}
        </section>
      )}

      <section className="container team-foot reveal">
        <Link to="/team" className="btn btn--ghost" viewTransition>{t('teams.peopleCta')} <Arrow /></Link>
        <Link to={`/teams/${other}`} className="btn btn--ghost" data-team={other} viewTransition>
          {t(`teams.${other}.name`)} <Arrow />
        </Link>
        <Link to="/partners" className="btn" viewTransition>{t('header.partnerCta')} <Arrow /></Link>
      </section>
    </div>
  );
};

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Picture from '../components/Picture';
import { withBase } from '../utils/asset.ts';
import './Teams.css';
import './Partners.css';

type Stat = { value: string; label: string };
type Pack = { name: string; for: string; perks: string[]; outcome: string };
const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;

const Partners = () => {
  const { t } = useTranslation();
  const firstStats = t('partners.first.stats', { returnObjects: true }) as Stat[];
  const track = t('partners.track.items', { returnObjects: true }) as Stat[];
  const intl = t('partners.track.intlItems', { returnObjects: true }) as string[];
  const packs = t('partners.packages.items', { returnObjects: true }) as Pack[];
  const funds = t('partners.packages.funds', { returnObjects: true }) as string[];
  const mail = 'ftcxcellence@gmail.com';

  return (
    <div className="partners">
      <header className="page-hero partners-hero">
        <div className="container partners-hero__grid">
          <div>
            <p className="eyebrow">{t('partners.hero.eyebrow')}</p>
            <h1>{t('partners.hero.title')}</h1>
            <p className="page-hero__lead">{t('partners.hero.lead')}</p>
            <div className="partners-hero__cta">
              <a className="btn" href={`mailto:${mail}`}>{t('partners.hero.cta')} <Arrow /></a>
              <a className="btn btn--ghost" href={withBase('xCellence-sponsorship-proposal.pdf')} download>
                {t('partners.hero.download')}
              </a>
            </div>
          </div>
          <div className="partners-hero__art" aria-hidden="true">
            <Picture src="xCellenceTeam2.jpg" alt="" fill eager sizes="(min-width: 900px) 40vw, 90vw" />
          </div>
        </div>
      </header>

      <section className="container pair">
        <article className="pair__col reveal">
          <h2>{t('partners.about.title')}</h2>
          <p>{t('partners.about.text')}</p>
        </article>
        <article className="pair__col reveal" style={{ ['--d' as string]: '100ms' }}>
          <h2>{t('partners.first.title')}</h2>
          <p>{t('partners.first.text')}</p>
        </article>
      </section>

      <section className="container big-stats">
        <ul>
          {firstStats.map((s, i) => (
            <li key={s.label} className="reveal" style={{ ['--d' as string]: `${i * 70}ms` }}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
        <p className="source">{t('partners.first.source')}</p>
      </section>

      <section className="container p-track">
        <h2 className="reveal">{t('partners.track.title')}</h2>
        <ul className="p-track__stats">
          {track.map((s, i) => (
            <li key={s.label} className="reveal" style={{ ['--d' as string]: `${i * 80}ms` }}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
        <div className="p-track__intl reveal">
          <h3>{t('partners.track.intl')}</h3>
          <ul>{intl.map((a) => <li key={a}>{a}</li>)}</ul>
          <p>{t('partners.track.alumni')}</p>
        </div>
      </section>

      <section className="container packages">
        <header className="head reveal">
          <h2>{t('partners.packages.title')}</h2>
          <p>{t('partners.packages.intro')}</p>
        </header>
        <div className="packages__grid">
          {packs.map((p, i) => (
            <article key={p.name} className="pack reveal" data-num={`0${i + 1}`} style={{ ['--d' as string]: `${i * 90}ms` }}>
              <h3>{p.name}</h3>
              <p className="pack__for">{p.for}</p>
              <h4>{t('partners.packages.get')}</h4>
              <ul>{p.perks.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className="pack__out">{p.outcome}</p>
            </article>
          ))}
        </div>
        <div className="funds reveal">
          <h3>{t('partners.packages.fundsTitle')}</h3>
          <ul>{funds.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      </section>

      <section className="container partners-cta reveal">
        <h2>{t('partners.contact.title')}</h2>
        <p>{t('partners.contact.text')}</p>
        <a className="btn" href={`mailto:${mail}`}>{t('partners.contact.cta')} <Arrow /></a>
        <Link to="/contact" className="btn btn--ghost" viewTransition>{t('header.nav.contact')}</Link>
      </section>
    </div>
  );
};

export default Partners;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Resources.css';
import Picture from '../components/Picture';
import BookViewer from '../components/BookViewer';

type ResourceItem = {
  name: string;
  description: string;
  href: string;
  type: 'guide' | 'video' | 'tool' | 'template';
};

type ResourceSection = {
  title: string;
  summary: string;
  items: ResourceItem[];
};

const BOOK_PAGES = [
  'обложка.png',
  ...Array.from({ length: 18 }, (_, i) => `${i + 1}.png`),
  'задняя обложка.png',
];

const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;

const Resources = () => {
  const { t } = useTranslation();
  const resourceSections = t('resources.sections', { returnObjects: true }) as ResourceSection[];
  const [bookStart, setBookStart] = useState<number | null>(null);
  const openBook = (page = 0) => setBookStart(page);

  return (
    <div className="resources-page">
      <section className="resources-hero">
        <div className="resources-hero-content">
          <span className="section-tag">{t('resources.hero.tag')}</span>
          <h1>{t('resources.hero.title')}</h1>
          <p>
            {t('resources.hero.description')}
          </p>
        </div>
      </section>

      <section className="resources-section">
        <div className="resources-container">
          <article className="book-showcase reveal">
            <button type="button" className="book3d" onClick={() => openBook()} aria-label={t('resources.book.open')}>
              <span className="book3d__inner" aria-hidden="true">
                <Picture src={BOOK_PAGES[1]} alt="" fill sizes="(min-width: 900px) 300px, 60vw" />
              </span>
              <span className="book3d__cover">
                <Picture src={BOOK_PAGES[0]} alt={t('resources.book.coverAlt')} fill eager sizes="(min-width: 900px) 300px, 60vw" />
                <span className="book3d__shine" aria-hidden="true" />
              </span>
              <span className="book3d__edge" aria-hidden="true" />
            </button>

            <div className="book-showcase__text">
              <p className="eyebrow">{t('resources.book.eyebrow')}</p>
              <h2>{t('resources.book.title')}</h2>
              <p>{t('resources.book.summary')}</p>
              <div className="book-showcase__row">
                <button type="button" className="btn" data-magnetic onClick={() => openBook()}>
                  {t('resources.book.read')} <Arrow />
                </button>
                <span className="book-showcase__count">{t('resources.book.pageCount', { count: BOOK_PAGES.length })}</span>
              </div>
              <ul className="book-showcase__peek">
                {[1, 2, 3].map((i) => (
                  <li key={i}>
                    <button type="button" onClick={() => openBook(i)} aria-label={t('resources.book.pageAlt', { current: i + 1 })}>
                      <Picture src={BOOK_PAGES[i]} alt="" fill sizes="96px" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {resourceSections.map((section) => (
            <article key={section.title} className="resource-block">
              <header>
                <h2>{section.title}</h2>
                <p>{section.summary}</p>
              </header>

              <ul className="resource-list">
                {section.items.map((item) => (
                  <li key={item.name} className="resource-item">
                    <div className="resource-item-meta">
                      <span className={`resource-type ${item.type}`}>{t(`resources.types.${item.type}`)}</span>
                      <h3>{item.name}</h3>
                    </div>
                    <p>{item.description}</p>
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {t('resources.open')} <Arrow />
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {bookStart !== null && <BookViewer pages={BOOK_PAGES} startPage={bookStart} onClose={() => setBookStart(null)} />}
    </div>
  );
};

export default Resources;




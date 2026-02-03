import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Resources.css';

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

const Resources = () => {
  const { t } = useTranslation();
  const resourceSections = t('resources.sections', { returnObjects: true }) as ResourceSection[];
  const bookPages = useMemo(
    () => [
      '/обложка.png',
      '/1.png',
      '/2.png',
      '/3.png',
      '/4.png',
      '/5.png',
      '/6.png',
      '/7.png',
      '/8.png',
      '/9.png',
      '/10.png',
      '/11.png',
      '/12.png',
      '/13.png',
      '/14.png',
      '/15.png',
      '/16.png',
      '/17.png',
      '/18.png',
      '/задняя обложка и обложка.png',
    ],
    [],
  );
  const [bookOpen, setBookOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = bookPages.length;
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === totalPages - 1;
  const currentPageSrc = encodeURI(bookPages[pageIndex]);
  const prevPageSrc = pageIndex > 0 ? encodeURI(bookPages[pageIndex - 1]) : null;
  const nextPageSrc = pageIndex < totalPages - 1 ? encodeURI(bookPages[pageIndex + 1]) : null;

  const openBook = () => {
    setPageIndex(0);
    setBookOpen(true);
  };

  const closeBook = () => {
    setBookOpen(false);
  };

  const goPrevPage = () => {
    setPageIndex((prev) => Math.max(0, prev - 1));
  };

  const goNextPage = () => {
    setPageIndex((prev) => Math.min(totalPages - 1, prev + 1));
  };

  useEffect(() => {
    if (!bookOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeBook();
        return;
      }
      if (event.key === 'ArrowLeft') {
        goPrevPage();
        return;
      }
      if (event.key === 'ArrowRight') {
        goNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [bookOpen, totalPages]);

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
          <article className="resource-block book-block">
            <header>
              <h2>{t('resources.book.title')}</h2>
              <p>{t('resources.book.summary')}</p>
            </header>
            <div className="book-preview">
              <button type="button" className="book-cover" onClick={openBook} aria-label={t('resources.book.open')}>
                <img src={encodeURI(bookPages[0])} alt={t('resources.book.coverAlt')} loading="lazy" />
                <span className="book-cover-overlay">{t('resources.book.open')}</span>
              </button>
              <div className="book-preview-details">
                <p>{t('resources.book.description')}</p>
                <div className="book-preview-actions">
                  <button type="button" className="book-open-button" onClick={openBook}>
                    {t('resources.book.open')}
                  </button>
                  <span className="book-page-count">
                    {t('resources.book.pageCount', { count: totalPages })}
                  </span>
                </div>
              </div>
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
                      {t('resources.open')}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {bookOpen && (
        <div className="book-modal" role="dialog" aria-modal="true" aria-label={t('resources.book.viewer')}>
          <div className="book-modal-backdrop" onClick={closeBook} />
          <div className="book-modal-content">
            <div className="book-modal-header">
              <div>
                <span className="book-modal-title">{t('resources.book.viewer')}</span>
                <span className="book-modal-subtitle">
                  {t('resources.book.pageLabel', { current: pageIndex + 1, total: totalPages })}
                </span>
              </div>
              <button type="button" className="book-close-button" onClick={closeBook} aria-label={t('resources.book.close')}>
                ×
              </button>
            </div>
            <div className="book-page">
              <div className="book-side">
                <button type="button" className="book-nav-button" onClick={goPrevPage} disabled={isFirstPage}>
                  {t('resources.book.prev')}
                </button>
                {prevPageSrc ? (
                  <button type="button" className="book-side-preview" onClick={goPrevPage}>
                    <img src={prevPageSrc} alt={t('resources.book.pageAlt', { current: pageIndex })} />
                    <span>{t('resources.book.prev')}</span>
                  </button>
                ) : (
                  <div className="book-side-placeholder" />
                )}
              </div>
              <div className="book-page-frame">
                <img src={currentPageSrc} alt={t('resources.book.pageAlt', { current: pageIndex + 1 })} />
              </div>
              <div className="book-side">
                <button type="button" className="book-nav-button" onClick={goNextPage} disabled={isLastPage}>
                  {t('resources.book.next')}
                </button>
                {nextPageSrc ? (
                  <button type="button" className="book-side-preview" onClick={goNextPage}>
                    <img src={nextPageSrc} alt={t('resources.book.pageAlt', { current: pageIndex + 2 })} />
                    <span>{t('resources.book.next')}</span>
                  </button>
                ) : (
                  <div className="book-side-placeholder" />
                )}
              </div>
            </div>
            <div className="book-modal-footer">
              <span>{t('resources.book.hint')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;




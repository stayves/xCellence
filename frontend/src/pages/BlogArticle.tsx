import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { blogArticlesBySlug } from '../data/blog';
import './BlogArticle.css';

const BlogArticle = () => {
  const { slug } = useParams();
  const article = slug ? blogArticlesBySlug[slug] : undefined;
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!slug) {
      return '';
    }

    if (typeof window === 'undefined') {
      const basePath = import.meta.env.BASE_URL?.replace(/\/+$/, '') ?? '';
      return `${basePath}/blog/${slug}`;
    }

    const basePath = import.meta.env.BASE_URL?.replace(/\/+$/, '') ?? '';
    return `${window.location.origin}${basePath}/blog/${slug}`;
  }, [slug]);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(article.title);

  const shareLinks = [
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  const handleCopyLink = async () => {
    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="article-shell">
      <div className="article-topbar">
        <div className="article-topbar-inner">
          <div className="article-breadcrumbs">
            <Link to="/blog">Блог xCellence</Link>
            <span>/</span>
            <span>{article.kicker}</span>
          </div>
          <div className="article-topbar-meta">
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>

      <div className="article-layout">
        <main className="article-main">
          <article className="article-card">
            <header className="article-header">
              <span className="article-kicker">{article.kicker}</span>
              <h1>{article.title}</h1>
              <p className="article-description">{article.intro}</p>
              <div className="article-meta">
                <span>{article.date}</span>
                <span className="article-dot">•</span>
                <span>{article.readTime}</span>
                <span className="article-dot">•</span>
                <span className="article-author">{article.author}</span>
              </div>
            </header>

            <figure className="article-cover">
              <img src={article.heroImage} alt={article.heroAlt} />
              <figcaption>Photo: xCellence Media Team</figcaption>
            </figure>

            {article.sections.map((section) => (
              <section key={section.title} className="article-section">
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.title}-${index}`}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="article-list">
                    {section.bullets.map((bullet, listIndex) => (
                      <li key={`${section.title}-bullet-${listIndex}`}>{bullet}</li>
                    ))}
                  </ul>
                )}
              {section.images && (
                <div className="article-media-grid">
                  {section.images.map((image, mediaIndex) => (
                    <figure
                      key={`${section.title}-image-${mediaIndex}-${image.src}`}
                      className="article-inline-image"
                    >
                      <img src={image.src} alt={image.alt} loading="lazy" />
                      <figcaption>{image.caption ?? image.alt}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
                <div className="article-divider" />
              </section>
            ))}

            <p className="article-closing">{article.closing}</p>

            <div className="article-footer-links">
              <Link to="/blog" className="article-back">
                ← Вернуться ко всем публикациям
              </Link>
            </div>
          </article>
        </main>

        <aside className="article-aside">
          <div className="article-card aside-card">
            <p className="aside-label">Поделиться</p>
            <div className="share-links">
              {shareLinks.map((target) => (
                <a
                  key={target.label}
                  href={shareUrl ? target.href : '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="share-link"
                >
                  {target.label}
                </a>
              ))}
              <button type="button" className="share-copy" onClick={handleCopyLink}>
                {copied ? 'Скопировано' : 'Скопировать ссылку'}
              </button>
            </div>
          </div>

          <div className="article-card aside-card author-card">
            <p className="aside-label">Автор</p>
            <h3>{article.author}</h3>
            <p className="author-note">
              Делимся практическими заметками xCellence: CAD, механика, код и всё, что помогает нам выступать на
              соревнованиях FIRST Tech Challenge.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogArticle;



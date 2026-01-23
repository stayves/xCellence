import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBlogArticlesBySlug, type ArticleSection } from '../data/blog.ts';
import { withBase } from '../utils/asset.ts';
import './BlogArticle.css';

const BlogArticle = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const blogArticlesBySlug = getBlogArticlesBySlug(t);
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

  const resolvedArticle = {
    ...article,
    heroImage: withBase(article.heroImage),
    sections: article.sections.map((section) => ({
      ...section,
      images: section.images
        ? section.images.map((image) => ({
            ...image,
            src: withBase(image.src),
          }))
        : undefined,
    })),
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(resolvedArticle.title);

  const shareLinks = [
    {
      label: t('blogArticle.share.telegram'),
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: t('blogArticle.share.linkedin'),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: t('blogArticle.share.x'),
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

  const renderLinkedText = (text: string) => {
    const nodes: Array<JSX.Element | string> = [];
    const urlRegex = /https?:\/\/[^\s)]+/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = urlRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(text.slice(lastIndex, match.index));
      }

      let url = match[0];
      let trailing = '';
      while (/[.,;:!?]$/.test(url)) {
        trailing = `${url.slice(-1)}${trailing}`;
        url = url.slice(0, -1);
      }

      nodes.push(
        <a key={`${url}-${match.index}`} href={url} target="_blank" rel="noreferrer">
          {url}
        </a>,
      );

      if (trailing) {
        nodes.push(trailing);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }

    return nodes;
  };

  const slugify = (value: string) => {
    const slug = value
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '');
    return slug || 'section';
  };

  const getFigLabel = (text: string) => {
    const match = text.match(/fig\.?\s*\d+(?:\.\d+)?/i);
    return match ? match[0].toLowerCase().replace(/\s+/g, ' ').trim() : null;
  };

  const normalizeFigLabel = (text: string) => {
    const label = getFigLabel(text);
    return label ? label.replace(/\.$/, '') : null;
  };

  const renderInlineImage = (image: { src: string; alt: string; caption?: string }, key: string) => (
    <figure key={key} className="article-inline-image">
      <img src={image.src} alt={image.alt} loading="lazy" />
      <figcaption>{image.caption ?? image.alt}</figcaption>
    </figure>
  );

  const renderSectionMedia = (section: ArticleSection) => {
    const figImageMap = new Map<string, typeof section.images[number]>();
    section.images?.forEach((image) => {
      const label = normalizeFigLabel(image.caption ?? image.alt);
      if (label) {
        figImageMap.set(label, image);
      }
    });

    const usedImages = new Set<string>();

    const paragraphNodes = section.paragraphs.map((paragraph, index) => {
      const figLabel = normalizeFigLabel(paragraph);
      const matchedImage = figLabel ? figImageMap.get(figLabel) : undefined;
      if (matchedImage) {
        usedImages.add(matchedImage.src);
      }

      return (
        <div key={`${section.title}-paragraph-${index}`}>
          <p>{renderLinkedText(paragraph)}</p>
          {matchedImage
            ? renderInlineImage(matchedImage, `${section.title}-image-${index}-${matchedImage.src}`)
            : null}
        </div>
      );
    });

    const remainingImages = section.images
      ? section.images.filter((image) => !usedImages.has(image.src))
      : [];

    return (
      <>
        {paragraphNodes}
        {remainingImages.length > 0 && (
          <div className="article-media-grid">
            {remainingImages.map((image, mediaIndex) =>
              renderInlineImage(image, `${section.title}-image-${mediaIndex}-${image.src}`),
            )}
          </div>
        )}
      </>
    );
  };

  const tocItems = resolvedArticle.sections.map((section, index) => ({
    id: `${slugify(section.title)}-${index + 1}`,
    title: section.title,
  }));

  return (
    <div className="article-shell">
      <div className="article-topbar">
        <div className="article-topbar-inner">
          <div className="article-breadcrumbs">
            <Link to="/blog">{t('blogArticle.breadcrumb')}</Link>
            <span>/</span>
            <span>{resolvedArticle.kicker}</span>
          </div>
          <div className="article-topbar-meta">
            <span>{resolvedArticle.readTime}</span>
          </div>
        </div>
      </div>

      <div className="article-layout">
        <main className="article-main">
          <article className="article-card">
            <header className="article-header">
              <span className="article-kicker">{resolvedArticle.kicker}</span>
              <h1>{resolvedArticle.title}</h1>
              <p className="article-description">{renderLinkedText(resolvedArticle.intro)}</p>
              <div className="article-meta">
                <span>{resolvedArticle.date}</span>
                <span className="article-dot">•</span>
                <span>{resolvedArticle.readTime}</span>
                <span className="article-dot">•</span>
                <span className="article-author">{resolvedArticle.author}</span>
              </div>
            </header>

            <figure className="article-cover">
              <img src={resolvedArticle.heroImage} alt={resolvedArticle.heroAlt} />
              <figcaption>{t('blogArticle.photoCredit')}</figcaption>
            </figure>

            {tocItems.length > 0 && (
              <nav className="article-toc" aria-label={t('blogArticle.toc')}>
                <p className="article-toc-title">{t('blogArticle.toc')}</p>
                <div className="article-toc-links">
                  {tocItems.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className="article-toc-link">
                      {item.title}
                    </a>
                  ))}
                </div>
              </nav>
            )}

            {resolvedArticle.sections.map((section, index) => (
              <section key={section.title} id={tocItems[index]?.id} className="article-section">
                <h2>{section.title}</h2>
                {renderSectionMedia(section)}
                {section.bullets && (
                  <ul className="article-list">
                    {section.bullets.map((bullet, listIndex) => (
                      <li key={`${section.title}-bullet-${listIndex}`}>{bullet}</li>
                    ))}
                  </ul>
                )}
                <div className="article-divider" />
              </section>
            ))}

            <p className="article-closing">{resolvedArticle.closing}</p>

            <div className="article-footer-links">
              <Link to="/blog" className="article-back">
                {t('blogArticle.back')}
              </Link>
            </div>
          </article>
        </main>

        <aside className="article-aside">
          <div className="article-card aside-card">
            <p className="aside-label">{t('blogArticle.share.label')}</p>
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
                {copied ? t('blogArticle.share.copied') : t('blogArticle.share.copy')}
              </button>
            </div>
          </div>

          <div className="article-card aside-card author-card">
            <p className="aside-label">{t('blogArticle.author.label')}</p>
            <h3>{resolvedArticle.author}</h3>
            <p className="author-note">
              {t('blogArticle.author.note')}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogArticle;



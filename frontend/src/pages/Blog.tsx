import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBlogPosts, type BlogPost } from '../data/blog.ts';
import './Blog.css';

const Blog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const blogPosts = getBlogPosts(t);
  const handleActivate = (slug?: string) => {
    if (!slug) return;
    navigate(`/blog/${slug}`);
  };

  const handleKeyActivate = (event: React.KeyboardEvent, slug?: string) => {
    if (!slug) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(`/blog/${slug}`);
    }
  };

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="blog-hero-content">
          <span className="section-tag">{t('blog.hero.tag')}</span>
          <h1>{t('blog.hero.title')}</h1>
          <p>
            {t('blog.hero.description')}
          </p>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-container">
          <div className="blog-grid">
            {blogPosts.map((post: BlogPost) => (
              <article
                key={post.title}
                className={`blog-card ${post.slug ? 'clickable' : 'disabled'}`}
                role="button"
                tabIndex={post.slug ? 0 : -1}
                onClick={() => handleActivate(post.slug)}
                onKeyDown={(event) => handleKeyActivate(event, post.slug)}
                aria-disabled={!post.slug}
              >
                <figure className="blog-card-cover">
                  <img src={post.coverImage} alt={post.coverAlt} loading="lazy" />
                </figure>
                <header className="blog-card-header">
                  <span className="blog-tag">{post.tag}</span>
                  <h2>{post.title}</h2>
                </header>
                <p className="blog-summary">{post.summary}</p>
                <footer className="blog-meta">
                  <div>
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-dot">•</span>
                    <span className="blog-readtime">{post.readTime}</span>
                  </div>
                  <span className="blog-author">{post.author}</span>
                </footer>
                <div className="blog-cta-inline">
                  {post.slug ? (
                    <span className="cta-link">{t('blog.cta.readStory')}</span>
                  ) : (
                    <span className="cta-disabled">{t('blog.cta.comingSoon')}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Blog;


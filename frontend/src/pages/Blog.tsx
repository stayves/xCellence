import { useNavigate } from 'react-router-dom';
import { blogPosts} from '../data/blog';
import './Blog.css';

const Blog = () => {
  const navigate = useNavigate();
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
          <span className="section-tag">Team Journal</span>
          <h1>Stories from the xCellence Lab</h1>
          <p>
            Follow our engineering breakthroughs, competition recaps, and outreach adventures as we prepare for each
            FIRST Tech Challenge season.
          </p>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-container">
          <div className="blog-grid">
            {blogPosts.map((post) => (
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
                    <span className="cta-link">Read story →</span>
                  ) : (
                    <span className="cta-disabled">Coming soon</span>
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


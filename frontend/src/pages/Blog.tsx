import { useNavigate } from 'react-router-dom';
import { blogPosts, fusionGuideArticle } from '../data/blog';
import './Blog.css';

const Blog = () => {
  const navigate = useNavigate();
  const handleReadStory = (slug?: string) => {
    if (!slug) {
      return;
    }

    navigate(`/blog/${slug}`);
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
              <article key={post.title} className="blog-card">
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
                <button
                  type="button"
                  className="blog-cta"
                  onClick={() => handleReadStory(post.slug)}
                  disabled={!post.slug}
                >
                  {post.slug ? 'Read story' : 'Coming soon'}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-article" id="fusion-guide">
        <div className="feature-container">
          <div className="feature-hero">
            <span className="section-tag">{fusionGuideArticle.kicker}</span>
            <h2>{fusionGuideArticle.title}</h2>
            <p>{fusionGuideArticle.intro}</p>
            <div className="feature-meta">
              <div>
                <span>{fusionGuideArticle.date}</span>
                <span className="blog-dot">•</span>
                <span>{fusionGuideArticle.readTime}</span>
              </div>
              <span className="feature-author">{fusionGuideArticle.author}</span>
            </div>
            <button
              type="button"
              className="blog-cta feature-cta"
              onClick={() => handleReadStory(fusionGuideArticle.slug)}
            >
              Read the full article
            </button>
          </div>
          <div className="feature-body">
            <figure className="feature-image">
              <img src={fusionGuideArticle.heroImage} alt={fusionGuideArticle.heroAlt} />
              <figcaption>Photo: xCellence Media Team</figcaption>
            </figure>
            <article className="feature-content">
              {fusionGuideArticle.sections.map((section) => (
                <div key={section.title} className="feature-section">
                  <h3>{section.title}</h3>
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.title}-${index}`}>{paragraph}</p>
                  ))}
                  {section.bullets && (
                    <ul className="feature-list">
                      {section.bullets.map((bullet, listIndex) => (
                        <li key={`${section.title}-bullet-${listIndex}`}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <p className="feature-closing">{fusionGuideArticle.closing}</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;


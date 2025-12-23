import { Link, Navigate, useParams } from 'react-router-dom';
import { blogArticlesBySlug } from '../data/blog';
import './BlogArticle.css';

const BlogArticle = () => {
  const { slug } = useParams();
  const article = slug ? blogArticlesBySlug[slug] : undefined;

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="article-page">
      <section className="article-hero">
        <div className="article-hero-content">
          <span className="section-tag">{article.kicker}</span>
          <h1>{article.title}</h1>
          <p>{article.intro}</p>
          <div className="article-meta">
            <span>{article.date}</span>
            <span className="article-dot">•</span>
            <span>{article.readTime}</span>
            <span className="article-dot">•</span>
            <span className="article-author">{article.author}</span>
          </div>
          <Link to="/blog" className="article-back">
            ← Back to blog
          </Link>
        </div>
      </section>

      <section className="article-body">
        <figure className="article-figure">
          <img src={article.heroImage} alt={article.heroAlt} />
          <figcaption>Photo: xCellence Media Team</figcaption>
        </figure>
        <article className="article-content">
          {article.sections.map((section) => (
            <div key={section.title} className="article-section">
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
            </div>
          ))}
          <p className="article-closing">{article.closing}</p>
          <Link to="/blog" className="article-back inline-back">
            ← Return to all posts
          </Link>
        </article>
      </section>
    </div>
  );
};

export default BlogArticle;



import './Blog.css';

type BlogPost = {
  title: string;
  date: string;
  author: string;
  summary: string;
  readTime: string;
  tag: string;
};

const posts: BlogPost[] = [
  {
    title: 'Building a Reliable Underwater Intake for INTO THE DEEP',
    date: 'October 18, 2025',
    author: 'Aruzhan — Mechanical Lead',
    summary:
      'A deep dive into our dual-roller intake prototype, from CAD iterations and material selection to water-resistant sealing tests.',
    readTime: '6 min read',
    tag: 'Engineering',
  },
  {
    title: 'Training Autonomous Neural Networks with FTC Dashboard',
    date: 'September 29, 2025',
    author: 'Arman — Software Captain',
    summary:
      'How we leveraged TensorFlow object detection, AprilTag localization, and Road Runner trajectories to score reliably in auto.',
    readTime: '8 min read',
    tag: 'Programming',
  },
  {
    title: 'Inside Our Community STEM Workshops',
    date: 'September 10, 2025',
    author: 'Ainur — Outreach Lead',
    summary:
      'Highlights from the 200+ students we mentored this fall, including lesson plans, feedback, and future collaboration goals.',
    readTime: '5 min read',
    tag: 'Outreach',
  },
  {
    title: 'Season Kickoff Strategy: From Whiteboard to Drive Practice',
    date: 'August 28, 2025',
    author: 'Dias — Team Captain',
    summary:
      'Our process for breaking down the game manual, defining scoring priorities, and translating strategy into subsystem milestones.',
    readTime: '7 min read',
    tag: 'Strategy',
  },
];

const Blog = () => {
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
            {posts.map((post) => (
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
                <button type="button" className="blog-cta">Read story</button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;




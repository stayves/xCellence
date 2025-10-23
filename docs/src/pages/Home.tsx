import { useState } from 'react';
import './Home.css';

const Home = () => {
  // Sample news data - can be populated dynamically
  const [newsItems] = useState([
    {
      id: 1,
      title: "World Championship Qualification",
      date: "March 15, 2025",
      image: "/news-1.jpg",
      description: "xCellence team qualifies for the FIRST Tech Challenge World Championship in Houston!",
      category: "Achievement"
    },
    {
      id: 2,
      title: "New Robot Reveal: 'Phoenix'",
      date: "February 28, 2025",
      image: "/news-2.jpg",
      description: "Meet Phoenix, our latest robot designed for the INTO THE DEEP season with innovative mechanisms.",
      category: "Robot"
    },
    {
      id: 3,
      title: "Regional Competition Victory",
      date: "February 10, 2025",
      image: "/news-3.jpg",
      description: "Team secures first place at the Regional Championship with a perfect autonomous score.",
      category: "Competition"
    },
    {
      id: 4,
      title: "Community Outreach: STEM Workshop",
      date: "January 20, 2025",
      image: "/news-4.jpg",
      description: "Hosted a successful robotics workshop for 50+ elementary school students in our community.",
      category: "Outreach"
    }
  ]);

  // Sample sponsors data
  const sponsors = [
    { name: "Sponsor 1", logo: "/sponsor-1.png", tier: "platinum" },
    { name: "Sponsor 2", logo: "/sponsor-2.png", tier: "platinum" },
    { name: "Sponsor 3", logo: "/sponsor-3.png", tier: "gold" },
    { name: "Sponsor 4", logo: "/sponsor-4.png", tier: "gold" },
    { name: "Sponsor 5", logo: "/sponsor-5.png", tier: "silver" },
    { name: "Sponsor 6", logo: "/sponsor-6.png", tier: "silver" },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-image-container">
          <img 
            src="/team-photo.jpg" 
            alt="xCellence FTC Team" 
            className="hero-image"
          />
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">x<span className="orange-text">Cellence</span></span>
              <span className="hero-title-sub">FTC Team</span>
            </h1>
            <p className="hero-description">
              Engineering the Future, One Innovation at a Time
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10+</span>
                <span className="stat-label">Years Active</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Competitions</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Awards</span>
              </div>
            </div>
            <div className="hero-cta">
              <button className="cta-primary" onClick={() => window.location.href = '/robot'}>
                See Our Robot
              </button>
              <button className="cta-secondary" onClick={() => window.location.href = '/team'}>
                Meet the Team
              </button>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission">
        <div className="mission-container">
          <div className="section-header">
            <span className="section-tag">Our Purpose</span>
            <h2 className="section-title">Mission Statement</h2>
            <div className="title-underline"></div>
          </div>
          
          <div className="mission-content">
            <div className="mission-main">
              <h3 className="mission-subtitle">FIRST Tech Challenge Mission</h3>
              <p className="mission-text">
                The <strong>FIRST</strong> Tech Challenge (FTC) is a robotics competition for students in grades 7-12
                to compete head-to-head, using a sports model. Teams design, build, and program robots to 
                compete in an alliance format against other teams. The robot kit is reusable from year-to-year
                and is programmed using a variety of languages.
              </p>
              <p className="mission-text">
                <strong>FIRST</strong> stands for <em>For Inspiration and Recognition of Science and Technology</em>.
                The mission is to inspire young people to be science and technology leaders and innovators, by 
                engaging them in exciting mentor-based programs that build science, engineering, and technology 
                skills, that inspire innovation, and that foster well-rounded life capabilities including 
                self-confidence, communication, and leadership.
              </p>
            </div>

            <div className="mission-cards">
              <div className="mission-card">
                <div className="card-icon"></div>
                <h4>Inspire</h4>
                <p>Inspiring the next generation to pursue careers in STEM through hands-on robotics experience.</p>
              </div>
              
              <div className="mission-card">
                <div className="card-icon"></div>
                <h4>Collaborate</h4>
                <p>Building strong partnerships with mentors, sponsors, and our community to achieve excellence.</p>
              </div>
              
              <div className="mission-card">
                <div className="card-icon"></div>
                <h4>Innovate</h4>
                <p>Pushing boundaries with creative solutions and cutting-edge technology in every challenge.</p>
              </div>
              
              <div className="mission-card">
                <div className="card-icon"></div>
                <h4>Excel</h4>
                <p>Striving for excellence in competition, gracious professionalism, and community impact.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news">
        <div className="news-container">
          <div className="section-header">
            <span className="section-tag">Latest Updates</span>
            <h2 className="section-title">Team News & Achievements</h2>
            <div className="title-underline"></div>
          </div>

          <div className="news-grid">
            {newsItems.map((news) => (
              <article key={news.id} className="news-card">
                <div className="news-image-wrapper">
                  <img src={news.image} alt={news.title} className="news-image" />
                  <span className="news-category">{news.category}</span>
                </div>
                <div className="news-content">
                  <time className="news-date">{news.date}</time>
                  <h3 className="news-title">{news.title}</h3>
                  <p className="news-description">{news.description}</p>
                  <a href="#" className="news-link">
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="news-cta">
            <button className="view-all-btn">View All News</button>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="sponsors">
        <div className="sponsors-container">
          <div className="section-header">
            <span className="section-tag">Our Partners</span>
            <h2 className="section-title">Sponsors & Supporters</h2>
            <div className="title-underline"></div>
            <p className="sponsors-intro">
              We are grateful to our sponsors who make our journey possible.
              Together, we're building the future of robotics and STEM education.
            </p>
          </div>

          <div className="sponsors-grid">
            {sponsors.map((sponsor, index) => (
              <div key={index} className={`sponsor-card ${sponsor.tier}`}>
                <div className="sponsor-logo-wrapper">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    className="sponsor-logo"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.style.display = 'none';
                      const placeholder = img.nextElementSibling as HTMLElement | null;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                  <div className="sponsor-placeholder" style={{ display: 'none' }}>
                    {sponsor.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sponsors-cta">
            <div className="sponsors-cta-content">
              <h3>Become a Sponsor</h3>
              <p>Support our team and help us inspire the next generation of innovators.</p>
              <button className="sponsor-btn" onClick={() => window.location.href = '/contact'}>
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // Real team news and achievements
  const [newsItems] = useState([
    {
      id: 1,
      title: "Design Award Winner CA 2025",
      date: "March 2025",
      image: "/xCellence/news-1.jpg",
      description: "xCellence wins Design Award at Central Asia Championship, showcasing excellence in engineering documentation and robot design.",
      category: "Achievement"
    },
    {
      id: 2,
      title: "WRO Republican Training Camp",
      date: "August 3, 2024",
      image: "/xCellence/news-2.jpg",
      description: "Successfully organized week-long training camp with 45 participants from all NIS schools, featuring conferences with robotics mentors and NU professors.",
      category: "Outreach"
    },
    {
      id: 3,
      title: "Temirqazyq Forum Success",
      date: "October 2, 2024",
      image: "/xCellence/news-3.jpg",
      description: "35 participants attended our STEM startups forum featuring leading specialists Karakoz Tasbolatova, Nurdaulet Bazylbekov, and Arlan Rakhmetzhanov.",
      category: "Forum"
    },
    {
      id: 4,
      title: "Social Media Milestone",
      date: "2024-2025",
      image: "/xCellence/news-4.jpg",
      description: "Reached 800+ followers on Instagram with 150,000 views and 6,000 accounts reached in last 3 months. Managing KZ Robotics Telegram with 250+ members.",
      category: "Media"
    }
  ]);

  // Sample sponsors data
  const sponsors = [
    { name: "Sponsor 1", logo: "/xCellence/sponsor-1.png", tier: "platinum" },
    { name: "Sponsor 2", logo: "/xCellence/sponsor-2.png", tier: "platinum" },
    { name: "Sponsor 3", logo: "/xCellence/sponsor-3.png", tier: "gold" },
    { name: "Sponsor 4", logo: "/xCellence/sponsor-4.png", tier: "gold" },
    { name: "Sponsor 5", logo: "/xCellence/sponsor-5.png", tier: "silver" },
    { name: "Sponsor 6", logo: "/xCellence/sponsor-6.png", tier: "silver" },
  ];

  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-image-container">
          <img 
            src="/xCellence/team.jpg" 
            alt="xCellence FTC Team" 
            className="hero-image"
          />
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">x<span className="orange-text">Cellence</span></span>
              <span className="hero-title-sub">Robotics Team</span>
            </h1>
            <p className="hero-description">
              Engineering the Future, One Innovation at a Time!
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">190</span>
                <span className="stat-label">People Engaged Offline</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">29,000</span>
                <span className="stat-label">People Engaged Online</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">105+</span>
                <span className="stat-label">Event Hours</span>
              </div>
            </div>
            <div className="hero-cta">
              <button className="cta-primary" onClick={() => navigate('/robot')}>
                See Our Robot
              </button>
              <button className="cta-secondary" onClick={() => navigate('/team')}>
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
                Since 2022, xCellence has been promoting robotics and STEAM in Kazakhstan, developing innovations, 
                training new generation of engineers and uniting communities. We are now in our 4th generation of 
                students, with <strong>Design Award Winner CA 2025</strong>, <strong>Think Award India 2023</strong>, 
                and <strong>Social Media Award CA 2024</strong>.
              </p>
              <p className="mission-text">
                Our mission is to create technologies, share knowledge and inspire youth, forming a culture of 
                engineering creativity and representing Kazakhstan on the world stage. We strive to acquire new 
                knowledge and share it, spreading robotics and STEAM among youth, uniting communities and improving 
                communication.
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

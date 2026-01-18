import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { withBase } from '../utils/asset.ts';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const teamSlides = useMemo(
    () =>
      ['xCellenceTeam9.jpg', 'xCellenceTeam2.jpg', 'xCellenceTeam4.JPG', 'xCellenceTeam1.jpg', 'xCellenceTeam6.jpg','xCellenceTeam5.jpg','xCellenceTeam7.jpg','xCellenceTeam8.jpg'].map((src) =>
        withBase(src)
      ),
    []
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (teamSlides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [teamSlides.length]);

  // Real team news and achievements
  const newsItems = (t('home.news.items', { returnObjects: true }) as {
    id: number;
    title: string;
    date: string;
    image: string;
    description: string;
    category: string;
  }[]).map((item) => ({ ...item, image: withBase(item.image) }));

  // Sample sponsors data
  const sponsors = (t('home.sponsors.items', { returnObjects: true }) as {
    name: string;
    logo: string;
    tier: string;
  }[]).map((item) => ({ ...item, logo: withBase(item.logo) }));

  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-image-container">
          <img
            key={teamSlides[currentSlide]}
            src={teamSlides[currentSlide]}
            alt={`xCellence team highlight ${currentSlide + 1}`}
            className="hero-image"
          />
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">x<span className="orange-text">Cellence</span></span>
              <span className="hero-title-sub">{t('home.hero.subtitle')}</span>
            </h1>
            <p className="hero-description">
              {t('home.hero.description')}
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">190</span>
                <span className="stat-label">{t('home.hero.stats.offline')}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">29,000</span>
                <span className="stat-label">{t('home.hero.stats.online')}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">105+</span>
                <span className="stat-label">{t('home.hero.stats.hours')}</span>
              </div>
            </div>
            <div className="hero-cta">
              {/* <button className="cta-primary" onClick={() => navigate('/trainer')}>
                Try Driver Trainer
              </button> */}
              <button className="cta-secondary" onClick={() => navigate('/team')}>
                {t('home.hero.cta')}
              </button>
            </div>
          </div>
        </div>
        {teamSlides.length > 1 && (
          <div
            className="hero-carousel-dots"
            role="tablist"
            aria-label={t('home.hero.carouselLabel')}
          >
            {teamSlides.map((_, index) => (
              <button
                key={teamSlides[index]}
                type="button"
                className={`hero-dot ${currentSlide === index ? 'active' : ''}`}
                aria-label={t('home.hero.showPhoto', { index: index + 1 })}
                aria-pressed={currentSlide === index}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        )}
        <div className="hero-scroll-indicator">
          <span>{t('home.hero.scroll')}</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Mission Section */}
      {/* <section className="mission">
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
      </section> */}

      {/* News Section */}
      <section className="news">
        <div className="news-container">
          <div className="section-header">
            <span className="section-tag">{t('home.news.tag')}</span>
            <h2 className="section-title">{t('home.news.title')}</h2>
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
                  <button className="news-link" onClick={() => navigate('/blog')}>
                    {t('common.cta.readMore')}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="news-cta">
            <button className="view-all-btn" onClick={() => navigate('/blog')}>
              {t('common.cta.viewAllNews')}
            </button>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="sponsors">
        <div className="sponsors-container">
          <div className="section-header">
            <span className="section-tag">{t('home.sponsors.tag')}</span>
            <h2 className="section-title">{t('home.sponsors.title')}</h2>
            <div className="title-underline"></div>
            <p className="sponsors-intro">
              {t('home.sponsors.intro')}
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
              <h3>{t('home.sponsors.cta.title')}</h3>
              <p>{t('home.sponsors.cta.description')}</p>
              <button className="sponsor-btn" onClick={() => navigate('/contact')}>
                {t('home.sponsors.cta.button')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

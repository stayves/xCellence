import { useTranslation } from 'react-i18next';
import './Robot.css';

const Robot = () => {
  const { t } = useTranslation();
  const robotSpecs = t('robot.specs.items', { returnObjects: true }) as {
    label: string;
    value: string;
    icon: string;
  }[];
  const features = t('robot.features.items', { returnObjects: true }) as {
    title: string;
    description: string;
    icon: string;
  }[];

  return (
    <div className="robot-page">
      <section className="robot-hero">
        <div className="robot-hero-content">
          <h1>{t('robot.hero.title')}</h1>
          <p>{t('robot.hero.subtitle')}</p>
        </div>
      </section>

      <section className="robot-showcase">
        <div className="robot-container">
          <div className="robot-image-section">
            <div className="robot-image-wrapper">
              <img src="/xCellence/robot_main.jpg" alt="Phoenix Robot" className="robot-main-image" />
              <div className="robot-name-tag">
                <span className="robot-name">PHOENIX</span>
                <span className="robot-season">2024-2025</span>
              </div>
            </div>
          </div>

          <div className="robot-info-section">
            <div className="section-header">
              <span className="section-tag">{t('robot.specs.tag')}</span>
              <h2 className="section-title">{t('robot.specs.title')}</h2>
            </div>

            <div className="specs-grid">
              {robotSpecs.map((spec, index) => (
                <div key={index} className="spec-card">
                  <span className="spec-icon">{spec.icon}</span>
                  <div className="spec-content">
                    <span className="spec-label">{spec.label}</span>
                    <span className="spec-value">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="robot-features">
        <div className="features-container">
          <div className="section-header">
            <span className="section-tag">{t('robot.features.tag')}</span>
            <h2 className="section-title">{t('robot.features.title')}</h2>
            <div className="title-underline"></div>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <img src={feature.icon} alt={feature.title} className="feature-icon" />
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="robot-gallery">
        <div className="gallery-container">
          <div className="section-header">
            <span className="section-tag">{t('robot.gallery.tag')}</span>
            <h2 className="section-title">{t('robot.gallery.title')}</h2>
            <div className="title-underline"></div>
          </div>

          <div className="gallery-grid">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="gallery-item">
                <img src={`/xCellence/robot_sub${num}.jpg`} alt={`Robot view ${num}`} />
                <div className="gallery-overlay">
                  <span>{t('robot.gallery.viewDetails')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Robot;


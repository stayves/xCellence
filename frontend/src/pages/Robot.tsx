import './Robot.css';

const Robot = () => {
  const robotSpecs = [
    { label: "Weight", value: "40 lbs", icon: "⚖️" },
    { label: "Dimensions", value: "18\" x 18\" x 18\"", icon: "📏" },
    { label: "Drive System", value: "Mecanum Wheels", icon: "⚙️" },
    { label: "Power", value: "12V Battery", icon: "🔋" },
    { label: "Programming", value: "Java", icon: "💻" },
    { label: "Build Time", value: "3 Months", icon: "⏱️" },
  ];

  const features = [
    {
      title: "Autonomous Navigation",
      description: "Advanced computer vision and sensor fusion for precise autonomous movement and object detection.",
      icon: "/xCellence/autonomous.svg"
    },
    {
      title: "Custom Manipulator",
      description: "Innovative mechanism designed for efficient game piece manipulation with 360° rotation capability.",
      icon: "/xCellence/custom.svg"
    },
    {
      title: "Modular Design",
      description: "Quick-swap components allow for rapid strategy changes and field repairs during competitions.",
      icon: "/xCellence/modular.svg"
    },
    {
      title: "Optimized Drive Train",
      description: "Mecanum wheel configuration provides omnidirectional movement for maximum maneuverability.",
      icon: "/xCellence/drive.svg"
    }
  ];

  return (
    <div className="robot-page">
      <section className="robot-hero">
        <div className="robot-hero-content">
          <h1>Our Robot: Phoenix</h1>
          <p>DECODE SEASON 2025-2026</p>
        </div>
      </section>

      <section className="robot-showcase">
        <div className="robot-container">
          <div className="robot-image-section">
            <div className="robot-image-wrapper">
              <img src="/xCellence/robot-main.jpg" alt="Phoenix Robot" className="robot-main-image" />
              <div className="robot-name-tag">
                <span className="robot-name">PHOENIX</span>
                <span className="robot-season">2024-2025</span>
              </div>
            </div>
          </div>

          <div className="robot-info-section">
            <div className="section-header">
              <span className="section-tag">Specifications</span>
              <h2 className="section-title">Technical Details</h2>
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
            <span className="section-tag">Innovation</span>
            <h2 className="section-title">Key Features</h2>
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
            <span className="section-tag">Gallery</span>
            <h2 className="section-title">Robot Gallery</h2>
            <div className="title-underline"></div>
          </div>

          <div className="gallery-grid">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="gallery-item">
                <img src={`/xCellence/robot-gallery-${num}.jpg`} alt={`Robot view ${num}`} />
                <div className="gallery-overlay">
                  <span>View Details</span>
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


import './Team.css';

const Team = () => {
  const teamMembers = [
    { name: "Team Member 1", role: "Team Captain", image: "/team-member-1.jpg" },
    { name: "Team Member 2", role: "Lead Programmer", image: "/team-member-2.jpg" },
    { name: "Team Member 3", role: "Mechanical Engineer", image: "/team-member-3.jpg" },
    { name: "Team Member 4", role: "Electrical Engineer", image: "/team-member-4.jpg" },
    { name: "Team Member 5", role: "CAD Designer", image: "/team-member-5.jpg" },
    { name: "Team Member 6", role: "Outreach Lead", image: "/team-member-6.jpg" },
  ];

  return (
    <div className="team-page">
      <section className="team-hero">
        <div className="team-hero-content">
          <h1>Meet Our Team</h1>
          <p>The brilliant minds behind xCellence</p>
        </div>
      </section>

      <section className="team-content">
        <div className="team-container">
          <div className="section-header">
            <span className="section-tag">Our People</span>
            <h2 className="section-title">Team Members</h2>
            <div className="title-underline"></div>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member-card">
                <div className="member-image-wrapper">
                  <img src={member.image} alt={member.name} className="member-image" />
                  <div className="member-overlay">
                    <span className="member-role">{member.role}</span>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;


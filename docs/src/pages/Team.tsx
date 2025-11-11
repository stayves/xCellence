import './Team.css';

type Member = {
  name: string;
  role: string;
  image: string;
  bio: string;
};

const currentMembers: Member[] = [
  {
    name: 'Dias Nurpeissov',
    role: 'Team Captain & Drive Coach',
    image: 'https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=600&q=80',
    bio: 'Coordinates alliance strategy, on-field performance, and cross-subsystem integration.',
  },
  {
    name: 'Arman Zhetpisbay',
    role: 'Programming Lead',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    bio: 'Architects autonomous routines, controls, and telemetry dashboards for our robot.',
  },
  {
    name: 'Aruzhan Shalabayeva',
    role: 'Mechanical Lead',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80',
    bio: 'Oversees CAD, prototyping, and reliability testing of all scoring mechanisms.',
  },
  {
    name: 'Miras Altynbek',
    role: 'Electrical & Controls',
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80',
    bio: 'Maintains control hub wiring, sensors, and power distribution best practices.',
  },
  {
    name: 'Dana Yusupova',
    role: 'Outreach Director',
    image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=600&q=80',
    bio: 'Leads community workshops, sponsor relations, and storytelling for our program.',
  },
  {
    name: 'Sanzhar Kapar',
    role: 'CAD Specialist',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    bio: 'Focuses on modular assemblies, manufacturing drawings, and version control.',
  },
];

const alumniMembers: Member[] = [
  {
    name: 'Aigerim Kassymova',
    role: 'Class of 2022 · Mechanical Lead',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
    bio: 'Currently researching haptics at Stanford University while mentoring local FTC teams.',
  },
  {
    name: 'Nurlan Ospan',
    role: 'Class of 2021 · Programming Captain',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    bio: 'Software engineer at a robotics startup building perception systems for autonomous drones.',
  },
  {
    name: 'Dinara Makhmud',
    role: 'Class of 2020 · Outreach Lead',
    image: 'https://images.unsplash.com/photo-1544723795-432537ff1fe2?auto=format&fit=crop&w=600&q=80',
    bio: 'Coordinates STEM access programs with UNICEF across Central Asia, focusing on rural schools.',
  },
  {
    name: 'Serik Moldakhmet',
    role: 'Class of 2019 · Drive Coach',
    image: 'https://images.unsplash.com/photo-1527254059243-099aa62cc8a1?auto=format&fit=crop&w=600&q=80',
    bio: 'Pursuing a master’s degree in robotics at ETH Zürich, specializing in motion control.',
  },
];

const Team = () => {
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
            <h2 className="section-title">Current Team Members</h2>
            <div className="title-underline"></div>
          </div>

          <div className="team-grid">
            {currentMembers.map((member) => (
              <div key={member.name} className="team-member-card">
                <div className="member-image-wrapper">
                  <img src={member.image} alt={member.name} className="member-image" />
                  <div className="member-overlay">
                    <span className="member-role">{member.role}</span>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="team-content alumni-section">
        <div className="team-container">
          <div className="section-header">
            <span className="section-tag">Alumni Network</span>
            <h2 className="section-title">xCellence Alumni</h2>
            <div className="title-underline"></div>
            <p className="alumni-intro">
              Our alumni continue to engineer, research, and inspire across universities, startups, and global
              organizations. We are proud to celebrate the impact they ignite beyond the field.
            </p>
          </div>

          <div className="team-grid alumni-grid">
            {alumniMembers.map((alumni) => (
              <div key={alumni.name} className="team-member-card">
                <div className="member-image-wrapper">
                  <img src={alumni.image} alt={alumni.name} className="member-image" />
                  <div className="member-overlay">
                    <span className="member-role">{alumni.role}</span>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{alumni.name}</h3>
                  <p>{alumni.bio}</p>
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


import './Team.css';

type Member = {
  name: string;
  role: string;
  image: string;
  bio: string;
};

const mentors: Member[] = [
  {
    name: 'Vladimir Ussoltcev',
    role: 'Primary Mentor',
    image: '/xCellence/vladimir.jpg',
    bio: 'Primary mentor with extensive hands-on engineering and robotics experience.',
  },
  {
    name: 'Madi Mukash',
    role: 'Primary Mentor',
    image: '/xCellence/madi.jpg',
    bio: 'Primary mentor with extensive hands-on engineering and robotics experience.',
  },
  {
    name: 'Daniil Filimonov',
    role: 'Research Assistant at ISSAI',
    image: '/xCellence/daniil.jpg',
    bio: 'Provides deep insights into AI, automation, and modern computational methods.',
  },
  {
    name: 'Azamat Eshmukhambetov',
    role: 'Professor at Nazarbayev University',
    image: '/xCellence/azamat.jpg',
    bio: 'Offers expertise in advanced engineering principles and research-based problem solving.',
  },
  {
    name: 'Azat Slyam',
    role: 'Technology Specialist',
    image: '/xCellence/azat.jpg',
    bio: 'Contributing valuable knowledge in technological development and innovation.',
  },
  {
    name: 'Zhanat Kapassov',
    role: 'NU SEDS Professor',
    image: '/xCellence/zhanat.jpg',
    bio: 'Expert in robotics and control systems, supporting technical growth and strategic engineering decisions.',
  },
];

const currentMembers: Member[] = [
  {
    name: 'Zhanarys Kaparov',
    role: 'Captain & Driver',
    image: '/xCellence/zhanarys.jpg',
    bio: 'Captain and driver of the team.',
  },
  {
    name: 'Zhanibek Danabek',
    role: 'CAD Specialist',
    image: '/xCellence/zhanibek.jpg',
    bio: 'CAD specialist and designer of the team.',
  },
  {
    name: 'Arnur Togambayev',
    role: 'Programmer ',
    image: '/xCellence/arnur1.jpg',
    bio: 'Programmer of the team.',
  },
  {
    name: 'Asylzhan Sailau',
    role: 'Inspire',
    image: '/xCellence/asylzhan1.jpg',
    bio: 'Inspire of the team.',
  },
  {
    name: 'Aizere Askarova',
    role: 'Inspire',
    image: '/xCellence/aizere1.jpg',
    bio: 'Inspire of the team.',
  },
  {
    name: 'Semyon Chistyakov',
    role: 'Inspire',
    image: '/xCellence/semyon.jpg',
    bio: 'Inspire of the team.',
  },
  {
    name: 'Togzhan Kabdolda',
    role: 'Inspire',
    image: '/xCellence/togzhan.jpg',
    bio: 'Inspire of the team.',
  },
  {
    name: 'Alzere Chindaliyeva',
    role: 'Inspire',
    image: '/xCellence/alzere1.jpg',
    bio: 'Inspire of the team.',
  },
  {
    name: 'Zhanaiym Tashkenbay',
    role: 'Inspire',
    image: '/xCellence/zhanaiym.jpg',
    bio: 'Inspire of the team.',
  },
  {
    name: 'Dastan Musrepov',
    role: 'CAD Specialist',
    image: '/xCellence/dastan1.jpg',
    bio: 'CAD specialist of the team.',
  },
  {
    name: 'Sayan Orynbek',
    role: 'Builder',
    image: '/xCellence/sayan.jpg',
    bio: 'Builder of the team.',
  },
  {
    name: 'Najmudin Adikhanov ',
    role: 'Builder',
    image: '/xCellence/naj.jpg',
    bio: 'Builder of the team.',
  },
  {
    name: 'Targyn Faizulla',
    role: 'CAD Specialist',
    image: '/xCellence/targyn.jpg',
    bio: 'CAD specialist of the team.',
  },
  {
    name: 'Vagiz Dissembayev',
    role: 'Builder',
    image: '/xCellence/vagiz1.jpg',
    bio: 'Builder of the team.',
  },
  {
    name: 'Ali Umargaliyev',
    role: 'Driver & Builder',
    image: '/xCellence/ali1.jpg',
    bio: 'Driver of the team.',
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
            <span className="section-tag">Mentorship</span>
            <h2 className="section-title">Mentors & Advisors</h2>
            <div className="title-underline"></div>
            <p className="alumni-intro">
              Our team is guided by highly qualified mentors, researchers, and professors who provide expertise 
              in engineering, AI, automation, and strategic problem solving.
            </p>
          </div>

          <div className="team-grid">
            {mentors.map((mentor) => (
              <div key={mentor.name} className="team-member-card">
                <div className="member-image-wrapper">
                  <img src={mentor.image} alt={mentor.name} className="member-image" />
                  <div className="member-overlay">
                    <span className="member-role">{mentor.role}</span>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{mentor.name}</h3>
                  <p>{mentor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="team-content">
        <div className="team-container">
          <div className="section-header">
            <span className="section-tag">Our People</span>
            <h2 className="section-title">Current Team Members</h2>
            <div className="title-underline"></div>
            <p className="alumni-intro">
              Since 2022, four generations of students have been part of xCellence. We continuously cultivate 
              new leaders, engineers, and mentors who explore all areas of robotics.
            </p>
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
            <span className="section-tag">Team Support</span>
            <h2 className="section-title">Teams We've Mentored & Assisted</h2>
            <div className="title-underline"></div>
            <p className="alumni-intro">
              We care about the sustainability of our school's robotics and Kazakhstan's STEAM ecosystem. 
              We have started and mentored 1 new FTC team and 2 new FLL teams, and assisted 16 teams total.
            </p>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Started & Mentored</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {['xCeption', 'XLNC Nova', 'XLNC Feral', 'SlapSeals', 'DostyqBot', 'ThanosNIS'].map(team => (
                  <div key={team} style={{ padding: '1rem', background: 'rgba(255,107,0,0.1)', borderRadius: '8px', textAlign: 'center' }}>
                    <strong>{team}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>Assisted</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {['Celestial (FTC)', 'BILMS (FLL)', 'Akita', 'Sakura', 'KAP', 'Meow-Meow', 'JelToqSun', 'PID', 'BilOrda', 'Venom', 'Reckless'].map(team => (
                  <div key={team} style={{ padding: '0.75rem', background: 'rgba(0,150,255,0.1)', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>
                    {team}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;


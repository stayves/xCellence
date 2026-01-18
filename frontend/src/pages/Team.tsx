import { useTranslation } from 'react-i18next';
import { withBase } from '../utils/asset.ts';
import './Team.css';

type Member = {
  name: string;
  role: string;
  image: string;
  bio: string;
};

const Team = () => {
  const { t } = useTranslation();
  const mentors = (t('team.mentors.people', { returnObjects: true }) as Member[]).map((mentor) => ({
    ...mentor,
    image: withBase(mentor.image),
  }));
  const currentMembers = (t('team.members.people', { returnObjects: true }) as Member[]).map((member) => ({
    ...member,
    image: withBase(member.image),
  }));
  const xlncFamilyTeams = t('team.support.families.xlnc.teams', { returnObjects: true }) as string[];
  const startedTeams = t('team.support.families.started.teams', { returnObjects: true }) as string[];
  const assistedTeams = t('team.support.families.assisted.teams', { returnObjects: true }) as string[];

  return (
    <div className="team-page">
      <section className="team-hero">
        <div className="team-hero-content">
          <h1>{t('team.hero.title')}</h1>
          <p>{t('team.hero.subtitle')}</p>
        </div>
      </section>

      <section className="team-content">
        <div className="team-container">
          <div className="section-header">
            <span className="section-tag">{t('team.mentors.tag')}</span>
            <h2 className="section-title">{t('team.mentors.title')}</h2>
            <div className="title-underline"></div>
            <p className="alumni-intro">
              {t('team.mentors.intro')}
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
            <span className="section-tag">{t('team.members.tag')}</span>
            <h2 className="section-title">{t('team.members.title')}</h2>
            <div className="title-underline"></div>
            <p className="alumni-intro">
              {t('team.members.intro')}
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
            <span className="section-tag">{t('team.support.tag')}</span>
            <h2 className="section-title">{t('team.support.title')}</h2>
            <div className="title-underline"></div>
            <p className="alumni-intro">
              {t('team.support.intro')}
            </p>
          </div>
          <div style={{maxWidth: '900px', margin: '0 auto', padding: '2rem'   }}>
          <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                {t('team.support.families.xlnc.title')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {xlncFamilyTeams.map((team) => (
                  <div key={team} style={{ padding: '1rem', background: 'rgba(255,107,0,0.1)', borderRadius: '8px', textAlign: 'center' }}>
                    <strong>{team}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                {t('team.support.families.started.title')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {startedTeams.map((team) => (
                  <div key={team} style={{ padding: '1rem', background: 'rgba(255,107,0,0.1)', borderRadius: '8px', textAlign: 'center' }}>
                    <strong>{team}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
                {t('team.support.families.assisted.title')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {assistedTeams.map((team) => (
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


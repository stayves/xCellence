import { useTranslation } from 'react-i18next';
import './Resources.css';

type ResourceItem = {
  name: string;
  description: string;
  href: string;
  type: 'guide' | 'video' | 'tool' | 'template';
};

type ResourceSection = {
  title: string;
  summary: string;
  items: ResourceItem[];
};

const Resources = () => {
  const { t } = useTranslation();
  const resourceSections = t('resources.sections', { returnObjects: true }) as ResourceSection[];

  return (
    <div className="resources-page">
      <section className="resources-hero">
        <div className="resources-hero-content">
          <span className="section-tag">{t('resources.hero.tag')}</span>
          <h1>{t('resources.hero.title')}</h1>
          <p>
            {t('resources.hero.description')}
          </p>
        </div>
      </section>

      <section className="resources-section">
        <div className="resources-container">
          {resourceSections.map((section) => (
            <article key={section.title} className="resource-block">
              <header>
                <h2>{section.title}</h2>
                <p>{section.summary}</p>
              </header>

              <ul className="resource-list">
                {section.items.map((item) => (
                  <li key={item.name} className="resource-item">
                    <div className="resource-item-meta">
                      <span className={`resource-type ${item.type}`}>{t(`resources.types.${item.type}`)}</span>
                      <h3>{item.name}</h3>
                    </div>
                    <p>{item.description}</p>
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {t('resources.open')}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Resources;




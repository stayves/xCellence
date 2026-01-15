import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    setIsSending(true);

    const serviceId = 'service_oy4sppb'; // provided
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_isn78dj';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!templateId || !publicKey) {
      setStatusMessage(t('contact.form.status.missingConfig'));
      setIsSending(false);
      return;
    }

    const templateParams = {
      name: formData.name,
      message: `${formData.message}\n\n${t('contact.email.subjectLabel')}: ${formData.subject || t('contact.email.notProvided')}\n${t('contact.email.emailLabel')}: ${formData.email}`,
      time: new Date().toLocaleString(),
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams,
        }),
      });

      if (!response.ok) {
        throw new Error(`EmailJS request failed with status ${response.status}`);
      }

      setStatusMessage(t('contact.form.status.success'));
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatusMessage(t('contact.form.status.error'));
      console.error('EmailJS error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const contactInfo = t('contact.info.items', { returnObjects: true }) as {
    icon: string;
    title: string;
    detail: string;
    link: string;
  }[];

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>{t('contact.hero.title')}</h1>
          <p>{t('contact.hero.subtitle')}</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-container">
          <div className="contact-info-section">
            <div className="section-header">
              <span className="section-tag">{t('contact.info.tag')}</span>
              <h2 className="section-title">{t('contact.info.title')}</h2>
            </div>

            <p className="contact-intro">
              {t('contact.info.intro')}
            </p>

            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.link}
                  className="contact-info-card"
                  target={info.link.startsWith('http') ? '_blank' : undefined}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <div className="info-icon">{info.icon}</div>
                  <div className="info-content">
                    <h3>{info.title}</h3>
                    <p>{info.detail}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-form-section">
            <div className="section-header">
              <span className="section-tag">{t('contact.form.tag')}</span>
              <h2 className="section-title">{t('contact.form.title')}</h2>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{t('contact.form.fields.name.label')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.form.fields.name.placeholder')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('contact.form.fields.email.label')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.form.fields.email.placeholder')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">{t('contact.form.fields.subject.label')}</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('contact.form.fields.subject.options.placeholder')}</option>
                  <option value="sponsorship">{t('contact.form.fields.subject.options.sponsorship')}</option>
                  <option value="collaboration">{t('contact.form.fields.subject.options.collaboration')}</option>
                  <option value="question">{t('contact.form.fields.subject.options.question')}</option>
                  <option value="outreach">{t('contact.form.fields.subject.options.outreach')}</option>
                  <option value="other">{t('contact.form.fields.subject.options.other')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">{t('contact.form.fields.message.label')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder={t('contact.form.fields.message.placeholder')}
                />
              </div>

              <button type="submit" className="submit-btn">
              {isSending ? t('contact.form.submit.sending') : t('contact.form.submit.idle')}
              </button>

            {statusMessage && <p className="form-status">{statusMessage}</p>}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

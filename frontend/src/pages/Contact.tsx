import { useState } from 'react';
import './Contact.css';

const Contact = () => {
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
      setStatusMessage('Email service is not configured. Please try again later.');
      setIsSending(false);
      return;
    }

    const templateParams = {
      name: formData.name,
      message: `${formData.message}\n\nSubject: ${formData.subject || 'Not provided'}\nEmail: ${formData.email}`,
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

      setStatusMessage('Thank you! Your message has been sent.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatusMessage('Sorry, something went wrong. Please try again later.');
      console.error('EmailJS error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const contactInfo = [
    {
      icon: '',
      title: 'Email',
      detail: 'info@xcellenceftc.com',
      link: 'mailto:info@xcellenceftc.com'
    },
    {
      icon: '',
      title: 'Sponsorships',
      detail: 'sponsor@xcellenceftc.com',
      link: 'mailto:sponsor@xcellenceftc.com'
    },
    {
      icon: '',
      title: 'Social Media',
      detail: '@xcellenceftc',
      link: 'https://instagram.com/xcellenceftc'
    },
    {
      icon: '',
      title: 'Location',
      detail: 'Nazarbayev Intellectual School of Natural Sciences and Mathematics in the Nura district of Astana, Kazakhstan',
      link: '#'
    }
  ];

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-container">
          <div className="contact-info-section">
            <div className="section-header">
              <span className="section-tag">Connect With Us</span>
              <h2 className="section-title">Contact Information</h2>
            </div>

            <p className="contact-intro">
              Whether you're interested in sponsorship opportunities, have questions about our team,
              or want to collaborate on outreach events, we're here to help!
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
              <span className="section-tag">Send a Message</span>
              <h2 className="section-title">Contact Form</h2>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="sponsorship">Sponsorship Inquiry</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="question">General Question</option>
                  <option value="outreach">Outreach Event</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button type="submit" className="submit-btn">
              {isSending ? 'Sending...' : 'Send Message'}
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

import { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebookF, FaTiktok, FaInstagram, FaYoutube } from 'react-icons/fa';
import { supabase } from '../../integrations/supabase/client';
import { SEO } from '../../components/common/SEO';

export const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields.'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Save to Supabase contact_messages table
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || '',
          subject: formData.subject,
          message: formData.message,
          is_read: false,
          replied: false,
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for reaching out! We will get back to you within 24 hours.'
      });
      
      // Reset form on success
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error saving message:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or call us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us" 
        description="Get in touch with The Broadoak Schools. Have questions or want to schedule a visit? We're here to help."
        url="https://broadoakschools.com/contact"
      />
    <main className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Reach out with any questions or to schedule a visit.</p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            
            {/* Left Side - Contact Info */}
            <div className="contact-info-side">
              <div className="info-card">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3>Visit Us</h3>
                <p>Plot 4, the broadoak schools crescent, Federal Housing Estate,</p>
                <p>off MCC, Uratta Road</p>
                <p>Owerri, Imo State, Nigeria</p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FaPhoneAlt />
                </div>
                <h3>Call Us</h3>
                <p><strong>Admissions:</strong> +234 803 750 3627</p>
                <p><strong>Administration:</strong> +234 810 444 6168</p>
                <p><strong>Emergency:</strong> +234 812 345 6789</p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <h3>Email Us</h3>
                <p><strong>General Inquiries:</strong> info@broadoakschools.com</p>
                <p><strong>Admissions:</strong> admissions@broadoakschools.com</p>
                <p><strong>Support:</strong> support@broadoakschools.com</p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FaClock />
                </div>
                <h3>Office Hours</h3>
                <p><strong>Monday - Friday:</strong> 8:00 AM - 4:00 PM</p>
                <p><strong>Saturday:</strong> 9:00 AM - 12:00 PM</p>
                <p><strong>Sunday:</strong> Closed</p>
              </div>

              <div className="info-card social-info">
                <h3>Connect With Us</h3>
                <div className="social-icons-contact">
                  <a href="https://web.facebook.com/broadoakschools" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <FaFacebookF />
                  </a>
                  <a href="https://www.tiktok.com/@thebroadoakschoolsowerri?_r=1&_t=ZS-979O93jnMZR" target="_blank" rel="noopener noreferrer" aria-label="Tiktok">
                    <FaTiktok />
                  </a>
                  <a href="https://www.instagram.com/broadoakschools/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <FaInstagram />
                  </a>
                  <a href="https://www.youtube.com/@thebroadoakschools" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="contact-form-side">
              <div className="form-container">
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                
                {submitStatus && (
                  <div className={`form-status ${submitStatus.type}`}>
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+234 123 456 7890"
                      />
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
                        <option value="Admissions">Admissions Inquiry</option>
                        <option value="Academic">Academic Information</option>
                        <option value="Technical">Technical Support</option>
                        <option value="General">General Inquiry</option>
                        <option value="Complaint">Complaint / Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Please provide details about your inquiry..."
                    ></textarea>
                  </div>

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="map-section">
        <div className="container">
          <h2>Find Us Here</h2>
          <div className="map-container">
            <iframe
              title="The Broadoak Schools Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.123456789012!2d7.0497398!3d5.4891043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1042585281f39bc9%3A0x1c42bf2be498b699!2sBroad%20Oak%20Schools!5e0!3m2!1sen!2sng!4v1234567890123!5m2!1sen!2sng"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
      </>
  );
};
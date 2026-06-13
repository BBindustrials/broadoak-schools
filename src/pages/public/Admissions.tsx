/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdmissionInfo, type AdmissionInfo } from '../../services/admissionService';
import { FaDownload, FaCalendarAlt, FaCheckCircle, FaFileAlt, FaMoneyBillWave, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { SEO } from '../../components/common/SEO';

export const Admissions = () => {
  const [admissionInfo, setAdmissionInfo] = useState<AdmissionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdmissionInfo();
  }, []);

  const loadAdmissionInfo = async () => {
    try {
      setLoading(true);
      const data = await fetchAdmissionInfo();
      setAdmissionInfo(data);
    } catch (error) {
      console.error('Error loading admission info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadForm = () => {
    if (admissionInfo?.admission_form_url) {
      window.open(admissionInfo.admission_form_url, '_blank');
    }
  };

  const handleDownloadFees = () => {
    if (admissionInfo?.fees_document_url) {
      window.open(admissionInfo.fees_document_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading admission information...
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Admissions" 
        description="Learn about the admission process at The Broadoak Schools. Find out the requirements and steps to enroll your child."
        url="https://broadoakschools.com/admissions"
      />
    <main className="admissions-page">
      <section className="admissions-hero">
        <div className="container">
          <h1>{admissionInfo?.title || 'Admissions'}</h1>
          <p>{admissionInfo?.description || 'Begin your child\'s journey to excellence at The Broadoak Schools'}</p>
        </div>
      </section>

      <section className="steps-section">
        <div className="container">
          <h2>Admission Process</h2>
          <p className="section-subtitle">Follow these simple steps to enroll your child</p>
          
          <div className="steps-grid">
            {admissionInfo?.process_steps?.map((step) => (
              <div key={step.step} className="step-card">
                <div className="step-number">{step.step.toString().padStart(2, '0')}</div>
                <div className="step-icon">📝</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="classes-section">
        <div className="container">
          <h2>Available Classes</h2>
          <p className="section-subtitle">Limited spaces available for the current academic session</p>
          
          <div className="classes-grid">
            {admissionInfo?.available_classes?.map((className, index) => (
              <div key={index} className="class-card">
                <div className="class-level">{className}</div>
                <div className="class-details">
                  <p>Limited slots available</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="requirements-section">
        <div className="container">
          <div className="requirements-grid">
            <div className="requirements-content">
              <h2>Admission Requirements</h2>
              <ul>
                {admissionInfo?.requirements?.map((req, index) => (
                  <li key={index}>
                    <FaCheckCircle className="check-icon" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="assessment-content">
              <h2>Entrance Assessment</h2>
              <ul>
                <li><FaCheckCircle className="check-icon" /><span>English Language proficiency test</span></li>
                <li><FaCheckCircle className="check-icon" /><span>Mathematics assessment</span></li>
                <li><FaCheckCircle className="check-icon" /><span>General knowledge evaluation</span></li>
                <li><FaCheckCircle className="check-icon" /><span>Oral interview (for JSS & SSS applicants)</span></li>
                <li><FaCheckCircle className="check-icon" /><span>Play-based observation (for Early Years)</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="documents-section">
        <div className="container">
          <div className="documents-grid">
            <div className="document-card">
              <FaFileAlt className="doc-icon" />
              <h3>Admission Form</h3>
              <p>Download the admission form and complete offline</p>
              <button onClick={handleDownloadForm} className="doc-btn" disabled={!admissionInfo?.admission_form_url}>
                <FaDownload /> {admissionInfo?.admission_form_url ? 'Download Form' : 'Coming Soon'}
              </button>
            </div>

            <div className="document-card">
              <FaMoneyBillWave className="doc-icon" />
              <h3>School Fees Schedule</h3>
              <p>View detailed fee structure for all classes</p>
              <button onClick={handleDownloadFees} className="doc-btn" disabled={!admissionInfo?.fees_document_url}>
                <FaDownload /> {admissionInfo?.fees_document_url ? 'Download Fees' : 'Coming Soon'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {admissionInfo?.deadline && (
        <section className="deadlines-section">
          <div className="container">
            <FaCalendarAlt className="deadline-icon" />
            <h2>Important Dates</h2>
            <div className="deadlines-grid">
              <div className="deadline-item">
                <div className="deadline-date">{new Date(admissionInfo.deadline).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className="deadline-event">Application Deadline</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="contact-admissions-section">
        <div className="container">
          <h2>Need Assistance?</h2>
          <p>Our admissions team is here to help you through the process</p>
          
          <div className="contact-admissions-grid">
            <div className="contact-item">
              <FaPhoneAlt className="contact-icon" />
              <div>
                <strong>Call Us</strong>
                <p>{admissionInfo?.contact_phone || '+234 803 750 3627'}</p>
              </div>
            </div>
            
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div>
                <strong>Email Us</strong>
                <p>{admissionInfo?.contact_email || 'admissions@broadoakschools.com'}</p>
              </div>
            </div>
          </div>
          
          <Link to="/contact" className="cta-admissions-btn">
            Contact Admissions Office →
          </Link>
        </div>
      </section>
    </main>
      </>
  );
};
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import { fetchUpcomingEvents, fetchPastEvents, type EventItem } from '../../services/eventService';
import { SEO } from '../../components/common/SEO';

export const EventsPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const [upcoming, past] = await Promise.all([
        fetchUpcomingEvents(),
        fetchPastEvents(),
      ]);
      setUpcomingEvents(upcoming || []);
      setPastEvents(past || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const EventCard = ({ event }: { event: EventItem }) => (
    <div className="event-card">
      {event.flyer_url && (
        <div className="event-card-flyer">
          <img src={event.flyer_url} alt={event.title} />
        </div>
      )}
      <div className="event-card-content">
        <div className="event-date-badge">
          <span className="event-day">{new Date(event.event_date).getDate()}</span>
          <span className="event-month">{new Date(event.event_date).toLocaleDateString('en-NG', { month: 'short' })}</span>
        </div>
        <h3>{event.title}</h3>
        <div className="event-details">
          <p><span className="event-icon">📅</span> {formatDate(event.event_date)}</p>
          {event.event_time && <p><span className="event-icon">⏰</span> {formatTime(event.event_time)}</p>}
          <p><span className="event-icon">📍</span> {event.venue}</p>
        </div>
        {event.description && (
          <p className="event-description">{event.description.substring(0, 150)}...</p>
        )}
        {event.registration_link && (
          <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="event-register-btn">
            Register Now →
          </a>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-spinner" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading events...
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Events" 
        description="Discover all the exciting events happening at The Broadoak Schools. Stay updated with upcoming and past events."
        url="https://broadoakschools.com/events"
      />
    <main className="events-page">
      <section className="events-hero">
        <div className="container">
          <h1>School Events</h1>
          <p>Stay updated with all upcoming and past events at The Broadoak Schools</p>
        </div>
      </section>

      <section className="events-content">
        <div className="container">
          <div className="events-tabs">
            <button
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              📅 Upcoming Events ({upcomingEvents.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              📜 Past Events ({pastEvents.length})
            </button>
          </div>

          {activeTab === 'upcoming' && (
            <>
              {upcomingEvents.length === 0 ? (
                <div className="no-events">
                  <p>No upcoming events scheduled at the moment.</p>
                  <p>Check back soon for updates!</p>
                </div>
              ) : (
                <div className="events-grid">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'past' && (
            <>
              {pastEvents.length === 0 ? (
                <div className="no-events">
                  <p>No past events to display.</p>
                </div>
              ) : (
                <div className="events-grid past-events-grid">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
      </>
  );
};
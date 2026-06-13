/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import {
  fetchAllMessages,
  fetchUnreadCount,
  markAsRead,
  markAsReplied,
  deleteMessage,
  deleteMultipleMessages,
  markMultipleAsRead,
  sendReply,
  type ContactMessage,
} from '../../services/contactService';

export const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [replyForm, setReplyForm] = useState({
    subject: '',
    message: '',
  });
  const [sendingReply, setSendingReply] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  useEffect(() => {
    loadMessages();
  }, [filter]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const [allMessages, unread] = await Promise.all([
        fetchAllMessages(),
        fetchUnreadCount(),
      ]);
      
      let filteredMessages = allMessages;
      if (filter === 'unread') {
        filteredMessages = allMessages.filter(m => !m.is_read);
      } else if (filter === 'read') {
        filteredMessages = allMessages.filter(m => m.is_read && !m.replied);
      } else if (filter === 'replied') {
        filteredMessages = allMessages.filter(m => m.replied);
      }
      
      setMessages(filteredMessages);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading messages:', error);
      alert('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (message: ContactMessage) => {
    if (!message.is_read) {
      await markAsRead(message.id!);
      await loadMessages();
    }
  };


  const handleDelete = async (message: ContactMessage) => {
    if (window.confirm(`Are you sure you want to delete this message from ${message.full_name}?`)) {
      await deleteMessage(message.id!);
      await loadMessages();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMessages.length === 0) return;
    if (window.confirm(`Delete ${selectedMessages.length} selected messages?`)) {
      await deleteMultipleMessages(selectedMessages);
      setSelectedMessages([]);
      await loadMessages();
    }
  };

  const handleBulkMarkRead = async () => {
    if (selectedMessages.length === 0) return;
    await markMultipleAsRead(selectedMessages);
    setSelectedMessages([]);
    await loadMessages();
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo) return;
    
    setSendingReply(true);
    try {
      await sendReply(
        replyingTo.email,
        replyForm.subject || `Re: ${replyingTo.subject}`,
        replyForm.message
      );
      await markAsReplied(replyingTo.id!);
      alert('Reply sent successfully!');
      setReplyingTo(null);
      setReplyForm({ subject: '', message: '' });
      await loadMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  const toggleSelectMessage = (id: string) => {
    setSelectedMessages(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map(m => m.id!));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-NG', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getStatusBadge = (message: ContactMessage) => {
    if (message.replied) return <span className="status-badge replied">✓ Replied</span>;
    if (message.is_read) return <span className="status-badge read">📖 Read</span>;
    return <span className="status-badge unread">🔴 Unread</span>;
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="management-container contact-messages-container">
      <div className="management-header">
        <h1>💬 Contact Messages</h1>
        <div className="header-stats">
          <span className="unread-badge">{unreadCount} Unread</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="messages-filter-bar">
        <div className="filter-buttons">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            All ({messages.length})
          </button>
          <button className={`filter-btn ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
            Unread ({messages.filter(m => !m.is_read).length})
          </button>
          <button className={`filter-btn ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
            Read ({messages.filter(m => m.is_read && !m.replied).length})
          </button>
          <button className={`filter-btn ${filter === 'replied' ? 'active' : ''}`} onClick={() => setFilter('replied')}>
            Replied ({messages.filter(m => m.replied).length})
          </button>
        </div>
        
        {selectedMessages.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedMessages.length} selected</span>
            <button onClick={handleBulkMarkRead} className="bulk-read-btn">📖 Mark as Read</button>
            <button onClick={handleBulkDelete} className="bulk-delete-btn">🗑️ Delete</button>
          </div>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="empty-state">
          <p>📭 No messages found</p>
          <p>When parents and visitors contact you, their messages will appear here.</p>
        </div>
      ) : (
        <div className="messages-table-container">
          <table className="messages-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedMessages.length === messages.length && messages.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Status</th>
                <th>Name</th>
                <th>Email / Phone</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id} className={!message.is_read ? 'unread-row' : ''}>
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id!)}
                      onChange={() => toggleSelectMessage(message.id!)}
                    />
                  </td>
                  <td>{getStatusBadge(message)}</td>
                  <td>
                    <div className="sender-info">
                      <strong>{message.full_name}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info-cell">
                      <div>{message.email}</div>
                      <div className="phone-small">{message.phone}</div>
                    </div>
                  </td>
                  <td>
                    <button
                      className="subject-btn"
                      onClick={() => {
                        setViewingMessage(message);
                        handleMarkAsRead(message);
                      }}
                    >
                      {message.subject}
                    </button>
                  </td>
                  <td className="date-cell">{formatDate(message.created_at!)}</td>
                  <td className="actions-cell">
                    <button
                      className="view-btn"
                      onClick={() => {
                        setViewingMessage(message);
                        handleMarkAsRead(message);
                      }}
                      title="View"
                    >
                      👁️
                    </button>
                    <button
                      className="reply-btn"
                      onClick={() => {
                        setReplyingTo(message);
                        setReplyForm({
                          subject: `Re: ${message.subject}`,
                          message: `Dear ${message.full_name},\n\nThank you for contacting The Broadoak Schools.\n\n`,
                        });
                      }}
                      title="Reply"
                    >
                      ✉️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(message)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Message Modal */}
      {viewingMessage && (
        <div className="modal-overlay" onClick={() => setViewingMessage(null)}>
          <div className="modal-container message-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message from {viewingMessage.full_name}</h2>
              <button className="modal-close" onClick={() => setViewingMessage(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="message-details">
                <div className="message-detail-row">
                  <strong>From:</strong> {viewingMessage.full_name}
                </div>
                <div className="message-detail-row">
                  <strong>Email:</strong> <a href={`mailto:${viewingMessage.email}`}>{viewingMessage.email}</a>
                </div>
                {viewingMessage.phone && (
                  <div className="message-detail-row">
                    <strong>Phone:</strong> <a href={`tel:${viewingMessage.phone}`}>{viewingMessage.phone}</a>
                  </div>
                )}
                <div className="message-detail-row">
                  <strong>Subject:</strong> {viewingMessage.subject}
                </div>
                <div className="message-detail-row">
                  <strong>Date:</strong> {formatDate(viewingMessage.created_at!)}
                </div>
                <div className="message-content">
                  <strong>Message:</strong>
                  <p>{viewingMessage.message}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="reply-btn"
                onClick={() => {
                  setReplyingTo(viewingMessage);
                  setReplyForm({
                    subject: `Re: ${viewingMessage.subject}`,
                    message: `Dear ${viewingMessage.full_name},\n\nThank you for contacting The Broadoak Schools.\n\n`,
                  });
                  setViewingMessage(null);
                }}
              >
                ✉️ Reply to Message
              </button>
              <button className="btn-secondary" onClick={() => setViewingMessage(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="modal-overlay" onClick={() => { setReplyingTo(null); setReplyForm({ subject: '', message: '' }); }}>
          <div className="modal-container reply-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reply to {replyingTo.full_name}</h2>
              <button className="modal-close" onClick={() => { setReplyingTo(null); setReplyForm({ subject: '', message: '' }); }}>✕</button>
            </div>
            <form onSubmit={handleSendReply}>
              <div className="modal-body">
                <div className="form-group">
                  <label>To:</label>
                  <input type="email" value={replyingTo.email} disabled className="disabled-input" />
                </div>
                <div className="form-group">
                  <label>Subject:</label>
                  <input
                    type="text"
                    value={replyForm.subject}
                    onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message:</label>
                  <textarea
                    value={replyForm.message}
                    onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })}
                    rows={10}
                    required
                    placeholder="Type your reply here..."
                  />
                </div>
                <div className="original-message">
                  <strong>Original Message:</strong>
                  <div className="original-content">
                    <p><em>{replyingTo.message}</em></p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => { setReplyingTo(null); setReplyForm({ subject: '', message: '' }); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={sendingReply}>
                  {sendingReply ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
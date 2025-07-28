import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import '../styles/Chat.css';

const Chat = ({ orderId }) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChatRoom = async () => {
      if (!orderId) return;
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please log in to see your conversations.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`/api/orders/${orderId}/chat/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversation(response.data);
      } catch (err) {
        setError('There was an error fetching the chat for this order.');
      } finally {
        setLoading(false);
      }
    };

    fetchChatRoom();
  }, [orderId]);

  useEffect(() => {
    if (conversation) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`/api/chat/rooms/${conversation.id}/messages/`);
          setMessages(response.data);
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };
      fetchMessages();
    }
  }, [conversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    try {
      const response = await axios.post(`/api/chat/rooms/${conversation.id}/send_message/`, {
        content: newMessage,
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <div>Loading your conversations...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-window">
        {conversation ? (
          <>
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-item ${msg.sender.id === 1 ? 'sent' : 'received'}`}>
                  <p>{msg.content}</p>
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <p>Loading chat...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

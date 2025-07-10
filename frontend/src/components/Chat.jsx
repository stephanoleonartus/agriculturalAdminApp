// Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // TODO: Replace with Django API and WebSocket connection
    fetchOnlineUsers();
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchOnlineUsers = async () => {
    // TODO: API call to Django backend
    // const response = await fetch('http://localhost:8000/api/chat/users/');
    // const data = await response.json();
    // setOnlineUsers(data);
    
    // Mock data
    setOnlineUsers([
      { id: 1, name: "John Mwakyusa", role: "Farmer", region: "Mbeya", online: true, lastSeen: "now" },
      { id: 2, name: "Asha Komba", role: "Farmer", region: "Morogoro", online: false, lastSeen: "2 hours ago" },
      { id: 3, name: "Peter Supplier", role: "Supplier", region: "Arusha", online: true, lastSeen: "now" },
      { id: 4, name: "Mary Customer", role: "Customer", region: "Dodoma", online: true, lastSeen: "now" }
    ]);
  };

  const fetchMessages = async (userId) => {
    // TODO: API call to Django backend
    // const response = await fetch(`http://localhost:8000/api/chat/messages/${userId}/`);
    // const data = await response.json();
    // setMessages(data);
    
    // Mock data
    setMessages([
      { id: 1, sender: "John Mwakyusa", content: "Hello! I have fresh apples available", timestamp: "10:30 AM", isMine: false },
      { id: 2, sender: "You", content: "That's great! What's the price per kg?", timestamp: "10:32 AM", isMine: true },
      { id: 3, sender: "John Mwakyusa", content: "2000 Tzs per kg. Quality is excellent!", timestamp: "10:35 AM", isMine: false },
      { id: 4, sender: "You", content: "Can I get 50kg? When can I pick up?", timestamp: "10:37 AM", isMine: true }
    ]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      content: newMessage,
      recipient: selectedUser.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // TODO: Send to Django backend via WebSocket or API
    // await fetch('http://localhost:8000/api/chat/send/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(messageData)
    // });

    // Update UI immediately
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "You",
      content: newMessage,
      timestamp: messageData.timestamp,
      isMine: true
    }]);

    setNewMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredUsers = onlineUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UserItem = ({ user, isSelected, onClick }) => (
    <div 
      className={`user-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(user)}
    >
      <div className="user-avatar">
        <img src={`https://i.pravatar.cc/40?img=${user.id}`} alt={user.name} />
        <div className={`status-indicator ${user.online ? 'online' : 'offline'}`}></div>
      </div>
      <div className="user-info">
        <h4>{user.name}</h4>
        <p className="user-role">{user.role} • {user.region}</p>
        <p className="last-seen">{user.online ? 'Online' : user.lastSeen}</p>
      </div>
    </div>
  );

  const MessageBubble = ({ message }) => (
    <div className={`message ${message.isMine ? 'mine' : 'theirs'}`}>
      <div className="message-content">
        {message.content}
      </div>
      <div className="message-time">
        {message.timestamp}
      </div>
    </div>
  );

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>💬 Messages</h2>
          <button className="new-chat-btn">+</button>
        </div>
        
        <div className="user-search">
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="users-list">
          {filteredUsers.map(user => (
            <UserItem
              key={user.id}
              user={user}
              isSelected={selectedUser?.id === user.id}
              onClick={setSelectedUser}
            />
          ))}
        </div>
      </div>

      <div className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <img src={`https://i.pravatar.cc/40?img=${selectedUser.id}`} alt={selectedUser.name} />
                <div>
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.role} • {selectedUser.region}</p>
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-btn">📞</button>
                <button className="action-btn">📹</button>
                <button className="action-btn">ℹ️</button>
              </div>
            </div>

            <div className="messages-area">
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="message-input-form">
              <div className="input-container">
                <button type="button" className="attachment-btn">📎</button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="message-input"
                />
                <button type="button" className="emoji-btn">😊</button>
                <button type="submit" className="send-btn">
                  ➤
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <h3>💬 Select a conversation</h3>
              <p>Choose a user from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
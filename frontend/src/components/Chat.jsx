// Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null); // Changed from selectedUser
  const [chatRooms, setChatRooms] = useState([]); // Changed from onlineUsers
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // To determine 'isMine' for messages

  // TODO: Fetch current user ID (e.g., from auth context or /api/accounts/profile/)
  useEffect(() => {
    // Placeholder for fetching current user's ID.
    // This is crucial for determining if a message is 'mine' or 'theirs'.
    // For now, assuming a mock ID or that sender ID from message can be compared.
    // const fetchUser = async () => {
    //   try {
    //     const response = await axios.get("http://localhost:8000/api/accounts/profile/", {
    //       headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    //     });
    //     setCurrentUserId(response.data.id);
    //   } catch (error) {
    //     console.error("Error fetching current user profile:", error);
    //   }
    // };
    // fetchUser();
    setCurrentUserId(1); // Mock: Assume current user ID is 1
  }, []);


  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    } else {
      setMessages([]); // Clear messages if no room is selected
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatRooms = async () => {
    setLoadingRooms(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:8000/api/v1/chat/rooms/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && Array.isArray(response.data.results)) {
        setChatRooms(response.data.results);
      } else if (Array.isArray(response.data)) { // Non-paginated fallback
        setChatRooms(response.data);
      } else {
        setChatRooms([]);
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      // Handle error (e.g., display message to user)
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchMessages = async (roomId) => {
    setLoadingMessages(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`http://localhost:8000/api/v1/chat/rooms/${roomId}/messages/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Assuming messages are directly in response.data or response.data.results
      const fetchedMessages = response.data.results || response.data || [];
      setMessages(fetchedMessages.map(msg => ({
        ...msg,
        isMine: msg.sender === currentUserId // Determine if message is from current user
      })));
    } catch (error) {
      console.error(`Error fetching messages for room ${roomId}:`, error);
      setMessages([]); // Clear messages on error
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/chat/rooms/${selectedRoom.id}/send_message/`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Add new message to state (or refetch messages for simplicity, though less optimal)
      // For optimistic update:
      const sentMessage = {
        ...response.data, // Assuming backend returns the created message object
        isMine: response.data.sender === currentUserId
      };
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");
      // Update last_message in the chatRooms list for the current room
      setChatRooms(prevRooms => prevRooms.map(room =>
        room.id === selectedRoom.id ? { ...room, last_message: response.data, last_message_at: response.data.created_at } : room
      ));

    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      // Handle send error (e.g., display to user)
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // TODO: Adapt filtering for chatRooms (e.g., by participant names)
  const filteredRooms = chatRooms.filter(room => {
    const roomName = room.name || (room.participants_names ? room.participants_names.join(', ') : 'Unnamed Room');
    return roomName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const ChatRoomItem = ({ room, isSelected, onClick }) => {
    // For a private chat, derive the other participant's name
    // This logic assumes participants_names contains names of all participants including current user.
    // And currentUserId is known.
    // A more robust way might be for backend to provide a 'display_name' for the room.
    let displayName = room.name;
    if (room.room_type === 'private' && room.participants_names) {
        // This is a simplified way to get the "other" user.
        // Backend `ChatRoomSerializer` could provide a field `other_participant_name` or `display_name`
        // For now, just join names, or if you have current user's name, filter it out.
        displayName = room.participants_names.filter(name => name !== "current_username_placeholder").join(', ') || "Private Chat";
    }
    displayName = displayName || `Room ${room.id}`;
    const lastMsg = room.last_message;
    const lastMsgText = lastMsg ? `${lastMsg.sender_name || 'User'}: ${lastMsg.content.substring(0,25)}...` : 'No messages yet';
    const lastMsgTime = lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';


    return (
      <div
        className={`user-item ${isSelected ? 'selected' : ''}`} // Reusing .user-item styling
        onClick={() => onClick(room)}
      >
        {/* Placeholder avatar, could use first participant's avatar or a group icon */}
        <div className="user-avatar">
          <img src={`https://i.pravatar.cc/40?u=${room.id}`} alt={displayName} />
        </div>
        <div className="user-info">
          <h4>{displayName}</h4>
          <p className="last-message-preview">{lastMsgText}</p>
        </div>
        <div className="room-meta">
            <span className="last-message-time">{lastMsgTime}</span>
            {room.unread_count > 0 && <span className="unread-badge">{room.unread_count}</span>}
        </div>
      </div>
    );
  };


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
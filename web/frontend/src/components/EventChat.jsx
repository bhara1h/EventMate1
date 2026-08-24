import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

// We connect to the backend server dynamically
const socketURL = import.meta.env.VITE_SOCKET_URL || `http://${window.location.hostname}:5000`;
const socket = io(socketURL);

const EventChat = ({ eventId, eventTitle, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 1. Fetch chat history
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/${eventId}`);
        setMessages(res.data);
        scrollToBottom();
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
      }
    };
    fetchHistory();

    // 2. Join Socket Room
    socket.emit('joinRoom', { eventId });

    // 3. Listen for incoming messages
    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    
    socket.on('receiveMessage', handleReceiveMessage);

    // Cleanup when component unmounts
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [eventId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Send to server via socket
    socket.emit('sendMessage', {
      eventId,
      senderId: user._id,
      senderName: user.name,
      senderRole: user.role,
      text: newMessage
    });

    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Event Chat</h3>
            <p className="text-blue-100 text-xs truncate max-w-[250px]">{eventTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-blue-100 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-700"
          >
            ✕
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.length === 0 ? (
            <p className="text-center text-slate-400 text-sm mt-10">No messages yet. Be the first to say hello!</p>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.sender?._id === user._id;
              const isOrganizer = msg.sender?.role === 'Organizer';
              return (
                <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && (
                    <span className="text-xs text-slate-500 mb-1 ml-1 font-medium flex items-center gap-1">
                      {msg.sender?.name}
                      {isOrganizer && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">Organizer</span>}
                    </span>
                  )}
                  <div 
                    className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 mx-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventChat;

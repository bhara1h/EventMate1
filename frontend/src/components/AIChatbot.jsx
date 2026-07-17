import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your EventMate AI. Looking for an event or need help planning one?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let response = "I'm still learning, but I can help you find events! Check out the Student Dashboard.";
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('tech') || lowerInput.includes('hackathon')) {
        response = "We have some amazing tech events coming up! Check out the 'Tech' category on your dashboard.";
      } else if (lowerInput.includes('create') || lowerInput.includes('plan')) {
        response = "If you're an organizer, head to the Organizer Dashboard to create a new event. Make sure to fill in all the details!";
      } else if (lowerInput.includes('ticket')) {
        response = "You can find your purchased tickets and QR codes under 'My Tickets' in the navigation bar.";
      }

      setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 transition-all origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '400px' }}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              🤖
            </div>
            <span className="font-bold">EventMate AI</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'ai' ? 'bg-white border border-slate-200 text-slate-800 self-start rounded-tl-sm' : 'bg-blue-600 text-white self-end rounded-tr-sm'}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2 rounded-b-2xl">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..." 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
          />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default AIChatbot;

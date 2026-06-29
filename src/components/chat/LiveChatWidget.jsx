import React, { useState } from 'react';
import { MessageCircle, X, Send, User, Phone, HelpCircle } from 'lucide-react';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', inquiryType: 'General' });
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Welcome to City Central Hospital. How can we help you today?", sender: "receptionist", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleStartChat = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setHasStarted(true);
      // In a real app, you would create a chat room in Supabase here
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'patient',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate auto-reply for demo purposes
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Thank you for your message. A receptionist will be with you shortly.",
        sender: 'receptionist',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden border border-slate-100 flex-shrink-0 transition-all">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Live Support</h3>
                <p className="text-xs text-primary-foreground/80">Typically replies in minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 bg-slate-50 overflow-y-auto p-4 flex flex-col relative">
            {!hasStarted ? (
              <div className="m-auto w-full max-w-sm bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h4 className="font-semibold text-slate-800 mb-2 text-center">Start a conversation</h4>
                <p className="text-xs text-slate-500 mb-6 text-center">Please fill in your details so we can better assist you.</p>
                <form onSubmit={handleStartChat} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="+254..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nature of Inquiry</label>
                    <div className="relative">
                      <HelpCircle className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <select
                        className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      >
                        <option>General</option>
                        <option>Billing</option>
                        <option>Booking</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Start Chat
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${msg.sender === 'patient'
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-white border text-slate-800 rounded-tl-sm'
                      }`}>
                      <p className="text-sm">{msg.text}</p>
                      <span className={`text-[10px] mt-1 block ${msg.sender === 'patient' ? 'text-primary-foreground/70 text-right' : 'text-slate-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Input */}
          {hasStarted && (
            <div className="p-3 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-full pl-4 pr-12 py-2.5 text-sm transition-all outline-none"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Phone, HelpCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', inquiryType: 'General' });
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Load chat session from sessionStorage on mount (survives refreshes)
  useEffect(() => {
    const savedRoomId = sessionStorage.getItem('hospital_chat_room_id');
    const savedName = sessionStorage.getItem('hospital_chat_patient_name');
    const savedPhone = sessionStorage.getItem('hospital_chat_patient_phone');
    const savedMode = sessionStorage.getItem('hospital_chat_is_offline') === 'true';

    if (savedRoomId && savedName && savedPhone) {
      setRoomId(savedRoomId);
      setFormData({ name: savedName, phone: savedPhone, inquiryType: 'General' });
      setHasStarted(true);
      setIsOfflineMode(savedMode);
      
      // Load previous messages
      loadMessages(savedRoomId, savedMode);
    }
  }, []);

  // Listen for real-time messages (Supabase or Offline Fallback)
  useEffect(() => {
    if (!roomId) return;

    if (!isOfflineMode) {
      // 1. Supabase Real-time Subscription
      const channel = supabase
        .channel(`room-${roomId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${roomId}` },
          (payload) => {
            const newMsg = payload.new;
            setMessages(prev => {
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, {
                id: newMsg.id,
                text: newMsg.message_text,
                sender: newMsg.sender_type,
                time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // 2. Offline Fallback Local Event Subscription
      const handleLocalMessage = (e) => {
        const { roomId: msgRoomId, message } = e.detail;
        if (msgRoomId === roomId) {
          setMessages(prev => {
            if (prev.some(m => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
      };

      window.addEventListener('local-message-sent', handleLocalMessage);
      return () => {
        window.removeEventListener('local-message-sent', handleLocalMessage);
      };
    }
  }, [roomId, isOfflineMode]);

  const loadMessages = async (rId, isOffline) => {
    if (!isOffline) {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('room_id', rId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const formatted = data.map(m => ({
          id: m.id,
          text: m.message_text,
          sender: m.sender_type,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        setMessages(formatted);
      } catch (err) {
        console.warn('Failed to load online messages, switching to local offline load');
        loadLocalMessages(rId);
      }
    } else {
      loadLocalMessages(rId);
    }
  };

  const loadLocalMessages = (rId) => {
    const allLocalMsgs = JSON.parse(localStorage.getItem('local_chat_messages') || '[]');
    const filtered = allLocalMsgs
      .filter(m => m.room_id === rId)
      .map(m => ({
        id: m.id,
        text: m.text,
        sender: m.sender,
        time: m.time
      }));
    
    if (filtered.length === 0) {
      // First welcome message
      setMessages([
        { id: 'welcome', text: `Hello ${formData.name || 'there'}! Welcome to Kuva Hospital support. How can we help you today?`, sender: "receptionist", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    } else {
      setMessages(filtered);
    }
  };

  const handleStartChat = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitting(true);

    const roomData = {
      patient_name: formData.name,
      patient_phone: formData.phone,
      inquiry_type: formData.inquiryType,
      status: 'active'
    };

    try {
      // Try online Supabase room creation
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert([roomData])
        .select();

      if (error) throw error;

      const createdRoom = data[0];
      setRoomId(createdRoom.id);
      setIsOfflineMode(false);
      
      sessionStorage.setItem('hospital_chat_room_id', createdRoom.id);
      sessionStorage.setItem('hospital_chat_patient_name', formData.name);
      sessionStorage.setItem('hospital_chat_patient_phone', formData.phone);
      sessionStorage.setItem('hospital_chat_is_offline', 'false');

      setHasStarted(true);
      loadMessages(createdRoom.id, false);
    } catch (err) {
      console.warn('Failed to start online chat, starting offline demo chat:', err.message || err);
      
      // Offline fallback: create local room
      const localRooms = JSON.parse(localStorage.getItem('local_chat_rooms') || '[]');
      const offlineRoomId = 'ROOM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      const offlineRoom = {
        id: offlineRoomId,
        patient_name: formData.name,
        patient_phone: formData.phone,
        inquiry_type: formData.inquiryType,
        status: 'active',
        created_at: new Date().toISOString()
      };

      localRooms.push(offlineRoom);
      localStorage.setItem('local_chat_rooms', JSON.stringify(localRooms));
      
      // Notify dashboard if open
      window.dispatchEvent(new CustomEvent('local-rooms-updated'));

      setRoomId(offlineRoomId);
      setIsOfflineMode(true);

      sessionStorage.setItem('hospital_chat_room_id', offlineRoomId);
      sessionStorage.setItem('hospital_chat_patient_name', formData.name);
      sessionStorage.setItem('hospital_chat_patient_phone', formData.phone);
      sessionStorage.setItem('hospital_chat_is_offline', 'true');

      setHasStarted(true);
      loadLocalMessages(offlineRoomId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !roomId) return;

    const messageText = inputValue.trim();
    setInputValue('');

    const displayMsg = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      text: messageText,
      sender: 'patient',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Optimistically add to UI
    setMessages(prev => [...prev, displayMsg]);

    if (!isOfflineMode) {
      try {
        const { error } = await supabase
          .from('chat_messages')
          .insert([{
            room_id: roomId,
            sender_type: 'patient',
            message_text: messageText
          }]);

        if (error) throw error;
      } catch (err) {
        console.warn('Failed to deliver online message, falling back to local list:', err);
        saveLocalMessage(roomId, displayMsg);
      }
    } else {
      saveLocalMessage(roomId, displayMsg);
      
      // Simulated AI auto-reply for standalone patient demo testing if no receptionist is connected
      setTimeout(() => {
        const responseMsg = {
          id: 'auto-' + Math.random().toString(36).substr(2, 9),
          room_id: roomId,
          text: "Thank you for contacting Kuva Hospital. A receptionist has received your inquiry and will reply shortly.",
          sender: 'receptionist',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        // Save receptionist reply to local storage so dashboard also sees it
        const allLocalMsgs = JSON.parse(localStorage.getItem('local_chat_messages') || '[]');
        allLocalMsgs.push(responseMsg);
        localStorage.setItem('local_chat_messages', JSON.stringify(allLocalMsgs));

        // Dispatch local event so widget hears it
        window.dispatchEvent(new CustomEvent('local-message-sent', { detail: { roomId, message: responseMsg } }));
      }, 3000);
    }
  };

  const saveLocalMessage = (rId, displayMsg) => {
    const allLocalMsgs = JSON.parse(localStorage.getItem('local_chat_messages') || '[]');
    const localMsgRecord = {
      id: displayMsg.id,
      room_id: rId,
      text: displayMsg.text,
      sender: displayMsg.sender,
      time: displayMsg.time,
      created_at: new Date().toISOString()
    };
    allLocalMsgs.push(localMsgRecord);
    localStorage.setItem('local_chat_messages', JSON.stringify(allLocalMsgs));
    
    // Dispatch local event for instant sync
    window.dispatchEvent(new CustomEvent('local-message-sent', { detail: { roomId: rId, message: localMsgRecord } }));
  };

  const handleEndSession = () => {
    sessionStorage.clear();
    setHasStarted(false);
    setRoomId(null);
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/95 text-white p-4.5 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 border border-primary-foreground/10"
        >
          <MessageCircle className="h-7 w-7 text-accent" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl w-[360px] sm:w-[420px] h-[550px] flex flex-col overflow-hidden border border-slate-100 transition-all animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                  <MessageCircle className="h-5 w-5 text-accent" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-snug">Kuva Support</h3>
                <p className="text-[10px] text-slate-300 font-medium">Typically replies in minutes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {hasStarted && (
                <button 
                  onClick={handleEndSession}
                  className="text-xs bg-white/10 hover:bg-white/20 text-slate-200 font-semibold px-2 py-1 rounded-lg transition-all"
                  title="End Chat Session"
                >
                  End Chat
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Offline Mode Banner */}
          {hasStarted && isOfflineMode && (
            <div className="bg-amber-50 border-b border-amber-100 text-amber-800 text-[10px] py-1.5 px-3 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Offline Demo Mode - Syncing via LocalStorage</span>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 bg-slate-50 overflow-y-auto p-4 flex flex-col relative">
            {!hasStarted ? (
              <div className="m-auto w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-1 text-center text-base">Start a conversation</h4>
                <p className="text-xs text-slate-500 mb-5 text-center leading-relaxed">
                  Fill in your details below. A receptionist at Kuva Hospital will assist you.
                </p>
                
                <form onSubmit={handleStartChat} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 transition-all"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 transition-all"
                        placeholder="+254 700 111222"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Inquiry Nature</label>
                    <div className="relative">
                      <HelpCircle className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <select
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-slate-800 transition-all"
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      >
                        <option>General Support</option>
                        <option>Booking Request</option>
                        <option>Billing & Insurance</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary/95 transition-all shadow-md shadow-primary/10 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'Start Chatting'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${msg.sender === 'patient'
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                      }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <span className={`text-[9px] mt-1 block font-semibold ${msg.sender === 'patient' ? 'text-primary-foreground/75 text-right' : 'text-slate-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer Input */}
          {hasStarted && (
            <div className="p-3.5 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 rounded-xl pl-4 pr-12 py-3 text-sm transition-all outline-none text-slate-800"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-primary/95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="h-4 w-4 text-accent" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

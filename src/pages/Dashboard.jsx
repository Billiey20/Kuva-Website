import React, { useState, useEffect, useRef } from 'react';
import { Search, CheckCircle, Clock, XCircle, Phone, Send, RefreshCw, MessageSquare, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  
  const [appointments, setAppointments] = useState([]);
  const [aptSearch, setAptSearch] = useState('');
  const [aptFilter, setAptFilter] = useState('all');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Initial Load & Connection Check
  useEffect(() => {
    checkConnectionAndLoad();

    // Listen to local tab sync events for offline capability
    window.addEventListener('local-appointments-updated', handleAppointmentsLocalUpdate);
    window.addEventListener('local-rooms-updated', handleRoomsLocalUpdate);

    const handleGlobalStorage = (e) => {
      if (e.key === 'local_appointments') {
        handleAppointmentsLocalUpdate();
      }
      if (e.key === 'local_chat_rooms' && !selectedChat) {
        handleRoomsLocalUpdate();
      }
    };
    window.addEventListener('storage', handleGlobalStorage);

    return () => {
      window.removeEventListener('local-appointments-updated', handleAppointmentsLocalUpdate);
      window.removeEventListener('local-rooms-updated', handleRoomsLocalUpdate);
      window.removeEventListener('storage', handleGlobalStorage);
    };
  }, []);

  const handleAppointmentsLocalUpdate = () => {
    setIsOfflineMode(true);
    loadAppointments(true);
  };

  const handleRoomsLocalUpdate = () => {
    setIsOfflineMode(true);
    loadChatRooms(true);
  };

  const checkConnectionAndLoad = async () => {
    setIsLoading(true);
    setConnectionStatus('checking');
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) throw new Error("No Supabase URL configured");
      // Test Supabase connection
      const { error } = await supabase.from('appointments').select('id').limit(1);
      if (error) throw error;

      setConnectionStatus('online');
      setIsOfflineMode(false);
      loadAppointments(false);
      loadChatRooms(false);
    } catch (err) {
      console.warn('Supabase offline. Switching to local storage fallback desk:', err.message || err);
      setConnectionStatus('offline');
      setIsOfflineMode(true);
      loadAppointments(true);
      loadChatRooms(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time Subscriptions (online mode)
  useEffect(() => {
    if (isOfflineMode || connectionStatus !== 'online') return;

    // 1. Subscribe to new chat rooms
    const roomsSub = supabase
      .channel('public:chat_rooms')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, () => {
        loadChatRooms(false);
      })
      .subscribe();

    // 2. Subscribe to appointments changes
    const aptsSub = supabase
      .channel('public:appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        loadAppointments(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomsSub);
      supabase.removeChannel(aptsSub);
    };
  }, [isOfflineMode, connectionStatus]);

  // Real-time Subscriptions for Selected Chat Messages (online mode)
  useEffect(() => {
    if (isOfflineMode || !selectedChat || selectedChat.isLocal) return;

    const messagesSub = supabase
      .channel(`room-msg-${selectedChat.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${selectedChat.id}` },
        (payload) => {
          const newMsg = payload.new;
          setChatMessages(prev => {
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
      supabase.removeChannel(messagesSub);
    };
  }, [selectedChat, isOfflineMode]);

  // Real-time local message listener for offline mode
  useEffect(() => {
    if (!isOfflineMode || !selectedChat) return;

    const handleLocalMessage = (e) => {
      const { roomId, message } = e.detail;
      if (selectedChat.id === roomId) {
        setChatMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, {
            id: message.id,
            text: message.text,
            sender: message.sender,
            time: message.time
          }];
        });
      }
    };

    const handleStorageEvent = (e) => {
      if (e.key === 'local_chat_messages') {
        loadLocalMessagesForRoom(selectedChat.id);
      }
      if (e.key === 'local_chat_rooms') {
        loadChatRooms(true);
      }
    };

    window.addEventListener('local-message-sent', handleLocalMessage);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('local-message-sent', handleLocalMessage);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [selectedChat, isOfflineMode]);

  // Load Appointments
  const loadAppointments = async (offline) => {
    if (!offline) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setAppointments(data);
      } catch (err) {
        loadLocalAppointments();
      }
    } else {
      loadLocalAppointments();
    }
  };

  const loadLocalAppointments = () => {
    const local = JSON.parse(localStorage.getItem('local_appointments') || '[]');
    // Mock default data if local storage is empty
    if (local.length === 0) {
      const defaults = [
        { id: 'APT-MOCK-1', patient_name: 'Alice Kamau', selected_service: 'Pediatrics', appointment_date: '2026-07-12', appointment_time: '09:00', status: 'pending', created_at: new Date().toISOString() },
        { id: 'APT-MOCK-2', patient_name: 'Peter Ochieng', selected_service: 'Orthopedics', appointment_date: '2026-07-12', appointment_time: '11:30', status: 'confirmed', created_at: new Date().toISOString() },
        { id: 'APT-MOCK-3', patient_name: 'Susan Njoroge', selected_service: 'Cardiology', appointment_date: '2026-07-13', appointment_time: '10:00', status: 'completed', created_at: new Date().toISOString() },
      ];
      localStorage.setItem('local_appointments', JSON.stringify(defaults));
      setAppointments(defaults);
    } else {
      // Sort newest first
      setAppointments(local.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
    }
  };

  // Load Chat Rooms
  const loadChatRooms = async (offline) => {
    if (!offline) {
      try {
        const { data, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setChatRooms(data);
        if (data.length > 0 && !selectedChat) {
          selectRoom(data[0], false);
        }
      } catch (err) {
        loadLocalChatRooms();
      }
    } else {
      loadLocalChatRooms();
    }
  };

  const loadLocalChatRooms = () => {
    const localRooms = JSON.parse(localStorage.getItem('local_chat_rooms') || '[]');
    if (localRooms.length === 0) {
      const defaults = [
        { id: 'ROOM-MOCK-1', patient_name: 'John Doe', patient_phone: '+254711223344', inquiry_type: 'Booking Request', status: 'active', created_at: new Date().toISOString() },
        { id: 'ROOM-MOCK-2', patient_name: 'Mary Wanjiku', patient_phone: '+254722334455', inquiry_type: 'Billing & Insurance', status: 'resolved', created_at: new Date().toISOString() }
      ];
      localStorage.setItem('local_chat_rooms', JSON.stringify(defaults));
      setChatRooms(defaults);
      if (!selectedChat) {
        selectRoom(defaults[0], true);
      }
    } else {
      setChatRooms(localRooms.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
      if (localRooms.length > 0 && !selectedChat) {
        selectRoom(localRooms[0], true);
      }
    }
  };

  const selectRoom = async (room, isLocalRoom) => {
    setSelectedChat(room);
    if (!isLocalRoom && connectionStatus === 'online') {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('room_id', room.id)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        setChatMessages(data.map(m => ({
          id: m.id,
          text: m.message_text,
          sender: m.sender_type,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      } catch (err) {
        loadLocalMessagesForRoom(room.id);
      }
    } else {
      loadLocalMessagesForRoom(room.id);
    }
  };

  const loadLocalMessagesForRoom = (rId) => {
    const allLocalMsgs = JSON.parse(localStorage.getItem('local_chat_messages') || '[]');
    const filtered = allLocalMsgs.filter(m => m.room_id === rId);
    
    if (filtered.length === 0) {
      setChatMessages([
        { id: 'first', text: 'Patient started live chat.', sender: 'patient', time: 'Just now' }
      ]);
    } else {
      setChatMessages(filtered.map(m => ({
        id: m.id,
        text: m.text,
        sender: m.sender,
        time: m.time
      })));
    }
  };

  // Send Chat Message
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;

    const messageText = replyText.trim();
    setReplyText('');

    const formattedMsg = {
      id: 'desk-' + Math.random().toString(36).substr(2, 9),
      text: messageText,
      sender: 'receptionist',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Optimistically update
    setChatMessages(prev => [...prev, formattedMsg]);

    const isLocalRoom = selectedChat.id.startsWith('ROOM-') || selectedChat.id.startsWith('mock') || isOfflineMode;

    if (!isLocalRoom) {
      try {
        const { error } = await supabase
          .from('chat_messages')
          .insert([{
            room_id: selectedChat.id,
            sender_type: 'receptionist',
            message_text: messageText
          }]);
        if (error) throw error;
      } catch (err) {
        console.warn('Failed online send, saving locally:', err);
        saveLocalReply(selectedChat.id, formattedMsg);
      }
    } else {
      saveLocalReply(selectedChat.id, formattedMsg);
    }
  };

  const saveLocalReply = (rId, msgObj) => {
    const allLocalMsgs = JSON.parse(localStorage.getItem('local_chat_messages') || '[]');
    const record = {
      id: msgObj.id,
      room_id: rId,
      text: msgObj.text,
      sender: msgObj.sender,
      time: msgObj.time,
      created_at: new Date().toISOString()
    };
    allLocalMsgs.push(record);
    localStorage.setItem('local_chat_messages', JSON.stringify(allLocalMsgs));
    
    // Dispatch local sync event
    window.dispatchEvent(new CustomEvent('local-message-sent', { detail: { roomId: rId, message: record } }));
  };

  // Mark resolved
  const handleMarkResolved = async (rId) => {
    const isLocalRoom = rId.startsWith('ROOM-') || rId.startsWith('mock') || isOfflineMode;

    if (!isLocalRoom) {
      try {
        const { error } = await supabase
          .from('chat_rooms')
          .update({ status: 'resolved' })
          .eq('id', rId);
        if (error) throw error;
        loadChatRooms(false);
      } catch (err) {
        markLocalRoomResolved(rId);
      }
    } else {
      markLocalRoomResolved(rId);
    }
  };

  const markLocalRoomResolved = (rId) => {
    const localRooms = JSON.parse(localStorage.getItem('local_chat_rooms') || '[]');
    const updated = localRooms.map(r => r.id === rId ? { ...r, status: 'resolved' } : r);
    localStorage.setItem('local_chat_rooms', JSON.stringify(updated));
    setChatRooms(updated);
    if (selectedChat && selectedChat.id === rId) {
      setSelectedChat({ ...selectedChat, status: 'resolved' });
    }
  };

  // Update Appointment Status
  const handleUpdateAptStatus = async (aptId, newStatus) => {
    const isLocalApt = aptId.startsWith('OFF-') || aptId.startsWith('APT-MOCK-') || isOfflineMode;

    if (!isLocalApt) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status: newStatus })
          .eq('id', aptId);
        if (error) throw error;
        loadAppointments(false);
      } catch (err) {
        updateLocalAptStatus(aptId, newStatus);
      }
    } else {
      updateLocalAptStatus(aptId, newStatus);
    }
  };

  const updateLocalAptStatus = (aptId, newStatus) => {
    const local = JSON.parse(localStorage.getItem('local_appointments') || '[]');
    const updated = local.map(a => a.id === aptId ? { ...a, status: newStatus } : a);
    localStorage.setItem('local_appointments', JSON.stringify(updated));
    setAppointments(updated);
  };

  // Pre-defined quick replies
  const insertQuickReply = (text) => {
    setReplyText(text);
  };

  // Filtering / Searching appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient_name.toLowerCase().includes(aptSearch.toLowerCase()) || 
                          apt.selected_service.toLowerCase().includes(aptSearch.toLowerCase());
    const matchesFilter = aptFilter === 'all' || apt.status === aptFilter;
    return matchesSearch && matchesFilter;
  });

  const activeInquiriesCount = chatRooms.filter(r => r.status === 'active').length;
  const pendingAppointmentsCount = appointments.filter(a => a.status === 'pending').length;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* Dashboard Sub-Header */}
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          {connectionStatus === 'online' && !isOfflineMode ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Supabase Live Sync
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Demo Storage Mode
            </span>
          )}
        </div>

        <button 
          onClick={checkConnectionAndLoad} 
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary transition-all bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Desks
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white flex-shrink-0">
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-8 py-5 text-sm font-bold border-b-2 transition-all relative ${activeTab === 'inquiries' ? 'border-primary text-primary bg-slate-50/20' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <MessageSquare className="w-4 h-4" />
          Live Inquiries
          {activeInquiriesCount > 0 && (
            <span className="bg-secondary text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">
              {activeInquiriesCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-8 py-5 text-sm font-bold border-b-2 transition-all relative ${activeTab === 'appointments' ? 'border-primary text-primary bg-slate-50/20' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Calendar className="w-4 h-4" />
          Appointment Queue
          {pendingAppointmentsCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 animate-bounce">
              {pendingAppointmentsCount}
            </span>
          )}
        </button>
      </div>

      {/* Main Tab Areas */}
      <div className="flex-1 overflow-hidden relative bg-slate-50/30">
        {activeTab === 'inquiries' ? (
          <div className="absolute inset-0 flex">
            
            {/* Sidebar Chat List */}
            <div className="w-80 md:w-96 border-r border-slate-200 flex flex-col bg-white">
              <div className="p-4 border-b border-slate-100 flex-shrink-0">
                <h4 className="font-bold text-slate-800 text-sm mb-3">Conversations Queue</h4>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                {chatRooms.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">No active chats.</div>
                ) : (
                  chatRooms.map(room => {
                    const isSelected = selectedChat && selectedChat.id === room.id;
                    const isActive = room.status === 'active';
                    return (
                      <div
                        key={room.id}
                        onClick={() => selectRoom(room, room.id.startsWith('ROOM-') || room.id.startsWith('mock') || isOfflineMode)}
                        className={`p-4 cursor-pointer transition-colors relative ${isSelected ? 'bg-primary/5' : 'hover:bg-slate-50/50'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            {room.patient_name}
                            {isActive && <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {room.created_at ? new Date(room.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {room.inquiry_type}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isActive ? 'text-green-700 bg-green-50' : 'text-slate-500 bg-slate-100'}`}>
                            {room.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Conversation Area */}
            {selectedChat ? (
              <div className="flex-1 flex flex-col bg-slate-50/50">
                
                {/* Active Chat Header */}
                <div className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm z-10 flex-shrink-0">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{selectedChat.patient_name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mt-0.5">
                      <Phone className="h-3.5 w-3.5 text-primary" /> {selectedChat.patient_phone}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {selectedChat.status === 'active' && (
                      <button 
                        onClick={() => handleMarkResolved(selectedChat.id)}
                        className="text-xs font-bold text-white bg-accent hover:bg-accent/90 px-4 py-2 rounded-xl transition-all shadow-md shadow-accent/15"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {/* Conversation Scroller */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'receptionist' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm border ${msg.sender === 'receptionist'
                          ? 'bg-primary text-white border-primary rounded-tr-sm'
                          : 'bg-white border-slate-100 text-slate-800 rounded-tl-sm'
                        }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <span className={`text-[9px] mt-1.5 block font-semibold ${msg.sender === 'receptionist' ? 'text-primary-foreground/70 text-right' : 'text-slate-400'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input & Quick Replies */}
                <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                    <button 
                      onClick={() => insertQuickReply("Hello! Our clinic is open daily. General consultation is 8:00 AM - 5:00 PM, and Emergency is 24/7.")} 
                      className="text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200/60 whitespace-nowrap transition-colors"
                    >
                      Operating Hours
                    </button>
                    <button 
                      onClick={() => insertQuickReply("Yes, we are fully accredited and accept SHA / NHIF insurance covers for all treatments.")} 
                      className="text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200/60 whitespace-nowrap transition-colors"
                    >
                      Accept SHA?
                    </button>
                    <button 
                      onClick={() => insertQuickReply("Kuva Hospital is located along the Webuye-Malaba Highway, Webuye Town, Bungoma County.")} 
                      className="text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200/60 whitespace-nowrap transition-colors"
                    >
                      Hospital Location
                    </button>
                  </div>
                  
                  {selectedChat.status === 'active' ? (
                    <form onSubmit={handleSendReply} className="flex items-center gap-2">
                      <input 
                        type="text" 
                        required
                        placeholder="Type your reply..." 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 bg-slate-100 border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white text-slate-800 transition-all" 
                      />
                      <button type="submit" className="bg-primary text-white p-3 rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/25">
                        <Send className="h-5 w-5 text-accent" />
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-2 text-xs font-bold text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                      This inquiry has been marked as resolved.
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-slate-50/50">
                <MessageSquare className="w-16 h-16 text-slate-300 mb-4" />
                <h4 className="font-bold text-slate-700 text-lg mb-1">Select a Conversation</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Choose a live support ticket from the sidebar queue to read messages and reply to patients in real-time.
                </p>
              </div>
            )}
            
          </div>
        ) : (
          /* Appointments List Tab */
          <div className="absolute inset-0 p-6 overflow-y-auto bg-slate-50/30">
            
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Digital Booking Submissions
                <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {filteredAppointments.length}
                </span>
              </h3>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search bookings..." 
                    value={aptSearch}
                    onChange={(e) => setAptSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 transition-all"
                  />
                </div>
                
                <select 
                  value={aptFilter}
                  onChange={(e) => setAptFilter(e.target.value)}
                  className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider">Patient Name</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider">Contact Phone</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider">Department</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider">Target Date & Time</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider">Booking Status</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-right">Queue Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-xs">
                          No matching appointments found.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map(apt => (
                        <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">{apt.patient_name}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{apt.patient_phone}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-lg">
                              {apt.selected_service}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800">{apt.appointment_date}</span>
                              <span className="text-xs text-slate-400 font-semibold">{apt.appointment_time}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                              ${apt.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                apt.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' :
                                  apt.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                                    'bg-slate-100 text-slate-600'}`}
                            >
                              {apt.status === 'pending' && <Clock className="w-3 h-3" />}
                              {apt.status === 'confirmed' && <CheckCircle className="w-3 h-3 text-green-500" />}
                              {apt.status === 'cancelled' && <XCircle className="w-3 h-3 text-red-500" />}
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {apt.status === 'pending' ? (
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleUpdateAptStatus(apt.id, 'confirmed')}
                                  className="text-xs font-bold text-white bg-accent hover:bg-accent/90 px-3 py-1.5 rounded-lg transition-all"
                                  title="Approve Booking"
                                >
                                  Confirm
                                </button>
                                <button 
                                  onClick={() => handleUpdateAptStatus(apt.id, 'cancelled')}
                                  className="text-xs font-bold text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all border border-slate-200/50"
                                  title="Cancel Booking"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs font-medium">Processed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}

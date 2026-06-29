import React, { useState } from 'react';
import { Search, MoreVertical, CheckCircle, Clock, XCircle, User, Phone, Send, Info } from 'lucide-react';

const mockChats = [
  { id: 1, name: 'John Doe', phone: '+254711223344', type: 'Booking', lastMessage: 'I need to see Dr. Jenkins on Monday.', time: '10:42 AM', active: true },
  { id: 2, name: 'Mary Wanjiku', phone: '+254722334455', type: 'Billing', lastMessage: 'How much is a maternity consultation?', time: '09:15 AM', active: false },
  { id: 3, name: 'Anonymous User', phone: '+254733445566', type: 'General', lastMessage: 'Are you open on weekends?', time: 'Yesterday', active: false },
];

const mockAppointments = [
  { id: 'APT-001', name: 'Alice Kamau', service: 'Pediatrics', date: '2026-06-28', time: '09:00 AM', status: 'pending' },
  { id: 'APT-002', name: 'Peter Ochieng', service: 'Orthopedics', date: '2026-06-28', time: '11:30 AM', status: 'confirmed' },
  { id: 'APT-003', name: 'Susan Njoroge', service: 'Cardiology', date: '2026-06-29', time: '10:00 AM', status: 'completed' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-8 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'inquiries' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          Live Inquiries
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-8 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'appointments' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          Appointment Queue
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'inquiries' ? (
          <div className="absolute inset-0 flex">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-slate-200 flex flex-col bg-white">
              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Search chats..." className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {mockChats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 border-b border-slate-50 cursor-pointer transition-colors ${selectedChat.id === chat.id ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                        {chat.name}
                        {chat.active && <span className="w-2 h-2 rounded-full bg-secondary"></span>}
                      </h4>
                      <span className="text-[10px] text-slate-400">{chat.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-sm">{chat.type}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-50/50">
              <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm z-10">
                <div>
                  <h3 className="font-bold text-slate-800">{selectedChat.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <Phone className="h-3 w-3" /> {selectedChat.phone}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                    Mark Resolved
                  </button>
                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="h-5 w-5" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex justify-center">
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[70%] shadow-sm">
                    <p className="text-sm">{selectedChat.lastMessage}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">{selectedChat.time}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex gap-2 mb-3">
                  <button className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors">Op Hours</button>
                  <button className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors">Booking Link</button>
                  <button className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors">Location</button>
                </div>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="Type your reply..." className="flex-1 bg-slate-100 border-transparent rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white" />
                  <button className="bg-primary text-white p-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 p-6 overflow-y-auto bg-slate-50/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Incoming Digital Bookings</h3>
              <div className="flex gap-2">
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>All Statuses</option>
                  <option>Pending</option>
                  <option>Confirmed</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{apt.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{apt.name}</td>
                      <td className="px-6 py-4 text-slate-600">{apt.service}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{apt.date}</span>
                          <span className="text-xs text-slate-500">{apt.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                          ${apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            apt.status === 'confirmed' ? 'bg-secondary/20 text-secondary-dark' :
                              'bg-slate-100 text-slate-600'}`}
                        >
                          {apt.status === 'pending' && <Clock className="w-3 h-3" />}
                          {apt.status === 'confirmed' && <CheckCircle className="w-3 h-3 text-secondary" />}
                          {apt.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="text-primary hover:bg-primary/10 p-1.5 rounded transition-colors" title="Confirm">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="text-slate-400 hover:text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors" title="Cancel">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

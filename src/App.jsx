import React, { useState, useEffect } from 'react';
import { Search, Filter, User, Shield, ChevronRight, LogOut, PlusCircle, Award } from 'lucide-react';
import LoginModal from './LoginModal';
import CreateListingModal from './CreateListingModal';
import ExpertModal from './ExpertModal';

const API_URL = '[https://techxchange-api.onrender.com](https://techxchange-api.onrender.com)'; 

const ListingCard = ({ listing }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
    <div className="h-48 overflow-hidden relative">
      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
         {/* Placeholder for real images */}
         <span className="text-4xl">📷</span>
      </div>
      <div className="absolute top-3 left-3">
        <span className="bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full">
          {listing.ip_type || "Patent"}
        </span>
      </div>
    </div>
    <div className="p-5">
      <div className="text-xs text-[#6b7280] font-semibold uppercase tracking-wider mb-2">{listing.category || "General"}</div>
      <h3 className="font-bold text-[#1f2937] text-lg leading-tight mb-3 line-clamp-2">{listing.title}</h3>
      <p className="text-[#6b7280] text-sm mb-4 line-clamp-2">{listing.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="font-bold text-[#111827] text-xl">${listing.price}</span>
        <button className="text-[#F97316] font-semibold text-sm hover:underline flex items-center">
          View <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [listings, setListings] = useState([]);
  const [experts, setExperts] = useState([]);
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null); // 'login', 'create', 'expert'

  const fetchListings = () => {
    fetch(`${API_URL}/api/listings`).then(res => res.json()).then(setListings).catch(console.error);
  };

  const fetchExperts = () => {
    fetch(`${API_URL}/api/experts`).then(res => res.json()).then(setExperts).catch(console.error);
  };

  useEffect(() => {
    fetchListings();
    fetchExperts();
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (data) => {
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-[#1f2937]">
      {/* HEADER */}
      <nav className="bg-[#111827] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
            <Shield className="h-8 w-8 text-[#F97316] mr-2" />
            <span className="font-bold text-xl tracking-tight">TechXchange</span>
          </div>

          <div className="hidden md:flex space-x-8">
            {['Marketplace', 'Experts'].map((item) => (
              <button key={item} onClick={() => setActiveTab(item.toLowerCase())} className={`text-sm font-medium hover:text-[#F97316] transition-colors ${activeTab === item.toLowerCase() ? 'text-[#F97316]' : 'text-gray-200'}`}>
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-3">
                <button onClick={() => setModal('create')} className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded flex gap-2 items-center">
                  <PlusCircle size={16}/> Post IP
                </button>
                {user.role !== 'expert' && (
                    <button onClick={() => setModal('expert')} className="text-sm border border-[#F97316] text-[#F97316] px-3 py-1.5 rounded flex gap-2 items-center">
                    <Award size={16}/> Be Expert
                    </button>
                )}
                <span className="text-sm text-gray-300 ml-2">{user.full_name}</span>
                <button onClick={handleLogout} className="text-gray-400 hover:text-white"><LogOut size={20}/></button>
              </div>
            ) : (
              <button onClick={() => setModal('login')} className="bg-[#F97316] hover:bg-[#ea580c] px-4 py-2 rounded-lg text-sm font-bold transition">
                Log In / Sign Up
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main>
        {activeTab === 'home' || activeTab === 'marketplace' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-[#1f2937] mb-8">Featured IP Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-[#1f2937] mb-8">Expert Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {experts.map(e => (
                <div key={e.id} className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold">{e.full_name}</h3>
                  <p className="text-[#F97316] text-sm">{e.title}</p>
                  <p className="text-gray-500 text-xs mt-2">{e.location} • ${e.hourly_rate}/hr</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {modal === 'login' && <LoginModal onClose={() => setModal(null)} onLogin={handleLogin} apiUrl={API_URL} />}
      {modal === 'create' && <CreateListingModal onClose={() => setModal(null)} apiUrl={API_URL} token={localStorage.getItem('token')} onSuccess={fetchListings} />}
      {modal === 'expert' && <ExpertModal onClose={() => setModal(null)} apiUrl={API_URL} token={localStorage.getItem('token')} />}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Search, Filter, User, Briefcase, Shield, ChevronRight, CheckCircle, Star, LogOut } from 'lucide-react';
import LoginModal from './LoginModal';

// REPLACE THIS WITH YOUR RENDER URL
const API_URL = '[https://techxchange-api.onrender.com](https://techxchange-api.onrender.com)'; 

const ListingCard = ({ listing }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
    <div className="h-48 overflow-hidden relative">
      <img 
        src={listing.image || "[https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400)"} 
        alt={listing.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
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
          View Details <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null); // Real User State
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Fetch Listings
    fetch(`${API_URL}/api/listings`)
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error("API Error", err));

    // Check if user is already logged in (from previous session)
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

  const renderHeader = () => (
    <nav className="bg-[#111827] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
            <Shield className="h-8 w-8 text-[#F97316] mr-2" />
            <span className="font-bold text-xl tracking-tight">TechXchange</span>
          </div>

          <div className="hidden md:flex space-x-8">
            {['Marketplace', 'Experts'].map((item) => (
              <button 
                key={item} onClick={() => setActiveTab(item.toLowerCase())}
                className={`text-sm font-medium hover:text-[#F97316] transition-colors ${activeTab === item.toLowerCase() ? 'text-[#F97316]' : 'text-gray-200'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300">Hello, {user.full_name}</span>
                <button onClick={handleLogout} className="text-gray-400 hover:text-white"><LogOut size={20}/></button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="bg-[#F97316] hover:bg-[#ea580c] px-4 py-2 rounded-lg text-sm font-bold transition">
                Log In / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderMarketplace = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-[#1f2937] mb-8">Featured IP Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.length > 0 ? listings.map(l => <ListingCard key={l.id} listing={l} />) : <div className="text-gray-500">Loading or No Listings...</div>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-[#1f2937]">
      {renderHeader()}
      <main>
        {activeTab === 'home' || activeTab === 'marketplace' ? renderMarketplace() : <div className="p-12 text-center text-gray-500">Feature Coming Soon</div>}
      </main>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} apiUrl={API_URL} />}
    </div>
  );
}
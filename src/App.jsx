import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  Briefcase, 
  Menu, 
  X, 
  Star, 
  MapPin, 
  CheckCircle, 
  ChevronRight,
  Shield,
  FileText
} from 'lucide-react';

// --- VISUAL IDENTITY CONSTANTS ---
const COLORS = {
  primary: '#111827',
  accent: '#F97316', 
  textMain: '#1f2937',
  textSec: '#6b7280',
  bgLight: '#f3f4f6',
};

// --- MOCK DATA ---
// (Used as fallback if backend is not running)

const MOCK_LISTINGS = [
  {
    id: 1,
    title: "AI-Driven Medical Diagnostic Algorithm",
    type: "Patent (Utility)",
    price: "150,000",
    category: "Healthcare",
    description: "A machine learning model capable of detecting early-stage arrhythmia with 99% accuracy.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    title: "Autonomous Drone Delivery System",
    type: "Patent Portfolio",
    price: "2,500,000",
    category: "Logistics",
    description: "Comprehensive stack of 5 patents covering urban navigation, charging docks, and payload management.",
    image: "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    title: "Eco-Friendly Biodegradable Packaging",
    type: "Process Patent",
    price: "75,000",
    category: "Manufacturing",
    description: "Novel chemical process for creating durable packaging from agricultural waste products.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400"
  }
];

const MOCK_EXPERTS = [
  {
    id: 1,
    name: "Dr. Sarah Chen, J.D.",
    title: "Senior Patent Attorney",
    firm: "Global IP Partners",
    rate: "$350/hr",
    rating: 4.9,
    reviews: 124,
    location: "San Francisco, CA",
    skills: ["Biotech", "Pharma", "Litigation"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    name: "James Wilson",
    title: "IP Valuation Consultant",
    firm: "Wilson Strategy Group",
    rate: "$200/hr",
    rating: 4.8,
    reviews: 89,
    location: "New York, NY",
    skills: ["Valuation", "Licensing", "Strategy"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  }
];

// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2 rounded-lg font-medium transition-all duration-200";
  const variants = {
    primary: `bg-[#111827] text-white hover:bg-[#030712]`,
    accent: `bg-[#F97316] text-white hover:bg-[#ea580c]`,
    outline: `border-2 border-[#111827] text-[#111827] hover:bg-gray-50`,
    ghost: `text-[#1f2937] hover:text-[#F97316]`
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const ListingCard = ({ listing }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
    <div className="h-48 overflow-hidden relative">
      {/* Fallback image if one isn't provided */}
      <img 
        src={listing.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400"} 
        alt={listing.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute top-3 left-3">
        <span className="bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full">
          {listing.ip_type || listing.type || "Patent"}
        </span>
      </div>
    </div>
    <div className="p-5">
      <div className="text-xs text-[#6b7280] font-semibold uppercase tracking-wider mb-2">{listing.category || "General"}</div>
      <h3 className="font-bold text-[#1f2937] text-lg leading-tight mb-3 line-clamp-2">{listing.title}</h3>
      <p className="text-[#6b7280] text-sm mb-4 line-clamp-2">{listing.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="font-bold text-[#111827] text-xl">{listing.price ? `$${listing.price}` : "Contact for Price"}</span>
        <button className="text-[#F97316] font-semibold text-sm hover:underline flex items-center">
          View Details <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

const ExpertCard = ({ expert }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center text-center">
    <div className="relative mb-4">
      <img src={expert.image} alt={expert.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#f0f4f8]" />
      <div className="absolute bottom-0 right-0 bg-[#F97316] p-1.5 rounded-full border-2 border-white">
        <CheckCircle size={12} className="text-white" />
      </div>
    </div>
    <h3 className="font-bold text-[#1f2937] text-lg">{expert.name}</h3>
    <p className="text-[#F97316] text-sm font-medium mb-1">{expert.title}</p>
    <p className="text-[#6b7280] text-xs mb-3">{expert.firm}</p>
    
    <div className="flex items-center gap-1 mb-4 text-amber-500 text-sm">
      <Star size={14} fill="currentColor" />
      <span className="font-bold">{expert.rating}</span>
      <span className="text-[#6b7280]">({expert.reviews})</span>
    </div>

    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {expert.skills.map(skill => (
        <span key={skill} className="bg-gray-100 text-[#1f2937] text-xs px-2 py-1 rounded">
          {skill}
        </span>
      ))}
    </div>

    <div className="w-full grid grid-cols-2 gap-3 mt-auto">
      <Button variant="outline" className="text-xs py-2">Profile</Button>
      <Button variant="accent" className="text-xs py-2">Hire</Button>
    </div>
  </div>
);

// --- MAIN APPLICATION ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userRole, setUserRole] = useState('client'); 
  
  // STATE FOR DATA FROM BACKEND
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    // IMPORTANT: When you deploy to Render backend, change this URL to your Render API URL
    // e.g., 'https://techxchange-api.onrender.com/api/listings'
    const API_URL = 'http://localhost:5000/api/listings';

    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(err => {
        // Fallback to mock data if backend is not running
        console.warn("Backend not detected, falling back to mock data.", err);
        setListings(MOCK_LISTINGS);
        setLoading(false);
      });
  }, []);

  const renderHeader = () => (
    <nav className="bg-[#111827] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
            <Shield className="h-8 w-8 text-[#F97316] mr-2" />
            <span className="font-bold text-xl tracking-tight">TechXchange</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {['Marketplace', 'Experts', 'Services', 'Community'].map((item) => (
              <button 
                key={item}
                onClick={() => setActiveTab(item.toLowerCase())}
                className={`text-sm font-medium hover:text-[#F97316] transition-colors ${activeTab === item.toLowerCase() ? 'text-[#F97316]' : 'text-gray-200'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('dashboard')} className="p-2 hover:bg-[#1f2937] rounded-full transition-colors">
              <User size={20} />
            </button>
            <Button variant="accent" className="text-sm py-1.5 px-4 rounded-full">
              Post IP
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHero = () => (
    <div className="bg-[#111827] pt-16 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#F97316] opacity-10 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          The Global Marketplace for <br />
          <span className="text-[#F97316]">Innovation & Intellectual Property</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Buy and sell patents, hire top-tier IP attorneys, and accelerate your technology transfer securely.
        </p>
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-2 shadow-xl flex flex-col md:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search patents, trademarks, or experts..." 
              className="w-full pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] text-gray-800"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-gray-50 border-none text-[#1f2937] px-4 py-3 rounded-md focus:ring-0 cursor-pointer">
              <option>All Categories</option>
              <option>Patents</option>
              <option>Trademarks</option>
              <option>Experts</option>
            </select>
            <Button variant="primary" className="md:w-32">Search</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketplace = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2937]">Featured IP Listings</h2>
          <p className="text-[#6b7280]">Discover curated patents and technologies available for license.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 text-sm">
            <Filter size={16} /> Filters
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading listings from backend...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
            No listings found. Make sure your backend is running!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      )}
    </div>
  );

  const renderExperts = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#1f2937] mb-4">Find IP Professionals</h2>
        <p className="text-[#6b7280] max-w-2xl mx-auto">Connect with verified attorneys...</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-4">
        {MOCK_EXPERTS.map(expert => <ExpertCard key={expert.id} expert={expert} />)}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#f8fafc] min-h-screen">
      <h2 className="text-2xl font-bold text-[#1f2937] mb-8">Dashboard</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500">User Dashboard Placeholder</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-[#1f2937]">
      {renderHeader()}
      <main>
        {activeTab === 'home' && (
          <>
            {renderHero()}
            {renderMarketplace()}
          </>
        )}
        {activeTab === 'marketplace' && renderMarketplace()}
        {activeTab === 'experts' && renderExperts()}
        {activeTab === 'dashboard' && renderDashboard()}
        {(activeTab === 'services' || activeTab === 'community') && (
          <div className="flex flex-col items-center justify-center h-96 text-center">
             <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md">
                <Briefcase size={48} className="text-[#F97316] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#111827] mb-2">Coming Soon</h2>
                <Button onClick={() => setActiveTab('home')}>Return Home</Button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
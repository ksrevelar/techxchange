import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  Briefcase, 
  MessageCircle, 
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
// Primary: Dark Slate (High contrast dark mode feel)
// Accent: Vibrant Orange (from screenshots)

const COLORS = {
  primary: '#111827',
  accent: '#F97316', // Changed to Orange
  textMain: '#1f2937',
  textSec: '#6b7280',
  bgLight: '#f3f4f6',
};

import React, { useState, useEffect } from 'react';
// ... inside the App component function ...

const [listings, setListings] = useState([]);

useEffect(() => {
  // Fetch data from your backend
  fetch('http://localhost:5000/api/listings')
    .then(res => res.json())
    .then(data => setListings(data))
    .catch(err => console.error("Error fetching api:", err));
}, []);


// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2 rounded-lg font-medium transition-all duration-200";
  const variants = {
    primary: `bg-[#111827] text-white hover:bg-[#030712]`,
    accent: `bg-[#F97316] text-white hover:bg-[#ea580c]`, // Orange hover
    outline: `border-2 border-[#111827] text-[#111827] hover:bg-gray-50`,
    ghost: `text-[#1f2937] hover:text-[#F97316]`
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children }) => (
  <span className={`px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-[#c2410c]`}>
    {children}
  </span>
);

const ListingCard = ({ listing }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
    <div className="h-48 overflow-hidden relative">
      <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 left-3">
        <span className="bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full">
          {listing.type}
        </span>
      </div>
    </div>
    <div className="p-5">
      <div className="text-xs text-[#6b7280] font-semibold uppercase tracking-wider mb-2">{listing.category}</div>
      <h3 className="font-bold text-[#1f2937] text-lg leading-tight mb-3 line-clamp-2">{listing.title}</h3>
      <p className="text-[#6b7280] text-sm mb-4 line-clamp-2">{listing.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="font-bold text-[#111827] text-xl">{listing.price}</span>
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
  const [userRole, setUserRole] = useState('client'); // 'client' or 'expert'

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
      {/* Abstract Background Decoration */}
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

        <div className="mt-12 flex justify-center gap-8 text-gray-400 text-sm font-semibold uppercase tracking-widest">
          <span>Trusted By</span>
          <span className="text-gray-300">TechMatch Inc</span>
          <span className="text-gray-300">Global Pharma</span>
          <span className="text-gray-300">University Labs</span>
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
          <select className="border border-[#111827] rounded-lg px-4 text-[#1f2937] text-sm focus:outline-none">
            <option>Sort by: Newest</option>
            <option>Price: Low to High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_LISTINGS.map(listing => <ListingCard key={listing.id} listing={listing} />)}
      </div>
    </div>
  );

  const renderExperts = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#1f2937] mb-4">Find IP Professionals</h2>
        <p className="text-[#6b7280] max-w-2xl mx-auto">Connect with verified attorneys, patent engineers, and valuation experts to secure your innovation.</p>
      </div>

      {/* Expert Profile Header Example (Requested in Prompt) */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-16">
        <div className="bg-[#111827] h-32 relative"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" 
              alt="Profile" 
              className="w-32 h-32 rounded-xl border-4 border-white shadow-md z-10"
            />
            <div className="md:ml-6 mt-4 md:mt-0 flex-grow">
              <h1 className="text-2xl font-bold text-[#1f2937]">Michael Ross, Ph.D.</h1>
              <div className="flex items-center gap-4 text-sm mt-1">
                <span className="text-[#F97316] font-medium">Biotech Patent Agent</span>
                <span className="text-gray-400">•</span>
                <span className="text-[#6b7280] flex items-center gap-1"><MapPin size={14} /> Boston, MA</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
               <Button variant="outline">Message</Button>
               <Button variant="accent">Hire Now</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-gray-100 pt-6">
            <div className="col-span-3">
              <h3 className="font-bold text-[#1f2937] mb-3">About</h3>
              <p className="text-[#6b7280] leading-relaxed">
                Specializing in CRIPSR and mRNA technology patents with over 15 years of experience in both USPTO examination and private practice. I help startups navigate complex freedom-to-operate landscapes.
              </p>
            </div>
            <div className="col-span-1 border-l border-gray-100 pl-8">
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase font-semibold">Hourly Rate</p>
                <p className="text-xl font-bold text-[#111827]">$450/hr</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Success Rate</p>
                <p className="text-xl font-bold text-[#111827]">98%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-4">
        {MOCK_EXPERTS.map(expert => <ExpertCard key={expert.id} expert={expert} />)}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#1f2937]">Dashboard</h2>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button 
            onClick={() => setUserRole('client')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${userRole === 'client' ? 'bg-[#111827] text-white' : 'text-gray-500 hover:text-[#111827]'}`}
          >
            Client View
          </button>
          <button 
            onClick={() => setUserRole('expert')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${userRole === 'expert' ? 'bg-[#111827] text-white' : 'text-gray-500 hover:text-[#111827]'}`}
          >
            Professional View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-fit">
          <nav className="space-y-1">
            {['Overview', 'Messages', 'Settings'].map(item => (
              <a key={item} href="#" className="block px-4 py-2 text-[#1f2937] hover:bg-gray-50 rounded-lg font-medium">
                {item}
              </a>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-100">
               {userRole === 'client' ? (
                 <>
                   <a href="#" className="block px-4 py-2 text-[#6b7280] hover:text-[#F97316]">My Listings</a>
                   <a href="#" className="block px-4 py-2 text-[#6b7280] hover:text-[#F97316]">Hired Experts</a>
                 </>
               ) : (
                 <>
                   <a href="#" className="block px-4 py-2 text-[#6b7280] hover:text-[#F97316]">Active Bids</a>
                   <a href="#" className="block px-4 py-2 text-[#6b7280] hover:text-[#F97316]">Profile Analytics</a>
                 </>
               )}
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#F97316]">
              <p className="text-gray-500 text-sm font-medium">{userRole === 'client' ? 'Active Listings' : 'Profile Views'}</p>
              <p className="text-2xl font-bold text-[#1f2937] mt-1">{userRole === 'client' ? '3' : '1,240'}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#111827]">
              <p className="text-gray-500 text-sm font-medium">{userRole === 'client' ? 'Pending Proposals' : 'Active Jobs'}</p>
              <p className="text-2xl font-bold text-[#1f2937] mt-1">{userRole === 'client' ? '12' : '4'}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
              <p className="text-gray-500 text-sm font-medium">{userRole === 'client' ? 'Total Spent' : 'Earnings (YTD)'}</p>
              <p className="text-2xl font-bold text-[#1f2937] mt-1">{userRole === 'client' ? '$4,500' : '$28,400'}</p>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[#1f2937] mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="bg-blue-50 p-2 rounded-full mr-4">
                    <FileText size={16} className="text-[#111827]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#1f2937] font-medium">
                      {userRole === 'client' 
                        ? 'New proposal received for "Medical Device Patent"' 
                        : 'Your bid for "Blockchain Validation" was viewed'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
        {/* Placeholder for other tabs */}
        {(activeTab === 'services' || activeTab === 'community') && (
          <div className="flex flex-col items-center justify-center h-96 text-center">
             <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md">
                <Briefcase size={48} className="text-[#F97316] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#111827] mb-2">Coming Soon</h2>
                <p className="text-gray-500 mb-6">The {activeTab} module is currently under development in this prototype.</p>
                <Button onClick={() => setActiveTab('home')}>Return Home</Button>
             </div>
          </div>
        )}
      </main>

      <footer className="bg-[#111827] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-[#F97316] mr-2" />
              <span className="font-bold text-lg">TechXchange</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting innovators with the professionals they need to protect and monetize their ideas.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Marketplace</a></li>
              <li><a href="#" className="hover:text-white">Expert Directory</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-sm text-gray-300">support@techxchange.com</p>
            <p className="text-sm text-gray-300 mt-2">1-800-PATENT-1</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
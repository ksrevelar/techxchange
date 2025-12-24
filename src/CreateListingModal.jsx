import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function CreateListingModal({ onClose, apiUrl, token, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: 'Tech', ip_type: 'Patent'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isNaN(formData.price) || formData.price <= 0) {
        alert("Please enter a valid price.");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/listings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Listing Created Successfully!');
        onSuccess();
        onClose();
      } else {
        const text = await res.text();
        alert(`Failed: ${res.status} ${res.statusText}\n${text}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network Error: Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20}/></button>
        <h2 className="text-2xl font-bold mb-4 text-[#111827]">Post IP for Sale</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full p-2 border rounded" 
            placeholder="Title" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})} 
            required 
          />
          <textarea 
            className="w-full p-2 border rounded" 
            placeholder="Description" 
            rows="3" 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="p-2 border rounded" 
              type="number" 
              placeholder="Price ($)" 
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})} 
              required 
            />
            <select 
              className="p-2 border rounded" 
              value={formData.ip_type}
              onChange={e => setFormData({...formData, ip_type: e.target.value})}
            >
              <option value="Patent">Patent</option>
              <option value="Trademark">Trademark</option>
              <option value="Copyright">Copyright</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white py-2 rounded font-bold transition ${loading ? 'bg-gray-400' : 'bg-[#111827] hover:bg-black'}`}
          >
            {loading ? 'Submitting...' : 'Submit Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function CreateListingModal({ onClose, apiUrl, token, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: 'Tech', ip_type: 'Patent'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert('Listing Created!');
        onSuccess();
        onClose();
      }
    } catch (err) {
      alert('Failed to create listing');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20}/></button>
        <h2 className="text-2xl font-bold mb-4">Post IP for Sale</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="Title" onChange={e => setFormData({...formData, title: e.target.value})} required />
          <textarea className="w-full p-2 border rounded" placeholder="Description" rows="3" onChange={e => setFormData({...formData, description: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input className="p-2 border rounded" type="number" placeholder="Price ($)" onChange={e => setFormData({...formData, price: e.target.value})} required />
            <select className="p-2 border rounded" onChange={e => setFormData({...formData, ip_type: e.target.value})}>
              <option>Patent</option><option>Trademark</option><option>Copyright</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-[#111827] text-white py-2 rounded font-bold">Submit Listing</button>
        </form>
      </div>
    </div>
  );
}
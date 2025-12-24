import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ExpertModal({ onClose, apiUrl, token }) {
  const [formData, setFormData] = useState({
    title: '', bio: '', hourly_rate: '', location: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/experts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Profile Created! You are now an Expert.');
        onClose();
      }
    } catch (err) {
      alert('Failed to create profile');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20}/></button>
        <h2 className="text-2xl font-bold mb-4">Join Expert Directory</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="Job Title (e.g. Patent Attorney)" onChange={e => setFormData({...formData, title: e.target.value})} required />
          <textarea className="w-full p-2 border rounded" placeholder="Short Bio & Experience" rows="3" onChange={e => setFormData({...formData, bio: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input className="p-2 border rounded" type="number" placeholder="Hourly Rate ($)" onChange={e => setFormData({...formData, hourly_rate: e.target.value})} required />
            <input className="p-2 border rounded" placeholder="Location" onChange={e => setFormData({...formData, location: e.target.value})} required />
          </div>
          <button type="submit" className="w-full bg-[#111827] text-white py-2 rounded font-bold">Create Profile</button>
        </form>
      </div>
    </div>
  );
}
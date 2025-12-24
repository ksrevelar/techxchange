import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function LoginModal({ onClose, onLogin, apiUrl }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegistering ? '/api/register' : '/api/login';
    const body = isRegistering 
      ? { email, password, full_name: fullName, role: 'inventor' }
      : { email, password };

    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      if (isRegistering) {
        setIsRegistering(false); // Switch to login after signup
        alert("Account created! Please log in.");
      } else {
        onLogin(data); // Success!
        onClose();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <input 
              type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg"
              value={fullName} onChange={e => setFullName(e.target.value)} required 
            />
          )}
          <input 
            type="email" placeholder="Email Address" className="w-full p-3 border rounded-lg"
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Password" className="w-full p-3 border rounded-lg"
            value={password} onChange={e => setPassword(e.target.value)} required 
          />

          <button type="submit" className="w-full bg-[#111827] text-white py-3 rounded-lg font-bold hover:bg-black transition">
            {isRegistering ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {isRegistering ? "Already have an account?" : "No account yet?"}{" "}
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-[#F97316] font-bold hover:underline">
            {isRegistering ? "Log In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

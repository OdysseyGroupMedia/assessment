'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Check your email for a magic login link!');
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4 border rounded max-w-sm mx-auto mt-8">
      <h2 className="text-xl mb-4">Login via Magic Link</h2>
      <input
        className="w-full p-2 border rounded mb-2"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-black text-white py-2 rounded">
        Send Magic Link
      </button>
      {message && <p className="mt-2 text-sm text-center">{message}</p>}
    </form>
  );
}

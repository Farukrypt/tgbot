import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPhone, FiCalendar } from 'react-icons/fi';
import useTelegram from '../hooks/useTelegram';
import { useLang } from '../context/LanguageContext';

const Register = () => {
  const navigate = useNavigate();
  const { user, userId } = useTelegram();
  const { t } = useLang();
  const [formData, setFormData] = useState({ phone: '', age: '' });
  const [loading, setLoading] = useState(false);

  const fields = [
    { name: 'phone', type: 'tel', placeholder: '+2348012345678', icon: FiPhone },
    { name: 'age', type: 'number', placeholder: t.agePlaceholder || 'Age', icon: FiCalendar },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const payload = {
        telegramId: userId || (user && user.id) || 0,
        first_name: (user && user.first_name) || '',
        last_name: (user && user.last_name) || '',
        phone: formData.phone,
        age: Number(formData.age) || 0,
      };

      const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const contentType = response.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) data = await response.json();
      else data = await response.text();

      if (response.ok) {
        navigate('/quiz');
      } else {
        const msg = (data && data.error) ? data.error : (typeof data === 'string' ? data : JSON.stringify(data));
        alert(`Registration failed: ${msg}`);
        console.error('Registration failed:', data);
      }
    } catch (err) {
      console.error('Network or unexpected error during registration', err);
      alert('Registration failed: Network error or server is not reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-12 min-h-screen bg-brand-dark px-6 pb-10 pt-20 text-white">
      <h2 className="mb-6 text-center text-3xl font-bold text-brand-orange">{t.signUp || "Sign Up"}</h2>
      {user && (
        <div className="mb-4 rounded-lg bg-black/20 p-4 text-center">
          <div className="text-sm text-white/80">{t.signingUpAs || "Signing up as"}</div>
          <div className="mt-1 text-lg font-bold">{(user.first_name || '') + (user.last_name ? ' ' + user.last_name : '')}</div>
          <div className="text-xs text-white/60">{t.telegramID || "Telegram ID:"} {userId}</div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((f) => (
          <div key={f.name} className="relative">
            <f.icon className="text-brand-gray-text absolute left-3 top-3.5" />
            <input
              name={f.name}
              type={f.type}
              placeholder={f.placeholder}
              value={formData[f.name]}
              onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
              required
              className="w-full rounded-xl bg-brand-purple p-3 pl-10 outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        ))}
        <button type="submit" disabled={loading} className="mt-4 w-full rounded-xl bg-brand-orange py-4 text-lg font-bold">
          {loading ? t.createAccount : (t.continueToQuiz || "Continue to Quiz")}
        </button>
      </form>
    </div>
  );
};
export default Register;
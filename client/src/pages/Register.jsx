import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiMail, FiCalendar, FiGlobe, FiBriefcase } from 'react-icons/fi';
import useTelegram from '../hooks/useTelegram';
import { useLang } from '../context/LanguageContext';

const Register = () => {
  const navigate = useNavigate();
  const { user, userId } = useTelegram();
  const { t, lang } = useLang();
  const [formData, setFormData] = useState({
    firstName: (user && user.first_name) || '',
    lastName: (user && user.last_name) || '',
    email: '',
    phone: '',
    age: '',
    country: '',
    workplace: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fields = [
    { name: 'firstName', type: 'text', placeholder: t.firstNamePlaceholder || 'John', icon: FiUser, label: t.firstName || 'First Name' },
    { name: 'lastName', type: 'text', placeholder: t.lastNamePlaceholder || 'Doe', icon: FiUser, label: t.lastName || 'Last Name' },
    { name: 'email', type: 'email', placeholder: t.emailPlaceholder || 'john@example.com', icon: FiMail, label: t.email || 'Email' },
    { name: 'phone', type: 'tel', placeholder: t.phonePlaceholder || '+2348012345678', icon: FiPhone, label: t.phone || 'Phone' },
    { name: 'age', type: 'number', placeholder: t.agePlaceholder || 'Age', icon: FiCalendar, label: t.age || 'Age' },
    { name: 'country', type: 'text', placeholder: t.countryPlaceholder || 'Your Country', icon: FiGlobe, label: t.country || 'Country' },
    { name: 'workplace', type: 'text', placeholder: t.workplacePlaceholder || 'Your Workplace', icon: FiBriefcase, label: t.workplace || 'Workplace' },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.age || formData.age < 13 || formData.age > 120) newErrors.age = 'Age must be between 13 and 120';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.workplace.trim()) newErrors.workplace = 'Workplace is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const payload = {
        telegramId: userId || (user && user.id) || 0,
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        age: Number(formData.age) || 0,
        country: formData.country,
        workplace: formData.workplace,
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
    <div className="mb-12 min-h-screen bg-brand-dark px-4 pb-10 pt-20 text-white md:px-6">
      <div className="mx-auto max-w-md">
        <h2 className="mb-2 text-center text-3xl font-bold text-brand-orange">{t.signUp || "Sign Up"}</h2>
        <p className="mb-6 text-center text-sm text-white/70">{t.completeYourProfile || "Complete your profile to qualify for rewards"}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="mb-2 block text-xs font-semibold uppercase text-white/80">{f.label}</label>
              <div className="relative">
                <f.icon className="text-brand-gray-text absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                <input
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={formData[f.name]}
                  onChange={(e) => {
                    setFormData({ ...formData, [f.name]: e.target.value });
                    if (errors[f.name]) setErrors({ ...errors, [f.name]: '' });
                  }}
                  className={`w-full rounded-lg bg-brand-purple/50 px-4 py-3 pl-11 outline-none transition ${errors[f.name]
                    ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500/50'
                    : 'border border-white/10 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/50'
                    }`}
                />
                {errors[f.name] && <span className="mt-1 block text-xs text-red-400">{errors[f.name]}</span>}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-brand-orange py-4 text-lg font-bold text-black transition hover:bg-orange-500 disabled:opacity-50"
          >
            {loading ? t.createAccount : (t.continueToQuiz || "Continue to Quiz")}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Register;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiMapPin, FiPhone, FiCreditCard, FiAlertCircle } from 'react-icons/fi';
import useTelegram from '../hooks/useTelegram';
import { useLang } from '../context/LanguageContext';

const ClaimProfile = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const { user, userId } = useTelegram();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasPassedQuiz, setHasPassedQuiz] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);


  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/check?id=${userId}`);
        const data = await res.json();
        if (res.ok && data.registered) {
          setIsRegistered(true);
          setHasPassedQuiz(Boolean(data.user?.hasPassedQuiz));
          setUserData(data.user);
        } else {
          setIsRegistered(false);
          setHasPassedQuiz(false);
          setUserData(null);
        }
      } catch (err) {
        console.error('Failed to fetch user data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleRedirect = () => {
    if (!isRegistered) {
      navigate('/register');
    } else if (!hasPassedQuiz) {
      navigate('/quiz');
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center px-6 pt-20 text-xl text-brand-orange">{t.loadingProfile || "Loading Profile..."}</div>;
  }

  const fields = [
    { label: t.name || 'Full Name', value: userData?.name, icon: FiUser },
    { label: t.country || 'Country', value: userData?.country, icon: FiMapPin },
    { label: t.phone || 'Phone Number', value: userData?.phone, icon: FiPhone },
    { label: t.email || 'Email Address', value: userData?.email, icon: FiMail },
    { label: t.accountNumber || 'Account Number', value: userData?.accountNumber, icon: FiCreditCard },
  ];

  return (
    <div className="min-h-screen bg-brand-dark px-6 pb-10 pt-20 text-white">
      <h2 className="mb-8 text-center text-3xl font-bold text-brand-orange">{t.claimPageTitle || 'Your Prize Claim Profile'}</h2>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-brand-purple p-6 shadow-xl">
        <h3 className="mb-4 border-b border-white/10 pb-2 text-xl font-bold">{t.userInformation || "User Information"}</h3>

        {fields.map((f, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
            <div className="text-brand-gray-text flex items-center space-x-3">
              <f.icon className="h-5 w-5" />
              <span className="font-medium">{f.label}:</span>
            </div>
            <span className="font-semibold text-white">{f.value || (isRegistered ? '—' : t.notProvided || 'Not provided')}</span>
          </div>
        ))}

        <div className="pt-4 text-center">
          <p className="text-brand-yellow text-sm font-bold">{t.claimInstruction || 'Please verify your details. Prizes will be sent based on this information.'}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {!isRegistered ? (
            <button
              onClick={() => setShowRegisterModal(true)}
              className="w-full rounded-xl bg-brand-orange py-3.5 text-lg font-bold transition hover:bg-orange-600"
            >
              {t.registerToClaim || "Register to Claim"}
            </button>
          ) : !hasPassedQuiz ? (
            <button
              onClick={() => navigate('/quiz')}
              className="w-full rounded-xl bg-brand-orange py-3.5 text-lg font-bold transition hover:bg-orange-600"
            >
              {t.takeQuizToClaim || "Take Quiz to Claim"}
            </button>
          ) : (
            <a
              href="https://t.me/Mustafa_AghaOfficial"
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-xl bg-brand-orange py-3.5 text-center text-lg font-bold text-white transition hover:bg-orange-600"
            >
              {t.messageAdminToClaim || "Message Admin to Claim"}
            </a>
          )}
        </div>
      </div>

      {/* Register Modal for unregistered users */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-brand-purple p-6 text-center">
            <h3 className="mb-2 text-xl font-bold">{t.registerToClaimModal || "Register to Claim"}</h3>
            <p className="mb-4 text-white/80">{t.registerToClaimDesc || "You need to register to be eligible for rewards. Tap below to complete your registration."}</p>
            <div className="flex gap-3">
              <button onClick={() => { setShowRegisterModal(false); navigate('/register'); }} className="flex-1 rounded bg-brand-orange py-3 font-bold">{t.registerNow || "Register Now"}</button>
              <button onClick={() => setShowRegisterModal(false)} className="flex-1 rounded border border-white/20 py-3">{t.cancel || "Cancel"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ClaimProfile;
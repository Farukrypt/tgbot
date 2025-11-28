import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiX, FiCheck, FiMessageCircle } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [code, setCode] = useState("");

  // MOCK USER STATE (Replace with real API check)
  const isRegistered = false; // Toggle this to true to see "Play Now"
  const telegramId = 12345;

  // 1. Auto Carousel (3 Seconds)
  const slides = [
    { title: t.welcome, sub: "1,000,000", color: "bg-purple-600" },
    { title: "Instant Cash", sub: "500 Coins", color: "bg-blue-600" },
    { title: "Luxury Car", sub: "Dream Big", color: "bg-orange-600" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 2. Actions
  const handleHeroClick = () => {
    if (isRegistered) {
      document.getElementById('cards-section').scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/register');
    }
  };

  const verifyCode = async () => {
    // API Call to /api/unlock
    console.log(`Checking code ${code} for user ${telegramId}`);
    setModalOpen(false);
    setCode("");
  };

  return (
    <div className="pt-20 pb-24 px-4 space-y-8">

      {/* HERO CAROUSEL */}
      <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
        {slides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${slideIndex === i ? 'opacity-100' : 'opacity-0'} ${slide.color}`}>
            <h2 className="text-2xl font-bold text-white">{slide.title}</h2>
            <p className="text-white/80 mb-4">{slide.sub}</p>
            <button onClick={handleHeroClick} className="bg-white text-black px-6 py-2 rounded-full font-bold">
              {isRegistered ? t.play : t.register}
            </button>
          </div>
        ))}
      </div>

      {/* TESTIMONIALS (Manual Scroll) */}
      <div>
        <h3 className="text-white font-bold mb-2">{t.winners}</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="min-w-[150px] bg-brand-light-purple p-3 rounded-xl border border-white/10">
              <div className="text-yellow-400 text-xs">★★★★★</div>
              <div className="text-white text-xs mt-1">"User {i} won!"</div>
            </div>
          ))}
        </div>
      </div>

      {/* LOCKED CARDS */}
      <div id="cards-section">
        <h3 className="text-white font-bold mb-2">{t.rewards}</h3>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(id => (
            <div key={id} className="aspect-square bg-gray-800 rounded-xl relative p-3 flex flex-col justify-between border border-white/10">
              <div className="flex justify-between">
                <span className="text-[10px] bg-black/50 px-2 rounded text-white">{t.locked}</span>
                <FiLock className="text-white/50" />
              </div>
              <div className="text-center font-bold text-white">Reward {id}</div>
              <button
                onClick={() => { setSelectedCard(id); setModalOpen(true); }}
                className="bg-brand-orange text-white text-xs py-2 rounded"
              >
                {t.unlock}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-brand-purple w-full max-w-sm rounded-2xl p-6 relative border border-white/20">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-white"><FiX /></button>

            <h3 className="text-xl text-white font-bold text-center mb-4">{t.enterCode}</h3>

            <input
              className="w-full bg-black/30 text-white text-center text-2xl p-3 rounded-lg mb-4 tracking-widest border border-white/10"
              placeholder="XXXXXX"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value)}
            />

            <button onClick={verifyCode} className="w-full bg-brand-orange text-white py-3 rounded-lg mb-3 flex justify-center items-center gap-2 font-bold">
              <FiCheck /> {t.verify}
            </button>

            {/* MESSAGE ADMIN BUTTON */}
            <a
              href="https://t.me/Mustafa_AghaOfficial"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-white/10 text-white py-3 rounded-lg flex justify-center items-center gap-2 font-bold"
            >
              <FiMessageCircle /> {t.askAdmin}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
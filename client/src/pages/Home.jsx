import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiCheckCircle, FiX, FiCheck, FiMessageCircle } from 'react-icons/fi';
import useTelegram from '../hooks/useTelegram';
import { useLang } from '../context/LanguageContext';
import mbcLogo from '../assets/images/mbc-logo.png';
import banner1En from '../assets/images/banner1-en.png';
import banner2En from '../assets/images/banner2-en.png';
import banner3En from '../assets/images/banner3-en.png';
import banner1Ar from '../assets/images/banner1-ar.png';
import banner2Ar from '../assets/images/banner2-ar.png';
import banner3Ar from '../assets/images/banner3-ar.png';
import testimonial1 from '../assets/images/testimonial-1.jpeg';
import testimonial2 from '../assets/images/testimonial-2.jpeg';
import testimonial3 from '../assets/images/testimonial-3.jpeg';

const Home = () => {
    const navigate = useNavigate();
    const { userId } = useTelegram();
    const { t, lang } = useLang();

    // State
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isRegistered, setIsRegistered] = useState(false);
    const [hasPassedQuiz, setHasPassedQuiz] = useState(false);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [code, setCode] = useState("");
    const [showWinnerPopup, setShowWinnerPopup] = useState(false);
    const [codeLoading, setCodeLoading] = useState(false);
    const [codeError, setCodeError] = useState(null);
    const [codeSuccess, setCodeSuccess] = useState(false);

    // --- 1. CAROUSEL DATA & LOGIC ---
    const slides = lang === 'en'
        ? [
            { id: 1, image: banner1En },
            { id: 2, image: banner2En },
            { id: 3, image: banner3En }
        ]
        : [
            { id: 1, image: banner1Ar },
            { id: 2, image: banner2Ar },
            { id: 3, image: banner3Ar }
        ];

    // Fixed Auto-Slide Logic
    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // 3 Seconds

        // Cleanup function to prevent memory leaks or double timers
        return () => clearInterval(interval);
    }, [slides.length]);

    // --- 2. REGISTRATION & QUIZ CHECK ---
    useEffect(() => {
        if (!userId) return;

        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const check = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/check?id=${userId}`);
                const data = await res.json();
                if (res.ok && data.registered) {
                    setIsRegistered(true);
                    setHasPassedQuiz(Boolean(data.user?.hasPassedQuiz));
                } else {
                    setIsRegistered(false);
                    setHasPassedQuiz(false);
                }
            } catch (err) {
                console.error('Failed to check registration', err);
            }
        };
        check();
    }, [userId]);

    const handleMainButton = () => {
        if (!isRegistered) {
            navigate('/register');
        } else {
            if (hasPassedQuiz) {
                setShowWinnerPopup(true);
            } else {
                navigate('/quiz');
            }
        }
    };

    const handleUnlockClick = (id) => {
        setSelectedCardId(id);
        setModalOpen(true);
        setCode("");
        setCodeError(null);
        setCodeSuccess(false);
    };

    const verifyCode = async () => {
        if (!code.trim()) {
            setCodeError(t.pleaseEnterCode || 'Please enter a code');
            return;
        }

        setCodeLoading(true);
        setCodeError(null);

        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const res = await fetch(`${API_BASE}/api/unlock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegramId: userId || 12345, code }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setCodeSuccess(true);
            } else {
                setCodeError(data.message || t.invalidCode || 'Invalid code. Please try again or chat admin for the correct code.');
            }
        } catch (err) {
            console.error('Code verification error', err);
            setCodeError(t.networkError || 'Network error. Please try again or chat admin.');
        } finally {
            setCodeLoading(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8 px-4 pb-24 pt-20">

            {/* --- HERO CAROUSEL --- */}
            <div className="relative">
                <div className="relative h-48 w-full overflow-hidden rounded-2xl shadow-2xl">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 flex flex-col items-center justify-center text-center p-4 transition-opacity duration-1000 ease-in-out bg-cover bg-center
                  ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                        </div>
                    ))}

                    {/* Carousel Dots (Manual Navigation) */}
                    <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center space-x-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-white w-6' : 'bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Button positioned below carousel */}
                <div className="mt-4 flex justify-center">
                    {!isRegistered ? (
                        <button
                            onClick={() => navigate('/register')}
                            className="transform rounded-full bg-brand-orange px-8 py-3 font-bold text-white shadow-lg transition hover:bg-orange-600 active:scale-95"
                        >
                            {t.register}
                        </button>
                    ) : (
                        <a
                            href="https://t.me/Mustafa_AghaOfficial"
                            target="_blank"
                            rel="noreferrer"
                            className="transform inline-block rounded-full bg-brand-orange px-8 py-3 font-bold text-white shadow-lg transition hover:bg-orange-600 active:scale-95"
                        >
                            {t.messageAdmin}
                        </a>
                    )}
                </div>
            </div>

            {/* --- WINNERS CIRCLE (Testimonials) --- */}
            <div>
                <h3 className="mb-3 text-lg font-bold text-white">{t.winners || "Winners Circle"}</h3>
                <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
                    {[
                        { id: 1, image: testimonial1 },
                        { id: 2, image: testimonial2 },
                        { id: 3, image: testimonial3 }
                    ].map((testimonial) => (
                        <div key={testimonial.id} className="flex min-w-[140px] flex-col items-center rounded-xl border border-white/10 bg-brand-light-purple p-4 shadow-md">
                            <div className="mb-2 h-12 w-12 overflow-hidden rounded-full border-2 border-brand-orange bg-gray-700">
                                {/* Testimonial Avatar Image */}
                                <img src={testimonial.image} alt="Testimonial" className="h-full w-full object-cover" />
                            </div>
                            <div className="text-brand-yellow mb-1 text-xs">★★★★★</div>
                            <div className="text-center text-xs italic text-white">"{t.winInstantly || "Win instantly!"}"</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- LOCKED REWARDS --- */}
            <div id="cards-section">
                {
                    [
                        { en: 'Streak', ar: 'تتابع' },
                        { en: 'Scratch', ar: 'احك' },
                        { en: 'Quest', ar: 'مهمة' },
                        { en: 'Bonus', ar: 'مكافأة' }
                    ].map((title, i) => {
                        const cardTitle = lang === 'en' ? title.en : title.ar;
                        return (
                            <div
                                key={i}
                                className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-xl border border-white/5 p-3 shadow-lg"
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 z-0 bg-cover bg-center opacity-50 transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url('/src/assets/images/${cardTitle.toLowerCase()}.png')` }}
                                />
                                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 to-transparent" />

                                {/* Content */}
                                <div className="relative z-10 flex items-start justify-between">
                                    <span className="rounded bg-brand-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">{t.locked || "Locked"}</span>
                                    <FiLock className="text-white/80" />
                                </div>

                                <div className="relative z-10 mt-auto">
                                    <div className="mb-2 text-center text-lg font-bold text-white">{cardTitle}</div>
                                    <button
                                        onClick={() => handleUnlockClick(i)}
                                        className="w-full rounded border border-white/10 bg-white/20 py-2 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-brand-orange"
                                    >
                                        {t.unlock || "Unlock"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            {/* --- CODE ENTRY MODAL --- */}
            {
                modalOpen && (
                    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                        <div className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-brand-purple p-6 shadow-2xl">
                            <button
                                onClick={() => { setModalOpen(false); setCode(""); setCodeError(null); setCodeSuccess(false); }}
                                className="absolute right-4 top-4 text-white/50 hover:text-white"
                            >
                                <FiX size={24} />
                            </button>

                            <h3 className="mb-3 text-center text-xl font-bold text-white">{t.enterCode || "Enter Code"}</h3>

                            <input
                                className="mb-6 w-full rounded-xl border border-white/10 bg-brand-dark py-4 text-center font-mono text-3xl uppercase tracking-[0.5em] text-white outline-none focus:border-brand-orange"
                                placeholder="......"
                                maxLength={6}
                                value={code}
                                onChange={e => setCode(e.target.value.toUpperCase())}
                                disabled={codeLoading}
                            />

                            {codeError && (
                                <div className="mb-4 rounded bg-red-500/20 p-3 text-sm text-red-300">
                                    {codeError}
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={verifyCode}
                                    disabled={codeLoading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 font-bold text-white transition hover:bg-orange-600 disabled:opacity-50"
                                >
                                    <FiCheck /> {codeLoading ? t.verifying : (t.verify || "Verify Code")}
                                </button>

                                <a
                                    href="https://t.me/Mustafa_AghaOfficial"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 py-3.5 font-bold text-white transition hover:bg-white/10"
                                >
                                    <FiMessageCircle /> {t.getCodeFromAdmin || "Get Code from Admin"}
                                </a>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* --- ERROR CODE DIALOG --- */}
            {
                codeError && !codeSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                        <div className="w-full max-w-sm rounded-2xl bg-brand-purple p-6 text-center">
                            <h3 className="mb-3 text-xl font-bold text-red-400">{t.wrongCode || "Wrong Code"}</h3>
                            <p className="mb-6 text-white/80">{t.wrongCodeMessage || "The code you entered is incorrect. Please chat with admin to get the correct code and try again."}</p>
                            <div className="flex gap-3">
                                <a href="https://t.me/Mustafa_AghaOfficial" target="_blank" rel="noreferrer" className="flex-1 rounded bg-brand-orange py-3 font-bold">{t.chatAdmin || "Chat Admin"}</a>
                                <button onClick={() => { setCodeError(null); setCode(""); }} className="flex-1 rounded border border-white/20 py-3">{t.tryAgain || "Try Again"}</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* --- SUCCESS CODE DIALOG --- */}
            {
                codeSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                        <div className="w-full max-w-sm rounded-2xl bg-brand-purple p-6 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                                <FiCheckCircle className="h-10 w-10 text-green-500" />
                            </div>
                            <h3 className="mb-3 text-2xl font-bold text-green-400">{t.congratulations || "Congratulations!"}</h3>
                            <p className="mb-6 text-white/80">{t.wonMessage || "You've won"} <span className="text-2xl font-bold text-brand-orange">$100,000</span>! 🎉</p>
                            <p className="mb-6 text-sm text-white/60">{t.claimPrize || "Chat with admin to claim your prize"}</p>
                            <div className="flex gap-3">
                                <a href="https://t.me/Mustafa_AghaOfficial" target="_blank" rel="noreferrer" className="flex-1 rounded bg-brand-orange py-3 font-bold">{t.messageAdmin || "Message Admin"}</a>
                                <button onClick={() => { setCodeSuccess(false); setModalOpen(false); setCode(""); }} className="flex-1 rounded border border-white/20 py-3">{t.close || "Close"}</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* --- WINNER POPUP --- */}
            {
                showWinnerPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm">
                        <div className="animate-bounce-in w-full max-w-sm rounded-2xl border border-white/20 bg-brand-purple p-8 text-center shadow-2xl">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                                <FiCheckCircle className="h-10 w-10 text-green-500" />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold text-white">{t.welcomeBack || "Welcome Back!"}</h2>
                            <p className="mb-8 leading-relaxed text-white/80">
                                {t.alreadyQualified || "You have already qualified for the rewards."}
                            </p>
                            <button
                                onClick={() => navigate('/claim')}
                                className="w-full rounded-xl bg-brand-orange py-3.5 font-bold text-white shadow-lg transition hover:bg-orange-600"
                            >
                                {t.goToClaimPage || "Go to Claim Page"}
                            </button>
                            <button
                                onClick={() => setShowWinnerPopup(false)}
                                className="mt-6 text-sm text-white/40 hover:text-white"
                            >
                                {t.close || "Close"}
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Home;
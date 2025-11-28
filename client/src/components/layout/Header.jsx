import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiGlobe } from 'react-icons/fi';
import { useUI } from '../../context/UIContext';
import { useLang } from '../../context/LanguageContext';
import mbcLogo from '../../assets/images/mbc-logo.png';

const Header = () => {
    const { toggleMenu } = useUI();
    const { lang, toggleLang } = useLang();
    const [showLangMenu, setShowLangMenu] = useState(false);

    const handleLangSelect = (selectedLang) => {
        if (lang !== selectedLang) toggleLang();
        setShowLangMenu(false);
    };

    return (
        <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between bg-brand-purple p-4 shadow-md">
            <button onClick={toggleMenu} className="rounded-lg p-2 text-white hover:bg-white/10">
                <FiMenu size={24} />
            </button>

            {/* LOGO */}
            <div className="flex h-10 w-32 items-center justify-center overflow-hidden rounded bg-white/10">
                <img src={mbcLogo} alt="MBC Logo" className="h-full object-contain" />
            </div>

            {/* LANGUAGE DROPDOWN */}
            <div className="relative">
                <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="rounded-lg p-2 text-white hover:bg-white/10"
                >
                    <FiGlobe size={24} />
                </button>

                {showLangMenu && (
                    <div className="animate-fade-in absolute right-0 top-12 w-32 overflow-hidden rounded-lg bg-white text-black shadow-xl">
                        <button
                            onClick={() => handleLangSelect('en')}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-brand-orange hover:text-white ${lang === 'en' ? 'bg-gray-200' : ''}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => handleLangSelect('ar')}
                            className={`block w-full text-right px-4 py-2 text-sm hover:bg-brand-orange hover:text-white ${lang === 'ar' ? 'bg-gray-200' : ''}`}
                        >
                            العربية
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
export default Header;
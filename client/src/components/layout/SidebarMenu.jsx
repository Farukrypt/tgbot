import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiGlobe, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiHome, FiAward, FiHelpCircle, FiFileText, FiGift } from 'react-icons/fi';
import { useUI } from '../../context/UIContext';
import { useLang } from '../../context/LanguageContext';

const SidebarMenu = () => {
    const { isMenuOpen, closeMenu } = useUI();
    const { toggleLang, lang, t } = useLang();
    const navigate = useNavigate();

    // Helper to handle navigation and closing menu
    const handleNav = (path) => {
        navigate(path);
        closeMenu();
    };

    return (
        <>
            {/* Overlay (Click to close) */}
            <div
                className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={closeMenu}
            />

            {/* Sidebar Drawer - RTL Fix applied here: right-0 and rtl:left-auto for position, and correct transform logic */}
            <div className={`fixed top-0 h-full w-3/4 max-w-xs bg-brand-purple z-50 transform transition-transform duration-300 shadow-2xl flex flex-col 
          
          ${lang === 'ar'
                    ? 'right-0 left-auto rtl:right-0 rtl:left-auto'
                    : 'left-0 right-auto rtl:right-0 rtl:left-auto'} 
          
          ${isMenuOpen
                    ? 'translate-x-0' // Always visible state
                    : lang === 'ar' ? 'translate-x-full' : '-translate-x-full' // Hidden state based on language
                }`}
            >

                {/* Header Section */}
                <div className="p-5 flex justify-between items-center border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">{t.menu || "Menu"}</h2>
                    <button onClick={closeMenu} className="text-white p-2 hover:bg-white/10 rounded-full">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Menu Links */}
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    <MenuItem icon={<FiHome />} label={t.homeMenu || "Home"} onClick={() => handleNav('/')} />
                    <MenuItem icon={<FiAward />} label={t.winnersMenu || "Winners"} onClick={() => handleNav('/winners')} />
                    <MenuItem icon={<FiGift />} label={t.prizesMenu || "Prizes"} onClick={() => handleNav('/prizes')} />
                    <MenuItem icon={<FiFileText />} label={t.termsMenu || "Terms and Conditions"} onClick={() => handleNav('/terms')} />
                    <MenuItem icon={<FiHelpCircle />} label={t.helpMenu || "Help"} onClick={() => handleNav('/help')} />

                    {/* Language Toggle Special Item */}
                    <button
                        onClick={toggleLang}
                        className="w-full flex items-start justify-between px-4 py-3 text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <div className="flex items-start space-x-4 rtl:space-x-reverse rtl:flex-row-reverse flex-1">
                            <FiGlobe size={20} className="text-brand-orange flex-shrink-0" />
                            <span className="font-medium">
                                {t.changeLanguage || "Change Language"}
                            </span>
                        </div>
                        <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded uppercase flex-shrink-0 order-last rtl:order-first ltr:ml-2 rtl:mr-2 self-start">
                            {lang === 'en' ? t.english : t.arabic}
                        </span>
                    </button>
                </nav>

                {/* Footer Section */}
                <div className="p-6 border-t border-white/10 bg-brand-dark/30">

                    {/* Social Media Icons */}
                    <div className="flex justify-center space-x-6 mb-6">
                        <SocialIcon icon={<FiFacebook />} href="#" />
                        <SocialIcon icon={<FiInstagram />} href="#" />
                        <SocialIcon icon={<FiTwitter />} href="#" />
                        <SocialIcon icon={<FiYoutube />} href="#" />
                    </div>

                    {/* Copyright */}
                    <div className="text-center text-brand-gray-text text-xs">
                        <p>{t.copyright || "© 2022. Dream All Right Reserved."}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

// Helper Components for cleaner code
const MenuItem = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center space-x-4 rtl:space-x-reverse px-4 py-3 text-white hover:bg-white/5 rounded-lg transition-colors"
    >
        <span className="text-brand-orange text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
    </button>
);

const SocialIcon = ({ icon, href }) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-white hover:text-brand-orange transition-colors text-xl bg-white/10 p-2 rounded-full"
    >
        {icon}
    </a>
);

export default SidebarMenu;
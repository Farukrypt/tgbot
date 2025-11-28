import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const Help = () => {
    const { t } = useLang();

    return (
        <div className="min-h-screen px-6 pt-24 text-white">
            <h2 className="mb-4 text-2xl font-bold text-brand-orange">{t.helpCenter || "Help Center"}</h2>
            <p className="text-brand-gray-text mb-6">{t.needAssistance || "Need assistance? Here are some quick steps:"}</p>
            <ol className="list-decimal list-inside text-white/80 space-y-2">
                <li>{t.helpStep1 || "Make sure you are registered through the Register page."}</li>
                <li>{t.helpStep2 || "If you have issues with rewards, message the admin via the Telegram link provided in the app."}</li>
                <li>{t.helpStep3 || "For payment or prize fulfillment, we will request verification details."}</li>
            </ol>

            <Link to="/" className="mt-6 inline-block rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/10">{t.backHome || "Back Home"}</Link>
        </div>
    );
};

export default Help;

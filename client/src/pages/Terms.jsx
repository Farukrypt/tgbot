import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const Terms = () => {
    const { t } = useLang();

    return (
        <div className="min-h-screen px-6 pt-24 text-white">
            <h2 className="mb-4 text-2xl font-bold text-brand-orange">{t.termsConditions || "Terms & Conditions"}</h2>
            <div className="prose max-w-none space-y-4 text-white/80">
                <p>{t.termsText1 || "This demo app is for illustrative purposes. By participating you agree to the following:"}</p>
                <ul className="list-inside list-disc space-y-2">
                    <li>{t.termsItem1 || "Prizes are distributed at the discretion of the organizer."}</li>
                    <li>{t.termsItem2 || "Winners may be required to provide identity verification to claim prizes."}</li>
                    <li>{t.termsItem3 || "Personal data will be used solely for prize fulfillment."}</li>
                </ul>
            </div>

            <Link to="/" className="mt-6 inline-block rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/10">{t.backHome || "Back Home"}</Link>
        </div>
    );
};

export default Terms;

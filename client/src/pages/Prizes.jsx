import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const Prizes = () => {
    const { t } = useLang();

    const prizes = [
        // Cash Prizes
        { title: t.cash10k || "$10,000 Cash", desc: t.bankTransfer || "Bank transfer" },
        { title: t.cash100k || "$100,000 Cash", desc: t.bankTransfer || "Bank transfer" },
        { title: t.cash500k || "$500,000 Cash", desc: t.bankTransfer || "Bank transfer" },
        { title: t.cash1000000 || "$1,000,000 Cash", desc: t.bankTransfer || "Bank transfer" },
        // Car Prizes
        { title: t.mercedesBenz || "Mercedes-Benz S-Class", desc: t.latestModel || "Latest model" },
        { title: t.teslaModelS || "Tesla Model S", desc: t.latestModel || "Latest model" },
        { title: t.porsche911 || "Porsche 911", desc: t.latestModel || "Latest model" },
        // House Prizes
        { title: t.luxuryVilla || "Luxury Villa", desc: t.beautifulHome || "Beautiful home" },
        { title: t.modernApartment || "Modern Apartment", desc: t.beautifulHome || "Beautiful home" },
        { title: t.beachHouse || "Beach House", desc: t.beautifulHome || "Beautiful home" },
        { title: t.penthouse || "Penthouse", desc: t.beautifulHome || "Beautiful home" },
        // Vouchers
        { title: t.fashionVoucher || "Fashion Voucher", desc: t.shoppingVoucher || "Shopping Voucher" },
        { title: t.electronicsVoucher || "Electronics Voucher", desc: t.shoppingVoucher || "Shopping Voucher" },
        { title: t.travelVoucher || "Travel Voucher", desc: t.vacationPackage || "Vacation Package" },
        { title: t.diningVoucher || "Dining Voucher", desc: t.shoppingVoucher || "Shopping Voucher" },
        { title: t.homeDecorVoucher || "Home Decor Voucher", desc: t.shoppingVoucher || "Shopping Voucher" }
    ];

    return (
        <div className="min-h-screen px-6 pt-24 text-white">
            <h2 className="mb-4 text-2xl font-bold text-brand-orange">{t.prizesGallery || "Prizes Gallery"}</h2>
            <p className="text-brand-gray-text mb-6">{t.explorePrizes || "Explore the suggested prizes you can win. Actual prizes and amounts may vary per campaign."}</p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {prizes.map((p, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-brand-purple p-4 shadow-md hover:border-brand-orange/30 transition">
                        <div className="text-lg font-bold">{p.title}</div>
                        <div className="text-brand-gray-text mt-2 text-sm">{p.desc}</div>
                    </div>
                ))}
            </div>

            <Link to="/" className="mt-6 inline-block rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/10">{t.backHome || "Back Home"}</Link>
        </div>
    );
};

export default Prizes;

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const Winners = () => {
    const { t } = useLang();

    // Generate 50 random winners with randomized prizes using deterministic seed
    const winners = useMemo(() => {
        const firstNames = {
            en: ['Ahmed', 'Sarah', 'Mohammed', 'Fatima', 'Ali', 'Aisha', 'Hassan', 'Layla', 'Omar', 'Noor', 
                  'Ibrahim', 'Zainab', 'Karim', 'Hana', 'Youssef', 'Maya', 'Khalid', 'Dina', 'Rashid', 'Sara',
                  'Faisal', 'Leila', 'Samir', 'Yasmin', 'Tariq', 'Rania', 'Adel', 'Lina', 'Majid', 'Hoor',
                  'Hamad', 'Joud', 'Jamal', 'Nada', 'Salim', 'Razan', 'Sami', 'Rana', 'Walid', 'Noon',
                  'Yazid', 'Tala', 'Zahir', 'Sama', 'Nasir', 'Noor', 'Amjad', 'Hind', 'Rashid', 'Jaha'],
            ar: ['أحمد', 'سارة', 'محمد', 'فاطمة', 'علي', 'عائشة', 'حسن', 'ليلى', 'عمر', 'نور',
                 'إبراهيم', 'زينب', 'كريم', 'هناء', 'يوسف', 'مايا', 'خالد', 'دينا', 'راشد', 'سارا',
                 'فيصل', 'ليلى', 'سمير', 'ياسمين', 'طارق', 'رانيا', 'عادل', 'لينا', 'ماجد', 'هور',
                 'حمد', 'جود', 'جمال', 'ندى', 'سالم', 'رزان', 'سامي', 'رنا', 'وليد', 'نون',
                 'يزيد', 'تالا', 'ظاهر', 'سما', 'ناصر', 'نور', 'امجد', 'هند', 'راشد', 'جاهة']
        };

        const lastInitials = ['K.', 'A.', 'M.', 'H.', 'S.', 'R.', 'Y.', 'F.', 'T.', 'N.'];

        const prizeKeys = [
            'cash10k', 'cash50k', 'cash100k', 'cash500k', 'cash1000000',
            'mercedesBenz', 'bmwX7', 'teslaModelS', 'rangeRoverSport', 'audiA8', 'porsche911',
            'luxuryVilla', 'modernApartment', 'beachHouse', 'penthouse', 'countryside',
            'fashionVoucher', 'electronicsVoucher', 'travelVoucher', 'diningVoucher', 'homeDecorVoucher'
        ];

        // Seeded random function for deterministic results
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        const lang = t.english ? 'en' : 'ar';
        const winnersList = [];

        for (let i = 0; i < 50; i++) {
            const firstName = firstNames[lang][i % firstNames[lang].length];
            const lastInitialIndex = Math.floor(seededRandom(i * 11) * lastInitials.length);
            const lastInitial = lastInitials[lastInitialIndex];
            const prizeKeyIndex = Math.floor(seededRandom(i * 17) * prizeKeys.length);
            const prizeKey = prizeKeys[prizeKeyIndex];

            winnersList.push({
                name: `${firstName} ${lastInitial}`,
                prize: t[prizeKey] || prizeKey
            });
        }

        return winnersList;
    }, [t]);

    return (
        <div className="min-h-screen px-6 pt-24 text-white">
            <h2 className="mb-4 text-2xl font-bold text-brand-orange">{t.winnersCircle || "Winners Circle"}</h2>
            <p className="text-brand-gray-text mb-6">{t.winnersCongrats || "Congratulations to recent winners! This page contains anonymized, verified winner listings and prize details."}</p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {winners.map((w, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-brand-purple p-4 shadow-md transition hover:border-brand-orange/30">
                        <div className="text-sm text-white/80">{t.winner || "Winner"} #{i + 1}</div>
                        <div className="mt-1 text-lg font-bold">{w.name}</div>
                        <div className="text-brand-gray-text mt-2 text-sm">{t.prize || "Prize"}: {w.prize}</div>
                    </div>
                ))}
            </div>

            <Link to="/" className="mt-6 inline-block rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/10">{t.backHome || "Back Home"}</Link>
        </div>
    );
};

export default Winners;

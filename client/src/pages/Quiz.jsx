import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import useTelegram from '../hooks/useTelegram';
import { useLang } from '../context/LanguageContext';

const QUESTIONS = (t) => [
    {
        id: 1,
        question: t.capitalOfSaudiArabia || "What is the capital of Saudi Arabia?",
        options: [t.dubai || "Dubai", t.riyadh || "Riyadh", t.jeddah || "Jeddah", t.mecca || "Mecca"],
        answer: t.riyadh || "Riyadh"
    },
    {
        id: 2,
        question: t.redPlanet || "Which planet is known as the Red Planet?",
        options: [t.venus || "Venus", t.mars || "Mars", t.jupiter || "Jupiter", t.saturn || "Saturn"],
        answer: t.mars || "Mars"
    },
    {
        id: 3,
        question: t.rainbowColors || "How many colors are there in a rainbow?",
        options: [t.five || "5", t.six || "6", t.seven || "7", t.eight || "8"],
        answer: t.seven || "7"
    },
    {
        id: 4,
        question: t.multiplyFiveByFive || "What is 5 multiplied by 5?",
        options: [t.twenty || "20", t.twentyfive || "25", t.thirty || "30", t.ten || "10"],
        answer: t.twentyfive || "25"
    },
    {
        id: 5,
        question: t.fastestLandAnimal || "Which is the fastest land animal?",
        options: [t.lion || "Lion", t.cheetah || "Cheetah", t.horse || "Horse", t.tiger || "Tiger"],
        answer: t.cheetah || "Cheetah"
    }
];

const Quiz = () => {
    const navigate = useNavigate();
    const { userId } = useTelegram();
    const { t } = useLang();
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [passed, setPassed] = useState(false);

    const questions = QUESTIONS(t);

    const handleAnswer = (option) => {
        let newScore = score;
        if (option === questions[currentQ].answer) {
            newScore += 10;
            setScore(newScore);
        }

        const nextQ = currentQ + 1;
        if (nextQ < questions.length) {
            setCurrentQ(nextQ);
        } else {
            finishQuiz(newScore);
        }
    };

    const finishQuiz = async (finalScore) => {
        // Logic: At least 2 correct answers (2 * 10 = 20 marks)
        const isPassed = finalScore >= 20;
        setPassed(isPassed);
        setShowResult(true);

        // Save result to backend
        await fetch(`${import.meta.env.VITE_API_URL || ''}/api/quiz`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegramId: userId || 12345, score: finalScore, passed: isPassed })
        });
    };

    if (showResult) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
                <div className="animate-bounce-in w-full max-w-sm rounded-2xl border border-white/20 bg-brand-purple p-8 text-center">
                    {passed ? (
                        <>
                            <FiCheckCircle className="mx-auto mb-4 h-20 w-20 text-green-500" />
                            <h2 className="mb-2 text-2xl font-bold text-white">{t.congratulations || "Congratulations!"}</h2>
                            <p className="mb-6 text-white/80">{t.youScored || "You scored"} {score}/50. {t.congratulations || "You qualify for the prize!"}</p>
                            <button
                                onClick={() => navigate('/claim')}
                                className="w-full rounded-xl bg-brand-orange py-3 font-bold text-white"
                            >
                                {t.claimYourPrize || "Claim Your Prize"}
                            </button>
                        </>
                    ) : (
                        <>
                            <FiAlertCircle className="mx-auto mb-4 h-20 w-20 text-red-500" />
                            <h2 className="mb-2 text-2xl font-bold text-white">{t.hardLuck || "Hard Luck!"}</h2>
                            <p className="mb-6 text-white/80">{t.youScored || "You scored"} {score}/50. {t.youNeedAtLeast || "You need at least 20 to qualify."}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full rounded-xl bg-white/20 py-3 font-bold text-white"
                            >
                                {t.tryAgain || "Try Again"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    const q = questions[currentQ];

    return (
        <div className="min-h-screen bg-brand-dark px-4 pt-20 text-white">
            <div className="rounded-2xl border border-white/10 bg-brand-purple p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <span className="font-bold text-brand-orange">{t.question || "Question"} {currentQ + 1}/{questions.length}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs">10 {t.marks || "Marks"}</span>
                </div>

                <h3 className="mb-8 h-16 text-xl font-bold">{q.question}</h3>

                <div className="space-y-3">
                    {q.options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleAnswer(opt)}
                            className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-left transition hover:bg-brand-orange"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
import React, { useState, useEffect } from 'react';

const PageHeader = ({ title, setView, isDark }) => (
    <div className="mb-14 fade-in-up">
        <button
            onClick={() => setView('home')}
            className={`group flex items-center text-sm font-semibold mb-6 transition-colors duration-300 uppercase tracking-widest ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
        >
            <span className="mr-3 transition-transform duration-300 group-hover:-translate-x-2">←</span> Wróć do strony głównej
        </button>
        <h2 className={`text-4xl md:text-6xl font-black tracking-tight uppercase leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
    </div>
);

export default function App() {
    const [theme, setTheme] = useState('system');
    const [systemIsDark, setSystemIsDark] = useState(false);
    const [logoClicks, setLogoClicks] = useState(0);
    const [view, setView] = useState('home');
    const [mode, setMode] = useState(null);
    const [decks, setDecks] = useState([
        { id: 1, name: 'Język Angielski', cards: [{front: 'Apple', back: 'Jabłko'}, {front: 'Dog', back: 'Pies'}] },
        { id: 2, name: 'Programowanie', cards: [{front: 'Variable', back: 'Zmienna'}] }
    ]);

    const [editingDeckId, setEditingDeckId] = useState(null);
    const [newDeckName, setNewDeckName] = useState('');
    const [newCards, setNewCards] = useState([{ front: '', back: '' }]);

    const [currentDeckId, setCurrentDeckId] = useState(null);
    const [flipped, setFlipped] = useState(false);
    const [cardIdx, setCardIdx] = useState(0);
    const [stats, setStats] = useState({ correct: 0, wrong: 0 });
    const [isFinished, setIsFinished] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [displayCard, setDisplayCard] = useState(null);
    const [sessionCards, setSessionCards] = useState([]);

    const [userInput, setUserInput] = useState('');
    const [testResult, setTestResult] = useState(null);
    const [flashbang, setFlashbang] = useState(false);

    const [toast, setToast] = useState(null);
    const [modal, setModal] = useState(null);
    const [deckNameError, setDeckNameError] = useState(false);
    const [cardErrors, setCardErrors] = useState([]);

    const MAX_DECK_NAME = 40;
    const MAX_CARD_TEXT = 100;

    const deck = decks.find(d => d.id === currentDeckId);

    useEffect(() => {
        const savedTheme = localStorage.getItem('flashcards-theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme('system');
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemIsDark(mediaQuery.matches);
        const listener = (e) => setSystemIsDark(e.matches);
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, []);

    useEffect(() => {
        localStorage.setItem('flashcards-theme', theme);
    }, [theme]);

    const isDark = theme === 'dark' || (theme === 'system' && systemIsDark);

    useEffect(() => {
        if (sessionCards.length > 0 && !animating) {
            setDisplayCard(sessionCards[cardIdx]);
        }
    }, [cardIdx, sessionCards, animating]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const openAddDeck = () => {
        setEditingDeckId(null);
        setNewDeckName('');
        setNewCards([{ front: '', back: '' }]);
        setDeckNameError(false);
        setCardErrors([]);
        setView('addDeck');
    };

    const startEditing = (deckToEdit, e) => {
        e.stopPropagation();
        setEditingDeckId(deckToEdit.id);
        setNewDeckName(deckToEdit.name);
        setNewCards([...deckToEdit.cards]);
        setDeckNameError(false);
        setCardErrors([]);
        setView('addDeck');
    };

    const handleDeckNameChange = (e) => {
        const val = e.target.value;
        if (val.length >= MAX_DECK_NAME) {
            setDeckNameError(true);
            setTimeout(() => setDeckNameError(false), 500);
        }
        setNewDeckName(val.slice(0, MAX_DECK_NAME));
    };

    const handleCardChange = (idx, field, val) => {
        if (val.length >= MAX_CARD_TEXT) {
            const newErrors = [...cardErrors];
            if (!newErrors[idx]) newErrors[idx] = { front: false, back: false };
            newErrors[idx][field] = true;
            setCardErrors(newErrors);
            setTimeout(() => {
                const cleared = [...cardErrors];
                if (cleared[idx]) cleared[idx][field] = false;
                setCardErrors(cleared);
            }, 500);
        }
        const updated = [...newCards];
        updated[idx][field] = val.slice(0, MAX_CARD_TEXT);
        setNewCards(updated);
    };

    const saveDeck = () => {
        if (!newDeckName.trim()) {
            setDeckNameError(true);
            setTimeout(() => setDeckNameError(false), 500);
            setModal({ title: 'Brakujące dane', message: 'Proszę podać nazwę kolekcji.', type: 'alert' });
            return;
        }

        const validCards = newCards.filter(card => card.front.trim() && card.back.trim());
        if (validCards.length === 0) {
            setModal({ title: 'Brak fiszek', message: 'Kolekcja musi zawierać przynajmniej jedną w pełni uzupełnioną fiszkę (przód i tył).', type: 'alert' });
            return;
        }

        if (editingDeckId) {
            setDecks(decks.map(d => d.id === editingDeckId ? { ...d, name: newDeckName.trim(), cards: validCards } : d));
            showToast('Kolekcja została pomyślnie zaktualizowana.');
        } else {
            const newDeck = {
                id: Date.now(),
                name: newDeckName.trim(),
                cards: validCards
            };
            setDecks([...decks, newDeck]);
            showToast('Nowa kolekcja została dodana.');
        }

        setEditingDeckId(null);
        setNewDeckName('');
        setNewCards([{ front: '', back: '' }]);
        setView('home');
    };

    const deleteDeck = (id, e) => {
        e.stopPropagation();
        setModal({
            title: 'Potwierdź usunięcie',
            message: 'Czy na pewno chcesz bezpowrotnie usunąć tę kolekcję fiszek?',
            type: 'confirm',
            onConfirm: () => {
                setDecks(decks.filter(d => d.id !== id));
                showToast('Kolekcja została usunięta.', 'error');
            }
        });
    };

    const handleAnswer = (isCorrect) => {
        if (animating || !deck) return;

        setStats(prev => ({
            ...prev,
            [isCorrect ? 'correct' : 'wrong']: prev[isCorrect ? 'correct' : 'wrong'] + 1
        }));

        setAnimating(true);

        setTimeout(() => {
            if (cardIdx + 1 < sessionCards.length) {
                setFlipped(false);
                setCardIdx(cardIdx + 1);
                setUserInput('');
                setTestResult(null);
                setTimeout(() => {
                    setAnimating(false);
                }, 50);
            } else {
                setIsFinished(true);
                setAnimating(false);
            }
        }, 600);
    };

    const handleTestSubmit = (e) => {
        if (e) e.preventDefault();
        if (testResult || animating) return;

        const isCorrect = userInput.trim().toLowerCase() === displayCard.back.toLowerCase();

        if (isCorrect) {
            setTestResult('correct');
            setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setTestResult('wrong');
            setFlipped(true);
            setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
        }
    };

    const handleNextWithAnimation = () => {
        setAnimating(true);
        setTimeout(() => {
            if (cardIdx + 1 < sessionCards.length) {
                setFlipped(false);
                setCardIdx(cardIdx + 1);
                setUserInput('');
                setTestResult(null);
                setTimeout(() => {
                    setAnimating(false);
                }, 50);
            } else {
                setIsFinished(true);
                setAnimating(false);
            }
        }, 600);
    };

    const resetSession = () => {
        setCardIdx(0);
        setFlipped(false);
        setStats({ correct: 0, wrong: 0 });
        setIsFinished(false);
        setAnimating(false);
        setUserInput('');
        setTestResult(null);
        if (deck) {
            const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
            setSessionCards(shuffled);
            setDisplayCard(shuffled[0]);
        }
    };

    const triggerFlashbang = () => {
        setFlashbang(true);
        setTimeout(() => {
            setFlashbang(false);
        }, 5000);
    };

    return (
        <div className={`min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-black selection:text-white transition-colors duration-500 relative ${isDark ? 'bg-[#0a0a0a] text-gray-100 dark-mode' : 'bg-[#fafafa] text-gray-900'}`}>
            <style>{`
                .scene { width: 100%; height: 380px; perspective: 2000px; }
                .card-wrapper { width: 100%; height: 100%; transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out; }
                .card-wrapper.leaving { transform: translateX(-180px) rotate(-6deg) scale(0.92); opacity: 0; }
                .card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; cursor: pointer; }
                .card-inner.is-flipped { transform: rotateY(180deg); }
                .card-inner.no-transition { transition: none !important; }
                .card-face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; padding: 3rem; border-radius: 2rem; background: var(--card-bg, white); border: 1px solid var(--card-border, rgba(0,0,0,0.03)); box-shadow: 0 20px 40px -12px var(--card-shadow, rgba(0, 0, 0, 0.06)); font-size: 2.75rem; font-weight: 800; letter-spacing: -0.02em; text-align: center; transition: background-color 0.5s, border-color 0.5s, box-shadow 0.5s; word-wrap: break-word; overflow-wrap: break-word; hyphens: auto;}
                .card-back { transform: rotateY(180deg); background-color: var(--card-back-bg, #ffffff); border: 1px solid var(--card-border, rgba(0,0,0,0.06)); }
                .dark-mode { --card-bg: #111111; --card-border: rgba(255,255,255,0.05); --card-shadow: rgba(0, 0, 0, 0.5); --card-back-bg: #181818; }
                .fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(25px); filter: blur(3px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
                @keyframes csgoFlashbang { 0%, 15% { background-color: rgba(255, 255, 255, 1); opacity: 1; } 100% { background-color: rgba(255, 255, 255, 1); opacity: 0; } }
                .flashbang-active { animation: csgoFlashbang 5s cubic-bezier(0.25, 1, 0.5, 1) forwards; pointer-events: none; }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-6px); }
                    40%, 80% { transform: translateX(6px); }
                }
                .shake-animation { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
            `}</style>

            {toast && (
                <div className="fixed bottom-10 right-10 z-[100] fade-in-up">
                    <div className={`px-6 py-4 rounded-2xl shadow-2xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500 text-white shadow-red-500/20' : isDark ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-black/20'}`}>
                        <span className="text-lg">{toast.type === 'error' ? '🗑️' : '✅'}</span> {toast.message}
                    </div>
                </div>
            )}

            {modal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}></div>
                    <div className={`relative w-full max-w-md p-8 md:p-10 rounded-[2rem] shadow-2xl z-10 fade-in-up ${isDark ? 'bg-[#111] border border-gray-800' : 'bg-white'}`}>
                        <h3 className={`text-2xl font-black mb-4 uppercase tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{modal.title}</h3>
                        <p className={`text-lg mb-8 font-light leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{modal.message}</p>
                        <div className="flex justify-end gap-4">
                            {modal.type === 'confirm' && (
                                <button
                                    onClick={() => setModal(null)}
                                    className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${isDark ? 'bg-[#222] text-gray-400 hover:text-white hover:bg-[#333]' : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'}`}
                                >
                                    Anuluj
                                </button>
                            )}
                            <button
                                onClick={() => { modal.onConfirm?.(); setModal(null); }}
                                className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] ${modal.type === 'confirm' ? 'bg-red-500 text-white hover:bg-red-600 hover:shadow-red-500/20' : isDark ? 'bg-white text-black hover:shadow-white/10' : 'bg-black text-white hover:shadow-black/10'}`}
                            >
                                {modal.type === 'confirm' ? 'Usuń' : 'Rozumiem'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {flashbang && (
                <div className="fixed inset-0 z-[999999] bg-white flashbang-active"></div>
            )}

            <header className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl transition-colors duration-500 ${isDark ? 'border-gray-800/60 bg-[#111]/85' : 'border-gray-200/60 bg-white/85'}`}>
                <div className="max-w-6xl mx-auto px-6 md:px-8 py-5 md:py-6 flex justify-between items-center">
                    <div className="flex gap-10 md:gap-12 items-center">
                        <h1
                            className={`text-2xl md:text-3xl font-black tracking-tight cursor-pointer select-none uppercase hover:opacity-70 transition-opacity duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}
                            onClick={() => {
                                setView('home');
                                setLogoClicks(prev => {
                                    if (prev + 1 >= 5) {
                                        triggerFlashbang();
                                        return 0;
                                    }
                                    return prev + 1;
                                });
                            }}
                        >
                            Flashcards
                        </h1>
                        <nav className="hidden md:flex gap-8 md:gap-10 text-sm font-bold uppercase tracking-widest">
                            <span
                                className={`cursor-pointer transition-colors duration-300 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'} ${view === 'home' ? (isDark ? '!text-white' : '!text-gray-900') : ''}`}
                                onClick={() => setView('home')}
                            >
                                Moje Talie
                            </span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3 md:gap-5">
                        <button
                            onClick={() => setView('settings')}
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-[0.95] ${isDark ? 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#222] border border-gray-800' : 'bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-50 border border-gray-100'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <button
                            onClick={openAddDeck}
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-105 active:scale-[0.95] transition-transform duration-300 shadow-lg ${isDark ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-black/20'}`}
                        >
                            <span className="text-3xl md:text-4xl font-light leading-none relative -top-[2px] md:-top-[3px]">+</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-6xl mx-auto w-full px-6 md:px-8 pt-36 pb-12 md:pb-16">
                {view === 'home' && (
                    <div className="fade-in-up">
                        <h2 className={`text-4xl md:text-5xl font-black mb-12 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Kolekcje</h2>

                        {decks.length === 0 ? (
                            <div className={`flex flex-col items-center justify-center text-center p-12 md:p-20 border-2 border-dashed rounded-[2rem] transition-colors duration-500 ${isDark ? 'border-gray-800 bg-[#111]/50' : 'border-gray-200 bg-gray-50/50'}`}>
                                <div className={`w-24 h-24 mb-8 rounded-full flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-[#1a1a1a] text-gray-600' : 'bg-white shadow-sm text-gray-400 border border-gray-100'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                    </svg>
                                </div>
                                <h3 className={`text-3xl md:text-4xl font-black mb-4 uppercase tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Brak kolekcji</h3>
                                <p className={`text-lg mb-10 max-w-lg font-light leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Nie masz jeszcze żadnych fiszek. Utwórz swoją pierwszą kolekcję, by rozpocząć naukę i poszerzać swoją wiedzę!</p>
                                <button
                                    onClick={openAddDeck}
                                    className={`px-8 py-4 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ${isDark ? 'bg-white text-black hover:shadow-white/10' : 'bg-black text-white hover:shadow-black/10'}`}
                                >
                                    + Utwórz kolekcję
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {decks.map((d, index) => (
                                    <div
                                        key={d.id}
                                        onClick={() => { setCurrentDeckId(d.id); setView('mode-select'); }}
                                        className={`relative fade-in-up group p-8 md:p-10 rounded-[2rem] cursor-pointer transition-all duration-500 shadow-sm text-left flex flex-col justify-between min-h-[200px] border ${isDark ? 'border-gray-800 bg-[#111] hover:shadow-white/5 hover:border-gray-600' : 'border-gray-100 bg-white hover:shadow-2xl hover:border-gray-300'}`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                            <button
                                                onClick={(e) => startEditing(d, e)}
                                                className={`p-2.5 rounded-full transition-all duration-300 ${isDark ? 'text-gray-600 hover:text-blue-400 hover:bg-blue-900/30' : 'text-gray-300 hover:text-blue-500 hover:bg-blue-50'}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => deleteDeck(d.id, e)}
                                                className={`p-2.5 rounded-full transition-all duration-300 ${isDark ? 'text-gray-600 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>

                                        <h3 className={`text-xl md:text-2xl font-bold mb-4 transition-colors pr-12 break-normal hyphens-none leading-snug ${isDark ? 'text-gray-100 group-hover:text-white' : 'text-gray-900 group-hover:text-black'}`}>{d.name}</h3>
                                        <div className="flex items-center gap-4">
                                            <div className={`h-[2px] w-6 group-hover:w-10 transition-all duration-500 ${isDark ? 'bg-gray-800 group-hover:bg-white' : 'bg-gray-200 group-hover:bg-black'}`}></div>
                                            <p className={`text-xs font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}`}>{d.cards.length} kart w talii</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {view === 'settings' && (
                    <div className="max-w-4xl mx-auto fade-in-up">
                        <PageHeader title="Ustawienia" setView={setView} isDark={isDark} />

                        <div className={`space-y-12 p-10 md:p-16 rounded-[2rem] border shadow-sm transition-colors duration-500 ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-100'}`}>
                            <section className="fade-in-up delay-100">
                                <h4 className={`text-sm font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Wygląd aplikacji</h4>
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <p className={`text-lg leading-relaxed font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Wybierz preferowany motyw wizualny interfejsu.
                                    </p>
                                    <div className={`flex p-1.5 rounded-2xl border transition-colors duration-500 ${isDark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={`px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${theme === 'light' ? (isDark ? 'bg-[#333] text-white shadow-md border border-gray-700' : 'bg-white text-black shadow-md border border-gray-200') : (isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black')}`}
                                        >
                                            Jasny
                                        </button>
                                        <button
                                            onClick={() => setTheme('system')}
                                            className={`px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${theme === 'system' ? (isDark ? 'bg-[#333] text-white shadow-md border border-gray-700' : 'bg-white text-black shadow-md border border-gray-200') : (isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black')}`}
                                        >
                                            System
                                        </button>
                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={`px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${theme === 'dark' ? (isDark ? 'bg-[#333] text-white shadow-md border border-gray-700' : 'bg-white text-black shadow-md border border-gray-200') : (isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black')}`}
                                        >
                                            Ciemny
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {view === 'addDeck' && (
                    <div className="max-w-4xl mx-auto fade-in-up">
                        <PageHeader title={editingDeckId ? "Edytuj Kolekcję" : "Nowa Kolekcja"} setView={setView} isDark={isDark} />

                        <div className={`space-y-12 p-10 md:p-16 rounded-[2rem] border shadow-sm transition-colors duration-500 ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-100'}`}>
                            <div className="relative fade-in-up delay-100">
                                <label className={`block text-sm font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Nazwa kolekcji</label>
                                <input
                                    type="text"
                                    value={newDeckName}
                                    onChange={handleDeckNameChange}
                                    placeholder="np. Słówka z Hiszpańskiego"
                                    className={`w-full border-2 rounded-[1.5rem] py-5 px-8 text-2xl font-black outline-none transition-all duration-300 ${deckNameError ? 'border-red-500 text-red-500 shake-animation' : isDark ? 'bg-[#1a1a1a] border-transparent focus:border-gray-600 focus:bg-[#222] text-white placeholder-gray-700' : 'bg-gray-50 border-transparent focus:border-black bg-white text-gray-900 placeholder-gray-300 focus:shadow-xl'}`}
                                />
                                <div className={`mt-2 text-xs font-bold uppercase tracking-widest transition-opacity ${deckNameError ? 'opacity-100 text-red-500' : 'opacity-0'}`}>
                                    Przekroczono limit {MAX_DECK_NAME} znaków!
                                </div>
                            </div>

                            <div className="fade-in-up delay-200">
                                <div className="flex justify-between items-end mb-6">
                                    <h3 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Fiszki ({newCards.length})</h3>
                                </div>

                                <div className="space-y-8">
                                    {newCards.map((card, idx) => (
                                        <div key={idx} className={`flex flex-col md:flex-row gap-4 items-center border p-6 rounded-[1.5rem] transition-colors duration-300 ${isDark ? 'bg-[#1a1a1a]/50 border-gray-800 hover:border-gray-700' : 'bg-gray-50/50 border-gray-100 hover:border-gray-300'}`}>
                                            <div className={`flex font-black text-xl w-8 justify-center ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
                                                {idx + 1}
                                            </div>
                                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={card.front}
                                                        onChange={(e) => handleCardChange(idx, 'front', e.target.value)}
                                                        placeholder="Przód (np. słówko)"
                                                        className={`w-full bg-transparent border-b-2 pb-2 text-lg font-bold outline-none transition-colors ${cardErrors[idx]?.front ? 'border-red-500 text-red-500 shake-animation' : isDark ? 'border-gray-800 focus:border-gray-500 text-white placeholder-gray-700' : 'border-gray-200 focus:border-black text-gray-900 placeholder-gray-300'}`}
                                                    />
                                                    <div className={`absolute -bottom-5 left-0 text-[10px] font-bold uppercase tracking-widest transition-opacity ${cardErrors[idx]?.front ? 'opacity-100 text-red-500' : 'opacity-0'}`}>
                                                        Limit znaków: {MAX_CARD_TEXT}
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={card.back}
                                                        onChange={(e) => handleCardChange(idx, 'back', e.target.value)}
                                                        placeholder="Tył (np. tłumaczenie)"
                                                        className={`w-full bg-transparent border-b-2 pb-2 text-lg font-bold outline-none transition-colors ${cardErrors[idx]?.back ? 'border-red-500 text-red-500 shake-animation' : isDark ? 'border-gray-800 focus:border-gray-500 text-white placeholder-gray-700' : 'border-gray-200 focus:border-black text-gray-900 placeholder-gray-300'}`}
                                                    />
                                                    <div className={`absolute -bottom-5 left-0 text-[10px] font-bold uppercase tracking-widest transition-opacity ${cardErrors[idx]?.back ? 'opacity-100 text-red-500' : 'opacity-0'}`}>
                                                        Limit znaków: {MAX_CARD_TEXT}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if(newCards.length > 1) {
                                                        setNewCards(newCards.filter((_, index) => index !== idx));
                                                    }
                                                }}
                                                className={`p-3 rounded-full transition-all duration-300 ${newCards.length > 1 ? (isDark ? 'text-red-500 hover:text-red-400 hover:bg-red-900/30' : 'text-red-400 hover:text-red-600 hover:bg-red-50') : (isDark ? 'text-gray-800 cursor-not-allowed' : 'text-gray-200 cursor-not-allowed')}`}
                                                disabled={newCards.length <= 1}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setNewCards([...newCards, { front: '', back: '' }])}
                                    className={`w-full mt-8 py-6 border-2 border-dashed rounded-[1.5rem] text-sm font-bold uppercase tracking-widest transition-all duration-300 ${isDark ? 'border-gray-800 text-gray-600 hover:border-gray-500 hover:text-white' : 'border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900'}`}
                                >
                                    + Dodaj kolejną fiszkę
                                </button>
                            </div>

                            <div className={`pt-6 border-t fade-in-up delay-200 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                                <button
                                    onClick={saveDeck}
                                    className={`w-full py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ${isDark ? 'bg-white text-black hover:shadow-white/10' : 'bg-black text-white hover:shadow-black/10'}`}
                                >
                                    {editingDeckId ? "Zapisz zmiany" : "Utwórz kolekcję"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'mode-select' && (
                    <div className="max-w-4xl mx-auto fade-in-up text-center pt-8">
                        <button onClick={() => setView('home')} className={`text-sm font-semibold transition-colors duration-300 uppercase tracking-widest mb-10 block mx-auto ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>← Wróć do kolekcji</button>
                        <h2 className={`text-4xl md:text-5xl font-black mb-16 uppercase tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Wybierz tryb nauki</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div
                                onClick={() => { setMode('classic'); setView('deck'); resetSession(); }}
                                className={`fade-in-up delay-100 border p-10 md:p-12 rounded-[2rem] cursor-pointer transition-all duration-500 shadow-sm hover:-translate-y-2 group ${isDark ? 'bg-[#111] border-transparent hover:border-gray-700 hover:shadow-white/5' : 'bg-white border-transparent hover:border-gray-200 hover:shadow-2xl'}`}
                            >
                                <h3 className={`text-2xl md:text-3xl font-bold mb-4 uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>Tryb Klasyczny</h3>
                                <p className={`text-sm font-semibold uppercase tracking-widest leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Standardowe przeglądanie wiem/nie wiem</p>
                            </div>
                            <div
                                onClick={() => { setMode('test'); setView('deck'); resetSession(); }}
                                className={`fade-in-up delay-200 border p-10 md:p-12 rounded-[2rem] cursor-pointer transition-all duration-500 shadow-sm hover:-translate-y-2 group ${isDark ? 'bg-[#111] border-transparent hover:border-gray-700 hover:shadow-white/5' : 'bg-white border-transparent hover:border-gray-200 hover:shadow-2xl'}`}
                            >
                                <h3 className={`text-2xl md:text-3xl font-bold mb-4 uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>Tryb Testowy</h3>
                                <p className={`text-sm font-semibold uppercase tracking-widest leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Wpisywanie odpowiedzi z klawiatury</p>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'deck' && deck && !isFinished && (
                    <div className="max-w-3xl mx-auto fade-in-up">
                        <div className="flex justify-between items-start mb-12">
                            <button onClick={() => setView('home')} className={`text-sm font-semibold transition-colors duration-300 uppercase tracking-widest ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>← Wróć do kolekcji</button>
                            <div className="flex gap-10">
                                <div className="text-center">
                                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-green-500' : 'text-green-500'}`}>Dobrze</p>
                                    <p className={`text-2xl font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>{stats.correct}</p>
                                </div>
                                <div className="text-center">
                                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-red-500' : 'text-red-400'}`}>Źle</p>
                                    <p className={`text-2xl font-black ${isDark ? 'text-red-400' : 'text-red-500'}`}>{stats.wrong}</p>
                                </div>
                            </div>
                        </div>

                        <h2 className={`text-3xl md:text-4xl font-bold mb-14 uppercase tracking-tight text-center break-normal hyphens-none leading-snug px-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{deck.name}</h2>

                        <div className="space-y-12">
                            <div className={`flex justify-between items-end border-b pb-6 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                                <h3 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{mode === 'classic' ? 'Nauka' : 'Test'}</h3>
                                <span className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{cardIdx + 1} / {sessionCards.length}</span>
                            </div>

                            <div className="scene">
                                <div className={`card-wrapper ${animating ? 'leaving' : ''}`}>
                                    <div
                                        className={`card-inner ${flipped ? 'is-flipped' : ''} ${animating ? 'no-transition' : ''}`}
                                        onClick={() => {
                                            if (!animating) {
                                                if (mode === 'classic') {
                                                    setFlipped(!flipped);
                                                } else if (mode === 'test') {
                                                    setFlipped(!flipped);
                                                    if (!testResult) {
                                                        setTestResult('wrong');
                                                        setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        <div className={`card-face card-front ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {displayCard?.front}
                                        </div>
                                        <div className={`card-face card-back ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {displayCard?.back}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {mode === 'classic' ? (
                                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                                    <button
                                        onClick={() => handleAnswer(false)}
                                        disabled={animating}
                                        className={`w-full border py-6 rounded-[1.5rem] font-bold text-sm md:text-base uppercase tracking-widest hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] transition-all duration-300 disabled:opacity-50 ${isDark ? 'bg-[#111] border-gray-800 text-red-500 hover:border-red-900/50 hover:bg-red-900/20' : 'bg-white border-gray-200 text-red-500 hover:border-red-200 hover:bg-red-50'}`}
                                    >
                                        Nie wiedziałem
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(true)}
                                        disabled={animating}
                                        className={`w-full py-6 rounded-[1.5rem] font-bold text-sm md:text-base uppercase tracking-widest shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 ${isDark ? 'bg-white text-black shadow-white/5 hover:shadow-white/10' : 'bg-black text-white shadow-black/10 hover:shadow-2xl hover:shadow-black/20'}`}
                                    >
                                        Wiedziałem
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-8 space-y-6">
                                    {!testResult ? (
                                        <form onSubmit={handleTestSubmit} className="relative group">
                                            <input
                                                autoFocus
                                                type="text"
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                placeholder="Wpisz odpowiedź..."
                                                className={`w-full border-2 rounded-[1.5rem] py-6 px-8 text-xl font-bold outline-none transition-all duration-300 shadow-sm ${isDark ? 'bg-[#111] border-gray-800 text-white focus:border-gray-500 placeholder-gray-700 focus:shadow-white/5' : 'bg-white border-transparent focus:border-black text-gray-900 placeholder-gray-300 focus:shadow-xl'}`}
                                            />
                                            <button
                                                type="submit"
                                                className={`absolute right-4 top-1/2 -translate-y-1/2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-[0.95] transition-all duration-300 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                                            >
                                                Sprawdź
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="space-y-6 fade-in-up">
                                            <div className="flex flex-col gap-6">
                                                <button
                                                    onClick={handleNextWithAnimation}
                                                    className={`w-full py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ${isDark ? 'bg-white text-black shadow-white/5 hover:shadow-white/10' : 'bg-black text-white shadow-black/10 hover:shadow-2xl'}`}
                                                >
                                                    Następna fiszka
                                                </button>
                                                <div className={`text-center py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-500 ${testResult === 'correct' ? (isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600') : (isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600')}`}>
                                                    {testResult === 'correct' ? 'Świetnie! Dobra odpowiedź' : `Błąd. Poprawna odpowiedź: ${displayCard.back}`}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {view === 'deck' && isFinished && (
                    <div className="max-w-3xl mx-auto text-center py-16 fade-in-up">
                        <h2 className={`text-sm font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Gratulacje!</h2>
                        <h3 className={`text-5xl md:text-6xl font-black mb-20 uppercase tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Sesja zakończona</h3>
                        <div className="grid grid-cols-2 gap-8 md:gap-12 mb-16">
                            <div className={`p-12 rounded-[2rem] border shadow-xl hover:-translate-y-2 transition-transform duration-500 ${isDark ? 'bg-[#111] border-gray-800 shadow-green-900/10' : 'bg-white border-gray-100 shadow-green-900/5'}`}>
                                <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-green-500' : 'text-green-500'}`}>Poprawne</p>
                                <p className={`text-5xl md:text-6xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.correct + stats.wrong > 0 ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100) : 0}%</p>
                                <p className={`text-sm font-bold mt-4 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stats.correct} z {stats.correct + stats.wrong}</p>
                            </div>
                            <div className={`p-12 rounded-[2rem] border shadow-xl hover:-translate-y-2 transition-transform duration-500 ${isDark ? 'bg-[#111] border-gray-800 shadow-red-900/10' : 'bg-white border-gray-100 shadow-red-900/5'}`}>
                                <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-red-500' : 'text-red-400'}`}>Błędne</p>
                                <p className={`text-5xl md:text-6xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.correct + stats.wrong > 0 ? Math.round((stats.wrong / (stats.correct + stats.wrong)) * 100) : 0}%</p>
                                <p className={`text-sm font-bold mt-4 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stats.wrong} z {stats.correct + stats.wrong}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 max-w-md mx-auto">
                            <button onClick={resetSession} className={`w-full py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ${isDark ? 'bg-white text-black hover:shadow-white/10' : 'bg-black text-white hover:shadow-black/10'}`}>Spróbuj ponownie</button>
                            <button onClick={() => setView('home')} className={`w-full text-sm font-bold transition-colors duration-300 uppercase tracking-widest py-4 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>Wróć do menu głównego</button>
                        </div>
                    </div>
                )}

                {view === 'help' && (
                    <div className="max-w-4xl mx-auto fade-in-up">
                        <PageHeader title="Centrum Pomocy" setView={setView} isDark={isDark} />
                        <div className={`space-y-14 md:space-y-20 p-10 md:p-16 rounded-[2rem] border shadow-sm transition-colors duration-500 ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-100'}`}>
                            <section className="fade-in-up delay-100">
                                <h4 className={`text-sm font-bold uppercase tracking-widest mb-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Podstawy obsługi</h4>
                                <div className="grid gap-12 md:gap-16">
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                        <span className={`text-5xl font-black tabular-nums leading-none ${isDark ? 'text-gray-800' : 'text-gray-200'}`}>01</span>
                                        <div>
                                            <strong className={`block text-sm font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Struktura nauki</strong>
                                            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Każda talia stanowi zamknięty moduł dydaktyczny. Wybierz kolekcję z panelu głównego, aby zainicjować sesję. Aplikacja automatycznie przygotuje licznik postępów i zresetuje statystyki Twojej poprzedniej próby.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                        <span className={`text-5xl font-black tabular-nums leading-none ${isDark ? 'text-gray-800' : 'text-gray-200'}`}>02</span>
                                        <div>
                                            <strong className={`block text-sm font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Logika kart</strong>
                                            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Proces zapamiętywania opiera się na metodzie aktywnego przypominania. Kliknięcie w kartę odwraca ją, prezentując definicję lub tłumaczenie. Zalecamy sformułowanie odpowiedzi w myślach przed odwróceniem fizki.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                        <span className={`text-5xl font-black tabular-nums leading-none ${isDark ? 'text-gray-800' : 'text-gray-200'}`}>03</span>
                                        <div>
                                            <strong className={`block text-sm font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Samoocena i wyniki</strong>
                                            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Rzetelna ocena własnej wiedzy jest kluczowa. Przycisk „Wiedziałem” oraz „Nie wiedziałem” kategoryzuje kartę w końcowym raporcie, co pozwala zidentyfikować obszary wymagające dodatkowej powtórki.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className={`h-[1px] w-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                            <section className="fade-in-up delay-200">
                                <h4 className={`text-sm font-bold uppercase tracking-widest mb-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Rozwiązywanie problemów</h4>
                                <p className={`text-xl leading-relaxed font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Jeśli napotkasz błędy w wyświetlaniu treści, zalecamy odświeżenie przeglądarki. System działa w oparciu o pamięć lokalną, więc w skrajnych przypadkach wyczyszczenie danych witryny przywróci aplikację do stanu fabrycznego.
                                </p>
                            </section>
                        </div>
                    </div>
                )}

                {view === 'contact' && (
                    <div className="max-w-4xl mx-auto fade-in-up">
                        <PageHeader title="Komunikacja" setView={setView} isDark={isDark} />
                        <div className="space-y-16">
                            <p className={`text-2xl md:text-3xl font-light leading-relaxed fade-in-up delay-100 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Wspieramy dynamiczny rozwój społeczności uczącej się. Jeśli masz pytania dotyczące implementacji technicznej lub chcesz zgłosić błąd, nasze kanały komunikacji pozostają otwarte.
                            </p>
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 p-12 md:p-16 rounded-[2rem] border shadow-sm fade-in-up delay-200 transition-colors duration-500 ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-100'}`}>
                                <div className="group">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 border transition-colors duration-500 ${isDark ? 'bg-[#1a1a1a] border-gray-800 group-hover:bg-white group-hover:border-white' : 'bg-gray-50 border-gray-100 group-hover:bg-black group-hover:border-black'}`}>
                                        <span className={`text-lg transition-colors ${isDark ? 'text-gray-600 group-hover:text-black' : 'text-gray-400 group-hover:text-white'}`}>@</span>
                                    </div>
                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Dział Techniczny</h4>
                                    <a href="mailto:dev-support@flashcards.io" className={`text-xl font-bold mb-3 block transition-colors ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'}`}>dev-support@flashcards.io</a>
                                    <p className={`text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Obsługa zgłoszeń technicznych i błędów UI/UX.</p>
                                </div>
                                <div className="group">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 border transition-colors duration-500 ${isDark ? 'bg-[#1a1a1a] border-gray-800 group-hover:bg-white group-hover:border-white' : 'bg-gray-50 border-gray-100 group-hover:bg-black group-hover:border-black'}`}>
                                        <span className={`text-lg transition-colors ${isDark ? 'text-gray-600 group-hover:text-black' : 'text-gray-400 group-hover:text-white'}`}>&</span>
                                    </div>
                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Partnerstwa</h4>
                                    <a href="mailto:partners@flashcards.io" className={`text-xl font-bold mb-3 block transition-colors ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'}`}>partners@flashcards.io</a>
                                    <p className={`text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Propozycje integracji i dystrybucji treści.</p>
                                </div>
                            </div>

                            <div className={`p-8 md:p-14 rounded-[2rem] shadow-2xl fade-in-up delay-200 flex flex-col lg:flex-row gap-10 lg:items-stretch overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#1a1a1a] border border-gray-800 text-white' : 'bg-gray-900 text-white'}`}>
                                <div className="flex-1 flex flex-col justify-center relative z-20">
                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Centrum Operacyjne</h4>
                                    <p className="text-lg md:text-xl leading-loose uppercase tracking-widest font-light text-gray-200">
                                        <strong className="font-bold text-white block mb-2">Flashcards Digital Systems</strong>
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-200'}>
                                            Strzelców 4A<br/>
                                            31-422 Kraków
                                        </span>
                                        <span className={`mt-5 block text-sm ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>NIP: 000-000-00-00</span>
                                    </p>
                                </div>
                                <div className={`w-full lg:w-[45%] min-h-[250px] lg:min-h-full rounded-2xl overflow-hidden shadow-inner border hover:scale-[1.03] transition-transform duration-500 cursor-pointer transform-gpu relative z-10 ${isDark ? 'border-gray-700' : 'border-gray-800'}`}>
                                    <iframe
                                        title="mapa-dojazdu"
                                        src="https://maps.google.com/maps?q=Strzelc%C3%B3w%204A,%20Krak%C3%B3w&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, filter: isDark ? 'grayscale(1) invert(0.9) contrast(1.2)' : 'none' }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'privacy' && (
                    <div className="max-w-4xl mx-auto fade-in-up">
                        <PageHeader title="Polityka Prywatności" setView={setView} isDark={isDark} />
                        <div className={`space-y-12 p-10 md:p-16 rounded-[2rem] border shadow-sm transition-colors duration-500 ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-100'}`}>
                            <section className="fade-in-up delay-100">
                                <h4 className={`text-sm font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Suwerenność Danych</h4>
                                <p className={`text-lg md:text-xl leading-relaxed font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Aplikacja Flashcards została zaprojektowana zgodnie z paradygmatem <strong className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Zero-Server Architecture</strong>. Oznacza to, że nie posiadamy bazy danych w chmurze, nie przechowujemy Twoich haseł ani nie profilujemy Twoich nawyków nauki. Wszystko odbywa się lokalnie na Twoim procesorze i dysku.
                                </p>
                            </section>
                            <div className={`h-[1px] w-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                            <section className="fade-in-up delay-200">
                                <h4 className={`text-sm font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Bezpieczeństwo LocalStorage</h4>
                                <p className={`text-lg md:text-xl leading-relaxed font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Twoje talie są serializowane do formatu JSON i przechowywane w bezpiecznym kontenerze przeglądarki. Dostęp do nich mają wyłącznie skrypty uruchamiane w obrębie tej domeny. Reklamodawcy oraz skrypty śledzące nie mają wglądu w Twoje materiały edukacyjne.
                                </p>
                            </section>
                            <div className={`h-[1px] w-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                            <section className="fade-in-up delay-200">
                                <h4 className={`text-sm font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Brak Analityki</h4>
                                <p className={`text-lg md:text-xl leading-relaxed font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    W przeciwieństwie do konkurencyjnych rozwiązań, nie implementujemy SDK analitycznych (Facebook Pixel, Google Tag Manager). Twoja sesja nauki jest całkowicie anonimowa i odizolowana od systemów reklamowych.
                                </p>
                            </section>
                            <div className={`pt-10 mt-10 border-t flex items-center justify-between ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                                <div className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Aktualizacja: Marzec 2026</div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className={`border-t py-12 mt-auto transition-colors duration-500 ${isDark ? 'border-gray-800/60 bg-[#0a0a0a]/50' : 'border-gray-200/60 bg-white/50'}`}>
                <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className={`text-xs font-bold uppercase tracking-widest cursor-default ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Flashcards © 2026</p>
                    <div className="flex gap-10 text-xs font-bold uppercase tracking-widest">
                        <span onClick={() => setView('contact')} className={`cursor-pointer transition-colors duration-300 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>Kontakt</span>
                        <span onClick={() => setView('help')} className={`cursor-pointer transition-colors duration-300 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>Pomoc</span>
                        <span onClick={() => setView('privacy')} className={`cursor-pointer transition-colors duration-300 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>Prywatność</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
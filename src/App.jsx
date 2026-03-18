import React, { useState, useEffect } from 'react';

const PageHeader = ({ title, setView }) => (
    <div className="mb-14 fade-in-up">
        <button
            onClick={() => setView('home')}
            className="group flex items-center text-sm font-semibold text-gray-400 hover:text-gray-900 mb-6 transition-colors duration-300 uppercase tracking-widest"
        >
            <span className="mr-3 transition-transform duration-300 group-hover:-translate-x-2">←</span> Wróć do strony głównej
        </button>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none text-gray-900">{title}</h2>
    </div>
);

export default function App() {
    const [view, setView] = useState('home');
    const [mode, setMode] = useState(null);
    const [decks, setDecks] = useState([
        { id: 1, name: 'Język Angielski', cards: [{front: 'Apple', back: 'Jabłko'}, {front: 'Dog', back: 'Pies'}] },
        { id: 2, name: 'Programowanie', cards: [{front: 'Variable', back: 'Zmienna'}] }
    ]);

    const [newDeckName, setNewDeckName] = useState('');
    const [newCards, setNewCards] = useState([{ front: '', back: '' }]);

    const [currentDeckId, setCurrentDeckId] = useState(null);
    const [flipped, setFlipped] = useState(false);
    const [cardIdx, setCardIdx] = useState(0);
    const [stats, setStats] = useState({ correct: 0, wrong: 0 });
    const [isFinished, setIsFinished] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [displayCard, setDisplayCard] = useState(null);

    const [userInput, setUserInput] = useState('');
    const [testResult, setTestResult] = useState(null);

    const deck = decks.find(d => d.id === currentDeckId);

    useEffect(() => {
        if (deck && !animating) {
            setDisplayCard(deck.cards[cardIdx]);
        }
    }, [cardIdx, deck, animating]);

    const saveNewDeck = () => {
        if (!newDeckName.trim()) {
            alert('Proszę podać nazwę kolekcji.');
            return;
        }

        const validCards = newCards.filter(card => card.front.trim() && card.back.trim());
        if (validCards.length === 0) {
            alert('Kolekcja musi zawierać przynajmniej jedną w pełni uzupełnioną fiszkę.');
            return;
        }

        const newDeck = {
            id: Date.now(), 
            name: newDeckName.trim(),
            cards: validCards
        };

        setDecks([...decks, newDeck]);
        setNewDeckName('');
        setNewCards([{ front: '', back: '' }]);
        setView('home');
    };

    const handleAnswer = (isCorrect) => {
        if (animating || !deck) return;

        setStats(prev => ({
            ...prev,
            [isCorrect ? 'correct' : 'wrong']: prev[isCorrect ? 'correct' : 'wrong'] + 1
        }));

        setAnimating(true);

        setTimeout(() => {
            if (cardIdx + 1 < deck.cards.length) {
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
            if (cardIdx + 1 < deck.cards.length) {
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
        if (deck) setDisplayCard(deck.cards[0]);
    };

    
    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#fafafa] text-gray-900 overflow-x-hidden selection:bg-black selection:text-white">
            <style>{`
                .scene {
                    width: 100%;
                    height: 380px;
                    perspective: 2000px;
                }
                .card-wrapper {
                    width: 100%;
                    height: 100%;
                    transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out;
                }
                .card-wrapper.leaving {
                    transform: translateX(-180px) rotate(-6deg) scale(0.92);
                    opacity: 0;
                }
                .card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    transform-style: preserve-3d;
                    cursor: pointer;
                }
                .card-inner.is-flipped {
                    transform: rotateY(180deg);
                }
                .card-inner.no-transition {
                    transition: none !important;
                }
                .card-face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    border-radius: 2rem;
                    border: 1px solid rgba(0,0,0,0.03);
                    background: white;
                    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.06);
                    font-size: 2.75rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    text-align: center;
                }
                .card-back {
                    transform: rotateY(180deg);
                    background-color: #ffffff;
                    border: 1px solid rgba(0,0,0,0.06);
                }
                .fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(25px); filter: blur(3px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
            `}</style>

            <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/60 bg-white/85 backdrop-blur-xl transition-all duration-300">
                <div className="max-w-6xl mx-auto px-6 md:px-8 py-5 md:py-6 flex justify-between items-center">
                    <div className="flex gap-10 md:gap-12 items-center">
                        <h1
                            className="text-2xl md:text-3xl font-black tracking-tight cursor-pointer uppercase hover:opacity-70 transition-opacity duration-300 text-gray-900"
                            onClick={() => setView('home')}
                        >
                            Flashcards
                        </h1>
                        <nav className="hidden md:flex gap-8 md:gap-10 text-sm font-bold uppercase tracking-widest text-gray-400">
                            <span
                                className={`hover:text-gray-900 cursor-pointer transition-colors duration-300 ${view === 'home' ? 'text-gray-900' : ''}`}
                                onClick={() => setView('home')}
                            >
                                Moje Talie
                            </span>
                        </nav>
                    </div>
                    <button
                        onClick={() => setView('addDeck')}
                        className="bg-black text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-105 active:scale-[0.95] transition-transform duration-300 shadow-lg shadow-black/20"
                    >
                        <span className="text-3xl md:text-4xl font-light leading-none relative -top-[2px] md:-top-[3px]">+</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow max-w-6xl mx-auto w-full px-6 md:px-8 pt-36 pb-12 md:pb-16">
                {view === 'home' && (
                    <div className="fade-in-up">
                        <h2 className="text-4xl md:text-5xl font-black mb-12 tracking-tight text-gray-900">Kolekcje</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {decks.map((d, index) => (
                                <div
                                    key={d.id}
                                    onClick={() => { setCurrentDeckId(d.id); setView('mode-select'); }}
                                    className="fade-in-up group border border-gray-100 p-8 md:p-10 rounded-[2rem] hover:border-gray-300 cursor-pointer transition-all duration-500 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 text-left flex flex-col justify-between min-h-[200px]"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 group-hover:text-black transition-colors">{d.name}</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="h-[2px] w-6 bg-gray-200 group-hover:w-10 group-hover:bg-black transition-all duration-500"></div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest group-hover:text-gray-600 transition-colors">{d.cards.length} kart w talii</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'addDeck' && (
                    <div className="max-w-4xl mx-auto fade-in-up">
                        <PageHeader title="Nowa Kolekcja" setView={setView} />
                        
                        <div className="space-y-12 bg-white p-10 md:p-16 rounded-[2rem] border border-gray-100 shadow-sm">
                            <div className="fade-in-up delay-100">
                                <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Nazwa nowej kolekcji</label>
                                <input
                                    type="text"
                                    value={newDeckName}
                                    onChange={(e) => setNewDeckName(e.target.value)}
                                    placeholder="np. Słówka z Hiszpańskiego"
                                    className="w-full border-2 border-transparent bg-gray-50 rounded-[1.5rem] py-5 px-8 text-2xl font-black outline-none focus:border-black focus:bg-white focus:shadow-xl text-gray-900 transition-all duration-300 placeholder-gray-300"
                                />
                            </div>

                            <div className="fade-in-up delay-200">
                                <div className="flex justify-between items-end mb-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Fiszki ({newCards.length})</h3>
                                </div>
                                
                                <div className="space-y-4">
                                    {newCards.map((card, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row gap-4 items-center bg-gray-50/50 border border-gray-100 p-6 rounded-[1.5rem] hover:border-gray-300 transition-colors duration-300">
                                            <div className="flex text-gray-300 font-black text-xl w-8 justify-center">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                                <input
                                                    type="text"
                                                    value={card.front}
                                                    onChange={(e) => {
                                                        const updated = [...newCards];
                                                        updated[idx].front = e.target.value;
                                                        setNewCards(updated);
                                                    }}
                                                    placeholder="Przód (np. słówko)"
                                                    className="w-full bg-transparent border-b-2 border-gray-200 pb-2 text-lg font-bold outline-none focus:border-black text-gray-900 transition-colors placeholder-gray-300"
                                                />
                                                <input
                                                    type="text"
                                                    value={card.back}
                                                    onChange={(e) => {
                                                        const updated = [...newCards];
                                                        updated[idx].back = e.target.value;
                                                        setNewCards(updated);
                                                    }}
                                                    placeholder="Tył (np. tłumaczenie)"
                                                    className="w-full bg-transparent border-b-2 border-gray-200 pb-2 text-lg font-bold outline-none focus:border-black text-gray-900 transition-colors placeholder-gray-300"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if(newCards.length > 1) {
                                                        setNewCards(newCards.filter((_, index) => index !== idx));
                                                    }
                                                }}
                                                className={`p-3 rounded-full transition-all duration-300 ${newCards.length > 1 ? 'text-red-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-200 cursor-not-allowed'}`}
                                                disabled={newCards.length <= 1}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                <button
                                    onClick={() => setNewCards([...newCards, { front: '', back: '' }])}
                                    className="w-full mt-6 py-6 border-2 border-dashed border-gray-200 rounded-[1.5rem] text-sm font-bold text-gray-400 uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-all duration-300"
                                >
                                    + Dodaj kolejną fiszkę
                                </button>
                            </div>

                            <div className="pt-6 border-t border-gray-100 fade-in-up delay-200">
                                <button
                                    onClick={saveNewDeck}
                                    className="w-full bg-black text-white py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
                                >
                                    Utwórz kolekcję
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'mode-select' && (
                    <div className="max-w-4xl mx-auto fade-in-up text-center pt-8">
                        <button onClick={() => setView('home')} className="text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors duration-300 uppercase tracking-widest mb-10 block mx-auto">← Wróć do kolekcji</button>
                        <h2 className="text-4xl md:text-5xl font-black mb-16 uppercase tracking-tight text-gray-900">Wybierz tryb nauki</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div
                                onClick={() => { setMode('classic'); setView('deck'); resetSession(); }}
                                className="fade-in-up delay-100 border border-transparent p-10 md:p-12 rounded-[2rem] hover:border-gray-200 cursor-pointer transition-all duration-500 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 group"
                            >
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 uppercase text-gray-900">Tryb Klasyczny</h3>
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest leading-relaxed">Standardowe przeglądanie wiem/nie wiem</p>
                            </div>
                            <div
                                onClick={() => { setMode('test'); setView('deck'); resetSession(); }}
                                className="fade-in-up delay-200 border border-transparent p-10 md:p-12 rounded-[2rem] hover:border-gray-200 cursor-pointer transition-all duration-500 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 group"
                            >
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 uppercase text-gray-900">Tryb Testowy</h3>
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest leading-relaxed">Wpisywanie odpowiedzi z klawiatury</p>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'deck' && deck && !isFinished && (
                    <div className="max-w-3xl mx-auto fade-in-up">
                        <div className="flex justify-between items-start mb-12">
                            <button onClick={() => setView('home')} className="text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors duration-300 uppercase tracking-widest">← Wróć do kolekcji</button>
                            <div className="flex gap-10">
                                <div className="text-center">
                                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">Dobrze</p>
                                    <p className="text-2xl font-black text-green-600">{stats.correct}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Źle</p>
                                    <p className="text-2xl font-black text-red-500">{stats.wrong}</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-14 uppercase tracking-tight text-gray-900 text-center">{deck.name}</h2>

                        <div className="space-y-12">
                            <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800">{mode === 'classic' ? 'Nauka' : 'Test'}</h3>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{cardIdx + 1} / {deck.cards.length}</span>
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
                                        <div className="card-face card-front text-gray-900">
                                            {displayCard?.front}
                                        </div>
                                        <div className="card-face card-back text-gray-900">
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
                                        className="w-full bg-white border border-gray-200 text-red-500 py-6 rounded-[1.5rem] font-bold text-sm md:text-base uppercase tracking-widest hover:border-red-200 hover:bg-red-50 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
                                    >
                                        Nie wiedziałem
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(true)}
                                        disabled={animating}
                                        className="w-full bg-black text-white py-6 rounded-[1.5rem] font-bold text-sm md:text-base uppercase tracking-widest shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
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
                                                className="w-full border-2 border-transparent bg-white shadow-sm rounded-[1.5rem] py-6 px-8 text-xl font-bold outline-none focus:border-black focus:shadow-xl text-gray-900 transition-all duration-300 placeholder-gray-300"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 hover:scale-105 active:scale-[0.95] transition-all duration-300"
                                            >
                                                Sprawdź
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="space-y-6 fade-in-up">
                                            <div className="flex flex-col gap-6">
                                                <button
                                                    onClick={handleNextWithAnimation}
                                                    className="w-full bg-black text-white py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
                                                >
                                                    Następna fiszka
                                                </button>
                                                <div className={`text-center py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-500 ${testResult === 'correct' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
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
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Gratulacje!</h2>
                        <h3 className="text-5xl md:text-6xl font-black mb-20 uppercase tracking-tight text-gray-900">Sesja zakończona</h3>
                        <div className="grid grid-cols-2 gap-8 md:gap-12 mb-16">
                            <div className="bg-white p-12 rounded-[2rem] border border-gray-100 shadow-xl shadow-green-900/5 hover:-translate-y-2 transition-transform duration-500">
                                <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-4">Poprawne</p>
                                <p className="text-5xl md:text-6xl font-black text-gray-900">{stats.correct + stats.wrong > 0 ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100) : 0}%</p>
                                <p className="text-gray-400 text-sm font-bold mt-4 uppercase">{stats.correct} z {stats.correct + stats.wrong}</p>
                            </div>
                            <div className="bg-white p-12 rounded-[2rem] border border-gray-100 shadow-xl shadow-red-900/5 hover:-translate-y-2 transition-transform duration-500">
                                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">Błędne</p>
                                <p className="text-5xl md:text-6xl font-black text-gray-900">{stats.correct + stats.wrong > 0 ? Math.round((stats.wrong / (stats.correct + stats.wrong)) * 100) : 0}%</p>
                                <p className="text-gray-400 text-sm font-bold mt-4 uppercase">{stats.wrong} z {stats.correct + stats.wrong}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 max-w-md mx-auto">
                            <button onClick={resetSession} className="w-full bg-black text-white py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300">Spróbuj ponownie</button>
                            <button onClick={() => setView('home')} className="w-full text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors duration-300 uppercase tracking-widest py-4">Wróć do menu głównego</button>
                        </div>
                    </div>
                )}

                {view === 'help' && (
                    <div className="max-w-4xl mx-auto fade-in-up">
                        <PageHeader title="Centrum Pomocy" setView={setView} />
                        <div className="space-y-14 md:space-y-20 bg-white p-10 md:p-16 rounded-[2rem] border border-gray-100 shadow-sm">
                            <section className="fade-in-up delay-100">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-10">Podstawy obsługi</h4>
                                <div className="grid gap-12 md:gap-16">
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                        <span className="text-5xl font-black text-gray-200 tabular-nums leading-none">01</span>
                                        <div>
                                            <strong className="block text-sm font-bold uppercase tracking-widest mb-3 text-gray-900">Struktura nauki</strong>
                                            <p className="text-lg leading-relaxed text-gray-600">
                                                Każda talia stanowi zamknięty moduł dydaktyczny. Wybierz kolekcję z panelu głównego, aby zainicjować sesję. Aplikacja automatycznie przygotuje licznik postępów i zresetuje statystyki Twojej poprzedniej próby.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                        <span className="text-5xl font-black text-gray-200 tabular-nums leading-none">02</span>
                                        <div>
                                            <strong className="block text-sm font-bold uppercase tracking-widest mb-3 text-gray-900">Logika kart</strong>
                                            <p className="text-lg leading-relaxed text-gray-600">
                                                Proces zapamiętywania opiera się na metodzie aktywnego przypominania. Kliknięcie w kartę odwraca ją, prezentując definicję lub tłumaczenie. Zalecamy sformułowanie odpowiedzi w myślach przed odwróceniem fizki.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                        <span className="text-5xl font-black text-gray-200 tabular-nums leading-none">03</span>
                                        <div>
                                            <strong className="block text-sm font-bold uppercase tracking-widest mb-3 text-gray-900">Samoocena i wyniki</strong>
                                            <p className="text-lg leading-relaxed text-gray-600">
                                                Rzetelna ocena własnej wiedzy jest kluczowa. Przycisk „Wiedziałem” oraz „Nie wiedziałem” kategoryzuje kartę w końcowym raporcie, co pozwala zidentyfikować obszary wymagające dodatkowej powtórki.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="h-[1px] bg-gray-100 w-full"></div>
                            <section className="fade-in-up delay-200">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">Rozwiązywanie problemów</h4>
                                <p className="text-xl leading-relaxed text-gray-600 font-light">
                                    Jeśli napotkasz błędy w wyświetlaniu treści, zalecamy odświeżenie przeglądarki. System działa w oparciu o pamięć lokalną, więc w skrajnych przypadkach wyczyszczenie danych witryny przywróci aplikację do stanu fabrycznego.
                                </p>
                            </section>
                        </div>
                    </div>
                )}

                {view === 'contact' && (
                    <div className="max-w-4xl mx-auto fade-in-up">
                        <PageHeader title="Komunikacja" setView={setView} />
                        <div className="space-y-16">
                            <p className="text-2xl md:text-3xl font-light leading-relaxed text-gray-600 fade-in-up delay-100">
                                Wspieramy dynamiczny rozwój społeczności uczącej się. Jeśli masz pytania dotyczące implementacji technicznej lub chcesz zgłosić błąd, nasze kanały komunikacji pozostają otwarte.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-12 md:p-16 rounded-[2rem] border border-gray-100 shadow-sm fade-in-up delay-200">
                                <div className="group">
                                    <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 group-hover:bg-black group-hover:border-black transition-colors duration-500">
                                        <span className="text-lg text-gray-400 group-hover:text-white transition-colors">@</span>
                                    </div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Dział Techniczny</h4>
                                    <a href="mailto:dev-support@flashcards.io" className="text-xl font-bold mb-3 block text-gray-900 hover:text-gray-600 transition-colors">dev-support@flashcards.io</a>
                                    <p className="text-base text-gray-500 leading-relaxed">Obsługa zgłoszeń technicznych i błędów UI/UX.</p>
                                </div>
                                <div className="group">
                                    <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 group-hover:bg-black group-hover:border-black transition-colors duration-500">
                                        <span className="text-lg text-gray-400 group-hover:text-white transition-colors">&</span>
                                    </div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Partnerstwa</h4>
                                    <a href="mailto:partners@flashcards.io" className="text-xl font-bold mb-3 block text-gray-900 hover:text-gray-600 transition-colors">partners@flashcards.io</a>
                                    <p className="text-base text-gray-500 leading-relaxed">Propozycje integracji i dystrybucji treści.</p>
                                </div>
                            </div>

                            <div className="bg-gray-900 text-white p-8 md:p-14 rounded-[2rem] shadow-2xl fade-in-up delay-200 flex flex-col lg:flex-row gap-10 lg:items-stretch overflow-hidden">
                                <div className="flex-1 flex flex-col justify-center relative z-20">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Centrum Operacyjne</h4>
                                    <p className="text-lg md:text-xl leading-loose uppercase tracking-widest font-light text-gray-200">
                                        <strong className="font-bold text-white block mb-2">Flashcards Digital Systems</strong>
                                        Strzelców 4A<br/>
                                        31-422 Kraków<br/>
                                        <span className="text-gray-500 mt-5 block text-sm">NIP: 000-000-00-00</span>
                                    </p>
                                </div>
                                <div className="w-full lg:w-[45%] min-h-[250px] lg:min-h-full rounded-2xl overflow-hidden shadow-inner border border-gray-800 hover:scale-[1.03] transition-transform duration-500 cursor-pointer transform-gpu relative z-10">
                                    <iframe
                                        title="mapa-dojazdu"
                                        src="https://maps.google.com/maps?q=Spawner%20Marka,%20Strzelc%C3%B3w%204A,%20Krak%C3%B3w&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
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
                        <PageHeader title="Polityka Prywatności" setView={setView} />
                        <div className="space-y-12 bg-white p-10 md:p-16 rounded-[2rem] border border-gray-100 shadow-sm">
                            <section className="fade-in-up delay-100">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Suwerenność Danych</h4>
                                <p className="text-lg md:text-xl leading-relaxed text-gray-600 font-light">
                                    Aplikacja Flashcards została zaprojektowana zgodnie z paradygmatem <strong className="font-bold text-gray-900">Zero-Server Architecture</strong>. Oznacza to, że nie posiadamy bazy danych w chmurze, nie przechowujemy Twoich haseł ani nie profilujemy Twoich nawyków nauki. Wszystko odbywa się lokalnie na Twoim procesorze i dysku.
                                </p>
                            </section>
                            <div className="h-[1px] bg-gray-100 w-full"></div>
                            <section className="fade-in-up delay-200">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Bezpieczeństwo LocalStorage</h4>
                                <p className="text-lg md:text-xl leading-relaxed text-gray-600 font-light">
                                    Twoje talie są serializowane do formatu JSON i przechowywane w bezpiecznym kontenerze przeglądarki. Dostęp do nich mają wyłącznie skrypty uruchamiane w obrębie tej domeny. Reklamodawcy oraz skrypty śledzące nie mają wglądu w Twoje materiały edukacyjne.
                                </p>
                            </section>
                            <div className="h-[1px] bg-gray-100 w-full"></div>
                            <section className="fade-in-up delay-200">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Brak Analityki</h4>
                                <p className="text-lg md:text-xl leading-relaxed text-gray-600 font-light">
                                    W przeciwieństwie do konkurencyjnych rozwiązań, nie implementujemy SDK analitycznych (Facebook Pixel, Google Tag Manager). Twoja sesja nauki jest całkowicie anonimowa i odizolowana od systemów reklamowych.
                                </p>
                            </section>
                            <div className="pt-10 mt-10 border-t border-gray-100 flex items-center justify-between">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Aktualizacja: Marzec 2026</div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t border-gray-200/60 py-12 mt-auto bg-white/50">
                <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 cursor-default">Flashcards © 2026</p>
                    <div className="flex gap-10 text-xs font-bold uppercase tracking-widest text-gray-400">
                        <span onClick={() => setView('contact')} className="hover:text-gray-900 cursor-pointer transition-colors duration-300">Kontakt</span>
                        <span onClick={() => setView('help')} className="hover:text-gray-900 cursor-pointer transition-colors duration-300">Pomoc</span>
                        <span onClick={() => setView('privacy')} className="hover:text-gray-900 cursor-pointer transition-colors duration-300">Prywatność</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
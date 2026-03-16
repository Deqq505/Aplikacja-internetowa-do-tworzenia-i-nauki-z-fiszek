import React, { useState, useEffect } from 'react';

export default function App() {
    const [view, setView] = useState('home');
    const [mode, setMode] = useState(null);
    const [decks] = useState([
        { id: 1, name: 'Język Angielski', cards: [{front: 'Apple', back: 'Jabłko'}, {front: 'Dog', back: 'Pies'}] },
        { id: 2, name: 'Programowanie', cards: [{front: 'Variable', back: 'Zmienna'}] }
    ]);

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

    const PageHeader = ({ title }) => (
        <div className="mb-12">
            <button
                onClick={() => setView('home')}
                className="group flex items-center text-[10px] font-black text-gray-400 hover:text-black mb-6 transition uppercase tracking-[0.2em]"
            >
                <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> Wróć do strony głównej
            </button>
            <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">{title}</h2>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white text-black overflow-x-hidden">
            <style>{`
                .scene {
                    width: 100%;
                    height: 350px;
                    perspective: 1500px;
                }
                .card-wrapper {
                    width: 100%;
                    height: 100%;
                    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-in;
                }
                .card-wrapper.leaving {
                    transform: translateX(-180px) rotate(-8deg) scale(0.85);
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
                    padding: 2.5rem;
                    border-radius: 3rem;
                    border: 1px solid #f3f4f6;
                    background: white;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.04);
                    font-size: 2.25rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                }
                .card-back {
                    transform: rotateY(180deg);
                    background-color: #fafafa;
                }
                .view-enter-main {
                    animation: mainEnter 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .view-enter-content {
                    animation: contentEnter 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                @keyframes mainEnter {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes contentEnter {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .finish-screen {
                    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <header className="border-b border-gray-100 py-6">
                <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex gap-10 items-center">
                        <h1
                            className="text-2xl font-black tracking-tighter cursor-pointer uppercase hover:opacity-70 transition"
                            onClick={() => setView('home')}
                        >
                            Flashcards
                        </h1>
                        <nav className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <span
                                className={`hover:text-black cursor-pointer transition ${view === 'home' ? 'text-black' : ''}`}
                                onClick={() => setView('home')}
                            >
                                Moje Talie
                            </span>
                        </nav>
                    </div>
                    <button
                        onClick={() => alert('Funkcja dodawania w przygotowaniu')}
                        className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition shadow-lg shadow-black/20"
                    >
                        <span className="text-3xl font-light leading-none relative -top-[1px]">+</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12">
                {view === 'home' && (
                    <div className="view-enter-main">
                        <h2 className="text-4xl font-bold mb-10 tracking-tight">Kolekcje</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {decks.map(d => (
                                <div
                                    key={d.id}
                                    onClick={() => { setCurrentDeckId(d.id); setView('mode-select'); }}
                                    className="group border border-gray-100 p-10 rounded-[2.5rem] hover:border-black hover:-translate-y-1 cursor-pointer transition-all bg-white shadow-sm hover:shadow-xl text-left"
                                >
                                    <h3 className="text-2xl font-bold mb-2 group-hover:tracking-tight transition-all">{d.name}</h3>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{d.cards.length} kart w talii</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'mode-select' && (
                    <div className="max-w-2xl mx-auto view-enter-content text-center">
                        <button onClick={() => setView('home')} className="text-[10px] font-black text-gray-400 hover:text-black transition uppercase tracking-[0.2em] mb-8 block mx-auto">← Wróć do kolekcji</button>
                        <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter">Wybierz tryb nauki</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div
                                onClick={() => { setMode('classic'); setView('deck'); resetSession(); }}
                                className="border border-gray-100 p-10 rounded-[2.5rem] hover:border-black cursor-pointer transition-all bg-white shadow-sm hover:shadow-xl group"
                            >
                                <h3 className="text-2xl font-bold mb-2 uppercase group-hover:tracking-tight transition-all">Tryb Klasyczny</h3>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Standardowe przeglądanie wiem/nie wiem</p>
                            </div>
                            <div
                                onClick={() => { setMode('test'); setView('deck'); resetSession(); }}
                                className="border border-gray-100 p-10 rounded-[2.5rem] hover:border-black cursor-pointer transition-all bg-white shadow-sm hover:shadow-xl group"
                            >
                                <h3 className="text-2xl font-bold mb-2 uppercase group-hover:tracking-tight transition-all">Tryb Testowy</h3>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Wpisywanie odpowiedzi z klawiatury</p>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'deck' && deck && !isFinished && (
                    <div className="max-w-2xl mx-auto view-enter-content">
                        <div className="flex justify-between items-start mb-10">
                            <button onClick={() => setView('home')} className="text-[10px] font-black text-gray-400 hover:text-black transition uppercase tracking-[0.2em]">← Wróć do kolekcji</button>
                            <div className="flex gap-8">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Dobrze</p>
                                    <p className="text-xl font-bold text-green-600">{stats.correct}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Źle</p>
                                    <p className="text-xl font-bold text-red-600">{stats.wrong}</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-4xl font-bold mb-12 uppercase tracking-tight">{deck.name}</h2>

                        <div className="space-y-10">
                            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">{mode === 'classic' ? 'Nauka' : 'Test'}</h3>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cardIdx + 1} / {deck.cards.length}</span>
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
                                        <div className="card-face card-front">
                                            {displayCard?.front}
                                        </div>
                                        <div className="card-face card-back">
                                            {displayCard?.back}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {mode === 'classic' ? (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                    <button
                                        onClick={() => handleAnswer(false)}
                                        disabled={animating}
                                        className="w-full bg-white border-2 border-red-50 text-red-500 py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] hover:bg-red-50 active:scale-95 transition-all shadow-lg shadow-red-100/10 disabled:opacity-50"
                                    >
                                        Nie wiedziałem
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(true)}
                                        disabled={animating}
                                        className="w-full bg-black text-white py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        Wiedziałem
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4 space-y-4">
                                    {!testResult ? (
                                        <form onSubmit={handleTestSubmit} className="relative">
                                            <input
                                                autoFocus
                                                type="text"
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                placeholder="Wpisz odpowiedź..."
                                                className="w-full border-2 border-gray-100 rounded-[1.5rem] py-6 px-8 text-lg font-bold outline-none focus:border-black transition-all"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition"
                                            >
                                                Sprawdź
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-4">
                                                <button
                                                    onClick={handleNextWithAnimation}
                                                    className="w-full bg-black text-white py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
                                                >
                                                    Następna fiszka
                                                </button>
                                                <div className={`text-center py-2 font-black text-[10px] uppercase tracking-[0.3em] ${testResult === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
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
                    <div className="max-w-2xl mx-auto text-center py-10 finish-screen">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Gratulacje!</h2>
                        <h3 className="text-5xl font-black mb-16 uppercase tracking-tighter">Sesja zakończona</h3>
                        <div className="grid grid-cols-2 gap-8 mb-16">
                            <div className="bg-green-50/50 p-10 rounded-[3rem] border border-green-100">
                                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">Poprawne</p>
                                <p className="text-4xl font-black">{stats.correct + stats.wrong > 0 ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100) : 0}%</p>
                                <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase">{stats.correct} z {stats.correct + stats.wrong}</p>
                            </div>
                            <div className="bg-red-50/50 p-10 rounded-[3rem] border border-red-100">
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Błędne</p>
                                <p className="text-4xl font-black">{stats.correct + stats.wrong > 0 ? Math.round((stats.wrong / (stats.correct + stats.wrong)) * 100) : 0}%</p>
                                <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase">{stats.wrong} z {stats.correct + stats.wrong}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <button onClick={resetSession} className="bg-black text-white py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition">Spróbuj ponownie</button>
                            <button onClick={() => setView('home')} className="text-[10px] font-black text-gray-400 hover:text-black transition uppercase tracking-[0.2em] py-4">Wróć do menu głównego</button>
                        </div>
                    </div>
                )}

                {view === 'help' && (
                    <div className="max-w-3xl view-enter-content">
                        <PageHeader title="Centrum Pomocy" />
                        <div className="space-y-16">
                            <section>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 underline underline-offset-8 decoration-2 decoration-black">Podstawy obsługi</h4>
                                <div className="grid gap-12">
                                    <div className="flex gap-8">
                                        <span className="text-5xl font-black text-gray-100 tabular-nums">01</span>
                                        <p className="text-lg leading-relaxed">
                                            <strong className="block text-sm uppercase tracking-tighter mb-1 text-black">Struktura nauki</strong>
                                            Każda talia stanowi zamknięty moduł dydaktyczny. Wybierz kolekcję z panelu głównego, aby zainicjować sesję. Aplikacja automatycznie przygotuje licznik postępów i zresetuje statystyki Twojej poprzedniej próby.
                                        </p>
                                    </div>
                                    <div className="flex gap-8">
                                        <span className="text-5xl font-black text-gray-100 tabular-nums">02</span>
                                        <p className="text-lg leading-relaxed">
                                            <strong className="block text-sm uppercase tracking-tighter mb-1 text-black">Logika kart</strong>
                                            Proces zapamiętywania opiera się na metodzie aktywnego przypominania. Kliknięcie w kartę odwraca ją, prezentując definicję lub tłumaczenie. Zalecamy sformułowanie odpowiedzi w myślach przed odwróceniem fizki.
                                        </p>
                                    </div>
                                    <div className="flex gap-8">
                                        <span className="text-5xl font-black text-gray-100 tabular-nums">03</span>
                                        <p className="text-lg leading-relaxed">
                                            <strong className="block text-sm uppercase tracking-tighter mb-1 text-black">Samoocena i wyniki</strong>
                                            Rzetelna ocena własnej wiedzy jest kluczowa. Przycisk „Wiedziałem” oraz „Nie wiedziałem” kategoryzuje kartę w końcowym raporcie, co pozwala zidentyfikować obszary wymagające dodatkowej powtórki.
                                        </p>
                                    </div>
                                </div>
                            </section>
                            <section className="pt-8 border-t border-gray-50">
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 underline underline-offset-8 decoration-2 decoration-black">Rozwiązywanie problemów</h4>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    Jeśli napotkasz błędy w wyświetlaniu treści, zalecamy odświeżenie przeglądarki. System działa w oparciu o pamięć lokalną, więc w skrajnych przypadkach wyczyszczenie danych witryny przywróci aplikację do stanu fabrycznego.
                                </p>
                            </section>
                        </div>
                    </div>
                )}

                {view === 'contact' && (
                    <div className="max-w-3xl view-enter-content">
                        <PageHeader title="Komunikacja" />
                        <div className="space-y-12">
                            <p className="text-2xl font-light leading-relaxed text-gray-600">
                                Wspieramy dynamiczny rozwój społeczności uczącej się. Jeśli masz pytania dotyczące implementacji technicznej lub chcesz zgłosić błąd, nasze kanały komunikacji pozostają otwarte.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
                                <div className="group">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 group-hover:text-black transition">Dział Techniczny</h4>
                                    <a href="mailto:dev-support@flashcards.io" className="text-xl font-bold mb-1 hover:underline">dev-support@flashcards.io</a>
                                    <p className="text-sm text-gray-400 tracking-tight">Obsługa zgłoszeń technicznych i błędów UI/UX.</p>
                                </div>
                                <div className="group">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 group-hover:text-black transition">Partnerstwa</h4>
                                    <a href="mailto:partners@flashcards.io" className="text-xl font-bold mb-1 hover:underline">partners@flashcards.io</a>
                                    <p className="text-sm text-gray-400 tracking-tight">Propozycje integracji i dystrybucji treści.</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100">
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Centrum Operacyjne</h4>
                                <p className="text-sm leading-relaxed uppercase tracking-[0.2em] font-bold">
                                    Flashcards Digital Systems<br/>
                                    Plac Innowacji 21, 37-345 Bielsko-Biała<br/>
                                    NIP: 000-000-00-00
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'privacy' && (
                    <div className="max-w-3xl view-enter-content">
                        <PageHeader title="Polityka Prywatności" />
                        <div className="space-y-12">
                            <section>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 underline underline-offset-8 decoration-2 decoration-black">Suwerenność Danych</h4>
                                <p className="text-lg leading-relaxed">
                                    Aplikacja Flashcards została zaprojektowana zgodnie z paradygmatem <strong>Zero-Server Architecture</strong>. Oznacza to, że nie posiadamy bazy danych w chmurze, nie przechowujemy Twoich haseł ani nie profilujemy Twoich nawyków nauki. Wszystko odbywa się lokalnie na Twoim procesorze i dysku.
                                </p>
                            </section>
                            <section className="bg-gray-50/50 p-12 rounded-[3.5rem] border border-gray-100">
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Bezpieczeństwo LocalStorage</h4>
                                <p className="text-lg leading-relaxed text-gray-700">
                                    Twoje talie są serializowane do formatu JSON i przechowywane w bezpiecznym kontenerze przeglądarki. Dostęp do nich mają wyłącznie skrypty uruchamiane w obrębie tej domeny. Reklamodawcy oraz skrypty śledzące nie mają wglądu w Twoje materiały edukacyjne.
                                </p>
                            </section>
                            <section>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Brak Analityki</h4>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    W przeciwieństwie do konkurencyjnych rozwiązań, nie implementujemy SDK analitycznych (Facebook Pixel, Google Tag Manager). Twoja sesja nauki jest całkowicie anonimowa i odizolowana od systemów reklamowych.
                                </p>
                            </section>
                            <div className="pt-10 flex items-center gap-6">
                                <div className="h-[1px] flex-grow bg-gray-100"></div>
                                <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] whitespace-nowrap">Aktualizacja: Marzec 2026</div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t border-gray-100 py-16 mt-auto">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-200 cursor-default">Flashcards © 2026</p>
                    <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
                        <span onClick={() => setView('contact')} className="hover:text-black cursor-pointer transition-colors duration-300">Kontakt</span>
                        <span onClick={() => setView('help')} className="hover:text-black cursor-pointer transition-colors duration-300">Pomoc</span>
                        <span onClick={() => setView('privacy')} className="hover:text-black cursor-pointer transition-colors duration-300">Prywatność</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
import React, { useState } from 'react';

export default function App() {
    const [view, setView] = useState('home');
    const [decks] = useState([
        { id: 1, name: 'Język Angielski', cards: [{front: 'Apple', back: 'Jabłko'}, {front: 'Dog', back: 'Pies'}] },
        { id: 2, name: 'Programowanie', cards: [{front: 'Variable', back: 'Zmienna'}] }
    ]);

    const [currentDeckId, setCurrentDeckId] = useState(null);
    const [flipped, setFlipped] = useState(false);
    const [cardIdx, setCardIdx] = useState(0);
    const [stats, setStats] = useState({ correct: 0, wrong: 0 });
    const [isFinished, setIsFinished] = useState(false);

    const deck = decks.find(d => d.id === currentDeckId);

    const handleAnswer = (isCorrect) => {
        const newStats = {
            ...stats,
            [isCorrect ? 'correct' : 'wrong']: stats[isCorrect ? 'correct' : 'wrong'] + 1
        };
        setStats(newStats);

        if (cardIdx + 1 < deck.cards.length) {
            setFlipped(false);
            setCardIdx(cardIdx + 1);
        } else {
            setIsFinished(true);
        }
    };

    const resetSession = () => {
        setCardIdx(0);
        setFlipped(false);
        setStats({ correct: 0, wrong: 0 });
        setIsFinished(false);
    };

    const PageHeader = ({ title }) => (
        <div className="mb-12">
            <button onClick={() => setView('home')} className="text-[10px] font-black text-gray-400 hover:text-black mb-6 transition uppercase tracking-[0.2em]">← Wróć do strony głównej</button>
            <h2 className="text-5xl font-black tracking-tighter uppercase">{title}</h2>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white text-black">
            <header className="border-b border-gray-100 py-6">
                <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex gap-10 items-center">
                        <h1 className="text-2xl font-black tracking-tighter cursor-pointer uppercase" onClick={() => setView('home')}>Flashcards</h1>
                        <nav className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <span className={`hover:text-black cursor-pointer transition ${view === 'home' ? 'text-black' : ''}`} onClick={() => setView('home')}>Moje Talie</span>
                        </nav>
                    </div>
                    <button
                        onClick={() => alert('Funkcja dodawania w przygotowaniu')}
                        className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl font-light hover:scale-105 transition shadow-lg shadow-black/20"
                    >
                        +
                    </button>
                </div>
            </header>

            <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12">
                {view === 'home' && (
                    <div>
                        <h2 className="text-4xl font-bold mb-10 tracking-tight">Kolekcje</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {decks.map(d => (
                                <div key={d.id} onClick={() => {
                                    setCurrentDeckId(d.id);
                                    setView('deck');
                                    resetSession();
                                }}
                                     className="group border border-gray-100 p-10 rounded-[2rem] hover:border-black cursor-pointer transition-all bg-white shadow-sm hover:shadow-xl">
                                    <h3 className="text-2xl font-bold mb-2">{d.name}</h3>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{d.cards.length} kart w talii</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'deck' && deck && !isFinished && (
                    <div className="max-w-2xl mx-auto">
                        <div className="flex justify-between items-start mb-10">
                            <button onClick={() => setView('home')} className="text-[10px] font-black text-gray-400 hover:text-black transition uppercase tracking-[0.2em]">← Wróć do kolekcji</button>
                            <div className="flex gap-6">
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
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Nauka</h3>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cardIdx + 1} / {deck.cards.length}</span>
                            </div>

                            <div
                                onClick={() => setFlipped(!flipped)}
                                className="min-h-[350px] bg-white border border-gray-100 rounded-[3rem] flex items-center justify-center p-12 cursor-pointer text-center text-3xl font-bold shadow-2xl transition-all hover:scale-[1.01] active:scale-95"
                            >
                                {flipped ? deck.cards[cardIdx].back : deck.cards[cardIdx].front}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => handleAnswer(false)}
                                    className="w-full bg-white border-2 border-red-100 text-red-500 py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] hover:bg-red-50 transition shadow-lg shadow-red-100/20"
                                >
                                    Nie wiedziałem
                                </button>
                                <button
                                    onClick={() => handleAnswer(true)}
                                    className="w-full bg-black text-white py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] transition"
                                >
                                    Wiedziałem
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'deck' && isFinished && (
                    <div className="max-w-2xl mx-auto text-center py-10">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Gratulacje!</h2>
                        <h3 className="text-5xl font-black mb-16 uppercase tracking-tighter">Sesja zakończona</h3>

                        <div className="grid grid-cols-2 gap-8 mb-16">
                            <div className="bg-gray-50 p-10 rounded-[2.5rem]">
                                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">Poprawne</p>
                                <p className="text-4xl font-black">
                                    {stats.correct + stats.wrong > 0 ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100) : 0}%
                                </p>
                                <p className="text-gray-400 text-xs mt-2">{stats.correct} z {stats.correct + stats.wrong}</p>
                            </div>
                            <div className="bg-gray-50 p-10 rounded-[2.5rem]">
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Błędne</p>
                                <p className="text-4xl font-black">
                                    {stats.correct + stats.wrong > 0 ? Math.round((stats.wrong / (stats.correct + stats.wrong)) * 100) : 0}%
                                </p>
                                <p className="text-gray-400 text-xs mt-2">{stats.wrong} z {stats.correct + stats.wrong}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={resetSession}
                                className="bg-black text-white py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] transition"
                            >
                                Spróbuj ponownie
                            </button>
                            <button
                                onClick={() => setView('home')}
                                className="text-[10px] font-black text-gray-400 hover:text-black transition uppercase tracking-[0.2em] py-4"
                            >
                                Wróć do menu głównego
                            </button>
                        </div>
                    </div>
                )}

                {view === 'help' && (
                    <div className="max-w-3xl">
                        <PageHeader title="Centrum Pomocy" />
                        <div className="space-y-16">
                            <section>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 underline underline-offset-8 decoration-2 decoration-black">Podstawy obsługi</h4>
                                <div className="grid gap-10">
                                    <div className="flex gap-6">
                                        <span className="text-4xl font-black text-gray-100">01</span>
                                        <p className="text-lg leading-relaxed">
                                            <strong className="block text-sm uppercase tracking-tighter mb-1">Struktura nauki</strong>
                                            Każda talia stanowi zamknięty moduł dydaktyczny. Wybierz kolekcję z panelu głównego, aby zainicjować sesję. Aplikacja automatycznie przygotuje licznik postępów i zresetuje statystyki Twojej poprzedniej próby.
                                        </p>
                                    </div>
                                    <div className="flex gap-6">
                                        <span className="text-4xl font-black text-gray-100">02</span>
                                        <p className="text-lg leading-relaxed">
                                            <strong className="block text-sm uppercase tracking-tighter mb-1">Logika kart</strong>
                                            Proces zapamiętywania opiera się na metodzie aktywnego przypominania. Kliknięcie w kartę odwraca ją, prezentując definicję lub tłumaczenie. Zalecamy sformułowanie odpowiedzi w myślach przed odwróceniem fizki.
                                        </p>
                                    </div>
                                    <div className="flex gap-6">
                                        <span className="text-4xl font-black text-gray-100">03</span>
                                        <p className="text-lg leading-relaxed">
                                            <strong className="block text-sm uppercase tracking-tighter mb-1">Samoocena i wyniki</strong>
                                            Rzetelna ocena własnej wiedzy jest kluczowa. Przycisk „Wiedziałem” oraz „Nie wiedziałem” kategoryzuje kartę w końcowym raporcie, co pozwala zidentyfikować obszary wymagające dodatkowej powtórki.
                                        </p>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 underline underline-offset-8 decoration-2 decoration-black">Rozwiązywanie problemów</h4>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    Jeśli napotkasz błędy w wyświetlaniu treści, zalecamy odświeżenie przeglądarki. System działa w oparciu o pamięć lokalną, więc w skrajnych przypadkach wyczyszczenie danych witryny przywróci aplikację do stanu fabrycznego.
                                </p>
                            </section>
                        </div>
                    </div>
                )}

                {view === 'contact' && (
                    <div className="max-w-3xl">
                        <PageHeader title="Komunikacja" />
                        <div className="space-y-12">
                            <p className="text-2xl font-light leading-relaxed text-gray-600">
                                Wspieramy dynamiczny rozwój społeczności uczącej się. Jeśli masz pytania dotyczące implementacji technicznej lub chcesz zgłosić błąd, nasze kanały komunikacji pozostają otwarte.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Dział Techniczny</h4>
                                    <p className="text-xl font-bold mb-1">dev-support@flashcards.io</p>
                                    <p className="text-sm text-gray-400 tracking-tight">Obsługa zgłoszeń technicznych i błędów UI/UX.</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Partnerstwa</h4>
                                    <p className="text-xl font-bold mb-1">partners@flashcards.io</p>
                                    <p className="text-sm text-gray-400 tracking-tight">Propozycje integracji i dystrybucji treści.</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
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
                    <div className="max-w-3xl">
                        <PageHeader title="Polityka Prywatności" />
                        <div className="space-y-12">
                            <section>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Suwerenność Danych</h4>
                                <p className="text-lg leading-relaxed">
                                    Aplikacja Flashcards została zaprojektowana zgodnie z paradygmatem <strong>Zero-Server Architecture</strong>. Oznacza to, że nie posiadamy bazy danych w chmurze, nie przechowujemy Twoich haseł ani nie profilujemy Twoich nawyków nauki. Wszystko odbywa się lokalnie na Twoim procesorze i dysku.
                                </p>
                            </section>
                            <section className="bg-gray-50 p-10 rounded-[3rem]">
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
                            <div className="pt-10 flex items-center gap-4">
                                <div className="h-[1px] flex-grow bg-gray-100"></div>
                                <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Aktualizacja: Marzec 2026</div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t border-gray-50 py-16 mt-auto">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 cursor-default">Flashcards © 2026</p>
                    <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
                        <span onClick={() => setView('contact')} className={`hover:text-black cursor-pointer transition ${view === 'contact' ? 'text-black' : ''}`}>Kontakt</span>
                        <span onClick={() => setView('help')} className={`hover:text-black cursor-pointer transition ${view === 'help' ? 'text-black' : ''}`}>Pomoc</span>
                        <span onClick={() => setView('privacy')} className={`hover:text-black cursor-pointer transition ${view === 'privacy' ? 'text-black' : ''}`}>Prywatność</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
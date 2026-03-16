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

    const deck = decks.find(d => d.id === currentDeckId);

    const PageHeader = ({ title }) => (
        <div className="mb-12">
            <button onClick={() => setView('home')} className="text-[10px] font-black text-gray-400 hover:text-black mb-6 transition uppercase tracking-[0.2em]">← Wróć do strony głównej</button>
            <h2 className="text-5xl font-black tracking-tighter uppercase">{title}</h2>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white text-black">
            {/* HEADER */}
            <header className="border-b border-gray-100 py-6">
                <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex gap-10 items-center">
                        <h1 className="text-2xl font-black tracking-tighter cursor-pointer uppercase" onClick={() => setView('home')}>Flashcards</h1>
                        <nav className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <span className={`hover:text-black cursor-pointer transition ${view === 'home' ? 'text-black' : ''}`} onClick={() => setView('home')}>Moje Talie</span>
                            {/* Link "Pomoc" został stąd usunięty zgodnie z Twoją prośbą */}
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
                                <div key={d.id} onClick={() => { setCurrentDeckId(d.id); setView('deck'); setCardIdx(0); setFlipped(false); }}
                                     className="group border border-gray-100 p-10 rounded-[2rem] hover:border-black cursor-pointer transition-all bg-white shadow-sm hover:shadow-xl">
                                    <h3 className="text-2xl font-bold mb-2">{d.name}</h3>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{d.cards.length} kart w talii</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'deck' && deck && (
                    <div className="max-w-2xl mx-auto">
                        <button onClick={() => setView('home')} className="text-[10px] font-black text-gray-400 hover:text-black mb-10 transition uppercase tracking-[0.2em]">← Wróć do kolekcji</button>
                        <h2 className="text-4xl font-bold mb-12 uppercase tracking-tight">{deck.name}</h2>
                        <div className="space-y-10">
                            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Nauka</h3>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cardIdx + 1} / {deck.cards.length}</span>
                            </div>
                            <div onClick={() => setFlipped(!flipped)} className="min-h-[350px] bg-white border border-gray-100 rounded-[3rem] flex items-center justify-center p-12 cursor-pointer text-center text-3xl font-bold shadow-2xl transition-all hover:scale-[1.01] active:scale-95">
                                {flipped ? deck.cards[cardIdx].back : deck.cards[cardIdx].front}
                            </div>
                            <div className="flex justify-center">
                                <button onClick={() => { setFlipped(false); setCardIdx((cardIdx + 1) % deck.cards.length); }} className="w-full max-w-xs bg-black text-white py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-black/20">
                                    Następna fiszka
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'help' && (
                    <div className="max-w-3xl">
                        <PageHeader title="Pomoc" />
                        <div className="space-y-12">
                            <section>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Jak zacząć?</h4>
                                <p className="text-lg leading-relaxed">Wybierz jedną z dostępnych talii na ekranie głównym. Klikaj w kartę, aby zobaczyć jej drugą stronę, a następnie przejdź do kolejnej fiszki przyciskiem poniżej.</p>
                            </section>
                            <section>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Tworzenie własnych talii</h4>
                                <p className="text-lg leading-relaxed">Użyj przycisku "+" w prawym górnym rogu (funkcja w fazie testów), aby dodać nowy zestaw pojęć do swojej lokalnej biblioteki.</p>
                            </section>
                        </div>
                    </div>
                )}

                {view === 'contact' && (
                    <div className="max-w-3xl">
                        <PageHeader title="Kontakt" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Email</h4>
                                <p className="text-xl font-bold">hello@flashcards.io</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Wsparcie techniczne</h4>
                                <p className="text-xl font-bold">support@flashcards.io</p>
                            </div>
                            <div className="md:col-span-2 pt-8 border-t border-gray-100">
                                <p className="text-gray-400 italic">Pracujemy od poniedziałku do piątku w godzinach 9:00 - 17:00. Odpowiadamy zazwyczaj w ciągu 24 godzin.</p>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'privacy' && (
                    <div className="max-w-3xl">
                        <PageHeader title="Prywatność" />
                        <div className="space-y-8">
                            <p className="text-lg leading-relaxed font-bold">Twoje dane są bezpieczne, ponieważ nigdy nie opuszczają Twojej przeglądarki.</p>
                            <p className="text-gray-600 leading-relaxed">Aplikacja korzysta z technologii <span className="text-black font-mono">LocalStorage</span>. Oznacza to, że wszystkie stworzone przez Ciebie talie i postępy w nauce są zapisywane wyłącznie na Twoim urządzeniu. Nie używamy zewnętrznych baz danych ani systemów śledzących.</p>
                            <div className="p-8 bg-gray-50 rounded-[2rem] text-sm text-gray-500">
                                Wersja dokumentu: 1.0.1 (Marzec 2026)
                            </div>
                        </div>
                    </div>
                )}

            </main>

            <footer className="border-t border-gray-50 py-16">
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
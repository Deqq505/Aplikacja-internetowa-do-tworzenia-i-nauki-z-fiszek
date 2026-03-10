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

  const handleLinkClick = (name) => {
    alert(`Przejście do: ${name}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* HEADER */}
      <header className="border-b border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <div className="flex gap-10 items-center">
            <h1 className="text-2xl font-black tracking-tighter cursor-pointer uppercase" onClick={() => setView('home')}>Flashcards</h1>
            <nav className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span className="hover:text-black cursor-pointer transition" onClick={() => setView('home')}>Moje Talie</span>
              <span className="hover:text-black cursor-pointer transition" onClick={() => handleLinkClick('Pomoc')}>Pomoc</span>
            </nav>
          </div>
          <button 
            onClick={() => handleLinkClick('Dodawanie')} 
            className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl font-light hover:scale-105 transition shadow-lg shadow-black/20"
          >
            +
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12">
        {view === 'home' && (
          <div>
            <h2 className="text-4xl font-bold mb-10">Kolekcje</h2>
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
              
              <div 
                onClick={() => setFlipped(!flipped)} 
                className="min-h-[350px] bg-white border border-gray-100 rounded-[3rem] flex items-center justify-center p-12 cursor-pointer text-center text-3xl font-bold shadow-2xl transition-all hover:scale-[1.01] active:scale-95"
              >
                {flipped ? deck.cards[cardIdx].back : deck.cards[cardIdx].front}
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => { setFlipped(false); setCardIdx((cardIdx + 1) % deck.cards.length); }} 
                  className="w-full max-w-xs bg-black text-white py-6 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-black/20"
                >
                  Następna fiszka
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 cursor-default">Flashcards © 2026</p>
          <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
            <span onClick={() => handleLinkClick('Kontakt')} className="hover:text-black cursor-pointer transition">Kontakt</span>
            <span onClick={() => handleLinkClick('Pomoc')} className="hover:text-black cursor-pointer transition">Pomoc</span>
            <span onClick={() => handleLinkClick('Prywatność')} className="hover:text-black cursor-pointer transition">Prywatność</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
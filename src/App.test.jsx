import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Aplikacja Flashcards - Zestaw Stabilny', () => {
  
  it('powinna poprawnie renderować stronę główną z tytułem', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1, name: /Flashcards/i });
    expect(heading).toBeInTheDocument();
  });

  it('powinna wyświetlać domyślne kolekcje', () => {
    render(<App />);
    expect(screen.getByText(/Język Angielski/i)).toBeInTheDocument();
    expect(screen.getByText(/Programowanie/i)).toBeInTheDocument();
  });

  it('powinna otwierać formularz dodawania nowej talii po kliknięciu przycisku "+"', () => {
    render(<App />);
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText(/Nowa Kolekcja/i)).toBeInTheDocument();
  });

  it('powinna pozwolić na dodanie nowej kolekcji z fiszkami', () => {
    render(<App />);
    fireEvent.click(screen.getByText('+'));
    
    fireEvent.change(screen.getByPlaceholderText(/np. Słówka z Hiszpańskiego/i), { 
      target: { value: 'Geografia' } 
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Przód/i)[0], { 
      target: { value: 'Stolica Polski' } 
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Tył/i)[0], { 
      target: { value: 'Warszawa' } 
    });
    
    fireEvent.click(screen.getByText(/Utwórz kolekcję/i));
    expect(screen.getByText('Geografia')).toBeInTheDocument();
  });

  it('powinna przejść do wyboru trybu po kliknięciu w talię', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Język Angielski/i));
    expect(screen.getByText(/Wybierz tryb nauki/i)).toBeInTheDocument();
  });

  it('powinna uruchomić tryb klasyczny i pokazać pierwszą fiszkę', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Język Angielski/i));
    fireEvent.click(screen.getByText(/Tryb Klasyczny/i));
    expect(screen.getByText((content) => content.includes('1 / 2'))).toBeInTheDocument();
  });

  it('powinna obracać fiszkę po kliknięciu w trybie klasycznym', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Język Angielski/i));
    fireEvent.click(screen.getByText(/Tryb Klasyczny/i));
    
    const card = screen.getByText(/Apple/i);
    fireEvent.click(card);
    expect(screen.getByText(/Jabłko/i)).toBeInTheDocument();
  });

  it('powinna uruchomić tryb testowy', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Język Angielski/i));
    fireEvent.click(screen.getByText(/Tryb Testowy/i));
    expect(screen.getByPlaceholderText(/Wpisz odpowiedź/i)).toBeInTheDocument();
  });

  it('powinna wrócić do menu głównego po kliknięciu przycisku powrotu', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Język Angielski/i));
    fireEvent.click(screen.getByText(/Wróć do kolekcji/i));
    expect(screen.getByText(/Kolekcje/i)).toBeInTheDocument();
  });

  it('powinna otwierać i zamykać ustawienia', () => {
    render(<App />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(screen.getByText(/Wygląd aplikacji/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/Wróć do strony głównej/i));
    expect(screen.queryByText(/Wygląd aplikacji/i)).not.toBeInTheDocument();
  });

  it('powinna zmieniać motyw na ciemny', () => {
    render(<App />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    fireEvent.click(screen.getByText(/Ciemny/i));
    
    const mainContainer = screen.getByRole('main').parentElement;
    expect(mainContainer).toHaveClass('dark-mode');
  });

  it('powinna usuwać fiszkę podczas tworzenia kolekcji', () => {
    render(<App />);
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText(/Dodaj kolejną fiszkę/i));
    
    const deleteButtons = screen.getAllByText('✕');
    fireEvent.click(deleteButtons[1]);
    
    expect(screen.getAllByText('✕').length).toBe(1);
  });
});
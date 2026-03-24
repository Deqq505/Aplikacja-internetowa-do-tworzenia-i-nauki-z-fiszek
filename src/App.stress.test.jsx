import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Aplikacja Flashcards - Testy Przeciążeniowe', () => {

    it('powinna wyrenderować 50 pustych fiszek w formularzu', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));

        for (let i = 0; i < 49; i++) {
            fireEvent.click(screen.getByText(/\+ Dodaj kolejną fiszkę/i));
        }

        const inputs = screen.getAllByPlaceholderText(/Przód/i);
        expect(inputs.length).toBe(50);
    });

    it('powinna skrócić nazwę talii z 10000 znaków do 40', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        const nameInput = screen.getByPlaceholderText(/np. Słówka z Hiszpańskiego/i);
        fireEvent.change(nameInput, { target: { value: 'A'.repeat(10000) } });
        expect(nameInput.value.length).toBe(40);
    });

    it('powinna skrócić przód fiszki z 10000 znaków do 100', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        const frontInput = screen.getAllByPlaceholderText(/Przód/i)[0];
        fireEvent.change(frontInput, { target: { value: 'B'.repeat(10000) } });
        expect(frontInput.value.length).toBe(100);
    });

    it('powinna skrócić tył fiszki z 10000 znaków do 100', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        const backInput = screen.getAllByPlaceholderText(/Tył/i)[0];
        fireEvent.change(backInput, { target: { value: 'C'.repeat(10000) } });
        expect(backInput.value.length).toBe(100);
    });

    it('powinna znieść spamowanie przyciskami motywu', () => {
        const { container } = render(<App />);
        fireEvent.click(container.querySelector('header button'));
        for (let i = 0; i < 20; i++) {
            fireEvent.click(screen.getByText(/Ciemny/i));
            fireEvent.click(screen.getByText(/Jasny/i));
        }
        expect(screen.getByText(/Wygląd aplikacji/i)).toBeInTheDocument();
    });

    it('powinna wytrzymać agresywne przełączanie zakładek', () => {
        render(<App />);
        for (let i = 0; i < 15; i++) {
            fireEvent.click(screen.getByText('Kontakt'));
            fireEvent.click(screen.getByText('Pomoc'));
            fireEvent.click(screen.getByText('Prywatność'));
            fireEvent.click(screen.getByText('Moje Talie'));
        }
        expect(screen.getByText(/Kolekcje/i)).toBeInTheDocument();
    });

    it('powinna obsłużyć spamowanie dodawaniem i usuwaniem fiszek', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        for (let i = 0; i < 20; i++) {
            fireEvent.click(screen.getByText(/\+ Dodaj kolejną fiszkę/i));
            const deleteButtons = screen.getAllByText('✕');
            fireEvent.click(deleteButtons[deleteButtons.length - 1]);
        }
        expect(screen.getAllByPlaceholderText(/Przód/i).length).toBe(1);
    });

    it('powinna znieść 50 kliknięć w logo bez awarii', () => {
        const { container } = render(<App />);
        const logo = screen.getByText(/Flashcards/i, { selector: 'h1' });
        for (let i = 0; i < 50; i++) {
            fireEvent.click(logo);
        }
        expect(container.querySelector('.flashbang-active')).toBeInTheDocument();
    });

    it('powinna obsłużyć otwieranie i anulowanie modala usunięcia', () => {
        const { container } = render(<App />);
        for (let i = 0; i < 20; i++) {
            const deleteButtons = container.querySelectorAll('.absolute.top-6.right-6 button:last-child');
            fireEvent.click(deleteButtons[0]);
            fireEvent.click(screen.getByText(/Anuluj/i));
        }
        expect(screen.queryByText(/Czy na pewno chcesz/i)).not.toBeInTheDocument();
    });

    it('powinna znieść spamowanie wszystkimi opcjami motywu', () => {
        const { container } = render(<App />);
        fireEvent.click(container.querySelector('header button'));
        for (let i = 0; i < 20; i++) {
            fireEvent.click(screen.getByText(/System/i));
            fireEvent.click(screen.getByText(/Ciemny/i));
            fireEvent.click(screen.getByText(/Jasny/i));
        }
        expect(screen.getByText(/Wygląd aplikacji/i)).toBeInTheDocument();
    });

    it('powinna obsłużyć szybkie wchodzenie i wychodzenie z formularza', () => {
        render(<App />);
        for (let i = 0; i < 20; i++) {
            fireEvent.click(screen.getByText('+'));
            fireEvent.click(screen.getByText(/Wróć do strony głównej/i));
        }
        expect(screen.getByText(/Kolekcje/i)).toBeInTheDocument();
    });

    it('powinna zablokować i zignorować spam usunięcia jedynej fiszki', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        const deleteBtn = screen.getByText('✕');
        for (let i = 0; i < 50; i++) {
            fireEvent.click(deleteBtn);
        }
        expect(screen.getAllByPlaceholderText(/Przód/i).length).toBe(1);
    });

    it('powinna przetrwać wklejanie gigantycznych tekstów naraz', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        for (let i = 0; i < 5; i++) {
            fireEvent.click(screen.getByText(/\+ Dodaj kolejną fiszkę/i));
        }
        const fronts = screen.getAllByPlaceholderText(/Przód/i);
        const backs = screen.getAllByPlaceholderText(/Tył/i);
        const giantText = 'X'.repeat(2000);
        fronts.forEach(input => fireEvent.change(input, { target: { value: giantText } }));
        backs.forEach(input => fireEvent.change(input, { target: { value: giantText } }));
        expect(fronts[5].value.length).toBe(100);
    });

    it('powinna przetrwać masowe klikanie w kartę w trybie klasycznym', () => {
        render(<App />);
        fireEvent.click(screen.getByText(/Programowanie/i));
        fireEvent.click(screen.getByText(/Tryb Klasyczny/i));
        for (let i = 0; i < 50; i++) {
            fireEvent.click(screen.getByText(/Variable/i).parentElement);
        }
        expect(screen.getByText(/Variable/i)).toBeInTheDocument();
    });

    it('powinna znieść szybkie przełączanie między trybami nauki', () => {
        render(<App />);
        for (let i = 0; i < 15; i++) {
            fireEvent.click(screen.getByText(/Programowanie/i));
            fireEvent.click(screen.getByText(/Tryb Klasyczny/i));
            fireEvent.click(screen.getByText(/Wróć do kolekcji/i));
            fireEvent.click(screen.getByText(/Programowanie/i));
            fireEvent.click(screen.getByText(/Tryb Testowy/i));
            fireEvent.click(screen.getByText(/Wróć do kolekcji/i));
        }
        expect(screen.getByText(/Kolekcje/i)).toBeInTheDocument();
    });

});
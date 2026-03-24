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
        expect(screen.getByText(/1 \/ 2/i)).toBeInTheDocument();
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

    it('powinna ograniczać długość nazwy kolekcji i pokazywać błąd', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        const nameInput = screen.getByPlaceholderText(/np. Słówka z Hiszpańskiego/i);
        const longText = 'A'.repeat(45);
        fireEvent.change(nameInput, { target: { value: longText } });

        expect(nameInput.value).toBe('A'.repeat(40));
        expect(screen.getByText(/Przekroczono limit 40 znaków!/i)).toHaveClass('opacity-100');
    });

    it('powinna ograniczać długość tekstu fiszki', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        const frontInput = screen.getAllByPlaceholderText(/Przód/i)[0];
        const longText = 'B'.repeat(105);
        fireEvent.change(frontInput, { target: { value: longText } });

        expect(frontInput.value).toBe('B'.repeat(100));
    });

    it('powinna blokować zapis bez nazwy kolekcji', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        fireEvent.click(screen.getByText(/Utwórz kolekcję/i));

        expect(screen.getByText(/Proszę podać nazwę kolekcji/i)).toBeInTheDocument();
    });

    it('powinna blokować zapis z pustymi fiszkami', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        fireEvent.change(screen.getByPlaceholderText(/np. Słówka z Hiszpańskiego/i), {
            target: { value: 'Pusta talia' }
        });
        fireEvent.click(screen.getByText(/Utwórz kolekcję/i));

        expect(screen.getByText(/Kolekcja musi zawierać przynajmniej jedną w pełni uzupełnioną fiszkę/i)).toBeInTheDocument();
    });

    it('powinna obsługiwać wpisywanie poprawnej odpowiedzi w trybie testowym', () => {
        render(<App />);
        fireEvent.click(screen.getByText(/Programowanie/i));
        fireEvent.click(screen.getByText(/Tryb Testowy/i));

        const input = screen.getByPlaceholderText(/Wpisz odpowiedź/i);
        fireEvent.change(input, { target: { value: 'Zmienna' } });
        fireEvent.click(screen.getByText(/Sprawdź/i));

        expect(screen.getByText(/Świetnie! Dobra odpowiedź/i)).toBeInTheDocument();
    });

    it('powinna edytować istniejącą kolekcję z poziomu formularza', () => {
        const { container } = render(<App />);
        const editButtons = container.querySelectorAll('.absolute.top-6.right-6 button:first-child');
        fireEvent.click(editButtons[0]);

        const nameInput = screen.getByPlaceholderText(/np. Słówka z Hiszpańskiego/i);
        fireEvent.change(nameInput, { target: { value: 'Zmieniona Nazwa' } });
        fireEvent.click(screen.getByText(/Zapisz zmiany/i));

        expect(screen.getByText('Zmieniona Nazwa')).toBeInTheDocument();
    });

    it('powinna poprawnie przechodzić do sekcji Pomoc ze stopki', () => {
        render(<App />);
        fireEvent.click(screen.getByText('Pomoc'));
        expect(screen.getByText(/Centrum Pomocy/i)).toBeInTheDocument();
    });

    it('powinna poprawnie przechodzić do sekcji Kontakt ze stopki', () => {
        render(<App />);
        fireEvent.click(screen.getByText('Kontakt'));
        expect(screen.getByText(/Komunikacja/i)).toBeInTheDocument();
    });

    it('powinna poprawnie przechodzić do sekcji Prywatność ze stopki', () => {
        render(<App />);
        fireEvent.click(screen.getByText('Prywatność'));
        expect(screen.getByText(/Polityka Prywatności/i)).toBeInTheDocument();
    });

    it('powinna dodawać nowe pola fiszek po wielokrotnym kliknięciu dodaj fiszkę', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        fireEvent.click(screen.getByText(/Dodaj kolejną fiszkę/i));
        fireEvent.click(screen.getByText(/Dodaj kolejną fiszkę/i));

        const frontInputs = screen.getAllByPlaceholderText(/Przód/i);
        expect(frontInputs.length).toBe(3);
    });

    it('powinna blokować usunięcie jedynej fiszki w formularzu', () => {
        render(<App />);
        fireEvent.click(screen.getByText('+'));
        const deleteButton = screen.getByText('✕');
        expect(deleteButton).toBeDisabled();
    });

    it('powinna poprawnie usunąć kolekcję po zatwierdzeniu w modalu', () => {
        const { container } = render(<App />);
        const deleteButtons = container.querySelectorAll('.absolute.top-6.right-6 button:last-child');
        fireEvent.click(deleteButtons[1]);

        fireEvent.click(screen.getByText(/Usuń/i));
        expect(screen.queryByText(/Programowanie/i)).not.toBeInTheDocument();
    });

    it('powinna aktywować easter egg po 5 kliknięciach w logo', () => {
        const { container } = render(<App />);
        const logo = screen.getByText(/Flashcards/i, { selector: 'h1' });

        for(let i=0; i<5; i++) {
            fireEvent.click(logo);
        }

        expect(container.querySelector('.flashbang-active')).toBeInTheDocument();
    });
});
# Flashcards - Aplikacja internetowa do tworzenia i nauki z fiszek

Prosta aplikacja internetowa do tworzenia i nauki z fiszek. Projekt skupia się na przejrzystym interfejsie i logicznym wspieraniu procesu zapamiętywania.

## 📊 Diagram Przypadków Użycia
Tutaj znajduje się graficzna wizualizacja funkcjonalności aplikacji dla użytkownika.

<img width="2816" height="1536" alt="diagram" src="https://github.com/user-attachments/assets/0d5216d8-3dc2-4323-814b-9d65951ce485" />

## 👥 Autorzy
* **Grzegorz Mrzyk**
* **Marcin Puzoń**
* **Wojciech Godziek**
  
## 🌐 Link do aplikacji
* https://flashcards-tawny-chi.vercel.app

## 📸 Screeny z działania aplikacji

### 🏠 Strona Główna (Moje Talie)
Główny widok wyświetlający wszystkie zapisane kolekcje fiszek wraz z ich licznikami.
> <img width="1877" height="958" alt="image" src="https://github.com/user-attachments/assets/aaf05de1-4497-447b-bdd0-2a39bc4af918" />


### ➕ Dodawanie i Edycja Kolekcji
Dynamiczny formularz pozwalający na tworzenie nowych talii oraz zarządzanie poszczególnymi kartami.
> <img width="1863" height="958" alt="image" src="https://github.com/user-attachments/assets/fe099676-73dd-4708-af93-39f5951369fb" />


### 🎯 Wybór Trybu Nauki
Ekran pozwalający wybrać między trybem klasycznym a testowym.
> <img width="1874" height="955" alt="image" src="https://github.com/user-attachments/assets/f486f095-fade-49ee-b161-6c394b3cd60d" />


### 🃏 Tryb Klasyczny & Testowy
Widok interaktywnych fiszek oraz zaawansowanego trybu sprawdzającego wiedzę poprzez wpisywanie odpowiedzi.
> <img width="1863" height="957" alt="image" src="https://github.com/user-attachments/assets/95354247-9229-4770-a143-14ecb5a2efce" />

> <img width="1862" height="954" alt="image" src="https://github.com/user-attachments/assets/f7ee06c4-98bb-4560-a4dd-47908c3d0104" />


### 📊 Podsumowanie Wyników
Ekran prezentujący statystyki sesji nauki i skuteczność zapamiętywania.
> <img width="1863" height="958" alt="image" src="https://github.com/user-attachments/assets/6c3d2d65-2709-4ce0-9fc5-f76f721319af" />


### 🌓 Personalizacja (Dark Mode)
Obsługa motywu jasnego, ciemnego oraz dopasowania do ustawień systemowych.
> <img width="1871" height="953" alt="image" src="https://github.com/user-attachments/assets/93077526-e695-4bec-9b24-d6589a6d299e" />


### 📧 Kontakt
Sekcja umożliwiająca użytkownikowi zapoznanie się z danymi kontaktowymi autorów projektu.
> <img width="1859" height="954" alt="image" src="https://github.com/user-attachments/assets/bdbd39eb-99a7-48c7-b16e-74071984c085" />


### ❓ Pomoc / FAQ
Instrukcja obsługi aplikacji oraz odpowiedzi na najczęściej zadawane pytania dotyczące tworzenia fiszek.
> <img width="1860" height="954" alt="image" src="https://github.com/user-attachments/assets/4c9c104f-9338-49ed-9b1b-f92986a1868c" />


### 🔒 Polityka Prywatności
Informacje o sposobie przetwarzania danych oraz potwierdzenie, że wszystkie fiszki są przechowywane lokalnie w pamięci przeglądarki (LocalStorage).
> <img width="1863" height="958" alt="image" src="https://github.com/user-attachments/assets/5ebb8e1f-7b63-4055-bf16-b42ff791e9e2" />


---

## 🧪 Dokumentacja Testów

Aplikacja została poddana testom automatycznym przy użyciu **Vitest** oraz **React Testing Library**.

### Wyniki Testów (Terminal)
> <img width="2048" height="1162" alt="image" src="https://github.com/user-attachments/assets/7e1a8160-c73b-484a-9b64-798e132a9577" />


### ✅ Lista przeprowadzonych testów (Unit & Integration):
* **Header Render**: Sprawdzenie, czy nagłówek "Flashcards" wyświetla się poprawnie.
* **Initial Decks**: Weryfikacja ładowania domyślnych kolekcji (Angielski, Programowanie).
* **Navigation Flow**: Test przycisku dodawania i poprawnego otwierania widoku kreatora.
* **Creating Deck**: Pełny test dodania nowej talii wraz z kartami i zapisu.
* **Study Mode Selection**: Sprawdzenie inicjalizacji widoku wyboru trybu po kliknięciu w talię.
* **Classic Mode Logic**: Weryfikacja wyświetlania pierwszej karty po uruchomieniu sesji.
* **Test Mode Input**: Sprawdzenie obecności pola tekstowego w trybie testowym.
* **Back Button**: Testowanie powrotu do dashboardu i czyszczenia stanu sesji.
* **Theme Management**: Weryfikacja zmiany klas CSS (`dark`/`light`) na tagu `html`.
* **Row Removal**: Testowanie usuwania wierszy z kartami w edytorze.

### ⚠️ Stres Testy i Scenariusze Brzegowe (Stress Tests):
* **Validation Stress**: Blokada zapisu talii bez nazwy lub bez żadnych fiszek.
* **Data Persistence Stress**: Spójność zapisu w `localStorage` przy wielokrotnych operacjach.
* **Empty State Handling**: Zachowanie aplikacji przy próbie nauki z pustej talii.
* **UI Overflow Stress**: Sprawdzenie czytelności przy bardzo długich definicjach na kartach.
* **Rapid Interaction**: Stabilność stanu przy bardzo szybkim przełączaniu widoków.

---

## 📝 Wymagania Funkcjonalne
* **Tworzenie i usuwanie talii** – Użytkownik może organizować fiszki w oddzielne zestawy tematyczne.
* **Zarządzanie fiszkami** – Dodawanie nowych kart (pytanie/odpowiedź) oraz edycja i usuwanie już istniejących.
* **System kategorii** – Możliwość kategoryzowania talii dla zachowania porządku w nauce.
* **Logika algorytmu powtórek** – Aplikacja zarządza kolejnością wyświetlania kart, aby ułatwić naukę.
* **Licznik postępów** – Bieżące zliczanie poprawnych i błędnych odpowiedzi podczas sesji.
* **Interfejs użytkownika** – Przejrzysty widok pozwalający na wygodną obsługę aplikacji.

## ⚙️ Wymagania Niefunkcjonalne
* **Prostota obsługi** – Interfejs jest intuicyjny i pozwala na natychmiastowe rozpoczęcie nauki.
* **Lokalne działanie** – Aplikacja nie wymaga trybu online; działa stabilnie w środowisku lokalnym.
* **Responsywność** – Wygląd dostosowany do wygodnego wyświetlania treści fiszek.
* **Szybkość działania** – Natychmiastowe przełączanie między pytaniem a odpowiedzią.

## 🛠️ Technologie
* **Frontend:** React.js, Tailwind CSS, Vite.
* **Backend/Storage:** LocalStorage (pamięć przeglądarki).
* **Testy:** Vitest, React Testing Library.

## 🚀 Uruchomienie projektu

Poniżej znajduje się instrukcja, jak przygotować środowisko i uruchomić program na własnym komputerze.

### KROK 1: Instalacja środowiska Node.js
Do działania aplikacji wymagane jest środowisko Node.js. Jeśli go nie masz:
1. Wejdź na stronę [https://nodejs.org/](https://nodejs.org/).
2. Pobierz i zainstaluj wersję oznaczoną jako **LTS**.

### KROK 2: Pobranie plików
Pobierz folder z projektem na swój komputer i otwórz go za pomocą edytora **Visual Studio Code**.

### KROK 3: Otwarcie terminala w Visual Studio Code
W programie Visual Studio Code otwórz wbudowany terminal:
* Użyj skrótu klawiszowego: `Ctrl + \`` (klawisz pod Esc).
* Lub wybierz z górnego menu: **Terminal** -> **New Terminal**.

### KROK 4: Instalacja bibliotek (Dependencies)
W terminalu wpisz poniższą komendę i zatwierdź Enterem:
```bash
npm install

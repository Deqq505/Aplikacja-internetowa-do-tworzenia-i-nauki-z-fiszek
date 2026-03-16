# Flashcards - Aplikacja internetowa do tworzenia i nauki z fiszek

Prosta aplikacja internetowa do tworzenia i nauki z fiszek. Projekt skupia się na przejrzystym interfejsie i logicznym wspieraniu procesu zapamiętywania.

## 👥 Autorzy
* **Grzegorz Mrzyk**
* **Marcin Puzoń**
* **Wojciech Godziek**
  
## 🌐 Link do aplikacji
* https://flashcards-tawny-chi.vercel.app

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
```

### KROK 5: Uruchomienie programu
Po zainstalowaniu wpisz komendę i zatwierdź Enterem:
```bash
npm run dev
```
W terminalu pojawi się link (najczęściej http://localhost:5173). Skopiuj ten link i wklej w przeglądarkę.

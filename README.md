# RadioKing MP3 Downloader

Script om MP3's te downloaden uit je RadioKing account met mobiele emulatie.

## 🔧 Installatie

```bash
# Installeer dependencies
npm install

# Installeer Playwright browsers
npx playwright install chromium
```

## ⚙️ Configuratie

1. Kopieer `.env.example` naar `.env`:
   ```bash
   cp .env.example .env
   ```

2. Vul je gegevens in `.env`:
   ```
   RK_EMAIL=jouw@email.com
   RK_PASSWORD=jouwwachtwoord
   RK_URL=https://radioking.com/manager/jouw-station/playlist/jouw-playlist-id
   ```

## 🚀 Gebruik

```bash
npm start
```

Het script:
- ✅ Gebruikt iPhone 13 Pro emulatie voor mobiele versie
- ✅ Maakt screenshots bij elke stap voor debugging
- ✅ Logt alle RadioKing requests
- ✅ Houdt browser 5 minuten open voor inspectie

## 📸 Screenshots

Het script maakt automatisch screenshots:
- `step1-login.png` - Login pagina
- `step2-filled.png` - Ingevulde formulier
- `step3-logged-in.png` - Na succesvolle login
- `step4-playlist.png` - Playlist pagina

## 🔍 Belangrijkste verbeteringen

Vergeleken met het originele script:

1. **Playwright's ingebouwde device emulatie** - Gebruikt `devices['iPhone 13 Pro']` voor realistische mobiele emulatie
2. **Modernere iOS user agent** - iOS 17.2 (2024) in plaats van iOS 14
3. **Extra mobile headers** - Locale, timezone, geolocation
4. **Debug screenshots** - Bij elke stap om te controleren of mobile versie laadt
5. **Request logging** - Ziet alle RadioKing requests
6. **Betere error handling** - Met screenshots bij fouten

## 💡 Tips

- Check de screenshots om te zien of de mobiele versie correct laadt
- Het browser venster blijft 5 minuten open staan voor inspectie
- Kijk in de console voor request logs

## 🐛 Problemen oplossen

Als de mobiele versie nog steeds niet laadt:
- Check de screenshots om te zien wat er gebeurt
- Kijk of RadioKing een specifieke mobiele URL heeft (bijv. m.radioking.com)
- Probeer de user agent aan te passen in het script

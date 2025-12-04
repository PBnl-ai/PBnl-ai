const { chromium, devices } = require("playwright");
const dotenv = require("dotenv");

dotenv.config();

const EMAIL = process.env.RK_EMAIL;
const PASS = process.env.RK_PASSWORD;
const PLAYLIST = process.env.RK_URL;

(async () => {
  console.log("▶️ Start…");

  if (!EMAIL || !PASS || !PLAYLIST) {
    console.error("❌ Zorg dat RK_EMAIL, RK_PASSWORD en RK_URL in je .env staan!");
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100 // Langzamer voor betere debugging
  });

  // 🔥 GEBRUIK INGEBOUWDE IPHONE DEVICE
  const iPhone = devices['iPhone 13 Pro'];

  const context = await browser.newContext({
    ...iPhone,
    // Extra headers om mobile te forceren
    locale: 'nl-NL',
    timezoneId: 'Europe/Amsterdam',
    permissions: ['geolocation'],
    geolocation: { latitude: 52.3676, longitude: 4.9041 }, // Amsterdam
    // Extra viewport om zeker te zijn
    viewport: { width: 390, height: 844 },
    // Meest recente iOS user agent (2024)
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  // Log alle requests om te zien of mobile versie wordt geladen
  page.on('request', request => {
    if (request.url().includes('radioking')) {
      console.log(`📡 ${request.method()} ${request.url()}`);
    }
  });

  console.log("🌍 Ga naar loginpagina…");
  await page.goto("https://radioking.com/login", {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Screenshot om te zien of het mobile is
  await page.screenshot({ path: 'step1-login.png' });
  console.log("📸 Screenshot gemaakt: step1-login.png");

  // 👉 COOKIE POPUP SLUITEN
  try {
    // Wacht iets langer voor het cookie popup
    await page.waitForSelector("button[mode='primary']", { timeout: 10000 });
    console.log("🍪 Cookie popup gevonden → sluiten");
    await page.click("button[mode='primary']");
    await page.waitForTimeout(1000);
  } catch (e) {
    console.log("🍪 Geen cookie popup (prima)");
  }

  // 👉 LOGIN FIELDS
  console.log("✏️ Invullen email + wachtwoord...");

  // Wacht tot de velden zichtbaar zijn
  await page.waitForSelector('input[name="email"]', { timeout: 10000 });

  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASS);

  await page.screenshot({ path: 'step2-filled.png' });
  console.log("📸 Screenshot gemaakt: step2-filled.png");

  console.log("👉 Klikken op Login…");
  await page.click('button[type="submit"]');

  // 👉 WACHTEN TOT WE IN MANAGER ZITTEN
  try {
    await page.waitForURL(/manager/, { timeout: 30000 });
    console.log("✅ Login gelukt!");
    await page.screenshot({ path: 'step3-logged-in.png' });
    console.log("📸 Screenshot gemaakt: step3-logged-in.png");
  } catch (e) {
    console.log("❌ Login mislukt – verkeerde gegevens of extra popup?");
    await page.screenshot({ path: 'error-login.png' });
    console.log("📸 Error screenshot gemaakt: error-login.png");
    await browser.close();
    return;
  }

  // 👉 PLAYLIST OPENEN
  console.log("➡️ Opening playlistpagina…");
  await page.goto(PLAYLIST, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.screenshot({ path: 'step4-playlist.png' });
  console.log("📸 Screenshot gemaakt: step4-playlist.png");

  try {
    await page.waitForSelector(".playlist-list", { timeout: 60000 });
    console.log("🎵 Playlist geladen!");
  } catch (e) {
    console.log("⚠️ Selector '.playlist-list' niet gevonden");
    console.log("🔍 Zoeken naar alternatieve selectors...");

    // Probeer andere mogelijke selectors
    const body = await page.content();
    console.log("📄 Huidige URL:", page.url());

    await page.screenshot({ path: 'playlist-debug.png' });
    console.log("📸 Debug screenshot gemaakt: playlist-debug.png");
  }

  console.log("\n🎯 Script klaar! Check de screenshots om te zien of mobile versie geladen is.");
  console.log("💡 Laat het browser venster open staan om te inspecteren...");

  // Houd browser open voor inspectie
  await page.waitForTimeout(300000); // 5 minuten

  await browser.close();
})();

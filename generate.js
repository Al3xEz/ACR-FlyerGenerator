/**
 * ACR Flyer Generator
 * Genera un PNG 1080x1350 a partir del template HTML + datos del torneo.
 *
 * Uso:
 *   node generate.js --data '{"id":"496","nombre":"..."}' --output ../img_torneo.png
 *   node generate.js --file data.json --output ../img_torneo.png
 *
 * Requiere: npm install playwright
 * Primera vez: npx playwright install chromium
 */

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

async function generateFlyer(data, outputPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Viewport exacto del flyer
  await page.setViewportSize({ width: 1080, height: 1350 });

  // Cargar el template
  const templatePath = path.resolve(__dirname, "index.html");
  await page.goto(`file://${templatePath}`);

  // Inyectar los datos del torneo (reemplaza el objeto DATA del HTML)
  await page.evaluate((tournamentData) => {
    // Override DATA and re-render
    window.DATA = tournamentData;
    window.render();
  }, data);

  // Esperar a que la imagen del torneo y el QR carguen
  await page.waitForTimeout(1500);

  // Screenshot del elemento #flyer exactamente
  const flyer = await page.locator("#flyer");
  await flyer.screenshot({
    path: outputPath,
    type: "png",
  });

  await browser.close();
  console.log(`✓ Flyer generado: ${outputPath}`);
}

// ── CLI ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  let data, outputPath;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--data")   data = JSON.parse(args[i + 1]);
    if (args[i] === "--file")   data = JSON.parse(fs.readFileSync(args[i + 1], "utf8"));
    if (args[i] === "--output") outputPath = args[i + 1];
  }

  if (!data || !outputPath) {
    console.error("Uso: node generate.js --data '{...}' --output ruta.png");
    console.error("  o: node generate.js --file data.json --output ruta.png");
    process.exit(1);
  }

  await generateFlyer(data, outputPath);
}

main().catch(err => { console.error(err); process.exit(1); });

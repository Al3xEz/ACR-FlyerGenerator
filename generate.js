/**
 * ACR Flyer Generator
 * Genera un PNG 1080x1350 a partir del template HTML + datos del torneo.
 *
 * Uso:
 *   node generate.js --data '{"id":"496","titulo1":"..."}' --output ../img.png
 */

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const http = require("http");

const SERVE_DIR = path.resolve(__dirname);

function startServer() {
  const mimeTypes = {
    ".html": "text/html",
    ".js":   "text/javascript",
    ".css":  "text/css",
    ".png":  "image/png",
    ".webp": "image/webp",
    ".woff2":"font/woff2"
  };
  return new Promise(function(resolve) {
    const server = http.createServer(function(req, res) {
      const filePath = path.join(SERVE_DIR, req.url.split("?")[0]);
      try {
        const content = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
        res.end(content);
      } catch (e) {
        res.writeHead(404);
        res.end();
      }
    });
    server.listen(0, "127.0.0.1", function() {
      resolve({ server: server, port: server.address().port });
    });
  });
}

async function generateFlyer(data, outputPath) {
  const { server, port } = await startServer();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1350 });

    await page.goto("http://127.0.0.1:" + port + "/index.html", { waitUntil: "load" });

    // Esperar a que render() este disponible
    await page.waitForFunction(function() { return typeof window.render === "function"; });

    // Sobreescribir DATA y re-renderizar
    await page.evaluate(function(tournamentData) {
      Object.assign(window.DATA, tournamentData);
      window.render();
    }, data);

    // Esperar a que la imagen hero cargue (o falle) antes del screenshot
    await page.waitForFunction(function() {
      var img = document.getElementById('hero-img');
      return img && (img.complete || img.style.display === 'none');
    }, { timeout: 10000 }).catch(function() {});

    // Pequeña pausa para QR y fuentes
    await page.waitForTimeout(500);

    const flyer = await page.locator("#flyer");
    await flyer.screenshot({ path: outputPath, type: "png" });

    console.log("Flyer generado: " + outputPath);
  } finally {
    await browser.close();
    server.close();
  }
}

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
    process.exit(1);
  }

  await generateFlyer(data, outputPath);
}

main().catch(function(err) { console.error(err); process.exit(1); });

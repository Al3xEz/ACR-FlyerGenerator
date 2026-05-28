/**
 * ACR - Generador batch de torneos
 * Lee tournaments/{slug}/data.json y genera flyer.png + post.md
 * Uso: node generate-all.js
 *      node generate-all.js --slug 496-por-la-plata-xii
 */

const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')
const http = require('http')

const TOURNAMENTS_DIR = path.resolve(__dirname, '../tournaments')
const SERVE_DIR = path.resolve(__dirname)

function startServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css',
    '.png':  'image/png',
    '.webp': 'image/webp',
    '.woff2':'font/woff2'
  }
  return new Promise(function(resolve) {
    const server = http.createServer(function(req, res) {
      const filePath = path.join(SERVE_DIR, req.url.split('?')[0])
      try {
        const content = fs.readFileSync(filePath)
        const ext = path.extname(filePath)
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
        res.end(content)
      } catch (e) {
        res.writeHead(404)
        res.end()
      }
    })
    server.listen(0, '127.0.0.1', function() {
      resolve({ server: server, port: server.address().port })
    })
  })
}

async function generateFlyer(tournamentData, outputPath, port) {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    await page.setViewportSize({ width: 1080, height: 1350 })
    await page.goto('http://127.0.0.1:' + port + '/index.html', { waitUntil: 'load' })
    await page.waitForFunction(function() { return typeof window.render === 'function' })
    await page.evaluate(function(data) {
      Object.assign(window.DATA, data)
      window.render()
    }, tournamentData)

    // Esperar a que la imagen hero cargue (o falle) antes del screenshot
    await page.waitForFunction(function() {
      var img = document.getElementById('hero-img')
      return img && (img.complete || img.style.display === 'none')
    }, { timeout: 10000 }).catch(function() {})

    // Pausa para QR y fuentes
    await page.waitForTimeout(500)

    const flyer = await page.locator('#flyer')
    await flyer.screenshot({ path: outputPath, type: 'png' })
  } finally {
    await browser.close()
  }
}

function writePostMd(t, folderPath) {
  const title = t.titulo1 + (t.titulo2 ? ' ' + t.titulo2 : '')
  const lines = [
    '# ' + title,
    '',
    '## Caption',
    '',
    t.caption || '',
    '',
    '---',
    '',
    '## Hashtags',
    '',
    t.hashtags || '',
    '',
    '---',
    '',
    '## Notas',
    '',
    '- Torneo ID: ' + t.id,
    '- Tipo: ' + (t.tipo || '').charAt(0).toUpperCase() + (t.tipo || '').slice(1),
    '- Flyer: flyer.png',
    '- URL: https://ajedrezcostarica.com/es/tournaments/' + t.id,
    ''
  ]
  fs.writeFileSync(path.join(folderPath, 'post.md'), lines.join('\n'), 'utf8')
}

function getTournaments(onlySlug) {
  if (!fs.existsSync(TOURNAMENTS_DIR)) return []
  return fs.readdirSync(TOURNAMENTS_DIR)
    .filter(function(name) {
      if (onlySlug && name !== onlySlug) return false
      return fs.existsSync(path.join(TOURNAMENTS_DIR, name, 'data.json'))
    })
    .map(function(name) {
      return JSON.parse(fs.readFileSync(path.join(TOURNAMENTS_DIR, name, 'data.json'), 'utf8'))
    })
}

async function main() {
  const args = process.argv.slice(2)
  let onlySlug = null
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug') onlySlug = args[i + 1]
  }

  const tournaments = getTournaments(onlySlug)
  if (tournaments.length === 0) {
    console.log('No se encontraron data.json en tournaments/')
    return
  }

  console.log('Generando materiales para ' + tournaments.length + ' torneo(s)...')
  const { server, port } = await startServer()

  try {
    for (const t of tournaments) {
      const folderPath = path.join(TOURNAMENTS_DIR, t.slug)
      const flyerPath = path.join(folderPath, 'flyer.png')

      fs.mkdirSync(folderPath, { recursive: true })

      writePostMd(t, folderPath)
      console.log('[OK] post.md  -> tournaments/' + t.slug + '/')

      const flyerData = {
        id: t.id,
        imagen: t.imagen || '',
        titulo1: t.titulo1,
        titulo2: t.titulo2 || '',
        fecha: t.fecha,
        tipo: t.tipo,
        lugar: t.lugar,
        precio: t.precio,
        modalidad: t.modalidad,
        subtitulo: t.subtitulo,
        virtual: t.virtual || false
      }

      try {
        await generateFlyer(flyerData, flyerPath, port)
        console.log('[OK] flyer.png -> tournaments/' + t.slug + '/')
      } catch (err) {
        console.error('[ERROR] flyer ' + t.id + ':', err.message)
      }
    }
  } finally {
    server.close()
  }

  console.log('Listo! Revisa Social-Content/tournaments/')
}

main().catch(function(err) { console.error(err); process.exit(1) })

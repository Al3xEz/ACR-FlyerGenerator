// ═══════════════════════════════════════════════════════
// MOTOR DE RENDER — construye el flyer con los datos de DATA
// ═══════════════════════════════════════════════════════

function fitTitleFont(lines) {
  const maxW = 1080 - 128 // px-16 = 64px cada lado
  const sizes = [108, 94, 82, 70, 60, 52, 44, 38]
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  for (const sz of sizes) {
    ctx.font = `800 ${sz}px Poppins`
    const widths = lines.filter(Boolean).map((l) => ctx.measureText(l).width)
    if (Math.max(...widths) <= maxW) {
      document.getElementById('title-line1').style.fontSize = sz + 'px'
      document.getElementById('title-line2').style.fontSize = sz + 'px'
      return
    }
  }
  document.getElementById('title-line1').style.fontSize = '38px'
  document.getElementById('title-line2').style.fontSize = '38px'
}

function render() {
  const tipo = (DATA.tipo || 'clasico').toLowerCase()
  const cfg = TIPOS[tipo] || TIPOS.clasico
  const acc = cfg.accent

  // ── Color de acento global ──────────────────────────────────────────────
  document.documentElement.style.setProperty('--accent', acc)

  // ── Badge de tipo ───────────────────────────────────────────────────────
  document.getElementById('tipo-label').textContent = cfg.label
  document.getElementById('tipo-icon').innerHTML = icon(cfg.icon, 24, 'white')

  // ── Título ──────────────────────────────────────────────────────────────
  const t1 = DATA.titulo1 || DATA.nombre || ''
  const t2 = DATA.titulo2 || ''
  document.getElementById('title-line1').textContent = t1
  document.getElementById('title-line2').textContent = t2
  document.getElementById('title-line2').style.display = t2 ? '' : 'none'
  fitTitleFont([t1, t2].filter(Boolean))

  // ── Subtítulo ───────────────────────────────────────────────────────────
  document.getElementById('subtitle').innerHTML = DATA.subtitulo || ''
  document.querySelectorAll('#subtitle .kw, #subtitle em').forEach((el) => {
    el.style.color = acc
    el.style.fontStyle = 'normal'
    el.style.fontWeight = '600'
  })

  // ── Tarjeta de info ─────────────────────────────────────────────────────
  document.getElementById('val-fecha').innerHTML = (DATA.fecha || '').replace(
    /\n/g,
    '<br>'
  )
  document.getElementById('val-lugar').innerHTML = (DATA.lugar || '').replace(
    /\n/g,
    '<br>'
  )
  document.getElementById('val-precio').innerHTML = (DATA.precio || '').replace(
    /\n/g,
    '<br>'
  )
  document.getElementById('val-ritmo').innerHTML = (
    DATA.modalidad || ''
  ).replace(/\n/g, '<br>')
  document.getElementById('label-ritmo').textContent = cfg.ritmoLabel
  document.getElementById('icon-ritmo').innerHTML = icon(cfg.icon, 56, '#0A1028')

  // ── Imagen hero ─────────────────────────────────────────────────────────
  const img = document.getElementById('hero-img')
  const largeUrl =
    DATA.imagen ||
    `https://ajedrezcostarica.blob.core.windows.net/tournament-profiles/large/${DATA.id}.webp`
  const smallUrl = `https://ajedrezcostarica.blob.core.windows.net/tournament-profiles/small/${DATA.id}.webp`
  img.src = largeUrl
  img.onerror = () => {
    img.src = smallUrl
    img.onerror = () => {
      img.style.display = 'none'
    }
  }

  // ── QR ──────────────────────────────────────────────────────────────────
  document.getElementById('qr-code').innerHTML = ''
  new QRCode(document.getElementById('qr-code'), {
    text: `https://ajedrezcostarica.com/es/tournaments/${DATA.id}`,
    width: 158,
    height: 158,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
  })
}

window.addEventListener('load', render)

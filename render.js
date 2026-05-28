// ===================================================
// MOTOR DE RENDER - construye el flyer con datos de DATA
// ===================================================

function fitTitleFont(lines) {
  var maxW = 1080 - 128
  var sizes = [108, 94, 82, 70, 60, 52, 44, 38]
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')

  for (var i = 0; i < sizes.length; i++) {
    var sz = sizes[i]
    ctx.font = '800 ' + sz + 'px Poppins'
    var widths = lines.filter(Boolean).map(function(l) { return ctx.measureText(l).width })
    if (Math.max.apply(null, widths) <= maxW) {
      document.getElementById('title-line1').style.fontSize = sz + 'px'
      document.getElementById('title-line2').style.fontSize = sz + 'px'
      return
    }
  }
  document.getElementById('title-line1').style.fontSize = '38px'
  document.getElementById('title-line2').style.fontSize = '38px'
}

function render() {
  var tipo = (DATA.tipo || 'clasico').toLowerCase()
  var cfg = TIPOS[tipo] || TIPOS.clasico
  var acc = cfg.accent

  // Color de acento global
  document.documentElement.style.setProperty('--accent', acc)

  // Badge de tipo
  document.getElementById('tipo-label').textContent = cfg.label
  document.getElementById('tipo-icon').innerHTML = icon(cfg.icon, 28, 'white')

  // Titulo
  var t1 = DATA.titulo1 || DATA.nombre || ''
  var t2 = DATA.titulo2 || ''
  document.getElementById('title-line1').textContent = t1
  document.getElementById('title-line2').textContent = t2
  document.getElementById('title-line2').style.display = t2 ? '' : 'none'
  fitTitleFont([t1, t2].filter(Boolean))

  // Subtitulo
  document.getElementById('subtitle').innerHTML = DATA.subtitulo || ''
  document.querySelectorAll('#subtitle .kw, #subtitle em').forEach(function(el) {
    el.style.color = acc
    el.style.fontStyle = 'normal'
    el.style.fontWeight = '600'
  })

  // Tarjeta de info
  document.getElementById('val-fecha').innerHTML = (DATA.fecha || '').replace(/\n/g, '<br>')
  document.getElementById('label-lugar').textContent = DATA.virtual ? 'PLATAFORMA' : 'LUGAR'
  document.getElementById('val-lugar').innerHTML = (DATA.lugar || '').replace(/\n/g, '<br>')
  document.getElementById('val-precio').innerHTML = (DATA.precio || '').replace(/\n/g, '<br>')
  document.getElementById('val-ritmo').innerHTML = (DATA.modalidad || '').replace(/\n/g, '<br>')
  document.getElementById('label-ritmo').textContent = cfg.ritmoLabel
  document.getElementById('icon-ritmo').innerHTML = icon(cfg.icon, 56, '#0A1028')

  // Imagen hero
  var img = document.getElementById('hero-img')
  var largeUrl = DATA.imagen ||
    'https://ajedrezcostarica.blob.core.windows.net/tournament-profiles/large/' + DATA.id + '.webp'
  var smallUrl = 'https://ajedrezcostarica.blob.core.windows.net/tournament-profiles/small/' + DATA.id + '.webp'
  img.src = largeUrl
  img.onerror = function() {
    img.src = smallUrl
    img.onerror = function() { img.style.display = 'none' }
  }

  // QR
  document.getElementById('qr-code').innerHTML = ''
  new QRCode(document.getElementById('qr-code'), {
    text: 'https://ajedrezcostarica.com/es/tournaments/' + DATA.id,
    width: 158,
    height: 158,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
  })
}

window.addEventListener('load', render)

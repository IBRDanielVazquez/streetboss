import { businesses, categories, sample } from './catalogo.js'

const base = '/menu-navideno-2027/'
const officialUrl = 'https://streetboss.com.mx' + base
const all = { id: 'todos', label: 'Todo' }
const categoryNames = new Map(categories.map(({ id, label }) => [id, label]))
const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 })
const byId = id => document.getElementById(id)

const filters = byId('filters')
const search = byId('search-input')
const dialog = byId('menu-dialog')
let selectedCategory = all.id

function element(tag, { className, text } = {}) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
  return node
}

function imageFor({ image, alt }, className) {
  const img = element('img', { className })
  img.src = new URL(image, new URL(base, location.origin)).href
  img.alt = alt ?? ''
  img.loading = 'lazy'
  img.decoding = 'async'
  return img
}

function searchKey(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

function card(entry, { label, subtitle, business = false, open }) {
  const article = element('article', { className: business ? 'tile business-tile' : 'tile' })
  const button = element('button', { className: 'tile-button' })
  button.type = 'button'
  button.setAttribute('aria-haspopup', 'dialog')
  button.setAttribute('aria-label', 'Ver ' + entry.name)
  button.addEventListener('click', open)

  const media = element('div', { className: 'tile-media' })
  const visual = entry.image ? entry : { image: 'img/cena.webp', alt: '' }
  media.append(imageFor(visual, 'tile-image'))
  if (label) media.append(element('span', { className: 'tile-category', text: label }))

  const content = element('div', { className: 'tile-content' })
  const words = element('div')
  words.append(element('h4', { className: 'tile-name', text: entry.name }))
  if (subtitle) words.append(element('p', { className: 'tile-subtitle', text: subtitle }))
  const arrow = element('span', { className: 'tile-arrow', text: '↗' })
  arrow.setAttribute('aria-hidden', 'true')
  content.append(words, arrow)

  button.append(media, content)
  article.append(button)
  return article
}

function render() {
  const terms = searchKey(search.value).split(/\s+/u).filter(Boolean)
  const matchesWords = parts => {
    const haystack = searchKey(parts.filter(Boolean).join(' '))
    return terms.every(term => haystack.includes(term))
  }
  const matchesCategory = ids => selectedCategory === all.id || ids.includes(selectedCategory)

  const matchingItems = sample.items.filter(item =>
    matchesCategory([item.category]) &&
    matchesWords([sample.name, item.name, item.description, categoryNames.get(item.category)])
  )
  const matchingBusinesses = businesses.filter(business => {
    const items = business.items ?? []
    const categoryIds = [...new Set([...(business.categories ?? []), ...items.map(item => item.category)])]
    return matchesCategory(categoryIds) && matchesWords([
      business.name, business.description, business.city,
      ...categoryIds.map(id => categoryNames.get(id)),
      ...items.flatMap(item => [item.name, item.description]),
    ])
  })

  byId('sample-grid').replaceChildren(...matchingItems.map(item => card(item, {
    label: categoryNames.get(item.category),
    open: () => showMenu(sample, item),
  })))
  byId('business-grid').replaceChildren(...matchingBusinesses.map(business => card(business, {
    label: (business.categories ?? []).map(id => categoryNames.get(id)).find(Boolean),
    subtitle: business.city,
    business: true,
    open: () => showMenu(business),
  })))
  byId('sample-section').hidden = !matchingItems.length
  byId('business-section').hidden = !matchingBusinesses.length
  const count = matchingBusinesses.length + matchingItems.length
  byId('no-results').hidden = Boolean(count)
  byId('opening-note').hidden = Boolean(businesses.length || terms.length || selectedCategory !== all.id)
  byId('search-status').textContent = count === 1 ? '1 resultado' : count + ' resultados'
}

function setCategory(id) {
  selectedCategory = id
  for (const button of filters.children) {
    button.setAttribute('aria-pressed', String(button.value === id))
  }
  render()
}

function textLink(text, href, className) {
  const link = element('a', { className, text })
  link.href = href
  return link
}

function whatsappUrl(number, message) {
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message)
}

function showMenu(menu, dish) {
  const isSample = menu === sample
  const cover = byId('menu-cover')
  const details = byId('menu-details')
  const actions = byId('menu-actions')
  const visual = dish ?? menu
  cover.replaceChildren()
  details.replaceChildren()
  actions.replaceChildren()

  if (visual.image) cover.append(imageFor(visual, 'dialog-cover'))
  byId('menu-meta').textContent = isSample ? 'Menú de muestra · Imágenes ilustrativas' : (menu.city ?? '')
  byId('menu-title').textContent = dish?.name ?? menu.name

  if (visual.description) details.append(element('p', { className: 'menu-description', text: visual.description }))
  for (const sheet of dish ? [] : (menu.sheets ?? [])) {
    const img = imageFor(sheet, 'menu-sheet')
    const full = textLink('', img.src, 'menu-sheet-link')
    full.target = '_blank'
    full.rel = 'noopener noreferrer'
    full.setAttribute('aria-label', 'Abrir imagen del menú: ' + (sheet.alt || menu.name))
    full.append(img)
    details.append(full)
  }
  if (!dish && menu.items?.length) {
    const list = element('ul', { className: 'menu-list' })
    for (const item of menu.items) {
      const row = element('li', { className: 'menu-list-item' })
      if (item.image) row.append(imageFor(item, 'menu-thumb'))
      const copy = element('div')
      copy.append(element('h3', { text: item.name }))
      if (item.description) copy.append(element('p', { text: item.description }))
      row.append(copy)
      if (Number.isFinite(item.price)) row.append(element('strong', { className: 'price', text: money.format(item.price) }))
      list.append(row)
    }
    details.append(list)
  }

  if (isSample) {
    if (dish) {
      const fullMenu = element('button', { className: 'button button-secondary', text: 'Ver menú completo' })
      fullMenu.type = 'button'
      fullMenu.addEventListener('click', () => showMenu(sample))
      actions.append(fullMenu)
    } else {
      const join = textLink('Publica tu menú', '#participa', 'button button-primary')
      join.addEventListener('click', () => dialog.close())
      actions.append(join)
    }
  } else {
    if (menu.menuUrl) {
      const url = new URL(menu.menuUrl, location.origin)
      if (['https:', 'http:'].includes(url.protocol)) {
        actions.append(textLink('Abrir menú del negocio', url.href, 'button button-secondary'))
      }
    }
    if (/^\d{10,15}$/u.test(menu.whatsapp ?? '')) {
      const message = 'Hola, vi el menú de ' + menu.name + ' en Menú Navideño 2027 de StreetBoss. ¿Me pueden compartir disponibilidad, precios y opciones de entrega o recolección?'
      const whatsapp = textLink('Consultar por WhatsApp', whatsappUrl(menu.whatsapp, message), 'button button-primary')
      whatsapp.target = '_blank'
      whatsapp.rel = 'noopener noreferrer'
      actions.append(whatsapp)
    }
  }

  const scrollArea = dialog.querySelector('.dialog-inner')
  if (!dialog.open) dialog.showModal()
  else dialog.querySelector('.close-button').focus({ preventScroll: true })
  scrollArea.scrollTop = 0
}

for (const category of [all, ...categories]) {
  const button = element('button', { className: 'filter', text: category.label })
  button.type = 'button'
  button.value = category.id
  button.addEventListener('click', () => setCategory(category.id))
  filters.append(button)
}
setCategory(all.id)

byId('catalog-search').addEventListener('submit', event => event.preventDefault())
search.addEventListener('input', render)
byId('clear-search').addEventListener('click', () => {
  search.value = ''
  setCategory(all.id)
  search.focus()
})
byId('open-sample').addEventListener('click', () => showMenu(sample))
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close()
})

const join = byId('join-link')
const businessInfo = [
  'Hola, quiero aprovechar la superpromoción de noviembre de $199 MXN para publicar mi menú en Menú Navideño 2027 de StreetBoss.',
  '',
  'Nombre del negocio:',
  'Ciudad:',
  'WhatsApp para pedidos:',
  'Platillos o paquetes:',
  '',
  'Adjuntaré las fotos y el menú.',
]
join.href = whatsappUrl(new URL(join.href).pathname.slice(1), businessInfo.join('\n'))
byId('hero-join-link').href = join.href

byId('share-button').addEventListener('click', async event => {
  const button = event.currentTarget
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Menú Navideño 2027 | StreetBoss', url: officialUrl })
      return
    }
    await navigator.clipboard.writeText(officialUrl)
    button.firstChild.textContent = 'Enlace copiado '
    byId('share-status').textContent = 'Enlace copiado'
  } catch (error) {
    if (error.name !== 'AbortError') {
      window.open(whatsappUrl('', 'Menú Navideño 2027 | StreetBoss ' + officialUrl), '_blank', 'noopener,noreferrer')
    }
  }
})

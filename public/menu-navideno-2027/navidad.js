import { businesses, categories, demos } from './catalogo.js'

const base = '/menu-navideno-2027/'
const officialUrl = 'https://streetboss.com.mx' + base
const all = { id: 'todos', label: 'Todo' }
const categoryNames = new Map(categories.map(({ id, label }) => [id, label]))
const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 })
const byId = id => document.getElementById(id)

const filters = byId('filters')
const search = byId('search-input')
const dialog = byId('menu-dialog')
const join = byId('join-link')
const salesNumber = new URL(join.href).pathname.slice(1)
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

function card(entry, { label, subtitle, action, open }) {
  const article = element('article', { className: 'tile' })
  const button = element('button', { className: 'tile-button', text: action })
  button.type = 'button'
  button.setAttribute('aria-haspopup', 'dialog')
  button.setAttribute('aria-label', action + ' · ' + entry.name)
  button.addEventListener('click', open)

  const media = element('div', { className: 'tile-media' })
  const visual = entry.image ? entry : { image: 'img/cena.webp', alt: '' }
  media.append(imageFor(visual, 'tile-image'))
  if (label) media.append(element('span', { className: 'tile-category', text: label }))

  const content = element('div', { className: 'tile-content' })
  content.append(element('h3', { className: 'tile-name', text: entry.name }))
  if (subtitle) content.append(element('p', { className: 'tile-subtitle', text: subtitle }))
  content.append(button)
  article.append(media, content)
  return article
}

function render() {
  const terms = searchKey(search.value).split(/\s+/u).filter(Boolean)
  const matchesWords = parts => {
    const haystack = searchKey(parts.filter(Boolean).join(' '))
    return terms.every(term => haystack.includes(term))
  }
  const matchesCategory = ids => selectedCategory === all.id || ids.includes(selectedCategory)

  const matchingBusinesses = businesses.filter(business => {
    const items = business.items ?? []
    const categoryIds = [...new Set([...(business.categories ?? []), ...items.map(item => item.category)])]
    return matchesCategory(categoryIds) && matchesWords([
      business.name, business.description, business.city,
      ...categoryIds.map(id => categoryNames.get(id)),
      ...items.flatMap(item => [item.name, item.description]),
    ])
  })

  byId('business-grid').replaceChildren(...matchingBusinesses.map(business => card(business, {
    label: (business.categories ?? []).map(id => categoryNames.get(id)).find(Boolean),
    subtitle: business.city,
    action: 'Ver menú',
    open: () => showMenu(business),
  })))
  const count = matchingBusinesses.length
  byId('no-results').hidden = Boolean(count)
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

function leadUrl(demoName) {
  const message = [
    'Hola, quiero mi menú digital navideño con la superpromoción de noviembre de $199 MXN de StreetBoss.',
    ...(demoName ? ['Me interesa un menú como el demo de ' + demoName + '.'] : []),
    '',
    'Nombre del negocio:',
    'Ciudad:',
    '¿Qué comida vendo?:',
    'WhatsApp para recibir pedidos:',
    '',
    'Les puedo compartir mi carta, precios y fotos por aquí.',
  ]
  return whatsappUrl(salesNumber, message.join('\n'))
}

function demoOrder(menu) {
  const quantities = menu.items.map(() => 0)
  const panel = element('div')
  const list = element('ul', { className: 'menu-list' })
  const subtotal = element('p', { className: 'demo-subtotal' })
  subtotal.setAttribute('role', 'status')
  const preview = element('pre', { className: 'demo-message' })
  preview.id = 'demo-message'
  preview.hidden = true
  const previewButton = element('button', { className: 'button button-secondary', text: 'Ver mensaje de pedido' })
  previewButton.type = 'button'
  previewButton.setAttribute('aria-controls', preview.id)
  previewButton.setAttribute('aria-expanded', 'false')
  const orderPanel = element('div', { className: 'demo-order-panel' })
  orderPanel.append(subtotal, previewButton, preview)
  previewButton.addEventListener('click', () => togglePreview(preview.hidden))

  function togglePreview(visible) {
    preview.hidden = !visible
    previewButton.setAttribute('aria-expanded', String(visible))
    previewButton.textContent = visible ? 'Ocultar mensaje' : 'Ver mensaje de pedido'
  }

  function updateOrder() {
    const total = menu.items.reduce((sum, item, index) => sum + item.price * quantities[index], 0)
    const count = quantities.reduce((sum, quantity) => sum + quantity, 0)
    subtotal.textContent = 'Subtotal de ejemplo: ' + money.format(total) + ' MXN'
    previewButton.disabled = count === 0
    if (!count) togglePreview(false)
    const lines = menu.items.flatMap((item, index) =>
      quantities[index] ? [quantities[index] + ' × ' + item.name + ' — ' + money.format(quantities[index] * item.price)] : []
    )
    preview.textContent = ['Hola, me gustaría hacer un pedido navideño:', ...lines, '', subtotal.textContent, '¿Me confirmas disponibilidad y opciones de entrega?'].join('\n')
  }

  menu.items.forEach((item, index) => {
    const row = menuRow(item)
    const controls = element('div', { className: 'demo-quantity' })
    const count = element('span', { text: '0' })
    const decrease = element('button', { text: '−' })
    const increase = element('button', { text: '+' })
    decrease.type = increase.type = 'button'
    decrease.setAttribute('aria-label', 'Quitar ' + item.name)
    increase.setAttribute('aria-label', 'Agregar ' + item.name)
    function changeQuantity(change) {
      quantities[index] += change
      const quantity = quantities[index]
      count.textContent = String(quantity)
      decrease.disabled = quantity === 0
      updateOrder()
    }
    decrease.disabled = true
    decrease.addEventListener('click', () => changeQuantity(-1))
    increase.addEventListener('click', () => changeQuantity(1))
    controls.append(decrease, count, increase)
    row.append(controls)
    list.append(row)
  })
  updateOrder()
  panel.append(list, orderPanel)
  return panel
}

function menuRow(item) {
  const row = element('li', { className: 'menu-list-item' })
  if (item.image) row.append(imageFor(item, 'menu-thumb'))
  const copy = element('div', { className: 'menu-item-copy' })
  copy.append(element('h3', { text: item.name }))
  if (item.description) copy.append(element('p', { text: item.description }))
  if (Number.isFinite(item.price)) {
    copy.append(element('strong', { className: 'price', text: money.format(item.price) }))
  }
  row.append(copy)
  return row
}

function showMenu(menu, isDemo = false) {
  const cover = byId('menu-cover')
  const details = byId('menu-details')
  const actions = byId('menu-actions')
  cover.replaceChildren()
  details.replaceChildren()
  actions.replaceChildren()

  if (menu.image) cover.append(imageFor(menu, 'dialog-cover'))
  byId('menu-meta').textContent = isDemo ? 'Demo · Precios e imágenes de ejemplo' : (menu.city ?? '')
  byId('menu-title').textContent = menu.name

  if (!isDemo && menu.description) details.append(element('p', { className: 'menu-description', text: menu.description }))
  for (const sheet of menu.sheets ?? []) {
    const img = imageFor(sheet, 'menu-sheet')
    const full = textLink('', img.src, 'menu-sheet-link')
    full.target = '_blank'
    full.rel = 'noopener noreferrer'
    full.setAttribute('aria-label', 'Abrir imagen del menú: ' + (sheet.alt || menu.name))
    full.append(img)
    details.append(full)
  }
  if (isDemo) {
    details.append(demoOrder(menu))
    const contact = textLink('Quiero un menú como este', leadUrl(menu.name), 'button button-primary')
    contact.target = '_blank'
    contact.rel = 'noopener noreferrer'
    actions.append(contact)
  } else {
    if (menu.items?.length) {
      const list = element('ul', { className: 'menu-list' })
      list.append(...menu.items.map(menuRow))
      details.append(list)
    }
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
byId('cartelera').hidden = businesses.length === 0
if (businesses.length) setCategory(all.id)
byId('demo-grid').append(...demos.map(demo => card(demo, {
  label: 'Demo',
  subtitle: demo.description,
  action: 'Probar demo',
  open: () => showMenu(demo, true),
})))

byId('catalog-search').addEventListener('submit', event => event.preventDefault())
search.addEventListener('input', render)
byId('clear-search').addEventListener('click', () => {
  search.value = ''
  setCategory(all.id)
  search.focus()
})
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close()
})

join.href = leadUrl()
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

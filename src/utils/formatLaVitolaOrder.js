// Formato legible en WhatsApp: cada platillo y sección va separado por un renglón vacío.
export function formatLaVitolaOrder({ items, subtotal, delivery, name, phone, address, references, note, colonia = '', deliveryFee = null }) {
  const money = value => '$' + Number(value).toFixed(2);
  const productLines = items.map(({ product, qty }) => {
    const extras = product.adicionales || [];
    const extrasUnit = extras.reduce((sum, item) => sum + Number(item.precio), 0);
    const unitBase = Number(product.precio) - extrasUnit;
    const rows = [
      '*' + qty + ' × ' + product.nombre + '*',
      'Precio: ' + money(unitBase * qty),
    ];
    if (extras.length) {
      rows.push(...extras.map(extra => '+ ' + extra.nombre + ': ' + money(Number(extra.precio) * qty)));
      rows.push('*Importe: ' + money(Number(product.precio) * qty) + '*');
    }
    return rows.join('\n');
  });

  const customer = [
    '👤 *DATOS DEL CLIENTE*',
    'Nombre: ' + name.trim(),
    'WhatsApp: ' + phone,
    delivery && colonia ? 'Colonia: ' + colonia : '',
    delivery ? 'Dirección: ' + address.trim() : '',
    references?.trim() ? 'Referencias: ' + references.trim() : '',
    note?.trim() ? 'Indicaciones: ' + note.trim() : '',
  ].filter(Boolean).join('\n');

  return [
    '🍔 *SOLICITUD DE PEDIDO*\n*LA VITOLA*',
    '🧾 *PRODUCTOS*\n\n' + productLines.join('\n\n'),
    '*SUBTOTAL DE PRODUCTOS*\n' + money(subtotal) + ' MXN',
    delivery
      ? deliveryFee !== null && Number.isFinite(Number(deliveryFee))
        ? '🛵 *SERVICIO A DOMICILIO*\nCosto de envío: ' + money(deliveryFee) + '\n*TOTAL CON ENVÍO*\n' + money(Number(subtotal) + Number(deliveryFee)) + ' MXN'
        : '🛵 *SERVICIO A DOMICILIO*\n¿Cuál es el costo de envío a esta dirección?'
      : '🏪 *RECOGER EN EL LOCAL*',
    customer,
  ].join('\n\n');
}

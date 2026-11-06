import {
  BUILDER_ADDONS,
  BUILDER_FLOWERS,
  BUILDER_WRAPPINGS,
  PRODUCTS,
  SAMARKAND_DISTRICTS,
} from '../src/data/flowers.js';

function badRequest(message) {
  return Object.assign(new Error(message), { statusCode: 400 });
}

function cleanText(value, label, maxLength, required = false) {
  if (typeof value !== 'string') {
    if (required) throw badRequest(`${label}ni kiriting.`);
    return '';
  }
  const text = value.trim();
  if ((required && !text) || text.length > maxLength) {
    throw badRequest(`${label} noto‘g‘ri kiritildi.`);
  }
  return text;
}

function priceCustomBouquet(config) {
  if (!config || !Array.isArray(config.flowers) || config.flowers.length < 1) {
    throw badRequest('Maxsus guldasta tarkibi noto‘g‘ri.');
  }

  const flowerIds = new Set();
  let price = 0;
  const flowerLines = config.flowers.map((selection) => {
    const flower = BUILDER_FLOWERS.find((item) => item.id === selection.id);
    if (!flower || flowerIds.has(flower.id)) {
      throw badRequest('Guldastadagi gul turi noto‘g‘ri.');
    }
    if (!Number.isInteger(selection.count) || selection.count < 1 || selection.count > 50) {
      throw badRequest('Har bir gul soni 1–50 dona oralig‘ida bo‘lishi kerak.');
    }
    flowerIds.add(flower.id);
    price += flower.pricePerStem * selection.count;
    return `${flower.name} (${selection.count} dona)`;
  });

  const wrapping = BUILDER_WRAPPINGS.find((item) => item.id === config.wrappingId);
  if (!wrapping) throw badRequest('Guldasta o‘rovi tanlanmagan.');
  price += wrapping.price;

  const addonIds = Array.isArray(config.addonIds) ? config.addonIds : [];
  if (new Set(addonIds).size !== addonIds.length) {
    throw badRequest('Guldasta qo‘shimchalari noto‘g‘ri.');
  }
  const addons = addonIds.map((id) => {
    const addon = BUILDER_ADDONS.find((item) => item.id === id);
    if (!addon) throw badRequest('Guldasta qo‘shimchasi topilmadi.');
    price += addon.price;
    return addon.name;
  });
  const customNote = cleanText(config.customNote, 'Tabriknoma', 500);

  return {
    name: `Maxsus guldasta: ${flowerLines.join(', ')}`,
    price,
    details: { flowers: config.flowers, wrappingId: wrapping.id, wrappingName: wrapping.name, addonIds, flowerLines, addons, customNote },
  };
}

export function validateOrder(body, user) {
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 30) {
    throw badRequest('Savatcha bo‘sh yoki mahsulotlar soni noto‘g‘ri.');
  }

  const seen = new Set();
  let subtotal = 0;
  const items = body.items.map((item) => {
    if (!item || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
      throw badRequest('Mahsulot miqdori 1–50 oralig‘ida bo‘lishi kerak.');
    }
    const key = String(item.id);
    if (seen.has(key)) throw badRequest('Savatchadagi mahsulotlar takrorlangan.');
    seen.add(key);

    let pricedItem;
    if (item.isCustom === true) {
      pricedItem = priceCustomBouquet(item.customConfig);
    } else {
      const product = PRODUCTS.find((entry) => String(entry.id) === key);
      if (!product || !product.inStock) throw badRequest('Mahsulot topilmadi yoki hozir mavjud emas.');
      pricedItem = {
        name: product.name,
        price: product.price,
        details: { productId: product.id },
      };
    }
    subtotal += pricedItem.price * item.quantity;
    return { ...pricedItem, quantity: item.quantity, id: key };
  });

  const district = SAMARKAND_DISTRICTS.find((entry) => entry.name === body.district);
  if (!district) throw badRequest('Yetkazib berish hududini tanlang.');

  if (!user || typeof user.name !== 'string' || typeof user.phone !== 'string') {
    throw badRequest('Akkaunt ma’lumotlari noto‘g‘ri.');
  }
  const paymentMethods = ['Click', 'Payme', 'Naqd / Karta'];
  if (!paymentMethods.includes(body.paymentMethod)) {
    throw badRequest('To‘lov turini tanlang.');
  }

  const isSurprise = body.isSurprise === true;
  return {
    items,
    customerName: user.name,
    phone: user.phone,
    district: district.name,
    address: cleanText(body.address, 'Manzil', 500),
    deliveryDate: cleanText(body.deliveryDate, 'Yetkazish sanasi', 100),
    deliveryTime: cleanText(body.deliveryTime, 'Yetkazish vaqti', 100),
    isSurprise,
    recipientName: isSurprise ? cleanText(body.recipientName, 'Qabul qiluvchi ismi', 100, true) : '',
    recipientPhone: isSurprise ? cleanText(body.recipientPhone, 'Qabul qiluvchi telefoni', 30, true) : '',
    cardMessage: cleanText(body.cardMessage, 'Tabriknoma', 1000),
    notes: cleanText(body.notes, 'Izoh', 1000),
    paymentMethod: body.paymentMethod,
    subtotal,
    deliveryFee: district.deliveryFee,
    totalPrice: subtotal + district.deliveryFee,
  };
}

// Yordamchi funksiyalar

export function formatPrice(num) {
  if (num === null || num === undefined) return "0 so'm";
  return new Intl.NumberFormat('uz-UZ').format(num) + " so'm";
}

export function generateTelegramOrderUrl(orderDetails) {
  const {
    items,
    totalPrice,
    customerName,
    phone,
    address,
    district,
    isSurprise,
    recipientName,
    recipientPhone,
    deliveryDate,
    deliveryTime,
    cardMessage,
    paymentMethod,
    notes,
  } = orderDetails;

  let text = `🌸 *MELFIS FLOWER SHOP — YANGI BUYURTMA*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  text += `🛍 *Buyurtma tarkibi:*\n`;
  items.forEach((item, idx) => {
    text += `${idx + 1}. *${item.name}*\n`;
    text += `   Miqdor: ${item.quantity} dona | Narxi: ${formatPrice(item.price * item.quantity)}\n`;
    if (item.customDetails) {
      const details = typeof item.customDetails === 'string'
        ? item.customDetails
        : [
          item.customDetails.flowerLines?.join(', '),
          item.customDetails.wrappingName ? `O‘rov: ${item.customDetails.wrappingName}` : '',
          item.customDetails.addons?.length ? `Qo‘shimchalar: ${item.customDetails.addons.join(', ')}` : '',
          item.customDetails.customNote ? `Tabriknoma: "${item.customDetails.customNote}"` : '',
        ].filter(Boolean).join('; ');
      if (details) text += `   _Tafsilotlar: ${details}_\n`;
    }
  });

  text += `\n💰 *Umumiy to'lov:* *${formatPrice(totalPrice)}*\n`;
  text += `💳 *To'lov usuli:* ${paymentMethod || "Naqd / Karta"}\n\n`;

  text += `👤 *Buyurtmachi:*\n`;
  text += `• Ismi: ${customerName || "Ko'rsatilmadi"}\n`;
  text += `• Telefon: ${phone || "Ko'rsatilmadi"}\n\n`;

  if (isSurprise) {
    text += `🎁 *KUTILMAGAN SOVG'A (SURPRIZ):*\n`;
    text += `• Qabul qiluvchi: ${recipientName || "—"}\n`;
    text += `• Qabul qiluvchi tel: ${recipientPhone || "—"}\n`;
    text += `⚠️ _Iltimos, narxini aytmang va chek bermang!_\n\n`;
  }

  text += `📍 *Yetkazib berish manzili:*\n`;
  text += `• Hudud: ${district || "Samarqand"}\n`;
  text += `• Manzil: ${address || "Pavarot choraxasidan olib ketiladi"}\n`;
  text += `• Sana va vaqt: ${deliveryDate || "Bugun"} | ${deliveryTime || "Eng yaqin vaqtda (24/7)"}\n\n`;

  if (cardMessage && cardMessage.trim()) {
    text += `💌 *Tabriknoma so'zlari:*\n"${cardMessage.trim()}"\n\n`;
  }

  if (notes && notes.trim()) {
    text += `📝 *Qo'shimcha izoh:* ${notes.trim()}\n\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `✨ Samarqand Pavarot choraxasi | Tel: +998 70 039 07 19`;

  const encoded = encodeURIComponent(text);
  return `https://t.me/Melfis_flowers?text=${encoded}`;
}

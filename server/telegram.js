/**
 * Telegram Bot orqali yangi buyurtmalarni do'kon egasi yoki guruhiga yuborish
 */
export async function sendTelegramOrderNotification(order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Agar token yoki chat ID kiritilmagan bo'lsa, xato bermay o'tib ketadi
  if (!token || !chatId) {
    return;
  }

  const itemsText = order.items
    .map((item) => `🌸 <b>${item.name}</b> x ${item.quantity} dona (${Number(item.price).toLocaleString('uz-UZ')} so'm)`)
    .join('\n');

  const surpriseText = order.isSurprise ? '\n🎁 <b>Kutilmagan sovg‘a (Syurpriz)!</b>' : '';
  const recipientText = order.recipientName 
    ? `\n🙋‍♂️ <b>Qabul qiluvchi:</b> ${order.recipientName} ${order.recipientPhone ? `(<code>${order.recipientPhone}</code>)` : ''}` 
    : '';
  const cardText = order.cardMessage ? `\n💌 <b>Tabriknoma so'zi:</b> <i>"${order.cardMessage}"</i>` : '';
  const notesText = order.notes ? `\n📝 <b>Izoh:</b> <i>${order.notes}</i>` : '';

  const message = `
💐 <b>YANGI BUYURTMA: #${order.orderNumber}</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Buyurtmachi:</b> ${order.customerName}
📞 <b>Telefon:</b> <code>${order.phone}</code>
📍 <b>Manzil:</b> ${order.district}, ${order.address}
📅 <b>Yetkazish vaqti:</b> ${order.deliveryDate || 'Bugun'} (${order.deliveryTime || 'Iloji boricha tez'})
${recipientText}${surpriseText}${cardText}${notesText}

🛒 <b>Buyurtma tarkibi:</b>
${itemsText}

💰 <b>Yetkazish narxi:</b> ${Number(order.deliveryFee).toLocaleString('uz-UZ')} so'm
💵 <b>JAMI TO‘LOV:</b> <b>${Number(order.totalPrice).toLocaleString('uz-UZ')} so'm</b>
💳 <b>To‘lov usuli:</b> ${order.paymentMethod === 'card' ? 'Karta orqali' : 'Qabul qilganda naqd'}
━━━━━━━━━━━━━━━━━━━━
⏰ <i>Vaqt: ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}</i>
`.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('Telegram bot yuborishda xato:', errData);
    }
  } catch (error) {
    console.error('Telegram bildirishnomasini yuborib bo‘lmadi:', error);
  }
}


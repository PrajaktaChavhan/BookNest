// Builds a wa.me deep link pre-filled with a message referencing the
// listing, per our Phase 1/8 decision to use WhatsApp as a fallback
// communication channel alongside in-app chat.
export function whatsappLink(phoneNumber, listingTitle) {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  const message = encodeURIComponent(`Hi! Is "${listingTitle}" still available on BookNest?`);
  return `https://wa.me/${digitsOnly}?text=${message}`;
}

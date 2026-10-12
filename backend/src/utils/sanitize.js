// Removes HTML tags and stray angle brackets from text input.
function stripHtml(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim();
}

module.exports = { stripHtml };
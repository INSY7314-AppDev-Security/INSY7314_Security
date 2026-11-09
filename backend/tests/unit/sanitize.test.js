const { stripHtml } = require('../../src/utils/sanitize');
 
describe('stripHtml', () => {
  test('removes script tags', () => {
    expect(stripHtml('<script>alert(1)</script>Hello')).toBe('alert(1)Hello');
  });
 
  test('removes ordinary HTML tags but keeps the text', () => {
    expect(stripHtml('<b>bold</b> text')).toBe('bold text');
  });
 
  test('removes tags with attributes', () => {
    expect(stripHtml('<img src=x onerror=alert(1)>')).toBe('');
  });
 
  test('removes stray angle brackets', () => {
    expect(stripHtml('1<2')).toBe('12');
  });
 
  test('trims surrounding whitespace', () => {
    expect(stripHtml('   hello   ')).toBe('hello');
  });
 
  test('leaves non-string values unchanged', () => {
    expect(stripHtml(42)).toBe(42);
    expect(stripHtml(null)).toBe(null);
    expect(stripHtml(undefined)).toBe(undefined);
  });
});
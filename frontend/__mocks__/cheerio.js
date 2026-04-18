// Mock for cheerio - HTML parsing library
module.exports = jest.fn(() => ({
  load: jest.fn(() => ({})),
  text: jest.fn(() => ""),
  html: jest.fn(() => ""),
  find: jest.fn(() => ({
    text: jest.fn(() => ""),
    html: jest.fn(() => ""),
  })),
}));

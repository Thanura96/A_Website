// Preload fonts (stub – extend if needed)
export const preloadFonts = () => Promise.resolve();

export const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

import WebFont from 'webfontloader';

/**
 * Preload fonts using WebFont Loader
 * @param {string} id - TypeKit font ID
 * @returns {Promise} - Resolves when fonts are loaded
 */
const preloadFonts = id => {
    return new Promise((resolve) => {
        WebFont.load({
            typekit: {
                id: id
            },
            active: resolve
        });
    });
};

/**
 * Generate a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random number between min and max
 */
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export {
    preloadFonts,
    randomNumber
}

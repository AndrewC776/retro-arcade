function ColorGenerator() {
    const mix = {
        r: 25,
        g: 10,
        b: 0
    };
    const getRandColor = getRandomInt.bind(null, 0, 255);

    this.getColors = () => {
        const base = getBaseColor(mix);
        const invert = invertRGB(base);
        return {
            base: rgbToHex(base),
            invert: rgbToHex(invert),
        };
    };

    function getBaseColor(mix) {
        let r = getRandColor();
        let g = getRandColor();
        let b = getRandColor();

        r = Math.round((r + mix.r) / 2);
        g = Math.round((g + mix.g) / 2);
        b = Math.round((b + mix.b) / 2);
        return [r, g, b];
    }

    function invertRGB(rgb) {
        return rgb.map(c => 255 - c);
    }

    function toHex(c) {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    function rgbToHex(rgb) {
        return rgb.reduce((hex, c) => hex + toHex(c), '#');
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

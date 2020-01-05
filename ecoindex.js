var domQuantiles = [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601];
var reqQuantiles = [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920];
var sizeQuantiles = [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26];

/**
 * @param {array} quantiles
 * @param {number} value
 * @return {number}
 */
var calculateIndex = function (quantiles, value) {
    for (var i = 1; i < quantiles.length; i++) {
        if (value < quantiles[i]) {
            return (i + (value - quantiles[i - 1]) / (quantiles[i] - quantiles[i - 1]));
        }
    }

    return quantiles.length;
};

/**
 * @param {number} dom Number of DOM elements
 * @param {number} req Number of HTTP requests
 * @param {number} size Page size in ko
 * @return {number}
 */
module.exports.calculate = function (dom, req, size) {
    var domIndex = calculateIndex(domQuantiles, dom),
        reqIndex = calculateIndex(reqQuantiles, req),
        sizeIndex = calculateIndex(sizeQuantiles, size),
        total = 100 - 5 * (3 * domIndex + 2 * reqIndex + sizeIndex) / 6;

    return parseFloat(total.toPrecision(3));
};

/**
 * @param {number} index EcoIndex
 * @return {string}
 */
module.exports.getNote = function (index) {
    switch (true) {
        case index >= 75:
            return 'A';
        case index >= 65:
            return 'B';
        case index >= 50:
            return 'C';
        case index >= 35:
            return 'D';
        case index >= 20:
            return 'E';
        case index >= 5:
            return 'F';
        default:
            return 'G';
    }
};

/**
 * @param {string} x - from
 * @param {string} y - to
 * @param {boolean} padResult - Pad result with 0 if lees than 9
 *
 * @return {string}
 */
(function (x, y, padResult) {
    padResult = (!padResult) ? true : padResult;

    var rand = Math.random();
    var result = parseInt(Math.floor(rand * (y - x + 1))) + parseInt(x);
    System.log("result: " + result);

    if(padResult){
        return result < 10 ? '0' + result : '' + result;
    }
    return result
});

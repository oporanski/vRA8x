/**
 * Create Net Mask form cidr bit format
 * @param {string} cidr - cidr or bits Number
 *
 * @return {string}
 */
(function (cidr) {
    var bitCount = null; 

    System.debug("cidr: " + cidr);
    var pattern = /^\d\d$/;
    var isInBitFormat = pattern.test(cidr);

    if(isInBitFormat){
        bitCount = cidr;
    } 
    else{
        cidr = cidr.split('/');
        bitCount = cidr[1];
    }
    System.debug("bitCount: " + bitCount)

    var mask = [], i, n;
    for(i=0; i<4; i++) {
        n = Math.min(bitCount, 8);
        mask.push(256 - Math.pow(2, 8-n));
        bitCount -= n;
    }

    System.debug("netmask: " + mask.join('.'));
    return mask.join('.');
});

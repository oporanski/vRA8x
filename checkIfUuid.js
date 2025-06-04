/**
 * @param {string} uuid
 *
 * @return {boolean}
 */
(function (uuid) {
	var patt = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i
	return patt.test(uuid);
});

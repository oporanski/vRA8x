/**
 * @param {string} hostname
 *
 * @return {string}
 */
(function (hostname) {

	var vcVm = System.getModule("com.opo.utils").getVmByName(hostname); //dependency!
	System.debug("vcVm: " + vcVm);

	var sdkConnection = vcVm.sdkConnection;
	var optionManager = sdkConnection.optionManager;
	var vCenterFqdn = optionManager.queryOptions( "VirtualCenter.FQDN" ).shift().value;
	System.debug( "vCenter FQDN: " + vCenterFqdn );
	return vCenterFqdn.split('.')[0];
});

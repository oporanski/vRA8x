/**
 * A safe way to recover vcVM Object in big environments
 * @param {string} vmname
 * @return {VC:VirtualMachine}
 */
(function (vmname) {
    // 5 retries with random wait
    for (var w = 0; w <= 5; w++) {
        try {
            var vcs =  VcPlugin.allSdkConnections;
            break;
        } catch (e) {
            System.warn(e);
            System.sleep(Math.floor(Math.random() * 5) * 1000);
        }
    }

    if (vcs == null) {
        throw "VcPlugin failed";
    }

    var targetTypes = ["VirtualMachine"];
    var properties = ["name"];

    for (var v in vcs) {
        var vc = vcs[v];
        var containerRoot = vc.rootFolder

        var recursive = true
        var viewManager = vc.viewManager;
        if (viewManager == null) {
            System.warn("vc issue")
            continue;
        }

        var containerView = vc.viewManager.createContainerView(containerRoot, targetTypes, recursive)

        // create an object spec for the beginning of the traversal;
        // container view is the root object for this traversal
        var oSpec = new VcObjectSpec()
        oSpec.obj = containerView.reference
        oSpec.skip = true

        // create a traversal spec to select all objects in the view
        var tSpec = new VcTraversalSpec()
        tSpec.name = 'traverseEntities'
        tSpec.path = 'view'
        tSpec.skip = false
        tSpec.type = 'ContainerView'

        // add it to the object spec
        oSpec.selectSet = [tSpec]

        var propertySpecs = new Array()
        for (var t in targetTypes) {
            // specify the properties for retrieval
            var pSpec = new VcPropertySpec()
            pSpec.type = targetTypes[t]
            pSpec.pathSet = properties
            propertySpecs.push(pSpec)
        }

        var fs = new VcPropertyFilterSpec()
        fs.objectSet = [oSpec]
        fs.propSet = propertySpecs

        var retrieveOptions = new VcRetrieveOptions()
        var propertyCollector = vc.propertyCollector.createPropertyCollector()

        try {
            var retrieveResult = propertyCollector.retrievePropertiesEx([fs], retrieveOptions)

            do {
                if (typeof retrieveResult !== 'undefined' && retrieveResult !== null) {
                    var resultObjects = retrieveResult.objects
                    if (typeof resultObjects === 'undefined' || resultObjects === null) {
                        resultObjects = new Array()
                    }
                    //var pattern = new RegExp(filter)
                    for (var r in resultObjects) {
                        var objContent = resultObjects[r]
                        var id = objContent.obj.id
                        var type = objContent.obj.type
                        var props = objContent.propSet
                        for (var p in props) {
                            if (vmname === props[p].val) {
                                var dunesId = "dunes://service.dunes.ch/CustomSDKObject?id='"
                                    + vc.id + ",id:" + id + "'&dunesName='VC:" + type + "'"
                                return Server.fromUri(dunesId);
                            }
                        }
                    }
                    if (retrieveResult.token !== 'undefined' && retrieveResult.token !== null) {
                        retrieveResult = propertyCollector.continueRetrievePropertiesEx(retrieveResult.token)
                    } else {
                        break
                    }
                } else {
                    break;
                }
            } while (true)
        } finally {
            propertyCollector.destroyPropertyCollector()
            containerView.destroyView()
        }
    }
    //Check directly!
    System.warn("SearchIndex empty trying getAllVirtualMachines...")
    // spit if vmname fqdn
    var xpathVmName = vmname.split(".")[0];
    var vcvm = VcPlugin.getAllVirtualMachines(null, "xpath:name[matches(.,'" + vmname + "')]");
    System.debug('xpath:name found: ' + vcvm);
    if (vcvm.length > 1) {
        throw (vmname + " matched more than one Virtual Machine");
    }
    if (vcvm.length == 1) {
        return vcvm[0];
    }
    System.error("Virtual Machine does not exist: " + vmname);
    return null;
});

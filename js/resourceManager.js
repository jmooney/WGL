
wgl.ResourceManager = {
	_resourceGroups: {},

	registerResource: function(identifier, groupIdentifier, resource) {
		var resourceCache = this._resourceGroups[groupIdentifier];
		if (!resourceCache)
			this._resourceGroups[groupIdentifier] = resourceCache = {};

		if(resourceCache[identifier])
			alert("Resource identifier already exists: " + identifier);
		else 
			resourceCache[identifier] = resource;
	},

	request: function(identifier, groupIdentifier) {
		var resourceCache = this._resourceGroups[groupIdentifier];
		if (resourceCache)
			return resourceCache[identifier];
		return null;
	}
};
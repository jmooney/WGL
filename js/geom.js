
wgl.Geom = {
	init: function(onInitialized) {
		var cubeDataObj = wgl.Loaders.TextLoader.loadFromServer("obj/cube.obj",
			function(objData) {
				wgl.Geom.Cube = wgl.Loaders.loadOBJ(objData);
				onInitialized();
			});
	},

	_Geometry: function(verts, norms, uvs, vertIndices) {
		this.vertices = verts;
		this.uvs = uvs;
		this.normals = norms;
		this.vertexIndices = vertIndices;
	}
};

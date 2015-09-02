
wgl.DrawGroup = function(usageHint) {
	this.usageHint = usageHint || gl.STATIC_DRAW;

	/*	OpenGL State	*/
	this._shader = null;
	this._transform = null;
	this._paramNodes = [];
	this._stateNodes = [];

	/*	Geometry Handlers	*/
	this.bufferedData = [];
	this.vertexIndices = [];
	this.vertexIndicesCountsAndOffsets = [];

	this.vertexDataBufferGL = gl.createBuffer();
	this.vertexIndicesBufferGL = gl.createBuffer();
};

wgl.DrawGroup.prototype.copyToGPU = function() {
	if (this.bufferedData.length > this.internalBufferSize)
		this._resizeAndCopyGPUBuffers()

	else if (this._dirtySubRegions) {
		for (var i = 0; i < this._dirtySubRegions.length; i++) {
			var startIndex = this._dirtySubRegions[i][0];
			var endIndex = this._dirtySubRegions[i][1];

			gl.bufferSubData(gl.ARRAY_BUFFER, startIndex,
				new Float32Array(this.bufferData.slice(startIndex, endIndex)));
		}
	}
};

wgl.DrawGroup.prototype._resizeAndCopyGPUBuffers = function() {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexDataBufferGL);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferedData), this.usageHint);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndicesBufferGL);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndices), this.usageHint);

	this.internalBufferSize = this.bufferData.length;
};

wgl.DrawGroup.prototype.accumulateGeometry = function(geomData) {
	var bufferOffset = this.bufferedData.length;

	/*	Fill data buffer	*/
	for (var i = 0; i < geomData.vertices.length; i++) {
		this.bufferedData.push(geomData.vertices[i]);
		//this.bufferedData.push(geomData.uvs[i]);
		//this.bufferedData.push(geomData.normals[i]);
	}

	/*	Fill index buffer	*/
	var numVerts = geomData.vertexIndices.length;
	var indicesOffset = this.vertexIndices.length;
	for (var i = 0; i < numVerts; i++) {
		var offsetVertIndex = geomData.vertexIndices[i] + bufferOffset;
		this.vertexIndices.push(offsetVertIndex);
	}

	this.vertexIndicesCountsAndOffsets.push([numVerts, indicesOffset]);
};

wgl.DrawGroup.prototype.doDraw = function() {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexDataBufferGL);

	var attibutesLengths = [3]
	for (var i = 0; i < attibutesLengths.length; i++) {
		var numDatas = attribLengths[i];

		// This seems funky.... Why this.bufferedData[i]?
		gl.vertexAttribPointer(i, numDatas, gl.FLOAT, gl.FALSE, 0, 0);
	}

	/*	Draw the multiple arrays datas	*/
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndicesBufferGL);
	for (var i = 0; i < this.vertexIndicesCountsAndOffsets.length; i++) {
		var count = this.vertexIndicesCountsAndOffsets[i][0];
		var offset = this.vertexIndicesCountsAndOffsets[i][1];

		gl.drawElements(this.drawMode, count, 
			gl.UNSIGNED_SHORT, Uint16Array.BYTES_PER_ELEMENT * offset);
	}
};
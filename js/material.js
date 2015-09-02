
wgl.Shaders = {	
	_ShaderObject: function(shaderType, shaderSource) {
		/*	Create GL Object 	*/
		this._glObject = gl.createShader(shaderType);
		gl.shaderSource(this._glObject, shaderSource);
		gl.compileShader();

		/*	Post GL Errors Here	*/
		if (!gl.getShaderParameter(this._glObject, gl.COMPILE_STATUS))
			alert("An error occurred compiling shader: \n\t" + gl.getShaderInfoLog(shader));  
	},

	_ShaderProgram: function(shaderObjs) {
		/*	Create program object	*/
		this._shaderProgram = gl.createProgram();

		/*	Create and attach shader objects	*/
		this._shaderObjs = shaderObjs;
		for (var i = 0; i < shaderObjs.length; i++) {
			gl.attachShader(this._shaderProgram, shaderObjs[i]);
		}

		/*	Link the program 	*/
		gl.linkProgram(this._shaderProgram);
		if (!gl.getProgramParameter(this._shaderProgram, gl.LINK_STATUS))
			alert("Unable to initialize the shader program.");
	}
};

wgl.Shaders._ShaderProgram.prototype.use = function() {
	gl.useProgram(this._shaderProgram);
};

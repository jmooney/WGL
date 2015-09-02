
var gl = null;

var wgl = {
	VertexArray: function(drawMode) {
		this.drawMode = drawMode;
		this.vertexIndices = [];
		this.vertexIndicesCountsAndOffsets = [];
		this.bufferedData = [];
		
		// Create vertex and indices buffer objects
		this.verticesBuffer = gl.createBuffer();
		this.indicesBuffer = gl.createBuffer();
	}
}

wgl.init = function(canvas) {
	try {
		// Try to grab the standard context, if it fails fallback to the experimental.
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	}
	catch(e) {}

	// If we don't have a valid context, give up.
	if (!gl) {
		alert("Unable to create WebGL context! Your browser may not support it!");
		return (gl=null);
	}

	// Only continue if webgl context is created
	gl.clearColor(0.0, 0.0, 0.0, 1.0);                  	// Set clear color to black, fully opaque
	gl.enable(gl.DEPTH_TEST);                             	// Enable depth testing
	gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
	gl.viewport(0, 0, canvas.width, canvas.height);			// Set the viewport

    // Set the resize event
    canvas.onresize = function() {
    	gl.viewport(0,0, canvas.width, canvas.height);
    }

    // Setup the Renderer
    //this._renderer = new wgl._Renderer(this);
}

wgl.loop = function() {
	requestAnimationFrame( wgl.loop );

	if (!wgl.drawGroup1) {
		wgl.drawGroup1 = new wgl.DrawGroup();
		wgl.drawGroup1.accumulateGeometry(wgl.Geom.Cube);
	}

	//wgl._renderer.render();
};

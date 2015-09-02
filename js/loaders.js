
wgl.Loaders = {
	loadOBJ : function(fileData) {
		// Set up common regex patterns
		var floatRegex = "-?\\d*\\.?\\d+";
		var reqFloat = "\\s+(\\_f)".replace(/\\_f/g, floatRegex);
		var optFloat = "(?:"+reqFloat+")?";

		// Parse fileData as an obj file
		var commentRegex = "^#";
		var ignoreRegex = "(\\_|(^\\s*$))".replace(/\\_/g, commentRegex);
		var vertPosRegex = "^v" + reqFloat + reqFloat + reqFloat + optFloat;
		var vertUVRegex = "^vt" + reqFloat + reqFloat + optFloat;
		var vertNormRegex = "^vn" + reqFloat + reqFloat + reqFloat + optFloat;

		var vertexPairRegex = "\\s+(\\d+(?:/\\d+?)?(?:/\\d+))?";
		var faceRegex = "^f\\_vpr\\_vpr\\_vpr".replace(/\\_vpr/g, vertexPairRegex);

		var isIgnored = new RegExp(ignoreRegex);
		var isVertPos = new RegExp(vertPosRegex);
		var isVertUV = new RegExp(vertUVRegex);
		var isVertNorm = new RegExp(vertNormRegex);
		var isFace = new RegExp(faceRegex);

		// Create 'data' arrays
		var posData = [];
		var uvData = [];
		var normData = [];
		var presentVertexTokens = {};
		var nextIndex = 0;

		// Create final results arrays
		var vertexPositions = [];
		var vertexUVs = [];
		var vertexNorms = [];
		var vertexIndices = [];

		// Create type converters
		var converters = [parseFloat, parseFloat, parseFloat];

		// For each line in the file
		var dataLines = fileData.split("\n");
		for (var i = 0; i < dataLines.length; i++) {
			var line = dataLines[i];

			if (isIgnored.test(line))
				continue;

			var match = null;
			var vertDataMatchers = [isVertPos, isVertUV, isVertNorm];
			var targets = [posData, uvData, normData];
			for (var j = 0; j < vertDataMatchers.length; j++)
				if (match=vertDataMatchers[j].exec(line)) {

					// Convert from str to float or int
					var convertedData = [];
					for(var k = 1; k < match.length; k++) {
						var asData = converters[j](match[k]);
						if (!isNaN(asData))
							convertedData.push(asData);						
					} 

					targets[j].push(convertedData);
					break;
				}

			// Try to match as face description
			if (!match && (match=isFace.exec(line))) {
				// Pull out vertex data triple. If it's already in array, index it. Otherwise, create it and index it.
				for (var j = 1; j < match.length; j++) {
					var faceTriple = match[j];

					// Have we seen this vertex before?
					if (presentVertexTokens[faceTriple] != null) {
						vertexIndices.push(presentVertexTokens[faceTriple]);
					}
					else {	// Need to create the vertex entry

						var faceTripleData = match[j].split("/");
						var vertPos = posData[parseInt(faceTripleData[0]) - 1];
						var vertUV = (uvData[parseInt(faceTripleData[1]) - 1] || [0,0]);
						var vertNorm = (normData[parseInt(faceTripleData[2]) - 1] || [1,0,0]); 

						// Fill data array
						vertexPositions.push(vertPos);
						vertexUVs.push(vertUV);
						vertexNorms.push(vertNorm);

						// Update indices
						vertexIndices.push(nextIndex);
						presentVertexTokens[faceTriple] = nextIndex;
						nextIndex++;
					}
				}
			}

			// An invalid line was found 
			if (!match)
				console.warn("E(" + i + "): Invalid line in OBJ \"" + line + "\""); 
		}

		// Here, data is available in the arrays. Return the created geom object.
		return new wgl.Geom._Geometry(vertexPositions, vertexUVs, vertexNorms, vertexIndices);
	},

	TextLoader: {
		loadFromDOM: function(domId) {
			var domElement = document.getElementById(domId);
			if (!domElement || domElement.nodeType != domElement.TEXT_NODE)
				return null;

			/*	Read the resource data (text support only) */
			var data = domElement.textContent;
			return data;
		},

		loadFromServer: function(filePath, onLoaded) {
			var dataDescriptor = {
				ready:false,
				data:null
			};

			$.get(filePath, function(fileData) {
				dataDescriptor.ready = true;
				dataDescriptor.data = fileData;

				onLoaded(fileData);
			});

			return dataDescriptor;
		}
	}
};

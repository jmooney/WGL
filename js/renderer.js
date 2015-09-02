
wgl.Renderer = function(stateDesc) {
	this._state = stateDesc;
}

wgl.Renderer.prototype.render = function(scene, camera) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var renderState = {};

	renderState.pMatrix = camera.getPerspectiveMatrix();
	renderState.vMatrix = camera.getViewMatrix();
	renderState.vpMatrix = camera.getVPMatrix();

	/*	For each scene node, set its render state, render, and continue	*/
	var doRenderNode = function(sceneNode) {
		renderState = sceneNode.setState(renderState);
		sceneNode.draw(renderState);

		for (var i = 0; i < sceneNode.children.length; i++)
			doRenderNode(sceneNode.children[i]);

		renderState = sceneNode.unsetState(renderState);
		return;
	}

	//	Perform the render
	doRenderNode(scene.getRoot());
};
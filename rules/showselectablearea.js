/**
 * [updateFogOfWar updates the selectable area around a player]
 * @param  {[type]} playerObject [description]
 * @return {[type]}              [description]
 */
function showSelectableArea(playerObject) {
	var fogOfWarSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("selectablearea")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 0
		},
		"animations": {
			"still": {
				"frames": [0],
				"next": "still",
				"speed": 1
			}
		}
	});

	removeSelectableArea();

	var coordinates = collisionSystem.getCollisionCoordinateFromCell(playerObject.animations.x + playerObject.animations.spriteSheet._frameWidth / 2, playerObject.animations.y + playerObject.animations.spriteSheet._frameHeight / 2);
	var distance = playerObject.sightDistance;
	renderer.fogOfWarContainer.uncache();

	for (var i = coordinates.x - distance; i < coordinates.x + distance; i++) {
		for (var j = coordinates.y - distance; j < coordinates.y + distance; j++) {
			var deltax = Math.pow(Math.abs(coordinates.x - i), 2);
			var deltay = Math.pow(Math.abs(coordinates.y - j), 2);

			if (Math.sqrt(deltax + deltay) < distance) {
				var selectableArea = new createjs.Sprite(fogOfWarSpriteSheet);
				selectableArea.x = i * renderer.mapData.tilewidth - renderer.container.x;
				selectableArea.y = j * renderer.mapData.tileheight - renderer.container.y;
				renderer.fogOfWarContainer.addChild(selectableArea);
				selectableAreas.push(selectableArea);
			}
		}
	}

	renderer.beginCaching(renderer.fogOfWarContainer);
}

/**
 * [removeSelectableArea removes selectable area]
 * @return {[type]} [description]
 */
function removeSelectableArea() {
	renderer.fogOfWarContainer.uncache();
	for (var i = 0; i < selectableAreas.length; i++) {
		renderer.fogOfWarContainer.removeChild(selectableAreas[i]);
	}
	selectableAreas = [];
	renderer.beginCaching(renderer.fogOfWarContainer);
}

/**
 * [isSelectionInSelectableBounds true if selection location is in selectable area bounds]
 * @param  {[type]}  x [description]
 * @param  {[type]}  y [description]
 * @return {Boolean}   [description]
 */
function isSelectionInSelectableBounds(playerObject, x, y) {
	var selectCoordinate = collisionSystem.getCollisionCoordinateFromCell(x, y);
	var coordinates = collisionSystem.getCollisionCoordinateFromCell(playerObject.animations.x + playerObject.animations.spriteSheet._frameWidth / 2, playerObject.animations.y + playerObject.animations.spriteSheet._frameHeight / 2);
	var deltax = Math.pow(Math.abs(coordinates.x - selectCoordinate.x), 2);
	var deltay = Math.pow(Math.abs(coordinates.y - selectCoordinate.y), 2);
	var distance = playerObject.sightDistance;
	return distance > Math.sqrt(deltax + deltay);
}
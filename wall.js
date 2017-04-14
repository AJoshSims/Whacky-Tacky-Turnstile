/**
 * Displays an interactive wall and turnstile.
 *
 * <p> The possible interactions are as follows.
 * Pressing ‘q’: the turnstile doors rotate a small angle around the pole and
 * the walls remain stationary (can be done repeatedly).
 * Pressing ‘p’: the walls rotate a small angle around the turnstile and the
 * turnstile doors remain stationary (can be done repeatedly).
 * Pressing ‘r’: all objects (except for the camera) are returned to their
 * initial state.
 * Pressing ‘0’: the camera is positioned at its initial position in the
 * upper right corner closest to the viewer.
 * Pressing ‘1’: moves the camera to the upper right corner farthest from the
 * viewer.
 * Pressing ‘2’: the camera is positioned at the vertical and horizontal
 * center of the scene and directed at the front of the wall.
 *
 * <p>Should be executed in the Google Chrome web browser.
 *
 * @author Joshua Sims
 *
 * @version 2017-04-08
 */

/**
 * X coordinate of the center of the scene.
 */
var sceneCenterX = 0;

/**
 * Y coordinate of the center of the scene.
 */
var sceneCenterY = 0;

/**
 * Z coordinate of the center of the scene.
 */
var sceneCenterZ = 0;

/**
 * The width of the canvas.
 */
var canvasWidth;

/**
 * The height of the canvas.
 */
var canvasHeight;

/**
 * The scene in which the turnstile and wall appear.
 */
var scene;

/**
 * The view length of the camera.
 */
var viewLength;

/**
 * The aspect ratio.
 */
var aspRat;

/**
 * The camera that is directed at the turnstile and wall.
 */
var camera;

/**
 * Renders the scene.
 */
var renderer;

/**
 * The ground which the turnstile and wall stand upon.
 */
var ground;

/**
 * The turnstile.
 */
var turnstile;

/**
 * The wall.
 */
var wall;

/**
 * The archetypal cube from which the cubes that compose the wall are cloned.
 */
var firstCube;

/**
 * The vertices of the archetypal cube.
 */
var firstCubeVertices;

/**
 * The faces of the archetypal cube.
 */
var firstCubeFaces;

// Initializes the scene.
init();

// Draws the scene.
draw();

// Renders the scene.
renderScene();

/**
 * Initializes the scene.
 */
function init()
{
	// Defines canvas dimensions.
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;

	viewLength = 500;
	aspRat = canvasWidth/canvasHeight;
	camera = new THREE.OrthographicCamera(
		-aspRat*viewLength/2,
		aspRat*viewLength/2,
		viewLength/2,
		-viewLength/2,
		-1000, 1000);

	camera.position.x = 1;
	camera.position.y = 1;
	camera.position.z = 1;
	camera.lookAt(
		new THREE.Vector3(
		sceneCenterX, sceneCenterY, sceneCenterZ));

	// Creates the scene.
	scene = new THREE.Scene();

	// Sets up renderer.
	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Sets up event listener for keydown.
	document.addEventListener("keydown", onDocumentKeyDown);

	turnstile = new THREE.Object3D();
	wall = new THREE.Object3D();
}

/**
 * Draws the scene.
 */
function draw()
{
	buildGround();
	scene.add(ground);

	buildTurnstile();
	scene.add(turnstile);

	buildFirstCube();

	buildWall("west");
	buildWall("east");
	scene.add(wall);
}

/**
 * Builds the ground.
 */
function buildGround()
{
	var groundGeometry = new THREE.PlaneGeometry(600, 600);

	var groundMaterial =
		new THREE.MeshBasicMaterial(
		{color: 0x00ff00, side: THREE.DoubleSide});

	ground = new THREE.Mesh(groundGeometry, groundMaterial);

	ground.rotation.x = Math.PI / 2;
}

/**
 * Builds the turnstile.
 */
function buildTurnstile()
{
	var turnstilePole = buildTurnstilePole();
	var turnstileDoor01 = buildTurnstileDoor();
	var turnstileDoor02 = turnstileDoor01.clone();
	turnstileDoor02.rotation.y = Math.PI / 2;

	turnstile.add(turnstilePole, turnstileDoor01, turnstileDoor02);

	turnstile.position.y = 90;
}

/**
 * Builds the turnstile pole.
 *
 * @return the mesh of the turnstile pole.
 */
function buildTurnstilePole()
{
	var turnstilePoleGeometry =
		new THREE.CylinderGeometry(5, 5, 180);
	var turnstilePoleMaterial =
		new THREE.MeshBasicMaterial( {color: 0x000000} );
	var turnstilePole =
		new THREE.Mesh( turnstilePoleGeometry, turnstilePoleMaterial );

	return turnstilePole;
}

/**
 * Builds a turnstile door.
 *
 * @return the mesh of a turnstile door.
 */
function buildTurnstileDoor()
{
	var turnstileDoorGeometry = new THREE.Geometry();

	var x = 40;
	var y = 80;
	var z = 5;
	turnstileDoorGeometry.vertices.push(
		new THREE.Vector3(-x, y, -z),
		new THREE.Vector3(x, y, -z),
		new THREE.Vector3(x, -y, -z),
		new THREE.Vector3(-x, -y, -z),

		new THREE.Vector3(-x, y, z),
		new THREE.Vector3(x, y, z),
		new THREE.Vector3(x, -y, z),
		new THREE.Vector3(-x, -y, z));

	var vertex00 = 0;
	var vertex01 = 1;
	var vertex02 = 2;
	var vertex03 = 3;
	var vertex04 = 4;
	var vertex05 = 5;
	var vertex06 = 6;
	var vertex07 = 7;
	turnstileDoorGeometry.faces.push(
		new THREE.Face3(vertex00, vertex01, vertex02),
		new THREE.Face3(vertex02, vertex03, vertex00),

		new THREE.Face3(vertex04, vertex05, vertex06),
		new THREE.Face3(vertex06, vertex07, vertex04),

		new THREE.Face3(vertex00, vertex01, vertex05),
		new THREE.Face3(vertex05, vertex04, vertex00),

		new THREE.Face3(vertex05, vertex01, vertex02),
		new THREE.Face3(vertex02, vertex06, vertex05),

		new THREE.Face3(vertex07, vertex06, vertex02),
		new THREE.Face3(vertex02, vertex03, vertex07),

		new THREE.Face3(vertex00, vertex04, vertex07),
		new THREE.Face3(vertex07, vertex03, vertex00));

	var turnstileDoorMaterial = new THREE.MeshBasicMaterial({
		color: 0xcccccc,
		side: THREE.DoubleSide});

	var turnstileDoor = new THREE.Mesh(
		turnstileDoorGeometry, turnstileDoorMaterial);

	return turnstileDoor;
}

/**
 * Builds a portion of the wall.
 *
 * @param side - the portion of the wall to be built.
 */
function buildWall(side)
{
	var newCube;
	var posY;

	var side;
	if (side === "west")
	{
		side = -1;
	}
	else if (side === "east")
	{
		side = 1;
	}

	var alternator;
	var cubeDimensions = 40;
	var turnstileHeightAdjustment = 150;
	for (var indexColumn = 0; indexColumn < 4; ++indexColumn)
	{
		alternator = indexColumn % 2;
		for (var indexRow = 0; indexRow < 5; ++indexRow)
		{
			
			newCube = firstCube.clone();

			newCube.position.x =
				side * ((cubeDimensions * 1.5) + cubeDimensions * indexRow);
			newCube.position.y = 
				(turnstile.position.y - turnstileHeightAdjustment) 
				+ (cubeDimensions * indexColumn);

			newCube.geometry.center();
			if (indexRow % 2 == alternator)
			{
				newCube.rotation.y = Math.PI / 2;
			}
			else
			{
				newCube.rotation.x = Math.PI / 2;
			}

			wall.add(newCube);
		}
	}

	wall.position.y += 45;
}

/**
 * Builds the archetypal cube from which the cubes that compose the wall are
 * cloned.
 */
function buildFirstCube()
{
	initGeom();

	var firstCubeGeometry = new THREE.Geometry();

	firstCubeGeometry.vertices = firstCubeVertices;
	firstCubeGeometry.faces = firstCubeFaces;

	var firstCubeMaterial = new THREE.MeshBasicMaterial({
		side: THREE.DoubleSide, vertexColors: THREE.FaceColors});

	firstCube = new THREE.Mesh(firstCubeGeometry, firstCubeMaterial);
}

/**
 * Builds the geometry of the archetypal cube from which the cubes that
 * compose the wall are cloned.
 */
function initGeom()
{
	var originX = turnstile.position.x;
	var originY = turnstile.position.y;
	var originZ = turnstile.position.z;

	var offset = 20;

	firstCubeVertices =
		[new THREE.Vector3(
		originX - offset, originY + offset, originZ - offset),
		new THREE.Vector3(
		originX + offset, originY + offset, originZ - offset),
		new THREE.Vector3(
		originX + offset, originY - offset, originZ - offset),
		new THREE.Vector3(
		originX - offset, originY - offset, originZ - offset),

		new THREE.Vector3(
		originX - offset, originY + offset, originZ + offset),
		new THREE.Vector3(
		originX + offset, originY + offset, originZ + offset),
		new THREE.Vector3(
		originX + offset, originY - offset, originZ + offset),
		new THREE.Vector3(
		originX - offset, originY - offset, originZ + offset)];

	var vertex00 = 0;
	var vertex01 = 1;
	var vertex02 = 2;
	var vertex03 = 3;
	var vertex04 = 4;
	var vertex05 = 5;
	var vertex06 = 6;
	var vertex07 = 7;
	firstCubeFaces =
		[new THREE.Face3(vertex00, vertex01, vertex02),
		new THREE.Face3(vertex02, vertex03, vertex00),

		new THREE.Face3(vertex04, vertex05, vertex06),
		new THREE.Face3(vertex06, vertex07, vertex04),

		new THREE.Face3(vertex00, vertex01, vertex05),
		new THREE.Face3(vertex05, vertex04, vertex00),

		new THREE.Face3(vertex05, vertex01, vertex02),
		new THREE.Face3(vertex02, vertex06, vertex05),

		new THREE.Face3(vertex07, vertex06, vertex02),
		new THREE.Face3(vertex02, vertex03, vertex07),

		new THREE.Face3(vertex00, vertex04, vertex07),
		new THREE.Face3(vertex07, vertex03, vertex00)];

	var colors = [0xa491ee, 0xee91e6, 0xee9d91, 0x948f61, 0x9cee91, 0x91eedf];

	var color;
	var colorIndex = 0;
	for (var i = 0; i < firstCubeFaces.length; ++i)
	{
		if (i % 2 == 0)
		{
			color = colors[colorIndex];
			++colorIndex;
		}
		firstCubeFaces[i].color.setHex(color);
	}
}

/**
 * Renders the scene.
 */
function renderScene()
{
	renderer.render(scene, camera);
}

/**
 * Handles the interactions for the  different key presses.
 *
 * @param event - the key press event.
 */
function onDocumentKeyDown(event)
{
	var keyP = 80;
	var keyQ = 81;
	var keyR = 82;
	var keyZero = 48;
	var keyOne = 49;
	var keyTwo = 50;
	switch (event.keyCode)
	{
		case keyP:
			wall.rotation.y += Math.PI / 20;
			break;
		case keyQ:
			turnstile.rotation.y += Math.PI / 20;
			break;
		case keyR:
			wall.rotation.y = 0;
			turnstile.rotation.y = 0;
			break;
		case keyZero:
			camera = new THREE.OrthographicCamera(
				-aspRat*viewLength/2,
				aspRat*viewLength/2,
				viewLength/2,
				-viewLength/2,
				-1000, 1000);

			camera.position.x = 1;
			camera.position.y = 1;
			camera.position.z = 1;
			camera.lookAt(
				new THREE.Vector3(
				sceneCenterX, sceneCenterY, sceneCenterZ));
			break;
		case keyOne:
			camera = new THREE.OrthographicCamera(
				-aspRat*viewLength/2,
				aspRat*viewLength/2,
				viewLength/2,
				-viewLength/2,
				-1000, 1000);

			camera.position.x = 1;
			camera.position.y = 1;
			camera.position.z = -1;
			camera.lookAt(
				new THREE.Vector3(
				sceneCenterX, sceneCenterY, sceneCenterZ));
			break;
		case keyTwo:
			camera = new THREE.OrthographicCamera(
				-aspRat*viewLength/2,
				aspRat*viewLength/2,
				viewLength/2,
				-viewLength/2,
				-1000, 1000);

			camera.position.x = 0;
			camera.position.y = 0;
			camera.position.z = 1;
			camera.lookAt(
				new THREE.Vector3(
				sceneCenterX, sceneCenterY, sceneCenterZ));
			break;
	}

	renderScene();
}


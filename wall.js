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

var turnstile;

var firstCubeMesh;

var firstCubeVertices;

var firstCubeFaces;

init();

draw();

renderScene();

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

	camera.position.x += 1;
	camera.position.y += 1;
	camera.position.z += 1;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// Creates the scene.
	scene = new THREE.Scene();

	// Sets up renderer.
	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Sets up event listener for keydown.
	document.addEventListener("keydown", onDocumentKeyDown);
}

function draw()
{
	scene.add(buildGround());

	scene.add(buildTurnstile());

	buildFirstCube();

	buildWall();
}

function buildGround()
{
	var groundGeometry = new THREE.PlaneGeometry(600, 600);

	var groundMaterial =
		new THREE.MeshBasicMaterial(
		{color: 0x00ff00, side: THREE.DoubleSide});

	var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

	groundMesh.rotation.x = Math.PI / 2;

	return groundMesh;
}

function buildTurnstile()
{
	turnstile = new THREE.Object3D();
	var turnstilePole = buildTurnstilePole();
	var turnstileDoor01 = buildTurnstileDoor();
	var turnstileDoor02 = turnstileDoor01.clone();
	turnstileDoor02.rotation.y = Math.PI / 2;

	turnstile.add(turnstilePole, turnstileDoor01, turnstileDoor02);

	turnstile.position.y = 90;

	return turnstile;
}

function buildTurnstilePole()
{
	var turnstilePoleGeometry =
		new THREE.CylinderGeometry(5, 5, 180);
	var turnstilePoleMaterial =
		new THREE.MeshBasicMaterial( {color: 0x000000} );
	var turnstilePoleMesh =
		new THREE.Mesh( turnstilePoleGeometry, turnstilePoleMaterial );

	return turnstilePoleMesh;
}

function buildTurnstileDoor()
{
	var turnstileDoorGeometry = new THREE.Geometry();
	turnstileDoorGeometry.vertices.push(
		new THREE.Vector3(-40, 80, -5),
		new THREE.Vector3(40, 80, -5),
		new THREE.Vector3(40, -80, -5),
		new THREE.Vector3(-40, -80, -5),

		new THREE.Vector3(-40, 80, 5),
		new THREE.Vector3(40, 80, 5),
		new THREE.Vector3(40, -80, 5),
		new THREE.Vector3(-40, -80, 5));

	turnstileDoorGeometry.faces.push(
		new THREE.Face3(0, 1, 2),
		new THREE.Face3(2, 3, 0),

		new THREE.Face3(4, 5, 6),
		new THREE.Face3(6, 7, 4),

		new THREE.Face3(0, 1, 5),
		new THREE.Face3(5, 4, 0),

		new THREE.Face3(5, 1, 2),
		new THREE.Face3(2, 6, 5),

		new THREE.Face3(7, 6, 2),
		new THREE.Face3(2, 3, 7),

		new THREE.Face3(0, 4, 7),
		new THREE.Face3(7, 3, 0));

	var turnstileDoorMaterial = new THREE.MeshBasicMaterial({
		color: 0xcccccc,
		side: THREE.DoubleSide});

	var turnstileDoorMesh = new THREE.Mesh(
		turnstileDoorGeometry, turnstileDoorMaterial);

	return turnstileDoorMesh;
}

function buildWall(side)
{
	// if (side.equals("west"))
	// {
	//
	// }
}

function buildFirstCube()
{
	initGeom();

	var firstCubeGeometry = new THREE.Geometry();

	firstCubeGeometry.vertices = firstCubeVertices;
	firstCubeGeometry.faces = firstCubeFaces;

	var firstCubeMaterial = new THREE.MeshBasicMaterial({
		side: THREE.DoubleSide, vertexColors: THREE.FaceColors});

	firstCubeMesh = new THREE.Mesh(firstCubeGeometry, firstCubeMaterial);

	firstCubeMesh.position.x = turnstile.position.x + 60;

	scene.add(firstCubeMesh);
}

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

	firstCubeFaces =
		[new THREE.Face3(0, 1, 2),
		new THREE.Face3(2, 3, 0),

		new THREE.Face3(4, 5, 6),
		new THREE.Face3(6, 7, 4),

		new THREE.Face3(0, 1, 5),
		new THREE.Face3(5, 4, 0),

		new THREE.Face3(5, 1, 2),
		new THREE.Face3(2, 6, 5),

		new THREE.Face3(7, 6, 2),
		new THREE.Face3(2, 3, 7),

		new THREE.Face3(0, 4, 7),
		new THREE.Face3(7, 3, 0)];

	var color;
	for (var i = 0; i < firstCubeFaces.length; ++i)
	{
		if (i % 2 == 0)
		{
			color = Math.random() * 0xffffff;
		}
		firstCubeFaces[i].color.setHex(color);
	}
}

function renderScene()
{
	renderer.render(scene, camera);
}

function onDocumentKeyDown(event)
{
	var q = 81;
	switch (event.keyCode)
	{
		case q:
			turnstile.rotation.y += Math.PI / 20;
			break;
	}

	renderScene();
}


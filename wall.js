// /**
//  * Displays an interactive wall and turnstile.
//  *
//  * <p> The possible interactions are as follows.
//  * Pressing ‘q’: the turnstile doors rotate a small angle around the pole and
//  * the walls remain stationary (can be done repeatedly).
//  * Pressing ‘p’: the walls rotate a small angle around the turnstile and the
//  * turnstile doors remain stationary (can be done repeatedly).
//  * Pressing ‘r’: all objects (except for the camera) are returned to their
//  * initial state.
//  * Pressing ‘0’: the camera is positioned at its initial position in the
//  * upper right corner closest to the viewer.
//  * Pressing ‘1’: moves the camera to the upper right corner farthest from the
//  * viewer.
//  * Pressing ‘2’: the camera is positioned at the vertical and horizontal
//  * center of the scene and directed at the front of the wall.
//  *
//  * <p>Should be executed in the Google Chrome web browser.
//  *
//  * @author Joshua Sims
//  *
//  * @version 2017-04-08
//  */
//
// /**
//  * The width of the canvas.
//  */
// var canvasWidth;
//
// /**
//  * The height of the canvas.
//  */
// var canvasHeight;
//
// /**
//  * The scene in which the turnstile and wall appear.
//  */
// var scene;
//
// /**
//  * The view length of the camera.
//  */
// var viewLength;
//
// /**
//  * The aspect ratio.
//  */
// var aspRat;
//
// /**
//  * The camera that is directed at the turnstile and wall.
//  */
// var camera;
//
// /**
//  * Renders the scene.
//  */
// var renderer;
//
// init();
//
// draw();
//
// renderScene();
//
// function init()
// {
// 	// Establishes canvas dimensions.
// 	canvasWidth = window.innerWidth;
// 	canvasHeight = window.innerHeight;
//
// 	// Creates scene.
// 	scene = new THREE.Scene();
//
// 	// Sets up camera.
// 	viewLength = 500;
// 	aspRat = canvasWidth/canvasHeight;
// 	camera = new THREE.OrthographicCamera(
// 		-aspRat*viewLength/2,
// 		aspRat*viewLength/2,
// 		viewLength/2,
// 		-viewLength/2,
// 		-1000, 1000);
// 	// camera.position.z = 100;
// 	// camera.up = new THREE.Vector3(0, 1, 0);
// 	// camera.lookAt(new THREE.Vector3(0, 0, 0));
//
// 	// Sets up renderer.
// 	renderer = new THREE.WebGLRenderer({alpha: true});
// 	renderer.setSize(window.innerWidth, window.innerHeight);
// 	document.body.appendChild(renderer.domElement);
//
// 	// Sets up event listener for onkeydown.
// 	document.addEventListener("keydown", doThing);
// }
//
// function draw()
// {
// 	scene.add(buildGround());
//
// 	buildWall();
// }
//
// function buildGround()
// {
// 	var geometry = new THREE.PlaneGeometry(600, 1, 600);
// 	var material = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} );
// 	var plane = new THREE.Mesh( geometry, material );
// 	// plane.position.set(0, 0, 0);
// 	return plane;
// }
//
// function buildTurnStile()
// {
//
// }
//
// function buildWall(side)
// {
//
// }
//
// function buildFirstCube()
// {
//
// }
//
// function initGeom()
// {
//
// }
//
// function renderScene()
// {
// 	renderer.render(scene, camera);
// }
//
// function doThing()
// {
//
// }
//

var camera, scene, renderer;
var geometry, material, mesh;
var aspRat, canvasWidth, canvasHeight, viewLength;

init();
animate();

function init() {

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

	scene = new THREE.Scene();

	geometry = new THREE.BoxGeometry(40, 40, 40);
	for ( var i = 0; i < geometry.faces.length; i ++ ) {
		if ((i % 3) == 1)
		{
			geometry.faces[ i ].color.setHex(0xff0000);
		}
		else if ((i % 3) == 2)
		{
			geometry.faces[ i ].color.setHex(0x00ff00);
		}
		else
		{
			geometry.faces[ i ].color.setHex(0x0000ff);
		}
	}

	material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

}

function animate() {



	renderer.render(scene, camera);

}

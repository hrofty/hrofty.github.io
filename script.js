//Controlls
THREE.FPControlls = function ( camera, MouseMoveSensitivity = 0.002, speed = 800.0, height = 30.0) {
  var scope = this;
  
  scope.MouseMoveSensitivity = MouseMoveSensitivity;
  scope.speed = speed;
  scope.height = height;
  scope.click = false;
  
  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  
  var velocity = new THREE.Vector3();
  var direction = new THREE.Vector3();

  var prevTime = performance.now();

  camera.rotation.set( 0, 0, 0 );

  var pitchObject = new THREE.Object3D();
  pitchObject.add( camera );

  var yawObject = new THREE.Object3D();
  yawObject.position.y = 10;
  yawObject.add( pitchObject );

  var PI_2 = Math.PI / 2;

  var onMouseMove = function ( event ) {

    if ( scope.enabled === false ) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * scope.MouseMoveSensitivity;
    pitchObject.rotation.x -= movementY * scope.MouseMoveSensitivity;

    pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

  };

  var onKeyDown = (function ( event ) {
    
    if ( scope.enabled === false ) return;
    
    switch ( event.keyCode ) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

    }

  }).bind(this);

  var onKeyUp = (function ( event ) {
    
    if ( scope.enabled === false ) return;
    
    switch ( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

    }

  }).bind(this);
  
  var onMouseDownClick= (function ( event ) {
    if ( scope.enabled === false ) return; 
    scope.click = true;
  }).bind(this);
  
  var onMouseUpClick= (function ( event ) {
    if ( scope.enabled === false ) return; 
    scope.click = false;
  }).bind(this);

  scope.dispose = function() {
    document.removeEventListener( 'mousemove', onMouseMove, false );
    document.removeEventListener( 'keydown', onKeyDown, false );
    document.removeEventListener( 'keyup', onKeyUp, false );
    document.removeEventListener( 'mousedown', onMouseDownClick, false );
    document.removeEventListener( 'mouseup', onMouseUpClick, false );
  };

  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );
  document.addEventListener( 'mousedown', onMouseDownClick, false );
  document.addEventListener( 'mouseup', onMouseUpClick, false );

  scope.enabled = false;

  scope.getObject = function () {

    return yawObject;

  };

  scope.update = function () {

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    velocity.y -= 9.8 * 100.0 * delta;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize();

    var currentSpeed = scope.speed;
    if (moveForward || moveBackward || moveLeft || moveRight) currentSpeed = currentSpeed + (currentSpeed * 1.1);

    if ( moveForward || moveBackward ) velocity.z -= direction.z * currentSpeed * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * currentSpeed * delta;

    scope.getObject().translateX( -velocity.x * delta );
    scope.getObject().translateZ( velocity.z * delta );
    
    scope.getObject().position.y += ( velocity.y * delta );

    if ( scope.getObject().position.y < scope.height ) {

      velocity.y = 0;
      scope.getObject().position.y = scope.height;

    }
    prevTime = time;
  };
};

//Menu
var menu = document.querySelector("#menu");
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
  var element = document.body;
  var pointerlockchange = function ( event ) {
    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
      controls.enabled = true;
      menu.style.display = 'none';
    } else {
      controls.enabled = false;
      menu.style.display = '-webkit-box';
    }
  };
  var pointerlockerror = function ( event ) {
    menu.style.display = 'none';
  };

  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

  menu.addEventListener( 'click', function ( event ) {
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    if ( /Firefox/i.test( navigator.userAgent ) ) {
      var fullscreenchange = function ( event ) {
        if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
          document.removeEventListener( 'fullscreenchange', fullscreenchange );
          document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
          element.requestPointerLock();
        }
      };
      document.addEventListener( 'fullscreenchange', fullscreenchange, false );
      document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
      element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
      element.requestFullscreen();
    } else {
      element.requestPointerLock();
    }
  }, false );
} else {
  menu.innerHTML = 'Your browser not suported PointerLock';
}

//setup
var camera, scene, renderer, controls, world;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
  camera.position.y = 30;
  world = new THREE.Group();

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x28323c);
  scene.fog = new THREE.Fog( 0xffffff, 0, 2000 );
  //scene.fog = new THREE.FogExp2 (0xffffff, 0.007);

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );
  renderer.outputEncoding = THREE.sRGBEncoding;

  window.addEventListener( 'resize', onWindowResize, false );

  var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0, 100, 0.4 );
  scene.add( light );

  var dirLight = new THREE.SpotLight( 0xffffff, .5, 0.0, 180.0);
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set(0, 300, 100);
  dirLight.castShadow = true;
  dirLight.lookAt(new THREE.Vector3());
  scene.add( dirLight );
  
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  dirLight.shadow.camera.far = 3000;

  //var dirLightHeper = new THREE.SpotLightHelper( dirLight, 10 );
  //scene.add( dirLightHeper );

  controls = new THREE.FPControlls( camera );
  scene.add( controls.getObject() );

  // floor

  var floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
  var floorMaterial = new THREE.MeshLambertMaterial();
  floorMaterial.color.setHSL( 0, 0, 0.2 );

  var floor = new THREE.Mesh( floorGeometry, floorMaterial );
  floor.rotation.x = - Math.PI / 2;
  floor.receiveShadow = true;
  world.add(floor);

  //box
  const geometry = new THREE.BoxGeometry( 30, 30, 30 );
  const material = new THREE.MeshBasicMaterial( { color: 0x0c0d0f } );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.z = -40;
  cube.position.y = 30;
  world.add( cube );


  
  scene.add( world );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  if ( controls.enabled === true ) {

    controls.update();

  }

  renderer.render( scene, camera );

}




var Controlers = function() {
  this.MouseMoveSensitivity = 0.002;
  this.speed = 800.0;
  this.height = 30.0;
};

window.onload = function() {
  var controler = new Controlers();
};
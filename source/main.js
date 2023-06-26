// npm run dev
// npx vite build

import * as THREE from 'three'
import "./style.css"
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'

class Microdistrict {
  constructor() {
    //Canvas size
    } 
}


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const clock = new THREE.Clock();

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xefd1b5 );
scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );

//Object
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 10)
scene.add(light)

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 500)
camera.position.z = 30
scene.add(camera)

//Renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

const controls = new FirstPersonControls(camera, renderer.domElement)
controls.movementSpeed = 50;
controls.lookSpeed = 0.2;

//Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update( clock.getDelta() )
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

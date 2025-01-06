// Import the Three.js library
import * as THREE from "three";
// To allow for the camera to move around the scene
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS scene
const scene: THREE.Scene = new THREE.Scene();

// Create a new camera with position and angles
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Keep object as global variable
let object: THREE.Object3D | undefined;

// OrbitControl to move the scene
let controls: OrbitControls | undefined;

// Set object to render
const objToRender: string = "pudding";

// Initiate the loader
const loader: GLTFLoader = new GLTFLoader();

// Load the file
loader.load(
  `/models/${objToRender}/jiggly_pudding.glb`,
  function (gltf: GLTF) {
    // If file loaded, go to scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr: ProgressEvent) {
    // Log the loading progress
    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  // function (error: ErrorEvent) {
  //   // If there is an error, log it
  //   console.error("Error loading model:", error);
  // }
);

// Instantiate a new renderer and set its size
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Add renderer to the DOM
const container = document.getElementById("container3D");
if (container) {
  container.appendChild(renderer.domElement);
} else {
  console.error("Container element with ID 'container3D' not found.");
}

// Set how far the camera is from the 3D model
camera.position.z = objToRender === "dino" ? 25 : 500;

// Add lighting to illuminate the object
const topLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500); // Top-left-ish?
topLight.castShadow = true;
scene.add(topLight);

const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(
  0x333333,
  objToRender === "dino" ? 5 : 1
);
scene.add(ambientLight);

// Render the scene
function animate(): void {
  requestAnimationFrame(animate);

  // Optional: Add any object animations here
  if (object) {
    object.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

// Add listener so we can resize if needed
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the 3D rendering
animate();

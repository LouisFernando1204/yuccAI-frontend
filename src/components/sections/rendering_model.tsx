import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeDScene: React.FC = () => {
  useEffect(() => {
    // 1. Create a Three.js scene
    const scene = new THREE.Scene();

    // 2. Create a new camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // 3. Create a renderer and set its size
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Attach renderer to the DOM
    const container = document.getElementById("container3D");
    if (container && !container.hasChildNodes()) {
      container.appendChild(renderer.domElement);
    }

    // 4. Set camera position and orientation
    camera.position.set(0, 1, 5); // Adjust as necessary
    camera.lookAt(0, 0, 0); // Point camera towards the center of the scene

    // 5. Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 6. Load the model
    const loader = new GLTFLoader();
    let object: THREE.Object3D | undefined;

    loader.load(
      "models/pudding/Anime_charcter.glb",
      (gltf) => {
        object = gltf.scene;
        object.scale.set(0.5, 0.5, 0.5); // Scale model if necessary
        object.position.set(0, 0, 0); // Center model in the scene
        scene.add(object);
      },
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    // 7. Add orbit controls for user interaction
    const controls = new OrbitControls(camera, renderer.domElement);

    // 8. Animation loop
    function animate() {
      requestAnimationFrame(animate);
      if (object) {
        object.rotation.y += 0.01; // Optional: Add rotation or other animations
      }
      controls.update();
      renderer.render(scene, camera);
    }

    // 9. Resize handler
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 10. Start animation
    animate();
  }, []);

  return <div id="container3D" style={{ width: "100vw", height: "0vh", marginBottom: "55vh" }}></div>;
};

export default ThreeDScene;

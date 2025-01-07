import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeDScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a Three.js scene
    const scene = new THREE.Scene();

    // Create a new camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 1, 7);
    camera.lookAt(0, 0, 3);

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300); // Initial size; will be updated

    // Attach renderer to the DOM
    containerRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load the model
    const loader = new GLTFLoader();
    let object: THREE.Object3D | undefined;

    loader.load(
      "models/pudding/Yucca.glb",
      (gltf) => {
        object = gltf.scene;
        object.scale.set(0.7, 0.7, 0.7);
        object.position.set(0, -3.6, 0);
        scene.add(object);
      },
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enablePan = false;
    controls.enableZoom = false;

    // Function to handle resizing
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
      }
    };

    // Initial resize
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (object) {
        object.rotation.y += 0.01;
      }
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "180px",
        height: "49vh",
        margin: "0 auto",
        // border: "1px solid #ccc",
      }}
    />
  );
};

export default ThreeDScene;

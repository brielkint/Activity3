// Importing Three.js and OrbitControls
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);  // Dark background for cosmic effect
//comment
// Initial window size and camera setup
let sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 7;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Particle system setup
const particleCount = 15000;  // Increased particles for a denser effect
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

// Create particles with random positions and cosmic colors (with glowing effect)
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 15;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

  // Add a radiant, glowing color effect (from deep purple to bright blue)
  colors[i * 3] = Math.random() * 0.3 + 0.2;  // Red
  colors[i * 3 + 1] = Math.random() * 0.3 + 0.2;  // Green
  colors[i * 3 + 2] = Math.random() * 0.3 + 0.2;  // Blue
}

// Add the positions and colors attributes to the geometry
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Particle material with glowing effect (ShaderMaterial for custom glow)
const material = new THREE.PointsMaterial({
  size: 0.1,  // Particle size
  vertexColors: true,  // Enable vertex colors
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending  // Additive blending for a glowing effect
});

// Create the particle system (Points)
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Godly light source: Dynamic light to emulate divine energy
const godLight = new THREE.PointLight(0xFFAA00, 2, 20);  // Orange glowing light
godLight.position.set(0, 0, 0);  // Central position
scene.add(godLight);

// Ambient Light (soft glow)
const ambientLight = new THREE.AmbientLight(0x444444, 0.5);
scene.add(ambientLight);

// Dynamic light effects (flickering light)
function updateGodlyLight() {
  const time = Date.now() * 0.001;
  godLight.intensity = Math.sin(time * 0.5) * 1.5 + 1.5;  // Flicker intensity
  godLight.position.x = Math.sin(time * 0.3) * 5;
  godLight.position.y = Math.cos(time * 0.4) * 5;
  godLight.position.z = Math.cos(time * 0.5) * 5;
}

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// Window resizing functionality
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen functionality
window.addEventListener('dblclick', () => {
  const canvas = renderer.domElement;
  if (!document.fullscreenElement) {
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    else if (canvas.mozRequestFullScreen) canvas.mozRequestFullScreen();
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
});

// Animation loop to rotate particles, animate them and update the divine light
function animate() {
  // Animate particles for cosmic energy
  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] = Math.sin(positions[i] + Date.now() * 0.001) * 2 + Math.cos(positions[i + 2] + Date.now() * 0.001) * 2;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  // Rotate the particles system and apply movement to the godly light
  particles.rotation.x += 0.002;
  particles.rotation.y += 0.002;
  
  updateGodlyLight();

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

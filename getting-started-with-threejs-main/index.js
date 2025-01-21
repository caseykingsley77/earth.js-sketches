import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
import {getFresnelMat} from "./src/getFresnelMat.js";

// Renderer setup
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 10, 25);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//Star Setup
const stars = getStarfield({numStars: 1000});
scene.add(stars);

// Sun setup
const textureLoader = new THREE.TextureLoader();
const sunMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load("https://s3.tebi.io/planets/textures/sunmap.jpg"),
});
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Solar system group
const solarSystem = new THREE.Group();
scene.add(solarSystem);

// Planet data
const planetsData = [
  {
    name: "Mercury",
    radius: 0.38,
    distance: 5,
    texture: "https://s3.tebi.io/planets/textures/mercurymap.jpg",
    moons: [],
    orbitSpeed: 0.001,
  },
  {
    name: "Venus",
    radius: 0.95,
    distance: 8,
    texture: "https://s3.tebi.io/planets/textures/venusmap.jpg",
    moons: [],
    orbitSpeed: 0.001,
  },
  {
    name: "Earth",
    radius: 1,
    distance: 11,
    texture: "https://s3.tebi.io/planets/textures/00_earthmap1k.jpg",
    moons: [
      {
        name: "Moon",
        radius: 0.27,
        distance: 2,
        texture: "https://upload.wikimedia.org/wikipedia/commons/d/db/Moonmap_from_clementine_data.png",
        orbitSpeed: 0.0003,
      },
    ],
    orbitSpeed: 0.00005,
  },
  {
    name: "Mars",
    radius: 0.53,
    distance: 14,
    texture: "https://s3.tebi.io/planets/textures/marsmap1k.jpg",
    moons: [
      { name: "Phobos", radius: 0.02, distance: 0.5, texture: "https://s3.tebi.io/planets/textures/phobosbump.jpg", orbitSpeed: 0.0004 },
      { name: "Deimos", radius: 0.01, distance: 0.8, texture: "https://s3.tebi.io/planets/textures/deimosbump.jpg", orbitSpeed: 0.0003 },
    ],
    orbitSpeed: 0.000006,
  },
  {
    name: "Jupiter",
    radius: 2.5,
    distance: 20,
    texture: "https://s3.tebi.io/planets/textures/jupitermap.jpg",
    moons: [
      { name: "Io", radius: 0.2, distance: 3, texture: "https://s3.tebi.io/planets/textures/io.png", orbitSpeed: 0.0002 },
      { name: "Europa", radius: 0.18, distance: 4, texture: "https://s3.tebi.io/planets/textures/europa.jpg", orbitSpeed: 0.0018 },
      { name: "Ganymede", radius: 0.3, distance: 5, texture: "https://s3.tebi.io/planets/textures/ganymede.png", orbitSpeed: 0.0016 },
      { name: "Callisto", radius: 0.25, distance: 6, texture: "https://s3.tebi.io/planets/textures/callisto.png", orbitSpeed: 0.0015 },
    ],
    orbitSpeed: 0.00005,
  },
  {
    name: "Saturn",
    radius: 2.2,
    distance: 28,
    texture: "https://s3.tebi.io/planets/textures/saturnmap.jpg",
    moons: [
      { name: "Titan", radius: 0.25, distance: 4, texture: "https://s3.tebi.io/planets/textures/titan.png", orbitSpeed: 0.0017 },
      { name: "Enceladus", radius: 0.1, distance: 3, texture: "https://s3.tebi.io/planets/textures/enceladus.png", orbitSpeed: 0.0002 },
    ],
    orbitSpeed: 0.00004,
  },
  {
    name: "Uranus",
    radius: 1.8,
    distance: 35,
    texture: "https://s3.tebi.io/planets/textures/uranusmap.jpg",
    moons: [
      { name: "Miranda", radius: 0.1, distance: 2, texture: "https://s3.tebi.io/planets/textures/miranda.png", orbitSpeed: 0.0002 },
      { name: "Ariel", radius: 0.15, distance: 3, texture: "https://s3.tebi.io/planets/textures/ariel.png", orbitSpeed: 0.00018 },
    ],
    orbitSpeed: 0.00003,
  },
  {
    name: "Neptune",
    radius: 1.7,
    distance: 40,
    texture: "https://s3.tebi.io/planets/textures/neptunemap.jpg",
    moons: [
      { name: "Triton", radius: 0.2, distance: 3, texture: "https://s3.tebi.io/planets/textures/titron.jpg", orbitSpeed: 0.0002 },
    ],
    orbitSpeed: 0.00002,
  },
];

const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);

sunLight.position.set(-2,0.5, 1.5)

scene.add(sunLight);

// Create planets and moons
planetsData.forEach((planetData) => {
  const planetGroup = new THREE.Group();
  const planetGeometry = new THREE.SphereGeometry(planetData.radius, 32, 32);
  const planetMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(planetData.texture),
  });
  const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
  planetGroup.add(planetMesh);

  // Position planet
  planetGroup.position.x = planetData.distance;

  // Create moons
  planetData.moons.forEach((moonData) => {
    const moonGroup = new THREE.Group();
    const moonGeometry = new THREE.SphereGeometry(moonData.radius, 16, 16);
    const moonMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load(moonData.texture),
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

    // Position moon
    moonMesh.position.x = moonData.distance;
    moonGroup.add(moonMesh);
    moonGroup.userData = {
      orbitRadius: moonData.distance,
      orbitSpeed: moonData.orbitSpeed,
    };

    planetGroup.add(moonGroup);
  });

  planetGroup.userData = {
    orbitRadius: planetData.distance,
    orbitSpeed: planetData.orbitSpeed,
  };

  solarSystem.add(planetGroup);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  stars.rotation.y -= 0.0002;

  // Rotate planets around the Sun
  solarSystem.children.forEach((planetGroup) => {
    const { orbitRadius, orbitSpeed } = planetGroup.userData || {};
    if (orbitRadius) {
      const time = Date.now() * orbitSpeed;
      planetGroup.position.x = Math.cos(time) * orbitRadius;
      planetGroup.position.z = Math.sin(time) * orbitRadius;

      // Rotate moons around their planet
      planetGroup.children.forEach((moonGroup) => {
        const { orbitRadius: moonRadius, orbitSpeed: moonSpeed } = moonGroup.userData || {};
        if (moonRadius) {
          const moonTime = Date.now() * moonSpeed;
          moonGroup.position.x = Math.cos(moonTime) * moonRadius;
          moonGroup.position.z = Math.sin(moonTime) * moonRadius;
        }
      });
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

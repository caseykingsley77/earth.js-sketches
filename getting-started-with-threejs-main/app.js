import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
import {getFresnelMat} from "./src/getFresnelMat.js";



const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w,h);
document.body.appendChild(renderer.domElement);



const fov = 100;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;
const scene = new THREE.Scene();
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
const textureLoader = new THREE.TextureLoader;



const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
const controls = new OrbitControls(camera, renderer.domElement);
const detail = 12;
const loader = new THREE.TextureLoader();
controls.enableDamping = true;
controls.dampingFactor = 0.03;
scene.add(earthGroup);
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
map: loader.load("./textures/00_earthmap1k.jpg"),
specularMap: loader.load("./textures/02_earthspec1k.jpg"),
bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
bumpScale: 0.04,

});

// material.map.colorSpace = THREE.SRGBColorSpace;
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);



const lightsMat = new THREE.MeshBasicMaterial({
map: loader.load("./textures/03_earthlights1k.jpg"),
blending: THREE.AdditiveBlending,
});

const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);



const cloudsMat = new THREE.MeshStandardMaterial({
map: loader.load("./textures/04_earthcloudmap.jpg"),
transparent: true,
opacity: 0.8,
blending: THREE.AdditiveBlending,
alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
// alphaTest: 0.3,
});

const cloudMesh = new THREE.Mesh(geometry, cloudsMat);
cloudMesh.scale.setScalar(1.003);
earthGroup.add(cloudMesh);





// Create Moon
const moonGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({
map: textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/d/db/Moonmap_from_clementine_data.png'), // Moon texture

bumpScale: 0.06
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);



const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);



const stars = getStarfield({numStars: 2000});
scene.add(stars);



const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2,0.5, 1.5)
scene.add(sunLight);



// Animation variables
let moonOrbitRadius = 4;
let moonOrbitSpeed = 0.005;
let moonRotationSpeed = 0.02;
let earthRotationSpeed = 0.005;
let time = 0;



function animate() {
requestAnimationFrame(animate);

earthMesh.rotation.y += 0.002;

// Calculate Moon's position in orbit
time += moonOrbitSpeed;
moon.position.x = Math.cos(time) * moonOrbitRadius;
moon.position.z = Math.sin(time) * moonOrbitRadius;

// Rotate Moon on its axis
moon.rotation.y += moonRotationSpeed;
lightsMesh.rotation.y += 0.002;
cloudMesh.rotation.y += 0.0023;
glowMesh.rotation.y += 0.002;
stars.rotation.y -= 0.0002;


renderer.render(scene, camera);


}


animate();



function handleWindowResize () {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);

}
window.addEventListener('resize', handleWindowResize, false);
import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js"; 

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w,h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const scene = new THREE.Scene();

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
const controls = new OrbitControls(camera, renderer.domElement);
const loader = new THREE.TextureLoader();
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const geometry = new THREE.IcosahedronGeometry(1, 16);
const material = new THREE.MeshStandardMaterial ({
    map: loader.load("./textures/earthmap1k.jpg"),
});
const earthMesh = new THREE.Mesh(geometry, material);
scene.add(earthMesh);
const stars = getStarfield({numStars: 5000});
scene.add(stars);


const hemLight = new THREE.HemisphereLight(0xffffff)
scene.add(hemLight);

function animate(t = 0) {
    requestAnimationFrame(animate);
    // mesh.scale.setScalar(Math.cos(t * 0.001) + 1.0);
    earthMesh.rotation.y = t * 0.0002;
    
    renderer.render(scene, camera);
    controls.update();
}

animate();
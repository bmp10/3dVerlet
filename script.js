import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera)

const geometry = new THREE.SphereGeometry(10, 32, 32);
const material = new THREE.MeshStandardMaterial({color: 0xff6347});
const sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);


const pointlight = new THREE.PointLight(0xffffff);
pointlight.position.set(5, 5, 5);
const ambientlight = new THREE.AmbientLight(0xffffff);
scene.add(pointlight, ambientlight);
const lighthelper = new THREE.PointLightHelper(pointlight);
scene.add(lighthelper);


let deg = 0;

function rad(degrees) {
    return degrees * (Math.PI / 180);
}

function animate() {
    requestAnimationFrame(animate);

    pointlight.position.set(Math.cos(rad(deg)) * 20, 0, Math.sin(rad(deg)) * 20);

    deg ++;

    renderer.render(scene, camera);
}

animate()
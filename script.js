import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

const bg = document.getElementById("bg")

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: bg,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(1000, 1000);
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
const gridhelper = new THREE.GridHelper(200, 50);
scene.add(lighthelper, gridhelper);



let deg = 0;

function rad(degrees) {
    return degrees * (Math.PI / 180);
}

const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
    requestAnimationFrame(animate);

    //sphere.position.y -= 1

    pointlight.position.set(Math.sin(rad(deg)) * 20, 0, Math.cos(rad(deg)) * 20);

    deg ++;

    renderer.render(scene, camera);
}

animate()

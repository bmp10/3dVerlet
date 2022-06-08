import * as render from './render.js';
import * as THREE from 'https://unpkg.com/three/build/three.module.js';


const gravity = -1000;

const worldpos = [0, 0, 0];
const worldradius = 400;

class Sphere {
    constructor(x, y, z, radius) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.oldx = x + Math.random() - 0.5;
        this.oldy = y + Math.random() - 0.5;
        this.oldz = z + Math.random() - 0.5;
        this.accx = 0;
        this.accy = 0;
        this.accz = 0;
    }

    updatepos(dt) {
        const velx = this.x - this.oldx;
        const vely = this.y - this.oldy;
        const velz = this.z - this.oldz;

        this.oldx = this.x;
        this.oldy = this.y;
        this.oldz = this.z;

        this.x = this.x + velx + this.accx * dt * dt;
        this.y = this.y + vely + this.accy * dt * dt;
        this.z = this.z + velz + this.accz * dt * dt;

        this.accx = 0;
        this.accy = 0;
        this.accz = 0;
    }

    accelerate(accx, accy, accz) {
        this.accx += accx;
        this.accy += accy;
        this.accz += accz;
    }
}

let spheres = [];//[new Sphere(500, 500, 30)];

function applygravity(sphere, index, array) {
    sphere.accelerate(0, gravity, 0);
}
function updatepositions(sphere, index, array) {
    sphere.updatepos((now - start) / 1000 / substeps);
}
function applyconstraint(sphere, index, array) {
    const diffx = sphere.x - worldpos[0];
    const diffy = sphere.y - worldpos[1];
    const diffz = sphere.z - worldpos[0];

    const dist2 = diffx ** 2 + diffy ** 2 + diffz ** 2;

    const radiusdiff = worldradius - sphere.radius;
    if (dist2 > radiusdiff ** 2) {
        const dist = dist2 ** 0.5;
        const unitx = diffx / dist;
        const unity = diffy / dist;
        const unitz = diffz / dist;
        sphere.x = worldpos[0] + unitx * (worldradius - sphere.radius);
        sphere.y = worldpos[1] + unity * (worldradius - sphere.radius);
        sphere.z = worldpos[2] + unitz * (worldradius - sphere.radius);
    }
}

function solvecollisions() {
    for (let i = 0; i < spheres.length; i++) {
        const sphere1 = spheres[i];
        for (let j = i + 1; j < spheres.length; j++) {
            const sphere2 = spheres[j];
            const axisx = sphere1.x - sphere2.x;
            const axisy = sphere1.y - sphere2.y;
            const axisz = sphere1.z - sphere2.z;
            const dist2 = axisx ** 2 + axisy ** 2 + axisz ** 2;

            const mindist = sphere1.radius + sphere2.radius;

            if (dist2 > 0) {
                if (dist2 < mindist ** 2) {
                    const dist = dist2 ** 0.5;
                    const unitx = axisx / dist;
                    const unity = axisy / dist;
                    const unitz = axisz / dist;
    
                    const delta = mindist - dist;
    
                    sphere1.x += (sphere1.radius / 100) * delta * unitx;
                    sphere1.y += (sphere1.radius / 100) * delta * unity;
                    sphere1.z += (sphere1.radius / 100) * delta * unitz;
    
                    sphere2.x -= (sphere2.radius / 100) * delta * unitx;
                    sphere2.y -= (sphere2.radius / 100) * delta * unity;
                    sphere2.z -= (sphere2.radius / 100) * delta * unitz;
                }
            }
        }
    }
}

var start = Date.now();
var now;

var count = 0;
const interval = 1;
const max = 100;
var substeps = 8;

function substep() {
    for (let i = 0; i < substeps; i++) {
        spheres.forEach(applygravity);
        spheres.forEach(updatepositions);
        spheres.forEach(applyconstraint);
        solvecollisions();
    }
}

let spheremeshes = [];

function newsphere(x, y, z, radius) {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), new THREE.MeshStandardMaterial({color: 0xff6347}));
    sphere.position.set(x, y, z);

    render.scene.add(sphere);
    spheremeshes.push(sphere);
}

function update() {
    if (count < interval * max && count % interval == 0) {
        //spheres.push(new Sphere(200, 500, 10));
        spheres.push(new Sphere(800, 500, 800, 10));
        newsphere(800, 500, 800, 10);
    }
    count ++;

    now = Date.now();

    substep();
    
    for (let i = 0; i < spheres.length; i++) {
        spheremeshes[i].position.set(spheres[i].x, spheres[i].y, spheres[i].z);
    }

    start = now;
}

setInterval(update, 10);

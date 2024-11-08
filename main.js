// Import necessary libraries for 3D rendering (e.g., Three.js, OrbitControls, and GLTFLoader)
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Create the floor
const floorGeometry = new THREE.BoxGeometry(100, -1, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x123123 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0, 0, 0);
scene.add(floor);

// Load the court texture and create a court plane
const textureLoader = new THREE.TextureLoader();
textureLoader.load('nbatopview.jpg', (texture) => {
    const planeGeometry = new THREE.PlaneGeometry(19.2, 10.8);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const court = new THREE.Mesh(planeGeometry, planeMaterial);
    court.rotation.x = -Math.PI / 2;
    scene.add(court);
});
// Load wall texture and create walls around the court
textureLoader.load('gsw.jpg', (wallTexture) => {
    // Set texture to repeat and stretch
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(1, 1); // Adjust as necessary to stretch texture fully

    const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture, side: THREE.BackSide }); // Ensure texture faces inward

    // Create and position walls around the court
    const wallGeometry = new THREE.PlaneGeometry(26, 5); // Adjust width for stretching

    // Back wall
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 2.5, -10); // Adjust the height and position
    backWall.rotation.y = Math.PI; // Rotate to face inward
    scene.add(backWall);

    // Front wall
    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.position.set(0, 2.5, 10); // Adjust the height and position
    frontWall.rotation.y = 0; // Face inward without rotation
    scene.add(frontWall);

    // Left wall
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.set(-13, 2.5, 0); // Adjust the height and position
    leftWall.rotation.y = Math.PI / -2; // Rotate inward
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.position.set(13, 2.5, 0); // Adjust the height and position
    rightWall.rotation.y = -Math.PI / -2; // Rotate inward
    scene.add(rightWall);
});


// Load hoop model and add it to the scene at specified positions
const loader = new GLTFLoader();

function loadHoopModel(positionX, mirror) {
    loader.load('hoopring.glb', (gltf) => {
        const hoop = gltf.scene;
        hoop.position.set(positionX, 0, 0);
        hoop.rotation.y = mirror ? Math.PI / 2 : -Math.PI / 2;
        hoop.scale.set(0.2, 0.2, 0.2);
        scene.add(hoop);
    });
}
function loadbola(positionX, mirror) {
    loader.load('bola.glb', (gltf) => {
        const bola = gltf.scene;
        bola.position.set(0, 0.1, 0);
        bola.scale.set(0.1, 0.1, 0.1);
        scene.add(bola);
    });
}
// Place hoops on both ends of the court
loadbola(0)
loadHoopModel(-8.5, false); // Left hoop
loadHoopModel(8.5, true);   // Right hoop

// Seating creation function
function createSeatingRow(yPos, zPos, color) {
    const geometry = new THREE.BoxGeometry(19.2, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color });
    const row = new THREE.Mesh(geometry, material);
    row.position.set(0, yPos, zPos);
    scene.add(row);
}

// Add seating on both sides of the court
createSeatingRow(0.3, -6.3, 0xFFD700);
createSeatingRow(0.7, -6.8, 0x0000AA);
createSeatingRow(1.2, -7.3, 0xFFD700);
createSeatingRow(1.7, -7.8, 0x0000AA);
createSeatingRow(2.2, -8.3, 0xFFD700);

createSeatingRow(0.3, 6.3, 0xFFD700);
createSeatingRow(0.7, 6.8, 0x0000AA);
createSeatingRow(1.2, 7.3, 0xFFD700);
createSeatingRow(1.7, 7.8, 0x0000AA);
createSeatingRow(2.2, 8.3, 0xFFD700);

// Back seating area
function createBackSeatingColumn(xPos, yPos, color) {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 10.8);
    const material = new THREE.MeshBasicMaterial({ color });
    const column = new THREE.Mesh(geometry, material);
    column.position.set(xPos, yPos, 0);
    scene.add(column);
}
// Back seating columns on both sides
createBackSeatingColumn(10.5, 0.3, 0xFFD700);
createBackSeatingColumn(11, 0.8, 0x0000AA);
createBackSeatingColumn(11.5, 1.3, 0xFFD700);
createBackSeatingColumn(12, 1.8, 0x0000AA);
createBackSeatingColumn(12.5, 2.3, 0xFFD700);

createBackSeatingColumn(-10.5, 0.3, 0xFFD700);
createBackSeatingColumn(-11, 0.8, 0x0000AA);
createBackSeatingColumn(-11.5, 1.3, 0xFFD700);
createBackSeatingColumn(-12, 1.8, 0x0000AA);
createBackSeatingColumn(-12.5, 2.3, 0xFFD700);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);


loader.load('light.glb', (gltf) =>{
    const lig = gltf.scene;
    lig.position.set(4,7,-2);
    lig.scale.set(0.1,0.1,0.1);
    scene.add(lig)
});
loader.load('light.glb', (gltf) =>{
    const lig1 = gltf.scene;
    lig1.position.set(4,7,2);
    lig1.scale.set(0.1,0.1,0.1);
    scene.add(lig1)
});
loader.load('light.glb', (gltf) =>{
    const lig2 = gltf.scene;
    lig2.position.set(-4,7,-2);
    lig2.scale.set(0.1,0.1,0.1);
    scene.add(lig2)
});
loader.load('light.glb', (gltf) =>{
    const lig3 = gltf.scene;
    lig3.position.set(-4,7,2);
    lig3.scale.set(0.1,0.1,0.1);
    scene.add(lig3)
});


camera.position.set(0, 20, 20);
camera.lookAt(0, 0, 0);


function createShotClock(xPosition, zPosition, rotationY) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext('2d');

    context.fillStyle = '#ff0000';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('24', canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const shotClockMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const shotClockGeometry = new THREE.BoxGeometry(0.5, 0.25, 0.1);
    const shotClock = new THREE.Mesh(shotClockGeometry, shotClockMaterial);

    shotClock.position.set(xPosition, 1.5, zPosition);
    shotClock.rotation.y = rotationY;

    scene.add(shotClock);
}
// Load the table model
function loadTableModel(xPos, zPos, rotationY) { 
    loader.load('table.glb', (gltf) => {
        const table = gltf.scene;
        table.position.set(xPos, 0.5, zPos);
        table.scale.set(0.8, 0.8, 0.8); 

        table.rotation.y = rotationY; 

        scene.add(table);
    });
}


loadTableModel(0, -5, Math.PI / 2); 
loadTableModel(0, 5, -Math.PI / 2); 

loadTableModel(-5, 0); 
loadTableModel(5, 0);  



createShotClock(-7.5, 0, -Math.PI / 2);
createShotClock(7.5, 0, Math.PI / 2);




function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}


function createSpotlight(positionX, positionZ, targetX, targetZ) {
    const spotlight = new THREE.SpotLight(0xffffff, 1, 10, Math.PI / 4, 0.5, 2);
    spotlight.position.set(positionX, 7, positionZ); 
    spotlight.target.position.set(targetX, 7, targetZ); 

    
    spotlight.angle = Math.PI / 4; 
    spotlight.penumbra = 0.5; 
    spotlight.distance = 10; 

    
    scene.add(spotlight);
    scene.add(spotlight.target);
}


createSpotlight(4, -2, 4, 0);   
createSpotlight(4, 2, 4, 0);    
createSpotlight(-4, -2, -4, 0); 
createSpotlight(-4, 2, -4, 0);  


function loadLightModel(fileName, positionX, positionZ) {
    loader.load(fileName, (gltf) => {
        const light = gltf.scene;
        light.position.set(positionX, 7, positionZ);
        light.scale.set(0.1, 0.1, 0.1);

        
        light.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF, 
                    emissive: 0xFFFFFF, 
                    roughness: 0.5,   
                    metalness: 0.5,    
                });
            }
        });

        scene.add(light);
    });
}


loadLightModel('light.glb', 4, -2);  
loadLightModel('light.glb', 4, 2);   
loadLightModel('light.glb', -4, -2); 
loadLightModel('light.glb', -4, 2);  

animate();
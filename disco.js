import * as THREE from "https://unpkg.com/three@0.179.1/build/three.module.js";

const container = document.getElementById("disco");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.z = 3;



const renderer = new THREE.WebGLRenderer({
    alpha:true,
    antialias:true
});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

container.appendChild(renderer.domElement);



// свет

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        0.5
    )
);


const light1 = new THREE.PointLight(
    0xff00ff,
    20
);

light1.position.set(2,2,3);


const light2 = new THREE.PointLight(
    0x00ffff,
    20
);

light2.position.set(-2,-2,3);


scene.add(light1,light2);



// шар

const ball = new THREE.Group();

const material = new THREE.MeshPhysicalMaterial({

    color:0xffffff,

    metalness:1,

    roughness:0.15

});



const radius = 0.35;

const tiles = 14;



for(let y=0;y<tiles;y++){

    const phi =
        Math.PI * y / tiles;


    const count =
        Math.max(
            5,
            Math.floor(
                Math.sin(phi)*35
            )
        );


    for(let x=0;x<count;x++){

        const theta =
            Math.PI*2*x/count;


        const mesh =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.07,
                    0.07,
                    0.015
                ),
                material
            );


        mesh.position.set(

            radius*
            Math.sin(phi)*
            Math.cos(theta),

            radius*
            Math.cos(phi),

            radius*
            Math.sin(phi)*
            Math.sin(theta)

        );


        mesh.lookAt(0,0,0);


        ball.add(mesh);

    }

}


scene.add(ball);



// анимация

let t = 0;

function animate(){

    requestAnimationFrame(animate);


    t += 0.01;


    ball.rotation.y += 0.005;


    light1.position.x =
        Math.sin(t)*3;


    light2.position.x =
        Math.cos(t)*3;



    renderer.render(
        scene,
        camera
    );

}


animate();



// resize

window.addEventListener(
"resize",
()=>{

camera.aspect =
container.clientWidth /
container.clientHeight;

camera.updateProjectionMatrix();


renderer.setSize(
container.clientWidth,
container.clientHeight
);

});
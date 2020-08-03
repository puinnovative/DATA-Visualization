var canvas = document.getElementById("renderCanvas"); 
var engine = new BABYLON.Engine(canvas, true); 

var createScene = function () {

    var scene = new BABYLON.Scene(engine);

    //var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
    //camera.setTarget(BABYLON.Vector3.Zero());

    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);


    // Add lights to the scene
    camera.attachControl(canvas, true);
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light1.intensity = 0.3;

    
    // Add and manipulate meshes in the scene
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);
    sphere.position = new BABYLON.Vector3(0, 5, 0);

    var myBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: 2, width: 2, depth: 1}, scene);
    myBox.rotation = new BABYLON.Vector3(1, 0, 0);
    myBox.position = new BABYLON.Vector3(-2, -1, 3);

    var sourcePlane = new BABYLON.Plane(1, -1, 1, 0);
    sourcePlane.normalize();

    var myGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 6, height: 4, subdivisions: 2}, scene);
    myGround.position = new BABYLON.Vector3(0, -2, 0);

    var myPoints = [
        new BABYLON.Vector3(3, 0, 0),
        new BABYLON.Vector3(3, 2, 0),
        new BABYLON.Vector3(-2, 2, 0)
    ];
    var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene);

    // var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    // myMaterial.diffuseColor = new BABYLON.Color3(10, 0, 1);
    // myMaterial.alpha = 0.6;

    var boxMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    boxMaterial.diffuseTexture = new BABYLON.Texture("/textures/future.jpg", scene);
    var sphereMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    sphereMaterial.diffuseTexture = new BABYLON.Texture("/textures/girl.jpg", scene);
    //sphereMaterial.alpha = 0.1;
    //boxMaterial.backFaceCulling = true;
    sphereMaterial.wireframe = true;
    myBox.material = boxMaterial;
    sphere.material = sphereMaterial;

    var animationBox = new BABYLON.Animation("tutoAnimation", "scaling.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = [];
    keys.push({
        frame: 0,
        value: 1
    });
    keys.push({
        frame: 20,
        value: 0.5
    });
    keys.push({
        frame: 100,
        value: 1
    });
    animationBox.setKeys(keys);
    myBox.animations.push(animationBox);
    scene.beginAnimation(myBox, 0, 100, true);


    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);
    particleSystem.emitter = sphere;
    // particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); 
    // particleSystem.maxEmitBox = new BABYLON.Vector3(-3, 0, 0); 

    particleSystem.color1 = new BABYLON.Color4(7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

    particleSystem.minSize = 0.01;
    particleSystem.maxSize = 0.1;

    particleSystem.minLifeTime = 0.1;
    particleSystem.maxLifeTime = 1;
    particleSystem.emitRate = 3350;

    //particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
    particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 4;
    particleSystem.updateSpeed = 0.005;

    particleSystem.start();

    var earthGroundMaterial = new BABYLON.StandardMaterial("ground", scene);
    earthGroundMaterial.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", scene);
    var earthGround = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/worldHeightMap.jpg", 200, 200, 250, 0, 10, scene, false);
    earthGround.material = earthGroundMaterial;


	// light1
	var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
	light.position = new BABYLON.Vector3(20, 40, 20);
	light.intensity = 0.5;

	var lightSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
	lightSphere.position = light.position;
	lightSphere.material = new BABYLON.StandardMaterial("light", scene);
	lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

	// light2
	var light2 = new BABYLON.SpotLight("spot02", new BABYLON.Vector3(30, 40, 20),new BABYLON.Vector3(-1, -2, -1), 1.1, 16, scene);
	light2.intensity = 0.5;
	var lightSphere2 = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
	lightSphere2.position = light2.position;
	lightSphere2.material = new BABYLON.StandardMaterial("light", scene);
	lightSphere2.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

	// Ground
	var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 100, 100, 100, 0, 10, scene, false);
	var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
	groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
	groundMaterial.diffuseTexture.uScale = 6;
	groundMaterial.diffuseTexture.vScale = 6;
	groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	ground.position.y = 0;
	ground.material = groundMaterial;

	// Torus
	var torus = BABYLON.Mesh.CreateTorus("torus", 4, 2, 30, scene, false);

	// Box
    var box = BABYLON.Mesh.CreateBox("box", 3);
    box.parent = torus;	

	// Shadows
	var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
	shadowGenerator.addShadowCaster(torus);
	shadowGenerator.useExponentialShadowMap = true;

	var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light2);
	shadowGenerator2.addShadowCaster(torus);
	shadowGenerator2.usePoissonSampling = true;

    ground.receiveShadows = true;
    earthGround.receiveShadows = true;
	// Animations
	var alpha = 0;
	scene.registerBeforeRender(function () {
		torus.rotation.x += 0.01;
		torus.rotation.z += 0.02;

		torus.position = new BABYLON.Vector3(Math.cos(alpha) * 30, 10, Math.sin(alpha) * 30);
		alpha += 0.01;

	});

    return scene;
};

var scene = createScene(); //Call the createScene function

engine.runRenderLoop(function () {
        scene.render();
});

window.addEventListener("resize", function () {
        engine.resize();
});
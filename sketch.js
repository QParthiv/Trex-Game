var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, cloudsGroup, cloudsImage,ostaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,count,PLAY,END,gameState,gameOver,gameOvarImage,restart,restartImage,checkSound,dieSound,jumpSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png")
  cloudsImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  checkSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(100,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300,100,20,20);
  gameOver.scale = 0.4;
  restart = createSprite(300,140,20,20);
  restart.scale = 0.4;
  gameOver.addImage(gameOverImage);
  restart.addImage(restartImage);
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  count = 0;
  
  PLAY = 1;
  END = 0;
  gameState = PLAY;
  
  trex.addAnimation("trexc",trex_collided);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,320,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudsImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch (rand){
      case 1 : obstacle.addImage(obstacle1);
        break;
      case 2 : obstacle.addImage(obstacle2);
        break;
      case 3 : obstacle.addImage(obstacle3);
        break;
      case 4 : obstacle.addImage(obstacle4);
        break;
      case 5 : obstacle.addImage(obstacle5);
        break;
      case 6 : obstacle.addImage(obstacle6);
        break;
      default: console.log(trex.x);
        break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    obstaclesGroup.add(obstacle);
  }
}

function draw() {
  background(150);
  
  text("Score: "+ count, 250, 100);
  
  if (gameState === PLAY){
    spawnClouds();
    spawnObstacles();
    
    ground.x = ground.width /2;
    ground.velocityX = -4;
    
    gameOver.visible = false;
    restart.visible = false;
  
    count = count + Math.round(getFrameRate()/60);

  
    if(keyDown("space") && trex.y > 125) {
      trex.velocityY = -12;
      jumpSound.play();
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if (count % 100 === 0){
      checkSound.play();
    }
      
   if (trex.isTouching(obstaclesGroup)){
    gameState = END;
    dieSound.play();
   }   
  
} else if (gameState === END){
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("trexc",trex_collided); 
    trex.velocityY = 0;
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  
    gameOver.visible = true;
    restart.visible = true;
  
    if (mousePressedOver(restart)){
      reset();
    }
  }
  
  trex.collide(invisibleGround);
  drawSprites();


  
}

function reset(){
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  gameOver.visible = false;
  restart.visible = false;
  gameState = PLAY;
  count = 0;
  
}


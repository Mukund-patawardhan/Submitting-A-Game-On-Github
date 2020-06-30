var PLAY = 1;
var END = 0;
var gameState = PLAY;

var runner, running, runner_collided;
var ground, invisibleGround, groundImage;

var birdsGroup, birdImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var sky,skyImage;

localStorage["HighestScore"] = 0;

function preload(){
  running =   loadAnimation("kangaroo1.png","kangaroo2.png","kangaroo3.png");
  runner_collided = loadAnimation("kangaroo1.png");

  obstacle1=loadImage("Bush1.png");
  obstacle2=loadImage("Bush2.png");
  obstacle3=loadImage("Bush3.png");
  obstacle4=loadImage("Bush4.png");
  obstacle5=loadImage("Bush5.png");
  obstacle6=loadImage("Bush6.png");

  birdImage=loadImage("Bird.png");

  skyImage=loadImage("Sky.jpg");
}

function setup() {
  createCanvas(1350, 600);

  sky = createSprite(650,200);
  sky.depth=-200;
  sky.scale=2.5;
  
  sky.addImage(skyImage);
  
  runner = createSprite(450,580,20,50);
  runner.setCollider('rectangle',0,0,100,200);
  
  runner.addAnimation("running", running);
  runner.addAnimation("collided", runner_collided);
  runner.scale = 0.5;
  
  ground = createSprite(650,620,20400,200);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 5*score/100);
  ground.shapeColor=30;
  
  restart = createSprite(675,300,200,100);

  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  birdsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //runner.debug = true;
  background(255);
  
  if (gameState===PLAY){
    if(frameCount%5===0){
    score = score + 1;
    }
    ground.velocityX = -(6 + 3*score/100);
    sky.velocityX = -(6 + 3*score/100);

    if(keyDown("space") && runner.y >= 309) {
      runner.velocityY = -15;
      runner.velocityX = 2;
    }else{
      runner.velocityX=0;
    }

    ground.depth=-100;
    runner.depth=100;
    runner.frameDelay=10;
  
    runner.velocityY = runner.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if (sky.x < 0){
      sky.x = 650;
    }
  
    spawnbirds();
    spawnObstacles();

    obstaclesGroup.displace(runner,changeState);
    birdsGroup.displace(runner,changeState);

    runner.collide(ground);
  }
  else if (gameState === END) {
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    sky.velocityX=0;
    sky.x=650;
    runner.velocityY = 0;

    runner.x=530;
   
    //change the runner animation
    runner.changeAnimation("collided",runner_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(1);
    birdsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
     reset();
    }
  }
  
  
  drawSprites();

  textSize(55);
  noStroke();
  fill("grey");
  textFont('Jokerman')
  text("Score : "+ score, 0,70);
  text("Highest Score : "+localStorage["HighestScore"],0,150);

  if(gameState===END){
    fill("red");
    textFont("New York Times");
    textStyle(BOLD);
    text("RESET",585,320);
  }
}

function spawnbirds() {
  //write code here to spawn the birds
  if (frameCount % 50 === 0) {
    var bird = createSprite(1500,120,40,10);
    bird.y = Math.round(random(0,150));
    bird.addImage(birdImage);
    bird.scale = 0.09;
    bird.velocityX = -20;
    
     //assign lifetime to the variable
    bird.lifetime = 600;
    
    //adjust the depth
    bird.depth = runner.depth;
    runner.depth = runner.depth + 1;
    
    //add each bird to the group
    birdsGroup.add(bird);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(1500,500,50,20);
    obstacle.setCollider('rectangle',0,0,150,150);
    obstacle.velocityX = -(6 + 5*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.35;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  birdsGroup.destroyEach();
  
  runner.changeAnimation("running",running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  
  score = 0;
  
}

function changeState(){
  gameState = END;
}
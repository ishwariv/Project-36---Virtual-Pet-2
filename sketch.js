//global variables
var dog,happyDog;
var dogImg,happyDogImg;
var foodS,foodStock,addStock;
var database;
var name,nameButton,nameBox;
var addFood,feed, fedTime, lastFed;
var foodObj;

function preload()
{
  //preloading images
  dogImg=loadImage("images/dogImg.png");
  happyDogImg=loadImage("images/dogImg1.png");
  milkImg=loadImage("images/milk.png");
}

function setup() {
  database = firebase.database();

  createCanvas(500, 500);
  
  //Food Object
  foodObj=new Food();

  //dog sprite
  dog=createSprite(250,320);
  dog.addImage("normal",dogImg);
  dog.scale=0.2;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  database.ref("/").update({
    "Food": 20
  });

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  
  //Additional Challenge
  //Name Button
  nameBox = createInput("Name");
  nameBox.position(375, 75);

  nameButton = createButton("Update");
  nameButton.position(375, 100);
  nameButton.mousePressed(() => {
    name = nameBox.value();
  });

  //Feed Button
  feed=createButton("Feed");
  feed.position(690,75);
  feed.mousePressed(feedDog);

  //Add Food Button
  addFood=createButton("Add Food");
  addFood.position(750,75);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87);
  foodObj.display();

  //Name
  textSize(20);
  fill(255);
  textFont('Georgia');
  textAlign(CENTER,CENTER);
  text(name, 245, 410);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function (data){
    lastFed=data.val();
  });
  //Feeding Time
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed: "+ lastFed%12 + " PM",400,65);
  } else if(lastFed===0){
    text("Last Fed: 12 AM",400,65);
  } else{
    text("Last Fed: " + lastFed + " AM",400,65);
  }
  drawSprites();
}

function feedDog(){
  milk=createSprite(180,370);
  milk.addImage(milkImg);
  milk.scale=0.30;
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })  
}

function addFoods(){
  foodS++;
  //writeStock(foodS);
  database.ref('/').update({
    Food:foodS
  })
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0;
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}
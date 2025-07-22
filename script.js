var money = 100;

var c = document.getElementById("fishtank");
var ctx = c.getContext("2d");
var fish = document.getElementById('fishImg');
var fishLeft = document.getElementById('fishLeft');
var moneyImg = document.getElementById('money');
var fishName = document.getElementById('nameInput');
var ship = document.getElementById('shipImg');
var moneyText = document.getElementById("moneyText");

let mousePos = { x: 0, y: 0 };

var addFishButton = document.getElementById("add-fish");
var addShipButton = document.getElementById("add-ship");

addFishButton.addEventListener("click", addFish);
addShipButton.addEventListener("click", addShip);

var fishes = [];
var moneys = [];
var decorations = [];

var interval = setInterval(draw, 10);

c.addEventListener("mousemove", function(evt) {
    mousePos = getMousePos(c, evt);
});

c.addEventListener('click', mouseClick);

function mouseClick(){
    decorations.forEach(element => {
        if(!element.placed){
            element.placed = true;
        }
    });
}

class Decoration{
    constructor(img, posX, posY){
        this.img = img;
        this.posX = posX;
        this.posY = posY;
        this.placed = false;
    }

    exist(){
        if(!this.placed){
            this.posY = c.height-100;
            this.posX = mousePos.x - 50;
        }
    }
}

class Money{
    constructor(img, posX, posY, worth){
        this.img = img;
        this.posX = posX;
        this.posY = posY;
        this.worth = worth;
    }

    checkCollision() {
        fishes.forEach(element => {
            const fishLeft = element.posX;
            const fishRight = element.posX + element.width;
            const fishTop = element.posY;
            const fishBottom = element.posY + element.height;

            const moneyLeft = this.posX;
            const moneyRight = this.posX + 20; // 20 is coin width
            const moneyTop = this.posY;
            const moneyBottom = this.posY + 20; // 20 is coin height

            const isColliding = (
                fishLeft < moneyRight &&
                fishRight > moneyLeft &&
                fishTop < moneyBottom &&
                fishBottom > moneyTop
            );

            if (isColliding) {
                console.log("collision");
                money += this.worth;
                this.posX = getRandomInt(c.width);
                this.posY = getRandomInt(c.height);
            }
        });
    }

}


class Fish {
    constructor(img, posX, posY, width, height, name){
        this.img = img;
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.state = "IDLE"
        this.name = name;
        
        this.targetPos = [0,0];
        this.reachedTarget = true;

        this.states = ["SWIM", "IDLE", "FEEDING"]
    }

    swim(swimX, swimY){
        this.posX += swimX;
        this.posY += swimY;

        //Check collision with edge
        
        this.posX = (this.posX < this.width) ? this.width : this.posX;
        this.posX = (this.posX > c.width-this.width) ? c.width-this.width : this.posX;

        this.posY = (this.posY < this.height) ? this.height : this.posY;
        this.posY = (this.posY > c.height-this.height) ? c.height-this.height : this.posY;
    }

    doThing(){
        switch(this.state){
            case "IDLE":
                this.idle();
                break;
            case "SWIM":
                this.swim();
                break;
            default:
                this.idle();
                break;

        }
    }

    idle(){
        this.state = this.randomSwitchState("SWIM");
    }

    swim(){
        if(this.posX == this.targetPos[0] && this.posY == this.targetPos[1]){
            this.reachedTarget = true;
        }

        if(this.reachedTarget){
            this.targetPos = [getRandomInt(c.width), getRandomInt(c.height)];

            // Clamp target position to keep the object fully within the canvas
            this.targetPos[0] = Math.max(0, Math.min(this.targetPos[0], c.width - this.width));
            this.targetPos[1] = Math.max(0, Math.min(this.targetPos[1], c.height - this.height));



            this.reachedTarget = false;
        }
        if(this.posX != this.targetPos[0]){
            this.posX = (this.posX < this.targetPos[0]) ? this.posX + 1 : this.posX -1;
        }
        if(this.posY != this.targetPos[1]){
            this.posY = (this.posY < this.targetPos[1]) ? this.posY + 1 : this.posY -1;
        }

        if(this.posX < this.targetPos[0]){
            this.img = fish;
        }
        else{
            this.img = fishLeft;
        }

        this.state = this.randomSwitchState("IDLE");
    }

    randomSwitchState(new_state){
        if(new_state == "SWIM"){
            return (getRandomInt(40) == 0) ? new_state : this.state;
        }
        if(new_state == "IDLE"){
            return (getRandomInt(400) == 0) ? new_state : this.state;
        }
        return (getRandomInt(100) == 0) ? new_state : this.state;
    }
}

function addFish(){
    console.log("add fish :) cost: 100")
    if(money >= 100){
        fishes.push(new Fish(fish, 0, 0, (c.width / 5), (c.height /5), fishName.value));
        money -= 100;
        moneys.push(new Money(moneyImg, 460, 400, 50));
    }
    
}

function addShip(){
    if(money >= 50){
        decorations.push(new Decoration(ship, 0,0));
        money -= 50;
    }
}

function draw(){
    ctx.clearRect(0,0,c.width, c.height);
    
    fishes.forEach(element => {
        element.doThing();
        ctx.drawImage(element.img, element.posX, element.posY, element.width, element.height);
        ctx.fillText(element.name, element.posX+(element.width/2), element.posY);
    });

    moneys.forEach(element => {
        element.checkCollision();
        ctx.drawImage(element.img, element.posX, element.posY, 20, 20);
    })

    decorations.forEach(element => {
        element.exist();
        ctx.drawImage(element.img, element.posX, element.posY, 100,100);
    })

    moneyText.innerHTML = "Money: " + money;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
var money = 100;

var c = document.getElementById("fishtank");
var ctx = c.getContext("2d");
var fish = document.getElementById('fishImg');
var fishLeft = document.getElementById('fishLeft');
var moneyImg = document.getElementById('money')

var moneyText = document.getElementById("moneyText");


var addFishButton = document.getElementById("add-fish");

addFishButton.addEventListener("click", addFish);

var fishes = [];
var moneys = [];

var interval = setInterval(draw, 10);

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
    constructor(img, posX, posY, width, height){
        this.img = img;
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.state = "IDLE"
        
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

            //Width and height check
            this.targetPos[0] = (this.targetPos[0] < this.width) ? this.width : this.targetPos[0];
            this.targetPos[0] = (this.targetPos[0] > c.width - this.width) ? c.width-this.width : this.targetPos[0];

            this.targetPos[1] = (this.targetPos[1] < this.height) ? this.height : this.targetPos[1];
            this.targetPos[1] = (this.targetPos[1] > c.height - this.height) ? c.height-this.height : this.targetPos[1];


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
        fishes.push(new Fish(fish, 0, 0, (c.width / 5), (c.height /5)));
        money -= 100;
        moneys.push(new Money(moneyImg, 460, 400, 50));
    }
    
}

function draw(){
    ctx.clearRect(0,0,c.width, c.height);
    
    fishes.forEach(element => {
        element.doThing();
        ctx.drawImage(element.img, element.posX, element.posY, element.width, element.height);
    });

    moneys.forEach(element => {
        element.checkCollision();
        ctx.drawImage(element.img, element.posX, element.posY, 20, 20)
    })

    moneyText.innerHTML = "Money: " + money;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

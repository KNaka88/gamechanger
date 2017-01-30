/////////////////GLOBAL VARIABLES
var wallArray = []
var player = {
  xPos: 150,
  yPos: 150
};

var ball = {
  xPos: 200,
  yPos: 200
}

///////////////FUNCTIONS
var Room = {
  generate: function() {
    wallArray = [];
    createWalls(3);
  }
}

function Wall(xPos,yPos,width,height) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.width = width;
  this.height = height;
}

function randomNumber(min,max) {
  return Math.floor(Math.random()*(max-min)+min);
};

function randomNumberGrid(min,max) {
  return randomNumber(min,max)*20;
}

function createWalls(numberOfWalls) {
  for (var i = 1; i<=numberOfWalls; i++) {
    var randomWidth = randomNumberGrid(1,10);
    var randomHeight = randomNumberGrid(1,10);
    var randomXPosition = randomNumberGrid(0,30-(randomWidth/20));
    var randomYPosition = randomNumberGrid(0,30-(randomHeight/20));
    wallArray.push(new Wall(randomXPosition, randomYPosition,randomWidth,randomHeight));
  };
};


////////////////DOCUMENT READY
$(function(){
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  //ball variables
  var x = canvas.width/2;
  var y = canvas.height-30;
  var ballRadius = 10;
  var dx = 2;
  var dy = -2;


//player controller
  var leftPressed = false;
  var upPressed = false;
  var rightPressed = false;
  var downPressed = false;
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  //player controller ends




  var userHeight = 30;
  var userWidth = 30;


  function drawPlayer(){
    ctx.beginPath();
    ctx.rect(player.xPos, player.yPos, userHeight, userWidth );
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

  }


  //CONTROLLER Function
  function keyDownHandler(e) {
    if(e.keyCode === 39) {
      rightPressed = true;
    } else if (e.keyCode === 40) {
      downPressed = true;
    } else if(e.keyCode === 37) {
      leftPressed = true;
    } else if(e.keyCode === 38) {
      upPressed = true;
    }
  }

  function keyUpHandler(e) {
    if(e.keyCode === 39) {
      rightPressed = false;
    } else if (e.keyCode === 40) {
      downPressed = false;
    } else if(e.keyCode === 37) {
      leftPressed = false;
    } else if(e.keyCode === 38) {
      upPressed = false;
    }
  }
  //Controller Function Ends


  function drawBall() {
    ctx.beginPath();
    ctx.rect(ball.xPos, ball.yPos, userWidth, userHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };


  function drawWalls() {
    for (var i=0; i< wallArray.length; i++) {
      var currentWall = wallArray[i];
      drawWall(currentWall.xPos, currentWall.yPos, currentWall.width, currentWall.height);
    };
  };

  function drawWall(xPos,yPos,width,height) {
    ctx.beginPath();
    ctx.rect(xPos,yPos,width,height);
    ctx.fillStroke = "black";
    ctx.stroke();
    ctx.closePath();
  };

  // function collisionDetection(player) {
  //   for (var i=0;i<wallArray.length;i++) {
  //     var currentWallX = wallArray[i].xPos;
  //     var currentWallY = wallArray[i].yPos;
  //     var currentWallWidth = wallArray[i].width;
  //     var currentWallHeight = wallArray[i].height;
  //     if ((player.xPos + userWidth > currentWallX && player.xPos < currentWallX+currentWallWidth) && (player.yPos + userHeight > currentWallY && player.yPos < currentWallY+currentWallHeight) || (player.xPos < 0 || player.xPos + userWidth > 600 || player.yPos < 0 || player.yPos + userHeight > 600)) {
  //       console.log('inside wall');
  //       return true;
  //     }
  //   }
  // }

  function xCollisionDetection(player) {
    for (var i=0;i<wallArray.length;i++) {
      var currentWallX = wallArray[i].xPos;
      var currentWallY = wallArray[i].yPos;
      var currentWallWidth = wallArray[i].width;
      var currentWallHeight = wallArray[i].height;
      if ((player.xPos < 0 || player.xPos + userWidth > 600) || (player.xPos + userWidth > currentWallX && player.xPos < currentWallX + currentWallWidth)) {

        if (player.yPos + userHeight > currentWallY && player.yPos < currentWallY + currentWallHeight) {
          console.log("x collision");
          return true;
        } else if (player.xPos < 0 || player.xPos + userWidth > 600) {
          return true;
        }
      }
    }
  }

  function yCollisionDetection(player) {
    for (var i=0;i<wallArray.length;i++) {
      var currentWallX = wallArray[i].xPos;
      var currentWallY = wallArray[i].yPos;
      var currentWallWidth = wallArray[i].width;
      var currentWallHeight = wallArray[i].height;
      if ((player.yPos < 0 || player.yPos + userHeight > 600) || (player.yPos + userHeight > currentWallY && player.yPos < currentWallY + currentWallHeight)) {
        if (player.xPos + userWidth > currentWallX && player.xPos < currentWallX + currentWallWidth) {
          return true;
        } else if (player.yPos < 0 || player.yPos + userHeight > 600) {
          return true;
        }
      }
    }
  }

  function collisionDetection(player) {
    if (yCollisionDetection(player) || xCollisionDetection(player)) {
      return true;
    }
  }

///////////////// Call all programs
  createWalls(3);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBall();
    drawWalls();
    ball.xPos += dx;
    if(xCollisionDetection(ball)) {
      dx = -dx;
    };
    ball.yPos += dy;

    if(yCollisionDetection(ball)) {
        dy = -dy;
    };


    if(rightPressed) {
      player.xPos += 5;
      if (collisionDetection(player)) {
        player.xPos -= 5;
        //Decrement health
      }
    } else if(leftPressed) {
      player.xPos -= 5;
      if (collisionDetection(player)) {
        player.xPos += 5;
      }
    } else if(upPressed) {
      player.yPos -= 5;
      if (collisionDetection(player)) {
        player.yPos += 5;
      }
    } else if(downPressed) {
      player.yPos += 5;
      if (collisionDetection(player)) {
        player.yPos -= 5;
      }
    }
  }

  setInterval(draw, 10);

  $("#generateButton").click(function() {
    Room.generate();
  });

});

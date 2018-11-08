// Get canvas and canvas context
const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");

// Load images

// Flappy bird
const bird = new Image();
bird.src = "assets/images/flappyBird/bird.png";

// Background
const background = new Image();
background.src = "assets/images/flappyBird/bg.png";

// Foreground
const foreground = new Image();
foreground.src = "assets/images/flappyBird/fg.png";

// Pipe from top
const pipeUp = new Image();
pipeUp.src = "assets/images/flappyBird/pipeNorth.png";

// Pipe from bottom
const pipeDown = new Image();
pipeDown.src = "assets/images/flappyBird/pipeSouth.png";

// Load Audio

// Fly sound
const fly = new Audio();
fly.src = "assets/sounds/flappyBird/fly.mp3";

// Score sound
const scoreSound = new Audio();
scoreSound.src = "assets/sounds/flappyBird/score.mp3";

// some variables

// Gap between pipes
const gap = 85;


var constant;

// Staring coordinates for flappy bird
let bX = 10;
let bY = 150;

// "Gravitational" variable pulling flappy bird down
const gravity = 1.5;

// Score variable
let score = 0;

// Flying flappy bird
document.addEventListener("keydown", moveUp);

function moveUp(e){
    if(e.keyCode == '32'){
        bY -= 25;
        fly.play();
    }

}

// Pipe coordinates
const pipe = [];

pipe[0] = {
    x : canvas.width,
    y : 0
};


// Drawing on canvas
function draw(){
    
    // Draw background
    ctx.drawImage(background, 0, 0);
    
    // Rendering pipes
    for(let i = 0; i < pipe.length; i++){      
        constant = pipeUp.height+gap;
        ctx.drawImage(pipeUp,pipe[i].x,pipe[i].y);
        ctx.drawImage(pipeDown,pipe[i].x,pipe[i].y+constant);
             
        pipe[i].x--;
        
        if(pipe[i].x == 125){
            pipe.push({
                x : canvas.width,
                y : Math.floor(Math.random()*pipeUp.height)-pipeUp.height
            }); 
        }

        // Detect collision with pipes      
        if( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeUp.width && (bY <= pipe[i].y + pipeUp.height || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >=  canvas.height - foreground.height){
            location.reload(); // reload the page
        }
        
        if(pipe[i].x == 5){
            score++;
            scoreSound.play();
        }
              
    }

    // Draw foreground
    ctx.drawImage(foreground, 0, canvas.height - foreground.height);
    
    // Draw Flappy Bird
    ctx.drawImage(bird,bX,bY);
    
    bY += gravity;
    
    // Display score
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, canvas.height - 20);
    
    requestAnimationFrame(draw);    
}

draw();


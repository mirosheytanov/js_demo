const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');

// Ball object
const ball = {
    x : canvas.width / 2,
    y : canvas.height / 2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "#fff"
}

// User Paddle
const user = {
    x : 0, // left side of canvas
    y : (canvas.height - 100) / 2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#fff"
}

// Oponent Paddle
const opponent = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100) / 2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#fff"
}

// Net object
const net = {
    x : (canvas.width - 2) / 2,
    y : 0,
    height : 10,
    width : 2,
    color : "#fff"
}

// Construct paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Construct ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

// listening to the mouse
canvas.addEventListener("mousemove", getMousePos);
canvas.addEventListener("keydown", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

// Reset ball position at middle when either player scores a point
function resetBall(){
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text, x, y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// Detect collison
function collision(b, p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update function, the function that does all calculations
function update(){
    
    // change the score of players, if the ball goes to the left "ball.x<0" AI opponent win, else if "ball.x > canvas.width" the user win
    if(ball.x - ball.radius < 0){
        opponent.score++;
        resetBall();
    }else if(ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // AI opponent plays for itself, and we must be able to beat it
    // simple AI
    opponent.y += ((ball.y - (opponent.y + opponent.height/4)))*0.1;
    
    // when the ball collides with bottom and top walls we inverse the y velocity.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }
    
    // we check if the paddle hit the user or the AI opponent paddle
    let player = (ball.x + ball.radius < canvas.width/2) ? user : opponent;
    
    // if the ball hits a paddle
    if(collision(ball, player)){
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        collidePoint = collidePoint / (player.height/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }
}

// render function, the function that does al the drawing
function render(){
    
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // draw the user score to the left
    drawText(user.score,canvas.width/4,canvas.height/5);
    
    // draw the AI opponent score to the right
    drawText(opponent.score,3*canvas.width/4,canvas.height/5);
    
    // draw the net
    drawNet();
    
    // draw the user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // draw the AI opponent's paddle
    drawRect(opponent.x, opponent.y, opponent.width, opponent.height, opponent.color);
    
    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);

    update();
    requestAnimationFrame(render);
}

render();
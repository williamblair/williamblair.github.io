function createBall(){
  var ballObj = {
      radius: 10,
      x: 0,
      y: 0,
      vx: 0.0,
      vy: 0.0,
      ax: 0.0,
      ay: 0.0,
      mass: 5.0,
      elast: -0.5,
      forceX: 0.0,
      forceY: 0.0
  };
  
  ballObj.x = ballObj.radius;
  ballObj.y = ballObj.radius;
  
  return ballObj;
}

function calcPhysics(ball, timestep){
  /* apply physics */
  ball.forceY = ball.mass * ball.ay; // f=ma
  ball.ay = ball.forceY / ball.mass; // a=f/m

  ball.forceX = ball.mass * ball.ax;
  ball.ax = ball.forceX / ball.mass;

  /* apply y acceleration and velocity */
  ball.vy += ball.ay * timestep; // apply gravity	
  ball.y += ball.vy * timestep; // move the ball

  /* apply x acceleration and velocity */
  ball.vx += ball.ax * timestep;
  ball.x += ball.vx * timestep;
}

function startPhysics() {
  var canvas = document.getElementById("mycanvas");
  var ctx = canvas.getContext('2d');

  /* add the width and height for calculations below */
  canvas.width = 500;
  canvas.height = 500;

  /* some physics variables */
  var accelGrav = 9.8; // 9.8m/s^2
  var timeStep = 0.07; // time increment per frame

  /* create a new ball object */
  var ball1 = createBall();
  /* move it to the center of the screen */
  ball1.x = canvas.width / 2 - ball1.radius;

  /* give the ball initial acceleration */
  ball1.ax = 0.0;
  ball1.ay = accelGrav;

  function main() {

      /* apply gravity, force, physics to the ball */
      calcPhysics(ball1, timeStep);

      /* if the ball hits the ground 
       * (vertical hit detection) */
      if (ball1.y > canvas.height - ball1.radius && ball1.vy > 0) {
          /* apply the 'ball1.elastic' force */
          ball1.vy *= ball1.elast;

          /* move the ball away from the wall a little so it doesn't get stuck */
          ball1.y = canvas.height - ball1.radius;
      }

      /* if the ball hits the left or right wall */
      if ((ball1.x > canvas.width - ball1.radius || ball1.x < 0.0 + ball1.radius) && ball1.vx !== 0) {
          ball1.vx *= ball1.elast;

          /* move it away from the left or right wall if necessary */
          if (ball1.x < 0) ball1.x = ball1.radius;
          else if (ball1.x > canvas.width - ball1.radius) ball1.x = canvas.width - ball1.radius;
      }

      /* clear the screen */
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* draw a circle */
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(ball1.x, ball1.y, ball1.radius, 0, 2 * Math.PI);
      ctx.stroke();

      /* run the function again */
      requestAnimationFrame(main);
  }

  /* start the main loop */
  main();
}

startPhysics(); // call the above function

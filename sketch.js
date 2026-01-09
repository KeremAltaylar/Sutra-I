var inc = fxrandRange(10, 20, 0.1);
var scl = fxrandRange(100, 120, 1);
var magv = fxrandRange(0.1, 1, 0.1);
var cols, rows;
var fr;
var zoff = 0;
var particles = [];
var particles2 = [];
var flowfield;
var magv;
var cr = fxrandRange(0, 200, 1);
var cg = fxrandRange(100, 110, 1);
var cb = fxrandRange(200, 250, 1);
var dr = fxrandRange(0, 100, 1);
var dg = fxrandRange(150, 200, 1);
var db = fxrandRange(10, 150, 1);
var indexk = 0;
var sw1 = fxrandRange(0.1, 0.5, 0.1);
var sw2 = fxrandRange(0.1, 0.5, 0.1);

function recalculateFlowfieldGrid() {
  cols = max(1, floor(windowWidth / scl));
  rows = max(1, floor(windowHeight / scl));
  flowfield = new Array(cols * rows);
}

function resetParticles() {
  particles = [];
  particles2 = [];
  for (i = 0; i < 150; i++) {
    particles[i] = new Particle(
      cr,
      cg,
      cb,
      (fxrand() * i) / 10 + windowWidth / 3,
      (fxrand() * i) / 5 + windowHeight / 3,
      sw1
    );
  }
  for (i = 0; i < 100; i++) {
    particles2[i] = new Particle2(
      dr,
      dg,
      db,
      (fxrand() * i) / 10 + windowWidth / 7,
      (fxrand() * i) / 5 + windowHeight / 7,
      sw2
    );
  }
}

function restartSketch() {
  indexk = 0;
  zoff = 0;
  recalculateFlowfieldGrid();
  resetParticles();
  background(255);
  loop();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  fr = createP("");
  recalculateFlowfieldGrid();
  resetParticles();
  background(255);
}

function draw() {
  if (indexk > 400) {
    noLoop();
  }
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      var angle = fxrand() * xoff;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(magv);
      flowfield[index] = v;
      xoff += inc;
      // stroke(255, 130);
      // push();
      // translate(x * scl, y * scl);
      // rotate(v.heading());
      // strokeWeight(0.1);
      // line(0, 0, scl, 0);
      // pop(); //fill(r);

      //rect(scl * x, scl * y, scl, scl);
    }
    yoff += inc;
    zoff += 0.0008;
  }
  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
  for (var i = 0; i < particles2.length; i++) {
    particles2[i].follow(flowfield);
    particles2[i].update();
    particles2[i].edges();
    particles2[i].show();
  }
  push();
  rectMode(RADIUS);
  //fill(255, 1 * sin(millis() * 3000));
  noStroke();
  rect(
    windowWidth / 2,
    windowHeight / 2,
    windowWidth / 2 - 30,
    windowHeight / 2 - 30
  );
  pop();
  indexk = indexk + 1;
  //console.log(indexk);
}

function mousePressed() {
  restartSketch();
}

function touchStarted() {
  restartSketch();
  return false;
}

function windowResized() {
  var previousWidth = width;
  var previousHeight = height;
  resizeCanvas(windowWidth, windowHeight);

  var scaleX = previousWidth > 0 ? windowWidth / previousWidth : 1;
  var scaleY = previousHeight > 0 ? windowHeight / previousHeight : 1;

  for (i = 0; i < particles.length; i++) {
    if (!particles[i]) continue;
    particles[i].pos.x *= scaleX;
    particles[i].pos.y *= scaleY;
    particles[i].prevPos.x *= scaleX;
    particles[i].prevPos.y *= scaleY;
    particles[i].vel.mult(0);
    particles[i].acc.mult(0);
  }
  for (i = 0; i < particles2.length; i++) {
    if (!particles2[i]) continue;
    particles2[i].pos.x *= scaleX;
    particles2[i].pos.y *= scaleY;
    particles2[i].prevPos.x *= scaleX;
    particles2[i].prevPos.y *= scaleY;
    particles2[i].vel.mult(0);
    particles2[i].acc.mult(0);
  }

  recalculateFlowfieldGrid();

  background(255);
  indexk = 0;
  loop();
}

function fxrandRange(min, max, step) {
  value = Math.round((fxrand() * (max - min)) / step);
  return value * step + min;
}

window.$fxhashFeatures = {
  Shadow: cr,
  Self: dr,
  Destruction: magv,
  Creation: inc,
  Balance: scl,
};

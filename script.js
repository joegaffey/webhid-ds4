import { DualShock4 } from './webhid-ds4.js';
    
let squareShape, triangleShape, crossShape1, crossShape2, circleShape, 
    dpadLeftShape, dpadRightShape, dpadUpShape, dpadDownShape, 
    rightStickShape, leftStickShape, 
    gxLine, gyLine, gzLine,
    axLine, ayLine, azLine,
    touch1, touch2,
    l1Shape, r1Shape,
    l3Shape, r3Shape,
    lTrigger, rTrigger,
    shareShape, optionsShape,
    touchpadShape, playstationShape;

// The WebHID device can only be requested upon user interaction
document.getElementById("connectButton").addEventListener("click", async () => {
  
  const DS4 = new DualShock4();
  
  // This will request the WebHID device and initialize the controller
  await DS4.init();
  
  const smallRumble = document.getElementById("smallRumble");
  smallRumble.oninput = () => { DS4.rumble.light = smallRumble.value; DS4.sendLocalState(); };
  const largeRumble = document.getElementById("largeRumble");
  largeRumble.oninput = (e) => { DS4.rumble.heavy = largeRumble.value; DS4.sendLocalState(); };
  
  const color = document.getElementById("color");
  color.addEventListener('input', () =>{
    setColor();
  });
  
  function setColor() {
    DS4.lightbar.r = parseInt(color.value.substr(1,2), 16);
    DS4.lightbar.g = parseInt(color.value.substr(3,2), 16);
    DS4.lightbar.b = parseInt(color.value.substr(5,2), 16);
    DS4.sendLocalState();
  }
  setColor();
  
  function logInputs() {
    requestAnimationFrame(logInputs);
    
    DS4.state.buttons.square ? squareShape.style.stroke = 'red' : squareShape.style.stroke = 'black';
    DS4.state.buttons.circle ? circleShape.style.stroke = 'red' : circleShape.style.stroke = 'black';
    DS4.state.buttons.cross ? crossShape1.style.stroke = 'red' : crossShape1.style.stroke = 'black';
    DS4.state.buttons.cross ? crossShape2.style.stroke = 'red' : crossShape2.style.stroke = 'black';
    DS4.state.buttons.triangle ? triangleShape.style.stroke = 'red' : triangleShape.style.stroke = 'black';
    
    DS4.state.buttons.dPadLeft ? dpadLeftShape.style.fill = 'red' : dpadLeftShape.style.fill = '';
    DS4.state.buttons.dPadRight ? dpadRightShape.style.fill = 'red' : dpadRightShape.style.fill = '';
    DS4.state.buttons.dPadUp ? dpadUpShape.style.fill = 'red' : dpadUpShape.style.fill = '';
    DS4.state.buttons.dPadDown ? dpadDownShape.style.fill = 'red' : dpadDownShape.style.fill = '';
    
    DS4.state.buttons.l1 ? l1Shape.style.fill = 'red' : l1Shape.style.fill = '';
    DS4.state.buttons.r1 ? r1Shape.style.fill = 'red' : r1Shape.style.fill = '';
    
    DS4.state.buttons.l3 ? l3Shape.style.stroke = 'red' : l3Shape.style.stroke = 'black';
    DS4.state.buttons.r3 ? r3Shape.style.stroke = 'red' : r3Shape.style.stroke = 'black';
    
    DS4.state.buttons.share ? shareShape.style.fill = 'red' : shareShape.style.fill = '';
    DS4.state.buttons.options ? optionsShape.style.fill = 'red' : optionsShape.style.fill = '';
    
    DS4.state.buttons.touchPadClick ? touchpadShape.style.stroke = 'red' : touchpadShape.style.stroke = '';    
    DS4.state.buttons.playStation ? playstationShape.style.fill = 'red' : playstationShape.style.fill = '';
    
    if(DS4.state.touchpad.touches && DS4.state.touchpad.touches.length > 0) {
      DS4.state.touchpad.touches.forEach((touch, i) => {
        if(i === 0) {
          touch1.style.fill = 'red';
          touch1.setAttribute('cx', 205 + touch.x / 10); 
          touch1.setAttribute('cy', 50 + touch.y / 10); 
        }
        else if(i === 1) {
          touch2.style.fill = 'red';
          touch2.setAttribute('cx', 205 + touch.x / 10); 
          touch2.setAttribute('cy', 50 + touch.y / 10); 
        }
      });      
    }
    else {
      touch1.style.fill = 'none';
      touch2.style.fill = 'none';
    }
    
    if(DS4.state.axes.rightStickX > 138 || DS4.state.axes.rightStickX < 118 || DS4.state.axes.rightStickY > 138 || DS4.state.axes.rightStickY < 118) {
      rightStickShape.style.fill = 'red'
      rightStickShape.setAttribute('transform', `translate( ${(DS4.state.axes.rightStickX - 128) / 10} , ${(DS4.state.axes.rightStickY - 128) / 10} )`);
    }
    else {
      rightStickShape.style.fill = ''
      rightStickShape.setAttribute('transform', `translate(0, 0)`);
    }
    
    if(DS4.state.axes.leftStickX > 138 || DS4.state.axes.leftStickX < 118 || DS4.state.axes.leftStickY > 138 || DS4.state.axes.leftStickY < 118) {
      leftStickShape.style.fill = 'red'
      leftStickShape.setAttribute('transform', `translate( ${(DS4.state.axes.leftStickX - 128) / 10} , ${(DS4.state.axes.leftStickY - 128) / 10} )`);
    }
    else {
      leftStickShape.style.fill = ''
      leftStickShape.setAttribute('transform', `translate(0, 0)`);
    }
    
    if(DS4.state.axes.l2 > 5) {
      lTrigger.style.fill = 'red' 
      lTrigger.setAttribute('r', DS4.state.axes.l2 / 5); 
    } 
    else
      lTrigger.style.fill = 'none';
    
    if(DS4.state.axes.r2 > 5) {
      rTrigger.style.fill = 'red' 
      rTrigger.setAttribute('r', DS4.state.axes.r2 / 5); 
    } 
    else
      rTrigger.style.fill = 'none';
    
    gxLine.setAttribute('y2', (65535 - DS4.state.axes.gyroX) / 1000 | 0);
    gyLine.setAttribute('y2', (65535 - DS4.state.axes.gyroY) / 1000 | 0);
    gzLine.setAttribute('y2', (65535 - DS4.state.axes.gyroZ) / 1000 | 0);
    
    axLine.setAttribute('y2', DS4.state.axes.accelX / -500 | 0);
    ayLine.setAttribute('y2', DS4.state.axes.accelY / -500 | 0);
    azLine.setAttribute('y2', DS4.state.axes.accelZ / -500 | 0);
  }
  logInputs();  
});

////////////////////////////////// Init SVGs 

window.onload =  () => setupSVGs();

function setupSVGs() {
  setupDS4SVG();
  setupGyroSVG();
  setupAccelSVG();
}

function setupDS4SVG() {
  const svgDoc = ds4svg.contentDocument;
  
  svgDoc.getElementById('svg6306').setAttributeNS(null, 'height', 430);
  
  console.log(svgDoc)
  
  touchpadShape = svgDoc.getElementById('rect3842');
  playstationShape = svgDoc.getElementById('path3840');

  squareShape = svgDoc.getElementById('rect4554');
  triangleShape = svgDoc.getElementById('rect4554-1');
  circleShape = svgDoc.getElementById('path4552');
  crossShape1 = svgDoc.getElementById('path4532');
  crossShape2 = svgDoc.getElementById('path4532-0');

  dpadLeftShape = svgDoc.getElementById('rect4086-17');
  dpadRightShape = svgDoc.getElementById('rect4086-1');
  dpadUpShape = svgDoc.getElementById('rect4086-6');
  dpadDownShape = svgDoc.getElementById('rect4086');

  rightStickShape = svgDoc.getElementById('path4031-7');
  leftStickShape = svgDoc.getElementById('path4031');

  l1Shape = svgDoc.getElementById('rect4250');
  r1Shape = svgDoc.getElementById('rect4250-9');   
  
  l3Shape = svgDoc.getElementById('path4166-3-4-13-7');
  r3Shape = svgDoc.getElementById('path4166-3-4-13-7-1');    

  shareShape = svgDoc.getElementById('path2995');
  optionsShape = svgDoc.getElementById('path2995-7');

  const bodyShell = svgDoc.getElementById('g3324')

  touch1 = makeCircle(300, 100, 5, 'none', 'none', 1);
  touch2 = makeCircle(300, 100, 5, 'none', 'none', 1);
  bodyShell.appendChild(touch1);
  bodyShell.appendChild(touch2);
  bringToTopofSVG(touch1);
  bringToTopofSVG(touch2);

  lTrigger = makeCircle(130, 52, 0, 'none', 'none', 0.5);
  rTrigger = makeCircle(470, 52, 0, 'none', 'none', 0.5);
  bodyShell.appendChild(lTrigger);
  bodyShell.appendChild(rTrigger);
  bringToTopofSVG(lTrigger);
  bringToTopofSVG(rTrigger);
}

function makeCircle(x, y, r, fill, stroke, opacity) {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttributeNS(null, 'cx', x);
  circle.setAttributeNS(null, 'cy', y);
  circle.setAttributeNS(null, 'r', r);
  circle.setAttributeNS(null, 'style', `fill: ${fill}; stroke: ${stroke};`);
  circle.setAttributeNS(null, 'opacity', opacity);
  return circle;
}

function bringToTopofSVG(targetElement){
  let parent = targetElement.ownerSVGElement;
  parent.appendChild(targetElement);
}

function setupGyroSVG() {
  const svgDoc = gyroSvg.contentDocument;
  gxLine = svgDoc.getElementById('force_x');
  gyLine = svgDoc.getElementById('force_y');
  gzLine = svgDoc.getElementById('force_z');
  svgDoc.getElementById('text_title').textContent='Gyroscope';
  
  const svgElement = svgDoc.getElementById(2)
  ds4svg.contentDocument.getElementById('g3324').appendChild(svgElement);
  svgElement.setAttribute('transform', `translate(150, 260) scale(0.5)`);
}

function setupAccelSVG() {
  const svgDoc = accelSvg.contentDocument;
  axLine = svgDoc.getElementById('force_x');
  ayLine = svgDoc.getElementById('force_y');
  azLine = svgDoc.getElementById('force_z');
  svgDoc.getElementById('text_title').textContent='Accelerometer';
  
  const svgElement = svgDoc.getElementById(2)
  ds4svg.contentDocument.getElementById('g3324').appendChild(svgElement);
  svgElement.setAttribute('transform', `translate(300, 260) scale(0.5)`);
}
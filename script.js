
Viewed
@@ -1,5 +1,7 @@
<!DOCTYPE html>
<html>
    <head>
        <title>1D Game</title>
        <style>
            html, body {
                margin: 0px;
@@ -17,9 +19,9 @@
            .button {
                box-sizing: border-box;
                display: inline-block;
                width: 33.33%;
                width: 25%;
                border-radius: 25px;
                border: 10px solid #000;
                border: 5px solid #000;
                text-align: center;
                font-size: 20px;
                user-select: none;
@@ -47,8 +49,8 @@
                overflow: hidden;
            }

            #buttonF {
                float: right;
            .button-spacer {
                visibility: hidden;
            }

            #buttonS .button-icon {
@@ -72,22 +74,38 @@
                <div class="button-label">shoot</div>
                <div class="button-icon">⦻</div>
            </div>
            <div class="button button-spacer">
            </div>
            <div class="button" id="buttonF">
                <div class="button-label">move forward</div>
                <div class="button-icon">▲</div>
            </div>
            <br>
            <div class="button button-spacer">
            </div>
            <div class="button" id="buttonL">
                <div class="button-icon">↶</div>
                <div class="button-label">turn left</div>
            </div><div class="button" id="buttonR">
                <div class="button-icon">↷</div>
                <div class="button-label">turn right</div>
                <div class="button-icon">◀</div>
                <div class="button-label">move left</div>
            </div>
            <div class="button" id="buttonB">
                <div class="button-icon">▼</div>
                <div class="button-label">move back</div>
            </div>
            <div class="button" id="buttonR">
                <div class="button-icon">▶</div>
                <div class="button-label">move right</div>
            </div>
            <br>
            <div class="button button-spacer">
            </div>
            <div class="button" id="buttonTL">
                <div class="button-icon">↶</div>
                <div class="button-label">turn left</div>
            </div>
            <div class="button" id="buttonTR">
                <div class="button-icon">↷</div>
                <div class="button-label">turn right</div>
            </div>
        </div>
        <br>
        <br>
@@ -100,7 +118,17 @@
        <input type="checkbox" id="bigPicture" checked>
        <label for="bigPicture">Big Picture Mode</label>
        <br>
        <lable for="quality">1D Render Quality:</lable>
        <label for="strafeControls">Strafe with:</label>
        <select id="strafeControls">
            <option value="0">A/D</option>
            <option value="1">left/right arrow</option>
            <option value="2">Neither</option>
        </select>
        <br>
        <label for="acceleration">Acceleration:</label>
        <input type="range" min="1" max="2" value="2" class="slider" id="acceleration">
        <br>
        <label for="quality">1D Render Quality:</label>
        <input type="range" min="1" max="10" value="8" class="slider" id="quality">
        <br>
        <br>
  109  
script.js
Viewed
@@ -159,6 +159,17 @@ let enemyMax = 16 // keep track of a maximum of 8 enemies

enemies.push({x: 8, y: 10, xVel: 0, yVel: 0, dir: 0})

let keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    turnLeft: false,
    turnRight: false,
    shoot: false
}


function clearSelection() {
    document.activeElement.blur()
}
@@ -181,6 +192,33 @@ function toggleDisplay2d() {
document.getElementById("show2d").onclick = toggleDisplay2d
toggleDisplay2d.bind(document.getElementById("show2d"))()

let strafeControls = 0
function updateStrafeControls() {
    strafeControls = parseInt(this.value)
    if (strafeControls === 2) {
        keys.left = false
        keys.right = false
    }
}
document.getElementById("strafeControls").onclick = updateStrafeControls
updateStrafeControls.bind(document.getElementById("strafeControls"))()

function updateAcceleration() {
    if (this.value === '2') {
        acc = 0.1
        fric = 0.6
        angAcc = 0.03
        angFric = 0.5
    } else {
        acc = 0.005
        fric = 0.03
        angAcc = 0.003
        angFric = 0.05
    }
}
document.getElementById("acceleration").onchange = updateAcceleration
updateAcceleration.bind(document.getElementById("acceleration"))()

// render quality/resolution
let maxRes = 450
let renderQuality = 10
@@ -214,8 +252,6 @@ function updateWorldTexture() {
document.getElementById("texture").onchange = updateWorldTexture
updateWorldTexture.bind(document.getElementById("texture"))()

let keys = {forward: false, backward: false, left: false, right: false, shoot: false}

function updateKey(keyCode, value) {
    switch (keyCode) {
        case 38: // up key
@@ -227,12 +263,16 @@ function updateKey(keyCode, value) {
            keys.backward = value;
            break;
        case 37: // left key
        case 65: // A key; fallthrough
            keys.left = value;
            keys[strafeControls === 1 ? "left" : "turnLeft"] = value;
            break;
        case 65: // A key
            keys[strafeControls === 0 ? "left" : "turnLeft"] = value;
            break;
        case 39: // right key
        case 68: // D key; fallthrough
            keys.right = value;
            keys[strafeControls === 1 ? "right" : "turnRight"] = value;
            break;
        case 68: // D key
            keys[strafeControls === 0 ? "right" : "turnRight"] = value;
            break;
        case 32: // space key
        case 90: // Z key; fallthrough
@@ -256,6 +296,8 @@ let buttonR = document.getElementById("buttonR")
let buttonF = document.getElementById("buttonF")
let buttonB = document.getElementById("buttonB")
let buttonS = document.getElementById("buttonS")
let buttonTL = document.getElementById("buttonTL")
let buttonTR = document.getElementById("buttonTR")
// check for touch device
if (("ontouchstart" in window) ||
    (navigator.maxTouchPoints > 0) ||
@@ -306,6 +348,24 @@ if (("ontouchstart" in window) ||
        keys.shoot = false
        this.style.backgroundColor = ""
    }

    buttonTL.ontouchstart = function() {
        keys.turnLeft = true
        this.style.backgroundColor = "#555"
    }
    buttonTL.ontouchend = function() {
        keys.turnLeft = false
        this.style.backgroundColor = ""
    }

    buttonTR.ontouchstart = function() {
        keys.turnRight = true
        this.style.backgroundColor = "#555"
    }
    buttonTR.ontouchend = function() {
        keys.turnRight = false
        this.style.backgroundColor = ""
    }
} else {
    document.getElementById("buttonContainer").style.display = "none"
}
@@ -1179,26 +1239,39 @@ function update(timestep)
    // timestep ratio
    let tr = timestep / stepSt

    let xComp = Math.cos(player.direction)
    let yComp = Math.sin(player.direction)
    let xVel = xComp * acc * tr
    let yVel = yComp * acc * tr

    if (keys.forward) {
        player.xVel += xVel
        player.yVel += yVel
    }
    if (keys.backward) {
        player.xVel -= xVel * 0.75
        player.yVel -= yVel * 0.75
    }

    if (keys.right) {
        player.xVel -= yVel
        player.yVel += xVel
    }
    if (keys.left) {
        player.xVel += yVel
        player.yVel -= xVel
    }

    if (keys.turnRight) {
        player.angVel += angAcc * tr
    } else if (keys.left) {
    }
    if (keys.turnLeft) {
        player.angVel -= angAcc * tr
    }
    player.angVel *= (1 - angFric * tr)

    player.direction += player.angVel * tr

    let xComp = Math.cos(player.direction)
    let yComp = Math.sin(player.direction)

    if (keys.forward) {
        player.xVel += xComp * acc * tr
        player.yVel += yComp * acc * tr
    } else if (keys.backward) {
        player.xVel -= xComp * acc / 2 * tr
        player.yVel -= yComp * acc / 2 * tr
    }

    if (keys.shoot && bullets.length < bulletMax) {
        keys.shoot = false;
        bullets.push({

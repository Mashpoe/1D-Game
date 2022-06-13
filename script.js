let canvasElem2d = document.getElementById("canvas2d")
canvasElem2d.width = "300"
canvasElem2d.height = "150"

let canvasElem1d = document.getElementById("canvas1d")
canvasElem1d.width = "600"
canvasElem1d.height = "200"

let ctx2d = canvasElem2d.getContext("2d")
let ctx1d = canvasElem1d.getContext("2d")

let textures1D = [
    [{r: 255, g: 255, b: 255}, {r: 192, g: 192, b: 192}, {r: 128, g: 128, b: 128}, {r: 64, g: 64, b: 64}, {r: 128, g: 128, b: 128}, {r: 192, g: 192, b: 192},],
    [{r: 0, g: 0, b: 255}, {r: 0, g: 64, b: 192}, {r: 0, g: 128, b: 128}, {r: 0, g: 192, b: 64}, {r: 0, g: 128, b: 128}, {r: 0, g: 64, b: 192},],
    [{r: 255, g: 0, b: 0}, {r: 255, g: 128, b: 0}, {r: 255, g: 255, b: 0}, {r: 0, g: 255, b: 0}, {r: 0, g: 0, b: 255}, {r: 255, g: 0, b: 255}],
    [{r: 255, g: 255, b: 255}, {r: 128, g: 128, b: 128}],
    [{r: 255, g: 255, b: 0}, {r: 128, g: 128, b: 0}],
    [{r: 128, g: 0, b: 0}],
    [{r: 255, g: 255, b: 255}, {r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}, {r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}, {r: 0, g: 0, b: 0}, {r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}, ],
]

let enemyEyeColor = {r: 255, g: 255, b: 255}
let enemyBodyColor = {r: 255, g: 0, b: 255}

// texture for half of the enemy's face
let enemyTexture1D = [
    enemyBodyColor,
    enemyBodyColor,
    enemyEyeColor,
    {r: 0, g: 0, b: 0},
    enemyEyeColor,
    enemyBodyColor
]

let gameOverBackground = {r: 0, g: 0, b: 0}
let gameOverForeground = {r: 255, g: 255, b: 255}
let gameOverTexture = [
    // bg
    gameOverBackground,
    gameOverBackground,
    gameOverBackground,
    gameOverBackground,
    gameOverBackground,
    gameOverBackground,

    // game
    gameOverForeground,
    gameOverForeground,
    gameOverBackground,

    gameOverForeground,
    gameOverForeground,
    gameOverBackground,

    gameOverForeground,
    gameOverForeground,
    gameOverBackground,

    gameOverForeground,
    gameOverForeground,
    gameOverBackground,

    // space
    gameOverBackground,
    gameOverBackground,

    // over
    gameOverForeground,
    gameOverForeground,
    gameOverBackground,

    gameOverForeground,
    gameOverForeground,
    gameOverBackground,

    gameOverForeground,
    gameOverForeground,
    gameOverBackground,

    gameOverForeground,
    gameOverForeground,
    gameOverBackground,

    // bg
    gameOverBackground,
    gameOverBackground,
    gameOverBackground,
    gameOverBackground,
    gameOverBackground,
    gameOverBackground,
]

let playerType = 1
let player = {
    x: 1.5,
    y: 1.5,
    xVel: 0.0,
    yVel: 0.0,
    angVel: 0.0, // angular velocity
    type: playerType,
    direction: 0.0, // direction in radians
    cooldown: 0.0, // remaining cooldown time
    health: 100
}

let acc = 0.005
let fric = 0.03

let angAcc = 0.003
let angFric = 0.05

let hitCooldown = 1500 // cooldown in milliseconds

let bulletSpeed = 0.1

// view distance in blocks
let tutorialMaxViewDist = 400 / 32
let levelMaxViewDist = 200 / 32
let maxViewDist = tutorialMaxViewDist

let world = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]
let level = 0
let enemyType = 2
// enemy: {x, y, xVel, yVel, type, dir, state}
// null enemy = dead
// -state = death animation
// +state = regular animation
let enemies = []
let spawnEnemies = true

// bullet: {x, y, xVel, yVel, type}
let bulletType = 3
let bullets = []

// keep track of entities in each tile by storing their indexes as bit positions
let bulletOffset = 0 // the starting bit position for bullet indices
let bulletMax = 8 // keep track of a maximum of 8 bullets
let enemyOffset = bulletOffset + bulletMax
let enemyMax = 16 // keep track of a maximum of 8 enemies

enemies.push({x: 8, y: 10, xVel: 0, yVel: 0, dir: 0})

function clearSelection() {
    document.activeElement.blur()
}


let anaglyph = false
function toggleAnaglyph() {
    anaglyph = this.checked
    clearSelection()
}
document.getElementById("anaglyph").onclick = toggleAnaglyph
toggleAnaglyph.bind(document.getElementById("anaglyph"))()

let crossview = false
function toggleCrossview() {
    crossview = this.checked
    clearSelection()
}
document.getElementById("crossview").onclick = toggleCrossview
toggleCrossview.bind(document.getElementById("crossview"))

let parallelView = false
function toggleParallelView() {
    parallelView = this.checked
    clearSelection()
}
document.getElementById("parallelview").onclick = toggleParallelView
toggleParallelView.bind(document.getElementById("parallelview"))

let renderDots = false
function toggleRenderDots() {
    renderDots = this.checked
    clearSelection()
}
document.getElementById("renderdots").onclick = toggleRenderDots
toggleRenderDots.bind(document.getElementById("renderdots"))

let show2d = true
function toggleDisplay2d() {
    show2d = this.checked
    canvasElem2d.style.display = show2d ? "inline" : "none"
    clearSelection()
}
document.getElementById("show2d").onclick = toggleDisplay2d
toggleDisplay2d.bind(document.getElementById("show2d"))()

// render quality/resolution
let maxRes = 450
let renderQuality = 10
function updateRenderQuality() {
    renderQuality = this.value
    clearSelection()
}
document.getElementById("quality").onchange = updateRenderQuality
updateRenderQuality.bind(document.getElementById("quality"))()

let bigPicture = true
function updateCanvasSize() {
    canvasElem1d.width = bigPicture ? window.innerWidth : Math.min(window.innerWidth, 450)
    canvasElem1d.height = canvasElem1d.width / 3
    canvasElem2d.width = Math.min(window.innerWidth, 300)
}
window.onresize = updateCanvasSize
function updateBigPicture() {
    bigPicture = this.checked
    updateCanvasSize()
    clearSelection()
}
document.getElementById("bigPicture").onchange = updateBigPicture
updateBigPicture.bind(document.getElementById("bigPicture"))()

let texIndex = 0
function updateWorldTexture() {
    texIndex = parseInt(this.value)
    clearSelection()
}
document.getElementById("texture").onchange = updateWorldTexture
updateWorldTexture.bind(document.getElementById("texture"))()

let keys = {forward: false, backward: false, left: false, right: false, shoot: false}

function updateKey(keyCode, value) {
    switch (keyCode) {
        case 38: // up key
        case 87: // W key; fallthrough
            keys.forward = value;
            break;
        case 40: // down key
        case 83: // S key; fallthrough
            keys.backward = value;
            break;
        case 37: // left key
        case 65: // A key; fallthrough
            keys.left = value;
            break;
        case 39: // right key
        case 68: // D key; fallthrough
            keys.right = value;
            break;
        case 32: // space key
        case 90: // Z key; fallthrough
        case 88: // X key; fallthrough
            keys.shoot = value;
            break;
    }
}

window.onkeydown = function(e) {
    updateKey(e.keyCode, true);
    e.preventDefault()
}

window.onkeyup = function(e) {
    updateKey(e.keyCode, false);
}

let buttonL = document.getElementById("buttonL")
let buttonR = document.getElementById("buttonR")
let buttonF = document.getElementById("buttonF")
let buttonB = document.getElementById("buttonB")
let buttonS = document.getElementById("buttonS")
// check for touch device
if (("ontouchstart" in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0))
{
    document.getElementById("controls").style.display = "none"
    buttonL.ontouchstart = function() {
        keys.left = true
        this.style.backgroundColor = "#555"
    }
    buttonL.ontouchend = function() {
        keys.left = false
        this.style.backgroundColor = ""
    }

    buttonR.ontouchstart = function() {
        keys.right = true
        this.style.backgroundColor = "#555"
    }
    buttonR.ontouchend = function() {
        keys.right = false
        this.style.backgroundColor = ""
    }

    buttonF.ontouchstart = function() {
        keys.forward = true
        this.style.backgroundColor = "#555"
    }
    buttonF.ontouchend = function() {
        keys.forward = false
        this.style.backgroundColor = ""
    }

    buttonB.ontouchstart = function() {
        keys.backward = true
        this.style.backgroundColor = "#555"
    }
    buttonB.ontouchend = function() {
        keys.backward = false
        this.style.backgroundColor = ""
    }

    buttonS.ontouchstart = function() {
        keys.shoot = true
        this.style.backgroundColor = "#555"
    }
    buttonS.ontouchend = function() {
        keys.shoot = false
        this.style.backgroundColor = ""
    }
} else {
    document.getElementById("buttonContainer").style.display = "none"
}

function remove(x, y) {
    if (x >= 0 && y >= 0 && y < world.length && x < world[y].length) {
        world[y][x] = 0
        return
    }
}

function clear(p, dir) {
    switch (dir) {
        case 1: // up
            remove(p.x, p.y - 1)
            remove(p.x, p.y - 2)
            remove(p.x, p.y - 3)
            remove(p.x + 1, p.y - 1)
            remove(p.x + 1, p.y - 2)
            remove(p.x + 1, p.y - 3)
            p.y -= 3
            break;
        case 2: // down
            remove(p.x, p.y + 1)
            remove(p.x, p.y + 2)
            remove(p.x, p.y + 3)
            remove(p.x, p.y + 4)
            remove(p.x + 1, p.y + 1)
            remove(p.x + 1, p.y + 2)
            remove(p.x + 1, p.y + 3)
            remove(p.x + 1, p.y + 4)
            p.y += 3
            break;
        case 3: // left
            remove(p.x - 1, p.y)
            remove(p.x - 2, p.y)
            remove(p.x - 3, p.y)
            remove(p.x - 1, p.y + 1)
            remove(p.x - 2, p.y + 1)
            remove(p.x - 3, p.y + 1)
            p.x -= 3
            break;
        case 4: // right
            remove(p.x + 1, p.y)
            remove(p.x + 2, p.y)
            remove(p.x + 3, p.y)
            remove(p.x + 4, p.y)
            remove(p.x + 1, p.y + 1)
            remove(p.x + 2, p.y + 1)
            remove(p.x + 3, p.y + 1)
            remove(p.x + 4, p.y + 1)
            p.x += 3
            break;
        default:
            return
    }
    ++p.dist
}

function available(x, y) {
    if (x >= 0 && y >= 0 && y < world.length && x < world[y].length) {
        return world[y][x] == 1
    }
    return false
}

function generateWorld(size) {
    size = size * 3 + 1
    enemies = []

    // fill a 2d array
    world = []
    for (let i = 0; i < size; ++i) {
        world.push([])
        for (let j = 0; j < size; ++j) {
            world[i].push(1)
        }
    }

    let pathways = []

    pathways.push({x: 1, y: 1, dist: 0})
    remove(1, 1)
    remove(1, 2)
    remove(2, 1)

    let maxPathway = pathways[0]

    while (pathways.length > 0) {
        for (let i = 0; i < pathways.length; ++i) {
            let p = pathways[i]
            let directions = []
            if (available(p.x, p.y - 3)) {
                directions.push(1) // up
            }
            if (available(p.x, p.y + 4)) {
                directions.push(2) // down
            }
            if (available(p.x - 3, p.y)) {
                directions.push(3) // left
            }
            if (available(p.x + 4, p.y)) {
                directions.push(4) // right
            }

            for (let j = directions.length; j >= 0; --j) {
                if (Math.random() > .95) {
                    // clone p for new branch
                    let pathway = Object.assign({}, p)
                    clear(pathway, directions[j])
                    pathways.push(pathway)
                    directions.splice(j, 1)
                }
            }

            if (directions.length == 0) {
                if (p.dist > maxPathway.dist) {
                    maxPathway = p
                } else if (spawnEnemies && p.dist > 5  && enemies.length < enemyMax) {
                    // spawn an enemy at the end of a pathway
                    if (Math.random() > 0.75) {
                        enemies.push({
                            x: p.x + 0.5,
                            y: p.y + 0.5,
                            xVel: 0,
                            yVel: 0,
                            type: enemyType,
                            dir: 0,
                            state: 0
                        })
                    }
                }
                pathways.splice(i, 1)
            }
        }
    }

    // add the exit block
    world[maxPathway.y][maxPathway.x] = 2
}

let portalColor = {r: 255, g: 255, b: 255}
// casts a ray and returns the color of whatever it hits
function castRay(px, py, dir) {
    let xComp = Math.cos(dir)
    let yComp = Math.sin(dir)

    // slope of the line
    let m = yComp / xComp

    let rx = px
    let ry = py

    let facingRight = xComp >= 0
    let xWorldEdge = facingRight ? world[0].length : -1

    let facingDown = yComp >= 0
    let yWorldEdge = facingDown ? world.length : -1

    while (true) {
        // continue to the next block

        // find out which block edge will be hit first
        let nextX = facingRight ? Math.floor(rx) + 1 : Math.ceil(rx) - 1
        let nextY = facingDown ? Math.floor(ry) + 1 : Math.ceil(ry) - 1

        let distX = Math.abs(nextX - rx)
        let distY = Math.abs(nextY - ry)

        // coords of the current block
        let bx
        let by

        let facingVertEdge = distY / distX > Math.abs(m)
        if (facingVertEdge) {
            // vertical edge collision
            rx = nextX
            ry = py + (rx - px) * m

            bx = facingRight ? rx : rx - 1
            by = Math.floor(ry)
        } else {
            // horizontal edge collision
            ry = nextY
            rx = px + (ry - py) / m

            by = facingDown ? ry : ry - 1
            bx = Math.floor(rx)
        }

        // return black if we hit the world edge
        if (bx == xWorldEdge || by == yWorldEdge) {
            return {r: 0, g: 0, b: 0}
        }

        // check for a collsion in the current block
        if (world[by][bx] == 0) {
            continue
        }

        // let cX = canvasElem2d.width / 2
        // let cY = canvasElem2d.height / 2

        // ctx2d.beginPath()
        // ctx2d.fillStyle = "orange"
        // ctx2d.rect(cX + (bx - player.x) * 32, cY + (by - player.y) * 32, 32, 32)
        // ctx2d.fill()

        // ctx2d.beginPath()
        // ctx2d.strokeStyle = "red"
        // ctx2d.moveTo(cX, cY)
        // ctx2d.lineTo(cX + (rx - player.x) * 32, cY + (ry - player.y) * 32)
        // ctx2d.stroke()

        if (world[by][bx] == 2) {
            return portalColor
        }

        let color = null
        // a negative tile indicates there are entities inside
        if (world[by][bx] < 0) {

            let tileBits = -world[by][bx]

            // isolate enemy and bullet bits, adjust to 0 offset
            // assumes bulletOffset < enemyOffset
            let enemyBits = tileBits >> enemyOffset
            let bulletBits = (tileBits & (~(enemyBits << enemyOffset))) >> bulletOffset

            // find where the ray intersects an enemy or bullet
            let xInt = 0
            let yInt = 0
            // look for bullets first because they are likely to be closer
            for (let i = 0; i < bulletMax; ++i) {

                if (bulletBits == 0) {
                    // stop looking if there are no bullets
                    break
                }

                if ((bulletBits & 1) == 0) {
                    bulletBits >>= 1
                    continue
                }
                // go to the next bit
                bulletBits >>= 1

                let b = bullets[i]

                let bDistX = b.x - player.x
                let bDistY = b.y - player.y
                let bDist = Math.sqrt(bDistX ** 2 + bDistY ** 2)

                // find the angle between the bullet and the player
                let xCompB = bDistX / bDist
                let yCompB = bDistY / bDist

                // find the distance between the bullet and the ray
                let dist =
                    Math.abs((rx - px) * (py - b.y) - (px - b.x) * (ry - py)) /
                    Math.sqrt((rx - px) ** 2 + (ry - py) ** 2)

                if (dist > 0.125) {
                    // the bullet does not collide with the ray
                    continue
                }

                // the ray hits the bullet! return the color
                let blue = (dist / 0.125) * 255
                color = {r: 255, g: 255, b: blue}
                break
            }

            if (color == null) {

                // look for enemies
                for (let i = 0; i < enemyMax; ++i) {

                    if (enemyBits == 0) {
                        // stop looking if there are no enemies
                        break
                    }
                    if ((enemyBits & 1) == 0) {
                        // skip over this bit
                        enemyBits >>= 1
                        continue
                    }
                    // go to the next bit
                    enemyBits >>= 1

                    let e = enemies[i]

                    // find the line from the enemy perpendicular to the player
                    // use player.x instead of px for 3D anaglyph
                    let eDistX = e.x - player.x
                    let eDistY = e.y - player.y


                    // let cX = canvasElem2d.width / 2
                    // let cY = canvasElem2d.height / 2

                    // calculate where the two lines intersect
                    if (eDistX == 0) {
                        // player x == enemy x
                        yInt = e.y
                        xInt = px + (yInt - py) / m
                    } else if (eDistY == 0) {
                        // player y == enemy y
                        xInt = e.x
                        yInt = py + (xInt - px) * m
                    } else {
                        // find distance between player and enemy
                        let eDist = Math.sqrt(eDistX ** 2 + eDistY ** 2)

                        // find the perpendicular angle
                        let xCompE = -eDistY / eDist // -sin
                        let yCompE = eDistX / eDist // cos

                        let a1 = -yComp
                        let b1 = xComp

                        let a2 = -yCompE
                        let b2 = xCompE

                        // ctx2d.beginPath()
                        // ctx2d.strokeStyle = "yellow"
                        // let startX = e.x + (-3 * xCompE)
                        // let startY = e.y + (-3 * yCompE)
                        // ctx2d.moveTo(cX + (startX - player.x) * 32, cY + (startY - player.y) * 32)
                        // let endX = e.x + (3 * xCompE)
                        // let endY = e.y + (3 * yCompE)
                        // ctx2d.lineTo(cX + (endX - player.x) * 32, cY + (endY - player.y) * 32)
                        // ctx2d.stroke()

                        // ctx2d.beginPath()
                        // ctx2d.strokeStyle = "yellow"
                        // startX = px + (-3 * xComp)
                        // startY = py + (-3 * yComp)
                        // ctx2d.moveTo(cX + (startX - player.x) * 32, cY + (startY - player.y) * 32)
                        // endX = px + (3 * xComp)
                        // endY = py + (3 * yComp)
                        // ctx2d.lineTo(cX + (endX - player.x) * 32, cY + (endY - player.y) * 32)
                        // ctx2d.stroke()

                        // find c values for both lines in the form ax + by = c
                        let c1 = a1 * px + b1 * py
                        let c2 = a2 * e.x + b2 * e.y

                        //console.log((a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1) + ", " + py)

                        // let c1 = xComp * e.x + yComp * e.y
                        // let c2 = xCompE * px + yCompE * py

                        // compute the intersection x and y
                        yInt = (a2 * c1 - a1 * c2) / (a2 * b1 - a1 * b2)
                        xInt = e.x + (yInt - e.y) * (xCompE / yCompE)

                        //console.log(xInt + ", " + yInt)
                        // let temp = yInt
                        // yInt = xInt
                        // xInt = temp
                    }


                    // ctx2d.beginPath()
                    // ctx2d.fillStyle = "orange"
                    // ctx2d.rect(cX + (bx - player.x) * 32, cY + (by - player.y) * 32, 32, 32)
                    // ctx2d.fill()

                    // ctx2d.beginPath()
                    // ctx2d.strokeStyle = "red"
                    // ctx2d.moveTo(cX, cY)
                    // ctx2d.lineTo(cX + (xInt - player.x) * 32, cY + (yInt - player.y) * 32)
                    // ctx2d.stroke()

                    // find distance between enemy and interception
                    let dist = Math.sqrt((xInt - e.x) ** 2 + (yInt - e.y) ** 2)

                    if (dist > 0.25) {
                        continue
                    }

                    let colorIndex = Math.floor(dist / 0.25 * enemyTexture1D.length)
                    color = enemyTexture1D[colorIndex]

                }

            }

            if (color == null) {
                continue
            }

        } else {
            // find where the collision was on the tile
            let tilePos
            if (facingVertEdge) {
                tilePos = ry % 1
                if (facingRight) {
                    tilePos = 1 - tilePos
                }
            } else {
                tilePos = rx % 1
                if (facingDown) {
                    tilePos = 1 - tilePos
                }
            }
            let colorIndex = Math.floor(tilePos * textures1D[texIndex].length)
            color = textures1D[texIndex][colorIndex]
        }

        let distance = Math.sqrt((rx - px) ** 2 + (ry - py) ** 2)

        let brightness = 1.0 - (Math.min(distance, maxViewDist) / maxViewDist)
        if (anaglyph) {
            brightness = Math.min(1.0, brightness + 0.3)
        }
        return {
            r: color.r * brightness,
            g: color.g * brightness,
            b: color.b * brightness
        }

    }
}

function render1d() {

    let canvasWidth = canvasElem1d.width
    let canvasHeight = canvasElem1d.height

    ctx1d.beginPath()
    ctx1d.fillStyle = "black"
    ctx1d.rect(0, 0, canvasWidth, canvasHeight)
    ctx1d.fill()

    let resolution = maxRes / (10 / renderQuality)
    let pixelWidth = canvasWidth / resolution

    if (anaglyph || crossview || parallelView) {

        // calculate pupil positions and directions
        let leftPupilAng = player.direction - Math.PI / 2
        let rightPupilAng = player.direction + Math.PI / 2

        if(parallelView)
        {
            [leftPupilAng, rightPupilAng] = [rightPupilAng, leftPupilAng]
        }

        let leftPupilX = player.x + Math.cos(leftPupilAng) * 0.1
        let leftPupilY = player.y + Math.sin(leftPupilAng) * 0.1
        let leftPupilDir = player.direction + Math.PI / 80

        let rightPupilX = player.x + Math.cos(rightPupilAng) * 0.1
        let rightPupilY = player.y + Math.sin(rightPupilAng) * 0.1
        let rightPupilDir = player.direction - Math.PI / 80

        if(anaglyph) {

            // left eye
            for (let i = 0; i < resolution; ++i) {
                let currentDir = (Math.PI / 3) * (i / resolution - 0.5) + leftPupilDir

                let color = castRay(leftPupilX, leftPupilY, currentDir)

                ctx1d.beginPath()
                ctx1d.fillStyle = "rgb(" + color.r + ",0,0)"


                let startPos = Math.round(i * pixelWidth)
                let endPos = Math.round((i + 1) * pixelWidth)

                ctx1d.rect(startPos, 0, endPos - startPos, canvasHeight)
                ctx1d.fill()
            }
            // right eye
            for (let i = 0; i < resolution; ++i) {
                let currentDir = (Math.PI / 3) * (i / resolution - 0.5) + rightPupilDir

                let color = castRay(rightPupilX, rightPupilY, currentDir)

                ctx1d.beginPath()
                ctx1d.fillStyle = "rgba(0," + color.g + "," + color.b + ",0.5)"

                let startPos = Math.round(i * pixelWidth)
                let endPos = Math.round((i + 1) * pixelWidth)

                ctx1d.rect(startPos, 0, endPos - startPos, canvasHeight)
                ctx1d.fill()
            }
        } else {
            // left eye
            let dotColor = null

            for (let i = 0; i < resolution; ++i) {
                let currentDir = (Math.PI / 3) * (i / resolution - 0.5) + leftPupilDir

                let color = castRay(leftPupilX, leftPupilY, currentDir)

                ctx1d.beginPath()
                ctx1d.fillStyle = "rgb(" +
                    color.r + "," +
                    color.g + "," +
                    color.b + ")"

                if(i == Math.round(resolution / 2))
                {
                    dotColor = color
                }

                let startPos = i * pixelWidth
                let endPos = (i + 1) * pixelWidth

                startPos = Math.round(0.5 * startPos + 0.5 * canvasWidth);
                endPos = Math.round(0.5 * endPos + 0.5 * canvasWidth);
                console.log(pixelWidth)

                ctx1d.rect(startPos, 0, endPos - startPos, canvasHeight)
                ctx1d.fill()
            }
            // right eye
            for (let i = 0; i < resolution; ++i) {
                let currentDir = (Math.PI / 3) * (i / resolution - 0.5) + rightPupilDir

                let color = castRay(rightPupilX, rightPupilY, currentDir)


                ctx1d.beginPath()
                ctx1d.fillStyle = "rgb(" +
                    color.r + "," +
                    color.g + "," +
                    color.b + ")"

                let startPos = i * pixelWidth
                let endPos = (i + 1) * pixelWidth

                startPos = Math.round(0.5 * startPos)
                endPos = Math.round(0.5 * endPos)

                ctx1d.rect(startPos, 0, endPos - startPos, canvasHeight)
                ctx1d.fill()
            }

            if(renderDots)
            {
                let dotSize = 0.02 * canvasHeight
                let virtualDotStart = 0.5 * canvasWidth - 0.5 * dotSize

                ctx1d.fillStyle = "rgb(" +
                (255 - dotColor.r) + "," +
                (255 - dotColor.g) + "," +
                (255 - dotColor.b) + ")"

                let y = 0.5 * (canvasHeight - dotSize)

                ctx1d.rect(0.5 * virtualDotStart, y, dotSize, dotSize)
                ctx1d.fill()

                ctx1d.rect(1.5 * virtualDotStart, y, dotSize, dotSize)
                ctx1d.fill()
            }
        }
    } else {

        for (let i = 0; i < resolution; ++i) {
            let currentDir = (Math.PI / 2) * (i / resolution - 0.5) + player.direction

            let color = castRay(player.x, player.y, currentDir)

            ctx1d.beginPath()
            ctx1d.fillStyle = "rgb(" +
                color.r + "," +
                color.g + "," +
                color.b + ")"

            let startPos = Math.round(i * pixelWidth)
            let endPos = Math.round((i + 1) * pixelWidth)

            ctx1d.rect(startPos, 0, endPos - startPos, canvasHeight)
            ctx1d.fill()
        }
    }

    // draw damage overlay
    if (player.cooldown > 0) {
        ctx1d.beginPath()
        ctx1d.fillStyle = "rgba(" + player.cooldown / hitCooldown * 255 + ", 0, 0, 0.5)"
        ctx1d.rect(0, 0, canvasWidth, canvasHeight)
        ctx1d.fill()

        // if the player is hit, display health bar
        let healthBarWidth = Math.floor((player.health / 100) * resolution) * pixelWidth
        ctx1d.beginPath()
        ctx1d.fillStyle = "rgba(0, 255, 0, 0.5)"
        ctx1d.rect(0, 0, Math.round(healthBarWidth), canvasHeight)
        ctx1d.fill()
    }
}



function drawStage2d() {

    let cX = canvasElem2d.width / 2
    let cY = canvasElem2d.height / 2
    ctx2d.strokeStyle = "yellow"
    // portal color
    ctx2d.fillStyle = "rgb(" +
        portalColor.r + "," +
        portalColor.g + "," +
        portalColor.b + ")"

    for (let y = 0; y < world.length; ++y) {
        for (let x = 0; x < world[y].length; ++x) {
            if (world[y][x] > 0) {
                //ctx2d.strokeStyle = world[y][x] > 0 ? "yellow" : "red"
                ctx2d.strokeStyle = "yellow"
                ctx2d.beginPath()
                ctx2d.rect(
                    (x - player.x) * 32 + cX,
                    (y - player.y) * 32 + cY,
                    32, 32)
                if (world[y][x] == 2) {
                    ctx2d.fill()
                }
                ctx2d.stroke()
            }
        }
    }
}

function drawPlayer() {
    let cX = canvasElem2d.width / 2
    let cY = canvasElem2d.height / 2
    ctx2d.beginPath()
    ctx2d.strokeStyle = "black"
    ctx2d.fillStyle = "#ff00ff"
    ctx2d.arc(cX, cY, 16 / 2, 0, 2 * Math.PI, false)
    ctx2d.fill()
    ctx2d.stroke()
    // left eye
    ctx2d.fillStyle = "white"
    ctx2d.beginPath()
    let leftEyeAng = player.direction - Math.PI / 5
    let leftEyeX = cX + Math.cos(leftEyeAng) * 6
    let leftEyeY = cY + Math.sin(leftEyeAng) * 6
    ctx2d.arc(leftEyeX, leftEyeY, 3, 0, 2 * Math.PI, false)
    ctx2d.fill()
    ctx2d.stroke()

    // left pupil
    ctx2d.fillStyle = "black"
    ctx2d.beginPath()
    let leftPupilAng = player.direction - Math.PI / 6
    let leftPupilX = cX + Math.cos(leftPupilAng) * 7.5
    let leftPupilY = cY + Math.sin(leftPupilAng) * 7.5
    ctx2d.arc(leftPupilX, leftPupilY, 1.5, 0, 2 * Math.PI, false)
    ctx2d.fill()
    ctx2d.stroke()

    // right eye
    ctx2d.fillStyle = "white"
    ctx2d.beginPath()
    let rightEyeAng = player.direction + Math.PI / 5
    let rightEyeX = cX + Math.cos(rightEyeAng) * 6
    let rightEyeY = cY + Math.sin(rightEyeAng) * 6
    ctx2d.arc(rightEyeX, rightEyeY, 3, 0, 2 * Math.PI, false)
    ctx2d.fill()
    ctx2d.stroke()

    // right pupil
    ctx2d.fillStyle = "black"
    ctx2d.beginPath()
    let rightPupilAng = player.direction + Math.PI / 6
    let rightPupilX = cX + Math.cos(rightPupilAng) * 7.5
    let rightPupilY = cY + Math.sin(rightPupilAng) * 7.5
    ctx2d.arc(rightPupilX, rightPupilY, 1.5, 0, 2 * Math.PI, false)
    ctx2d.fill()
    ctx2d.stroke()
}

function drawEnemies() {
    let cX = canvasElem2d.width / 2
    let cY = canvasElem2d.height / 2

    for (let i = 0; i < enemies.length; ++i) {
        let e = enemies[i]
        if (e == null) {
            continue
        }

        ctx2d.beginPath()
        ctx2d.strokeStyle = "black"
        ctx2d.fillStyle = "#ff0000"
        ctx2d.arc(
            (e.x - player.x) * 32 + cX,
            (e.y - player.y) * 32 + cY,
            16 / 2, 0, 2 * Math.PI, false)
        ctx2d.fill()
        ctx2d.stroke()
    }
}

function drawBullets() {
    let cX = canvasElem2d.width / 2
    let cY = canvasElem2d.height / 2

    for (let i = 0; i < bullets.length; ++i) {
        let b = bullets[i]

        ctx2d.beginPath()
        ctx2d.strokeStyle = "black"
        ctx2d.fillStyle = "#ffff00"
        ctx2d.arc(
            (b.x - player.x) * 32 + cX,
            (b.y - player.y) * 32 + cY,
            8 / 2, 0, 2 * Math.PI, false)
        ctx2d.fill()
        ctx2d.stroke()
    }
}

function render2d() {
    ctx2d.beginPath()
    ctx2d.fillStyle = "black"
    ctx2d.strokeStyle = "white"
    ctx2d.rect(0, 0, canvasElem2d.width, canvasElem2d.height)
    ctx2d.fill()
    ctx2d.stroke()
    drawStage2d()
    drawBullets()
    drawPlayer()
    drawEnemies()
}

function render() {
    //ctx2d.clearRect(0, 0, canvasElem2d.width, canvasElem2d.height)    ctx1d.beginPath()


    if (show2d) {
        render2d()
    }

    render1d()
    //ctx1d.clearRect(0, 0, canvasElem1d.width, canvasElem1d.height)


}

function checkCollision(entity, movingHoriz) {
    // check for collisions
    let leftBoundX = Math.floor(entity.x - 0.25)
    let rightBoundX = Math.ceil(entity.x + 0.25)

    let topBoundY = Math.floor(entity.y - 0.25)
    let bottomBoundY = Math.ceil(entity.y + 0.25)
    for (let y = topBoundY; y < bottomBoundY; ++y) {
        for (let x = leftBoundX; x < rightBoundX; ++x) {

            if (world[y][x] > 0) {

                if (entity == player) {
                    if (world[y][x] == 2) {
                        generateWorld(++level + 2)
                        entity.x = 1.5
                        entity.y = 1.5
                        entity.xVel = 0
                        entity.yVel = 0
                        player.angVel = 0
                        player.direction = 0
                        document.getElementById("level").innerHTML = level
                        maxViewDist = levelMaxViewDist
                        return
                    }
                }

                if (movingHoriz) {
                    if (entity.xVel > 0) {
                        entity.x = x - 0.25
                    } else if (entity.xVel < 0) {
                        entity.x = x + 1.25
                    }
                    entity.xVel = 0
                } else {
                    if (entity.yVel > 0) {
                        entity.y = y - 0.25
                    } else if (entity.yVel < 0) {
                        entity.y = y + 1.25
                    }
                    entity.yVel = 0
                }
                return

            } else if (entity != player && player.cooldown == 0) {
                // the entity is an enemy; check if touching player

                // get the distance between the enemy and the player
                let xDist = player.x - entity.x
                let yDist = player.y - entity.y
                let dist = Math.sqrt(xDist ** 2 + yDist ** 2)

                // check if they are touching
                if (dist < 0.25 + 0.25) {
                    player.cooldown = hitCooldown
                    player.health -= 10
                }
            }

        }
    }
}

function clearAllBulletBits() {
    for (let i = 0; i < bullets.length; ++i) {
        let b = bullets[i]
        let leftBoundX = Math.floor(b.x - 0.25)
        let rightBoundX = Math.ceil(b.x + 0.25)
        let topBoundY = Math.floor(b.y - 0.25)
        let bottomBoundY = Math.ceil(b.y + 0.25)
        for (let y = topBoundY; y < bottomBoundY; ++y) {
            for (let x = leftBoundX; x < rightBoundX; ++x) {
                if (world[y][x] < 1) {
                    // set the corresponding bit index to 0
                    let bulletBits = -world[y][x]
                    bulletBits &= ~(1 << (i + bulletOffset))
                    world[y][x] = -bulletBits
                }
            }
        }
    }
}

function writeBulletBits(i) {
    let b = bullets[i]
    leftBoundX = Math.floor(b.x - 0.25)
    rightBoundX = Math.ceil(b.x + 0.25)
    topBoundY = Math.floor(b.y - 0.25)
    bottomBoundY = Math.ceil(b.y + 0.25)
    for (let y = topBoundY; y < bottomBoundY; ++y) {
        for (let x = leftBoundX; x < rightBoundX; ++x) {
            if (world[y][x] < 1) {
                // set the corresponding bit index to 1
                let bulletBits = -world[y][x]
                bulletBits |= 1 << (i + bulletOffset)
                world[y][x] = -bulletBits
            }
        }
    }
}

function clearEnemyBits(i) {
    let e = enemies[i]
    let leftBoundX = Math.floor(e.x - 0.25)
    let rightBoundX = Math.ceil(e.x + 0.25)
    let topBoundY = Math.floor(e.y - 0.25)
    let bottomBoundY = Math.ceil(e.y + 0.25)
    for (let y = topBoundY; y < bottomBoundY; ++y) {
        for (let x = leftBoundX; x < rightBoundX; ++x) {
            if (world[y][x] < 1) {
                // set the corresponding bit index to 0
                let tileBits = -world[y][x]
                tileBits &= ~(1 << (i + enemyOffset))
                world[y][x] = -tileBits
            }
        }
    }
}

function writeEnemyBits(i) {
    let e = enemies[i]
    let leftBoundX = Math.floor(e.x - 0.25)
    let rightBoundX = Math.ceil(e.x + 0.25)
    let topBoundY = Math.floor(e.y - 0.25)
    let bottomBoundY = Math.ceil(e.y + 0.25)
    for (let y = topBoundY; y < bottomBoundY; ++y) {
        for (let x = leftBoundX; x < rightBoundX; ++x) {
            if (i < enemyMax && world[y][x] < 1) {
                // set the corresponding bit index to 1
                let tileBits = -world[y][x]
                tileBits |= 1 << (i + enemyOffset)
                world[y][x] = -tileBits
            }
        }
    }
}

function checkBulletCollision(index) {
    let b = bullets[index]

    let leftBoundX = Math.floor(b.x - 0.125)
    let rightBoundX = Math.ceil(b.x + 0.125)

    let topBoundY = Math.floor(b.y - 0.125)
    let bottomBoundY = Math.ceil(b.y + 0.125)
    for (let y = topBoundY; y < bottomBoundY; ++y) {
        for (let x = leftBoundX; x < rightBoundX; ++x) {
            if (world[y][x] > 0) {
                return true
            }

            if (world[y][x] < 0) {
                let tileBits = -world[y][x]

                // isolate enemy bits, adjust to 0 offset
                // assumes bulletOffset < enemyOffset
                let enemyBits = tileBits >> enemyOffset

                // look for enemies
                for (let i = 0; i < enemyMax; ++i) {

                    if (enemyBits == 0) {
                        // stop looking if there are no enemies
                        break
                    }
                    if ((enemyBits & 1) == 0) {
                        // skip over this bit
                        enemyBits >>= 1
                        continue
                    }
                    // go to the next bit
                    enemyBits >>= 1

                    let e = enemies[i]

                    // get the distance between the enemy and the bullet
                    let xDist = e.x - b.x
                    let yDist = e.y - b.y
                    let dist = Math.sqrt(xDist ** 2 + yDist ** 2)

                    // check if they are touching
                    if (dist < 0.125 + 0.25) {
                        clearEnemyBits(i)
                        enemies[i] = null
                        return true
                    }
                }

            }
        }
    }
    return false
}

let brightenPortal = false

// the standard timestep
let stepSt = 20
function update(timestep)
{
    // timestep ratio
    let tr = timestep / stepSt

    if (keys.right) {
        player.angVel += angAcc * tr
    } else if (keys.left) {
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
            x: player.x,
            y: player.y,
            xVel: xComp * bulletSpeed,
            yVel: yComp * bulletSpeed,
            type: bulletType
        })
    }

    player.xVel *= (1 - fric * tr)
    player.yVel *= (1 - fric * tr)

    // check if the player is touching any e

    // remaining velocity x and y
    let rvx = Math.abs(player.xVel * tr)
    let rvy = Math.abs(player.yVel * tr)
    let xDir = player.xVel > 0 ? 1 : -1
    let yDir = player.yVel > 0 ? 1 : -1
    while(rvx > 0 || rvy > 0) {
        if (rvx > 1) {
            player.x += xDir
            rvx -= 1
        } else {
            player.x += xDir * rvx
            rvx = 0
        }
        checkCollision(player, true)

        if (rvy > 1) {
            player.y += yDir
            rvy -= 1
        } else {
            player.y += yDir * rvy
            rvy = 0
        }
        checkCollision(player, false)
    }

    // update damage cooldown
    if (player.cooldown > 0) {
        player.cooldown = Math.max(0, player.cooldown - timestep)
    }

    // update bullets
    clearAllBulletBits()
    let numBullets = bullets.length
    for (let i = 0; i < bullets.length; ++i) {
        let b = bullets[i]
        if (b == null) {
            continue
        }

        // remaining velocity x and y
        let rvx = Math.abs(b.xVel * tr)
        let rvy = Math.abs(b.yVel * tr)
        let xDir = b.xVel > 0 ? 1 : -1
        let yDir = b.yVel > 0 ? 1 : -1
        while(rvx > 0 || rvy > 0) {
            if (rvx > 1) {
                b.x += xDir
                rvx -= 1
            } else {
                b.x += xDir * rvx
                rvx = 0
            }
            if (checkBulletCollision(i)) {
                bullets.splice(i, 1)
                break
            }

            if (rvy > 1) {
                b.y += yDir
                rvy -= 1
            } else {
                b.y += yDir * rvy
                rvy = 0
            }
            if (checkBulletCollision(i)) {
                bullets.splice(i, 1)
                break
            }
        }

        if (numBullets > bullets.length) {
            --i
            numBullets = bullets.length
        } else {
            // update the bullet tile boundaries
            writeBulletBits(i)
        }
    }

    // update enemies
    for (let i = 0; i < enemies.length; ++i) {
        let e = enemies[i]
        if (e == null) {
            continue
        }

        // reset the enemy tile boundaries
        clearEnemyBits(i)

        // find the direction towards the player
        let xDist = (player.x - e.x)
        let yDist = (player.y - e.y)
        let dist = Math.sqrt(xDist ** 2 + yDist ** 2)
        let xComp = xDist/dist
        let yComp = yDist/dist

        e.xVel += xComp * acc * tr
        e.yVel += yComp * acc * tr

        e.xVel *= (1 - fric * tr)
        e.yVel *= (1 - fric * tr)

        // remaining velocity x and y
        let rvx = Math.abs(e.xVel * tr / 3)
        let rvy = Math.abs(e.yVel * tr / 3)
        let xDir = e.xVel > 0 ? 1 : -1
        let yDir = e.yVel > 0 ? 1 : -1
        while(rvx > 0 || rvy > 0) {
            if (rvx > 1) {
                e.x += xDir
                rvx -= 1
            } else {
                e.x += xDir * rvx
                rvx = 0
            }
            checkCollision(e, true)

            if (rvy > 1) {
                e.y += yDir
                rvy -= 1
            } else {
                e.y += yDir * rvy
                rvy = 0
            }
            checkCollision(e, false)
        }

        // update the enemy tile boundaries
        writeEnemyBits(i)

    }

    let portalAnimSpeed = 5 * tr
    let brightness = portalColor.r
    if (brightenPortal) {
        brightness += portalAnimSpeed
        if (brightness > 255) {
            brightness = 255
            brightenPortal = false
        }
    } else {
        brightness -= portalAnimSpeed
        if (brightness < 0) {
            brightness = 0
            brightenPortal = true
        }
    }

    portalColor.r = brightness
    portalColor.g = brightness
    portalColor.b = brightness

}

let lastTime = Date.now()
let gameOverOpacity = 0
let gameOverTime = 5000 // animation milliseconds
function runGame() {

    let currentTime = Date.now()
    let delta = currentTime - lastTime
    lastTime = currentTime

    if (player.health > 0) {
        render()

        update(Math.min(delta, 100))

    } else {

        if (gameOverOpacity < 1) {
            gameOverOpacity = Math.min(1, gameOverOpacity + delta / gameOverTime)
        }

        render()
        let resolution = maxRes / (10 / renderQuality)
        let pixelWidth = canvasElem1d.width / resolution
        let texPixelWidth = (resolution / gameOverTexture.length) * pixelWidth

        for (let i = 0; i < gameOverTexture.length; ++i) {
            let startPos = Math.round(i * texPixelWidth)
            let endPos = Math.round((i + 1) * texPixelWidth)
            ctx1d.beginPath()
            let color = "rgba(" +
                gameOverTexture[i].r + "," +
                gameOverTexture[i].g + "," +
                gameOverTexture[i].b + "," +
                gameOverOpacity + ")"
            ctx1d.fillStyle = color
            ctx1d.rect(startPos, 0, endPos - startPos, canvasElem1d.height)
            ctx1d.fill()
        }

        if (show2d) {
            ctx2d.font = "50px Arial";
            ctx2d.fillStyle = "black"
            ctx2d.fillText("Game Over", 22, 52);
            ctx2d.fillStyle = "white"
            ctx2d.fillText("Game Over", 20, 50);
        }
    }

    requestAnimationFrame(runGame)
}
runGame()

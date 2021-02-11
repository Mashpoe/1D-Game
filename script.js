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
    [{r: 255, g: 255, b: 255}],
]

let player = {x: 1.5, y: 1.5}
let direction = 0.0 // direction in radians

let velocity = {x: 0.0, y: 0.0}
let angVel = 0.0 // angular velocity

let acc = 0.005
let fric = 0.03

let angAcc = 0.003
let angFric = 0.05

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

let anaglyph = false
function toggleAnaglyph() {
    anaglyph = this.checked
}
document.getElementById("anaglyph").onclick = toggleAnaglyph
toggleAnaglyph.bind(document.getElementById("anaglyph"))()

let show2d = true
function toggleDisplay2d() {
    show2d = this.checked
    canvasElem2d.style.display = show2d ? "inline" : "none"
}
document.getElementById("show2d").onclick = toggleDisplay2d
toggleDisplay2d.bind(document.getElementById("show2d"))()

let renderQuality = 10
function updateRenderQuality() {
    renderQuality = this.value
}
document.getElementById("quality").onchange = updateRenderQuality
updateRenderQuality.bind(document.getElementById("quality"))()

function updateCanvasSize() {
    canvasElem1d.width = Math.min(window.innerWidth, 450)
    canvasElem1d.height = canvasElem1d.width / 3
    canvasElem2d.width = Math.min(window.innerWidth, 300)
}
window.onresize = updateCanvasSize
updateCanvasSize()

let texIndex = 0
function updateWorldTexture() {
    texIndex = parseInt(this.value)
}
document.getElementById("texture").onchange = updateWorldTexture
updateWorldTexture.bind(document.getElementById("texture"))()

let keys = {forward: false, backward: false, left: false, right: false}

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
    }
}

window.onkeydown = function(e) {
    updateKey(e.keyCode, true);
}

window.onkeyup = function(e) {
    updateKey(e.keyCode, false);
}

let buttonL = document.getElementById("buttonL")
let buttonR = document.getElementById("buttonR")
let buttonF = document.getElementById("buttonF")
let buttonB = document.getElementById("buttonB")
// check for touch device
if (("ontouchstart" in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0))
{
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
} else {
    buttonL.style.display = "none"
    buttonR.style.display = "none"
    buttonF.style.display = "none"
    buttonB.style.display = "none"
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
                if (pathways[i].dist > maxPathway.dist) {
                    maxPathway = pathways[i]
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
        if (world[by][bx] != 0) {
            let cX = canvasElem2d.width / 2
            let cY = canvasElem2d.height / 2
            
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
}

function drawStage2d() {

    //castRay2(player.x, player.y, direction)

    let centerX = canvasElem2d.width / 2
    let centerY = canvasElem2d.height / 2
    ctx2d.strokeStyle = "yellow"
    // portal color
    ctx2d.fillStyle = "rgb(" +
        portalColor.r + "," +
        portalColor.g + "," +
        portalColor.b + ")"

    for (let y = 0; y < world.length; ++y) {
        for (let x = 0; x < world[y].length; ++x) {
            if (world[y][x] != 0) {
                ctx2d.beginPath()
                ctx2d.rect(
                    (x - player.x) * 32 + centerX,
                    (y - player.y) * 32 + centerY,
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
    let centerX = canvasElem2d.width / 2
    let centerY = canvasElem2d.height / 2
    ctx2d.beginPath()
    ctx2d.strokeStyle = "black"
    ctx2d.fillStyle = "#ff00ff"
    ctx2d.arc(centerX, centerY, 16 / 2, 0, 2 * Math.PI, false)
    ctx2d.fill()
    ctx2d.stroke()
    // left eye
    ctx2d.fillStyle = "white"
    ctx2d.beginPath()
    let leftEyeAng = direction - Math.PI / 5
    let leftEyeX = centerX + Math.cos(leftEyeAng) * 6
    let leftEyeY = centerY + Math.sin(leftEyeAng) * 6
    ctx2d.arc(leftEyeX, leftEyeY, 3, 0, 2 * Math.PI, false)
    ctx2d.fill()
    ctx2d.stroke()

    // left pupil
    ctx2d.fillStyle = "black"
    ctx2d.beginPath()
    let leftPupilAng = direction - Math.PI / 6
    let leftPupilX = centerX + Math.cos(leftPupilAng) * 7.5
    let leftPupilY = centerY + Math.sin(leftPupilAng) * 7.5
    ctx2d.arc(leftPupilX, leftPupilY, 1.5, 0, 2 * Math.PI, false)
    ctx2d.fill()
    ctx2d.stroke()

    // right eye
    ctx2d.fillStyle = "white"
    ctx2d.beginPath()
    let rightEyeAng = direction + Math.PI / 5
    let rightEyeX = centerX + Math.cos(rightEyeAng) * 6
    let rightEyeY = centerY + Math.sin(rightEyeAng) * 6
    ctx2d.arc(rightEyeX, rightEyeY, 3, 0, 2 * Math.PI, false)
    ctx2d.fill()
    ctx2d.stroke()

    // right pupil
    ctx2d.fillStyle = "black"
    ctx2d.beginPath()
    let rightPupilAng = direction + Math.PI / 6
    let rightPupilX = centerX + Math.cos(rightPupilAng) * 7.5
    let rightPupilY = centerY + Math.sin(rightPupilAng) * 7.5
    ctx2d.arc(rightPupilX, rightPupilY, 1.5, 0, 2 * Math.PI, false)
    ctx2d.fill()
    ctx2d.stroke()
}

function render1d() {

    let canvasWidth = canvasElem1d.width
    let canvasHeight = canvasElem1d.height

    ctx1d.beginPath()
    ctx1d.fillStyle = "black"
    ctx1d.rect(0, 0, canvasWidth, canvasHeight)
    ctx1d.fill()

    let resolution = canvasWidth / (10 / renderQuality)

    if (anaglyph) {
        //resolution /= 2
        let pixelWidth = canvasWidth / resolution

        // calculate pupil positions and directions
        let leftPupilAng = direction - Math.PI / 2
        let leftPupilX = player.x + Math.cos(leftPupilAng) * 0.1
        let leftPupilY = player.y + Math.sin(leftPupilAng) * 0.1
        let leftPupilDir = direction + Math.PI / 80

        let rightPupilAng = direction + Math.PI / 2
        let rightPupilX = player.x + Math.cos(rightPupilAng) * 0.1
        let rightPupilY = player.y + Math.sin(rightPupilAng) * 0.1
        let rightPupilDir = direction - Math.PI / 80

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
        let pixelWidth = canvasWidth / resolution

        for (let i = 0; i < resolution; ++i) {
            let currentDir = (Math.PI / 2) * (i / resolution - 0.5) + direction

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
}

function render() {
    //ctx2d.clearRect(0, 0, canvasElem2d.width, canvasElem2d.height)    ctx1d.beginPath()
    

    ctx2d.beginPath()
        ctx2d.fillStyle = "black"
        ctx2d.rect(0, 0, canvasElem2d.width, canvasElem2d.height)
        ctx2d.fill()
    //console.log(castRay(direction))
    render1d()
    //ctx1d.clearRect(0, 0, canvasElem1d.width, canvasElem1d.height)

    if (show2d) {
        ctx2d.beginPath()
        ctx2d.strokeStyle = "white"
        ctx2d.fill()
        ctx2d.stroke()
        drawStage2d()
        drawPlayer()
    }

}

function checkCollision(movingHoriz) {
    // check for collisions
    let leftBoundX = Math.floor(player.x - 0.25)
    let rightBoundX = Math.ceil(player.x + 0.25)
    
    let topBoundY = Math.floor(player.y - 0.25)
    let bottomBoundY = Math.ceil(player.y + 0.25)
    for (let y = topBoundY; y < bottomBoundY; ++y) {
        for (let x = leftBoundX; x < rightBoundX; ++x) {

            if (world[y][x] != 0) {

                if (world[y][x] == 2) {
                    generateWorld(++level + 2)
                    player.x = 1.5
                    player.y = 1.5
                    velocity.x = 0
                    velocity.y = 0
                    angVel = 0
                    document.getElementById("level").innerHTML = level
                    maxViewDist = levelMaxViewDist
                    return;
                }
                
                if (movingHoriz) {
                    if (velocity.x > 0) {
                        player.x = x - 0.25
                    } else if (velocity.x < 0) {
                        player.x = x + 1.25
                    }
                    velocity.x = 0
                } else {
                    if (velocity.y > 0) {
                        player.y = y - 0.25
                    } else if (velocity.y < 0) {
                        player.y = y + 1.25
                    }
                    velocity.y = 0
                }

            }

        }
    }
}

let brightenPortal = false

// the standard timestep
let stepSt = 20
function update(timestep)
{
    // timestep ratio
    let tr = timestep / stepSt

    if (keys.right) {
        angVel += angAcc * tr
    } else if (keys.left) {
        angVel -= angAcc * tr
    }
    angVel *= (1 - angFric * tr)

    direction += angVel * tr

    let xComp = Math.cos(direction)
    let yComp = Math.sin(direction)

    if (keys.forward) {
        velocity.x += xComp * acc * tr
        velocity.y += yComp * acc * tr
    } else if (keys.backward) {
        velocity.x -= xComp * acc / 2 * tr
        velocity.y -= yComp * acc / 2 * tr
    }

    velocity.x *= (1 - fric * tr)
    velocity.y *= (1 - fric * tr)
    
    // remaining velocity x and y
    let rvx = Math.abs(velocity.x * tr)
    let rvy = Math.abs(velocity.y * tr)
    let xDir = velocity.x > 0 ? 1 : -1
    let yDir = velocity.y > 0 ? 1 : -1
    while(rvx > 0 || rvy > 0) {
        if (rvx > 1) {
            player.x += xDir
            rvx -= 1
        } else {
            player.x += xDir * rvx
            rvx = 0
        }
        checkCollision(true)

        if (rvy > 1) {
            player.y += yDir
            rvy -= 1
        } else {
            player.y += yDir * rvy
            rvy = 0
        }
        checkCollision(false)
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
function runGame() {

    render()

    let currentTime = Date.now()
    let delta = currentTime - lastTime
    lastTime = currentTime

    update(delta)

    requestAnimationFrame(runGame)
}
runGame()
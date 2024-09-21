import {Earth} from "./objects/Earth.js";

const cvs = document.createElement('canvas')
const ctx = cvs.getContext('2d')

const SCALE  = devicePixelRatio
const width  = window.innerWidth;
const height = window.innerHeight;
cvs.width  = width  * SCALE;
cvs.height = height * SCALE;
cvs.style.position = `absolute`;
cvs.style.width  = `${width }px`;
cvs.style.height = `${height}px`;
cvs.style.left = `50px`;
cvs.style.top = `50px`;

document.body.appendChild(cvs)


// orientation of camera
const vec = (x = 0, y = 0, z = 0) => ({x, y, z});
vec.set = (o, x = 0, y = 0, z = 0) => {
    o.x = x
    o.y = y
    o.z = z
    return o
}
const X = vec(1, 0, 0);
const Y = vec(0, 1, 0);
const Z = vec(0, 0, 1);
const GLOBAL_PHI = 0.5;
const GLOBAL_THETA = 60;
export {
    X, Y, Z,
    vec,
    GLOBAL_THETA, GLOBAL_PHI,
}

// project v to the camera, output to o

// draw camera-facing section of sphere with normal v and offset o (-1 < o < 1)


const front_grad = ctx.createRadialGradient(0, 0, 150 * 2 / 3, 0, 0, 150)
const back_grad  = ctx.createRadialGradient(0, 0, 150 * 2 / 3, 0, 0, 150)

front_grad.addColorStop(0, '#000')
front_grad.addColorStop(1, '#777')
back_grad.addColorStop(1, '#777')
back_grad.addColorStop(0, '#ddd')

ctx.fillStyle = '#fff'
ctx.lineCap = 'round'
ctx.translate(width / 2, height / 2)

const earth = new Earth();

function render() {
    requestAnimationFrame(render)

    earth.render(ctx);

    ctx.moveTo(-width, 0)
    ctx.lineTo(width, 0);
    ctx.moveTo(0, -height);
    ctx.lineTo(0, height);
    ctx.stroke();

    ctx.restore()
}

requestAnimationFrame(render)
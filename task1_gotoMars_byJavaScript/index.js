import {Earth} from "./objects/Earth.js";
import {CoordinatesSystem} from "./objects/CoordinatesSystem.js";
import {Rocket_M1} from "./objects/Rocket_M1.js";

const cvs = document.createElement('canvas')
const ctx = cvs.getContext('2d')

const SCALE  = devicePixelRatio
const WWidth  = window.innerWidth;
const WHeight = window.innerHeight;

export {
    WWidth,
    WHeight,
}

cvs.width  = WWidth  * SCALE;
cvs.height = WHeight * SCALE;
cvs.style.position = `absolute`;
cvs.style.width  = `${WWidth}px`;
cvs.style.height = `${WHeight}px`;

document.body.appendChild(cvs)


ctx.fillStyle = '#fff'
ctx.lineCap = 'round'
ctx.translate(WWidth / 2, WHeight / 2)

const earth = new Earth();
const cordSystem = new CoordinatesSystem();
const rocket = new Rocket_M1();

function render() {
    requestAnimationFrame(render)

    ctx.save();
    ctx.clearRect(-2 * WWidth, -2 * WHeight, 4 * WWidth, 4 * WHeight)
    ctx.translate(WWidth >> 1, WHeight >> 1);
    ctx.scale(1, -1);

    cordSystem.render(ctx);
    earth.render(ctx, cordSystem);
    rocket.render(ctx, cordSystem);

    ctx.restore()
}

requestAnimationFrame(render)
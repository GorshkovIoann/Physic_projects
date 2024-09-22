import {Vector} from "../vector/vector.js";
import {WHeight, WWidth} from "../index.js";
const {cos, sin, sqrt, acos, atan, atan2, abs, PI} = Math;
const clamp = (a, b, x) => x < a ? a : x > b ? b : x;

const LINE_WIDTH         = 2;

class CoordinatesSystem {
    X = new Vector(1, 0, 0);
    Y = new Vector(0, 1, 0);
    Z = new Vector(0, 0, 1);
    GLOBAL_PHI = 0.5;
    GLOBAL_THETA = 90;

    scale = 100 * WWidth;

    zoom = 40000;

    constructor() {
        this.rotationEvents();
        this.scalingEvents();
    }

    project({x, y, z}, object) {
        let ct = cos((object?.theta ?? 0) + this.GLOBAL_THETA), st = sin((object?.theta ?? 0) + this.GLOBAL_THETA)
        let cp = cos((object?.phi ?? 0) + this.GLOBAL_PHI),   sp = sin((object?.phi ?? 0) + this.GLOBAL_PHI)
        let a = x * ct + y * st
        return new Vector(y * ct - x * st, cp * z - sp * a, cp * a + sp * z)
    }

    render(ctx) {
        ctx.lineWidth = LINE_WIDTH;

        ctx.beginPath();
        ctx.strokeStyle = '#F00';
        let projectX =  this.project(this.X, null);
        ctx.moveTo(-projectX.x * this.scale, -projectX.y * this.scale);
        ctx.lineTo(projectX.x * this.scale, projectX.y * this.scale);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#00F';
        let projectY =  this.project(this.Y, null);
        ctx.moveTo(-projectY.x * this.scale, -projectY.y * this.scale);
        ctx.lineTo(projectY.x * this.scale, projectY.y * this.scale);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#0F0';
        let projectZ =  this.project(this.Z, null);
        ctx.moveTo(-projectZ.x * this.scale, -projectZ.y * this.scale);
        ctx.lineTo(projectZ.x * this.scale, projectZ.y * this.scale);
        ctx.stroke();
    }

    rotationEvents() {
        let pointerOffsetX;
        let pointerOffsetY;

        let system = this;

        document.body.addEventListener("pointerdown", (evt) => {
            pointerOffsetX = evt.offsetX;
            pointerOffsetY = evt.offsetY;

            document.body.addEventListener("pointermove", rotateSystem);
        })
        let rotateSystem = function (evt) {
            let deltaX = evt.offsetX - pointerOffsetX;
            let deltaY = evt.offsetY - pointerOffsetY;

            pointerOffsetX = evt.offsetX;
            pointerOffsetY = evt.offsetY;

            system.GLOBAL_PHI += deltaY / 1000;
            system.GLOBAL_THETA -= deltaX / 1000;
        }

        document.body.addEventListener("pointerup", () => {
            document.body.removeEventListener("pointermove", rotateSystem);
        });
    }
    scalingEvents() {
        let system = this;
        document.body.addEventListener("wheel", (evt) => {
            let delta = evt.deltaY;
            console.log(delta, evt);
            system.zoom += 5 * delta;
        })
    }
}


export {
    CoordinatesSystem
}
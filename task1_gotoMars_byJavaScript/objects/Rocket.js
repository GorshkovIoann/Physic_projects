import {Vector} from "../vector/vector.js";
import {WHeight, WWidth} from "../index.js";
const {cos, sin, sqrt, acos, atan, atan2, abs, PI} = Math;
const clamp = (a, b, x) => x < a ? a : x > b ? b : x;

const LINE_WIDTH         = 2;

class Rocket {
    _coords;
    _mass;
    _fuel;
    _velocities;
    _accelerations;

    phi;
    theta;
    width = 10 * 40000;
    height = 200;

    NB_SECTIONS = 6;
    constructor(coords, startLatitude = 0, startLongitude = 0) {
        this._coords = coords;
        this.phi = startLatitude;
        this.theta = startLongitude;
    }

    _p = new Vector(this._coords[0], this._coords[1], this._coords[2]);
    _n = new Vector(0, 0, 0);

    draw_section(n, ctx, cordSystem) {

    }
    draw_triangles(ctx, cordSystem) {
        this._p = new Vector(this._coords[0], this._coords[1], this._coords[2]);

        for (let i = this.NB_SECTIONS; i--;) {
            let a = i / this.NB_SECTIONS * Math.PI
            let d = new Vector(cos(a), sin(a), 1);
            console.log(this._n);

            let project = cordSystem.project(this._coords, this) // project normal on camera

            ctx.beginPath();
            ctx.strokeStyle = '#F00';
            ctx.moveTo(project.x - d, project.y);
            ctx.lineTo(project.x + d, project.y);
            ctx.stroke();
        }
        for (let i = this.NB_SECTIONS - 1; i--;) {
            let a = (i + 1) / this.NB_SECTIONS * Math.PI;
        }
    }
    render(ctx, cordSystem) {
        this.draw_triangles(ctx, cordSystem);
    }
}

export {
    Rocket
}
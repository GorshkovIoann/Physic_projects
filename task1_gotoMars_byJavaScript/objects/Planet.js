import {Vector} from "../vector/vector.js";
const {cos, sin, sqrt, acos, atan, atan2, abs, PI} = Math;
const clamp = (a, b, x) => x < a ? a : x > b ? b : x;

const LINE_WIDTH         = 3;

class Planet {
    _mass;
    _radius;
    _coords;
    _g = 10;

    RADIUS;
    phi = 0;
    theta = 0;

    NB_SECTIONS = 6;

    constructor(mass, radius, coords, g) {
        this._mass = mass;
        this._radius = radius;
        this._coords = coords;
        this._g = g;
    }

    _p = new Vector(0, 0, 0);
    draw_section(n, o = 0, ctx, cordSystem) {
        this._p = cordSystem.project(n, this) // project normal on camera
        let a  = atan2(this._p.y, this._p.x)           // angle of projected normal -> angle of ellipse
        let ry = sqrt(1 - o * o)       // radius of section -> y-radius of ellipse
        let rx = ry * abs(this._p.z)           // x-radius of ellipse
        let W  = sqrt(this._p.x * this._p.x + this._p.y * this._p.y)
        let sa = acos(clamp(-1, 1, o * (1 / W - W) / rx)) // ellipse start angle
        let sb = this._p.z > 0 ? 2 * PI - sa : - sa                    // ellipse end angle

        ctx.beginPath()
        ctx.ellipse(this._p.x * o * this.RADIUS + this._coords[0], this._p.y * o * this.RADIUS + this._coords[1], rx * this.RADIUS, ry * this.RADIUS, a, sa, sb, this._p.z <= 0)
        ctx.stroke()
    }

    _n = new Vector(0, 0, 0);

    draw_arcs(ctx, cordSystem) {
        for (let i = this.NB_SECTIONS; i--;) {
            let a = i / this.NB_SECTIONS * Math.PI
            this.draw_section(this._n = new Vector(cos(a), sin(a), 0), 0, ctx, cordSystem)
        }

        for (let i = this.NB_SECTIONS - 1; i--;) {
            let a = (i + 1) / this.NB_SECTIONS * Math.PI
            this.draw_section(cordSystem.Z, cos(a), ctx, cordSystem)
        }
    }
    render(ctx, cordSystem) {

        this.RADIUS = this._radius / (cordSystem.zoom);

        ctx.strokeStyle = '#777';
        ctx.lineWidth = LINE_WIDTH;

        ctx.beginPath();
        ctx.arc(this._coords[0], this._coords[1], this.RADIUS, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.lineWidth = LINE_WIDTH

        this.draw_arcs(ctx, cordSystem);
    }
}

export {
    Planet
}
import {GLOBAL_PHI, GLOBAL_THETA, vec, Z} from "../index.js";
const {cos, sin, sqrt, acos, atan, atan2, abs, PI} = Math;
const clamp = (a, b, x) => x < a ? a : x > b ? b : x;

const LINE_WIDTH         = 3;

const SCALE  = devicePixelRatio
const width  = 600;
const height = 600;

class Planet {
    _mass;
    _radius;
    _coords;
    RADIUS;
    phi = 0;
    theta = 0;

    constructor(mass, radius, coords) {
        this._mass = mass;
        this._radius = radius;
        this._coords = coords;

        this.NB_SECTIONS = 6;
        this.RADIUS = 150;
    }


    project(o, {x, y, z}) {
        let ct = cos(this.theta + GLOBAL_THETA), st = sin(this.theta + GLOBAL_THETA)
        let cp = cos(this.phi + GLOBAL_PHI),   sp = sin(this.phi + GLOBAL_PHI)
        let a = x * ct + y * st
        return vec.set(o, y * ct - x * st, cp * z - sp * a, cp * a + sp * z)
    }
    _p = vec();
    draw_section(n, o = 0, ctx) {
        let {x, y, z} = this.project(this._p, n) // project normal on camera
        let a  = atan2(y, x)           // angle of projected normal -> angle of ellipse
        let ry = sqrt(1 - o * o)       // radius of section -> y-radius of ellipse
        let rx = ry * abs(z)           // x-radius of ellipse
        let W  = sqrt(x * x + y * y)
        let sa = acos(clamp(-1, 1, o * (1 / W - W) / rx)) // ellipse start angle
        let sb = z > 0 ? 2 * PI - sa : - sa                    // ellipse end angle

        ctx.beginPath()
        ctx.ellipse(x * o * this.RADIUS + this._coords[0], y * o * this.RADIUS + this._coords[1], rx * this.RADIUS, ry * this.RADIUS, a, sa, sb, z <= 0)
        ctx.stroke()
    }

    _n = vec(100, 100, 100);

    draw_arcs(ctx) {
        for (let i = this.NB_SECTIONS; i--;) {
            let a = i / this.NB_SECTIONS * Math.PI
            this.draw_section(vec.set(this._n, cos(a), sin(a)), 0, ctx)
        }

        for (let i = this.NB_SECTIONS - 1; i--;) {
            let a = (i + 1) / this.NB_SECTIONS * Math.PI
            this.draw_section(Z, cos(a), ctx)
        }
    }
    render(ctx) {


        // 1. change the basis of the canvas
        ctx.save()
        ctx.fillRect(0, 0, width, height)
        ctx.translate(width >> 1, height >> 1)
        ctx.scale(1, -1)

        ctx.strokeStyle = '#777';
        ctx.lineWidth = LINE_WIDTH + 2
        ctx.beginPath()
        ctx.arc(this._coords[0], this._coords[1], 150, 0, 2 * Math.PI)
        ctx.stroke()

        // 4. draw front arcs
        ctx.lineWidth = LINE_WIDTH
        // ctx.strokeStyle = with_gradient.checked ? front_grad : '#000'

        this.draw_arcs(ctx);
    }
}

export {
    Planet
}
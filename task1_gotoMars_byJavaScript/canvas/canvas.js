const {cos, sin, sqrt, acos, atan, atan2, abs, PI} = Math;
const clamp = (a, b, x) => x < a ? a : x > b ? b : x;
class Canvas {
    cvs;
    ctx;

    constructor() {
        this.cvs = document.createElement('canvas');
        this.ctx = cvs.getContext('2d');
        document.body.appendChild(cvs);
    }

}
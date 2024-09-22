import {Rocket} from "./Rocket.js";

class Rocket_M1 extends Rocket {
    constructor() {
        super([0, 0, 6371000], 0, 0);
    }
}

export {
    Rocket_M1
}
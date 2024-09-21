import {Planet} from "./Planet.js";

const EARTH_MASS = 5972E21; // kg
const EARTH_RADIUS = 6371; // km
class Earth extends Planet {
    RADIUS             = 150;
    constructor() {
        super(EARTH_MASS, EARTH_RADIUS, [0, 0, 0]);
    }
}

export {
    Earth
}
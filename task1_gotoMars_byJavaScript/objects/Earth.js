import {Planet} from "./Planet.js";

const EARTH_MASS = 5972E21; // kg
const EARTH_RADIUS = 6371000; // km
const EARTH_G = 10; //
class Earth extends Planet {
    constructor() {
        super(EARTH_MASS, EARTH_RADIUS, [0, 0, 0], EARTH_G);
    }
}

export {
    Earth
}
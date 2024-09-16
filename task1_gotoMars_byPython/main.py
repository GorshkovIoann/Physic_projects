import numpy as np
from earth import R, G, M, g
import SpaceShip
import graphics

kartoshka = SpaceShip.SpaceShip(coordinates=[0, 0, R])

_, coordinates, _, vel, _ = kartoshka.simulate_entering_orbit()

print(coordinates, coordinates.size, kartoshka.calculate_rvector_modul())

graphics.create_the_world(coordinates=np.array(coordinates))

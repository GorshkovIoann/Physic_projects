import numpy as np
import math
import copy
from earth import M, R, G, g


def is_it_in_interval(a, b, num):
    if num > a and num < b:
        return num
    if a >= num:
        return a
    if b <= num:
        return b


class SpaceShip:
    def __init__(
        self,
        mass: int = 3e5,
        Vrel: int = 4500,
        coordinates: list[float, float, float] = [0, 0, 0],
        velocity: list[float, float, float] = [0, 0, 0],
        acceleration: list[float, float, float] = [0, 0, 0],
        basic_stop_acceleration: float = 20
    ) -> None:
        self.mass = mass
        self.Vrel = Vrel
        self.coordinates = coordinates
        self.orientation = self.calculate_rvector_orientation()
        self.velocity = velocity
        self.acceleration = acceleration
        self.basic_stop_acceleration = basic_stop_acceleration

    def calculate_fsv(self):
        return (G*M/self.calculate_rvector_modul())**0.5

    def calculate_rv_normal(self):
        print([1, 1, (-self.coordinates[0]-self.coordinates[1])/self.coordinates[2]])
        return [1, 1, (-self.coordinates[0]-self.coordinates[1])/self.coordinates[2]]

    def calculate_rvnormal_modul(self, v) -> float:
        return (v[0]**2 + v[1]**2 + v[2]**2)**0.5

    def calculate_rvnormall_orientation(self, v, v_mod) -> float:
        return [
            math.acos(v[0]/v_mod),
            math.acos(v[1]/v_mod),
            math.acos(v[2]/v_mod),
        ]

    def calculate_rvector_modul(self) -> float:
        return (self.coordinates[0]**2 + self.coordinates[1]**2 + self.coordinates[2]**2)**0.5

    def calculate_velocity_modul(self) -> float:
        return (self.velocity[0]**2 + self.velocity[1]**2 + self.velocity[2]**2)**0.5

    def calculate_acceleration_modul(self) -> float:
        return (self.acceleration[0]**2 + self.acceleration[1]**2 + self.acceleration[2]**2)**0.5

    def calculate_rvector_orientation(self) -> float:
        return [
            math.acos(self.coordinates[0]/self.calculate_rvector_modul()),
            math.acos(self.coordinates[1]/self.calculate_rvector_modul()),
            math.acos(self.coordinates[2]/self.calculate_rvector_modul()),
        ]

    def _update(
            self,
            time_step: float = 0.001,
            back_powers: list[float, float, float] = [0, 0, 0],
            side_powers: list[float, float, float] = [0, 0, 0],
            # по сути указывают на какой угол мы повернулись
            # на данный момент считаем в радианах и просто добавляем
            dmass_dt=0
    ):
        #  /1\<-side_powers
        #  |2|
        #  |3|
        # / 4 \
        # ||5||
        #  ^ ^
        #  | |
        # back_powers
        # меняем координаты, ориентацию, скорость, ускорение
        self.mass -= dmass_dt*time_step
        for i in range(3):
            self.acceleration[i] = back_powers[i]/self.mass
            self.velocity[i] += time_step*self.acceleration[i]
            self.coordinates[i] += time_step*self.velocity[i]
            self.orientation[i] += side_powers[i]
        print(self.velocity, " vel")

    def _calculate_powers(self,):
        # подсчет равнодействуЮщей сил,
        # при дальнейшем усложнении придется учитывать точку приложения
        # пока считаем,что можем поворачивать ориентацию ракеты без затрат топлива как хотим
        # со скоростью не быстрее 360 градусов в минуту и произвольно гасить любое возникающее угловое ускорение.
        Fgravity_mod = G*M/(self.calculate_rvector_modul()**2)
        rvec = self.calculate_rvector_orientation()
        Fgravity = [-(Fgravity_mod*math.cos(rvec[0])),
                    -(Fgravity_mod*math.cos(rvec[1])),
                    -(Fgravity_mod*math.cos(rvec[2]))]
        # try:
        dmass_dt, back_powers, side_powers = self._calculate_own_powers_toMCS(
            Fgravity)

        return dmass_dt, back_powers, side_powers
        # except Exception as e:

        print(side_powers)
        print(dmass_dt)

    # def calculate_trajctory_to_MCS(self, start_coordinates = self.coordinates):
     # создать массив точек ожидаемой траектории выхода на мкс

    def _calculate_own_powers_toMCS(
            self,
            back_powers=[0, 0, 0],
            side_powers=[0, 0, 0]
    ):
        rvec_mod = self.calculate_rvector_modul()
        rvec = self.calculate_rvector_orientation()
        velocity_mod = self.calculate_velocity_modul()
        acceleration_mod = self.calculate_acceleration_modul()
        if rvec_mod < 200000+R:
            # if acceleration_mod > 7*g:
            #   print("прямо по курсу черная дыра\n")
            # потом придумаем что делать при перегрузе которого быть не должно
            #    exit(0)
            if velocity_mod > 8000:
                wonted_power = [0, 0, 0]
            else:
                wonted_power = [
                    self.mass*6*g*math.cos(rvec[0]), self.mass * 6*g*math.cos(rvec[1]), self.mass * 6*g*math.cos(rvec[2])]
            dmass_dt = ((wonted_power[0] - back_powers[0])**2 +
                        (wonted_power[1] - back_powers[1])**2 +
                        (wonted_power[2] - back_powers[2])**2)**0.5 / self.Vrel
            return dmass_dt, wonted_power, [0, 0, 0]
            # летим вверх, мещерский с перегрузом около 6g

       # elif rvec_mod < 400000+R:
            # вывод по круговым орбитам надо будет посчитать

        else:

            wonted_velocity_mod = self.calculate_fsv()
            velocity_mod = self.calculate_velocity_modul()
            if self.mass < 10:
                print("malo mass")
            normal = self.calculate_rv_normal()
            normal_mod = self.calculate_rvnormal_modul(normal)
            normal_orientation = self.calculate_rvnormall_orientation(
                normal, normal_mod)
            print(normal_mod, normal_orientation)
            wonted_velocity = [math.cos(normal_orientation[0])*wonted_velocity_mod, math.cos(
                normal_orientation[2])*wonted_velocity_mod, math.cos(normal_orientation[2])*wonted_velocity_mod]
            rvec_mod = self.calculate_rvector_modul() - R
            if rvec_mod > 1279000:
                print("thats bad")
            else:
                print("...")
            acceleration_mod = self.calculate_acceleration_modul()
            if acceleration_mod > 9*g:
                print("прямо по курсу черная дыра\n")
            # хотим выровнять ракету по нормали, поворачивая не быстрее чем на 20 градусов в dt
            #  в будущем стоит поменять
            for i in range(3):
                if self.orientation[i]-normal_orientation[i] > 0.1:
                    self.orientation[i] -= min((self.orientation[i] -
                                                normal_orientation[i]), (3.14/9))

                if self.orientation[i]-normal_orientation[i] < -0.1:
                    self.orientation[i] += min((normal_orientation[i] -
                                                self.orientation[i]), (3.14/9))

            self.velocity = wonted_velocity
            return 0, back_powers, [0, 0, 0]
            wonted_power = [
                self.mass * is_it_in_interval(-6*g, 6*g, wonted_velocity[0] - self.velocity[0])*math.cos(
                    self.orientation[0]) + self.mass*is_it_in_interval(-4*g, 4*g, wonted_velocity[0] - self.velocity[0]),
                self.mass * is_it_in_interval(-6*g, 6*g, wonted_velocity[1] - self.velocity[1])*math.cos(
                    self.orientation[1])+self.mass*is_it_in_interval(-4*g, 4*g, wonted_velocity[1] - self.velocity[1]),
                self.mass * is_it_in_interval(-6*g, 6*g, wonted_velocity[2] - self.velocity[2])*math.cos(
                    self.orientation[2]) + self.mass*is_it_in_interval(-4*g, 4*g, wonted_velocity[2] - self.velocity[2])
            ]
            dmass_dt = ((wonted_power[0])**2 +
                        (wonted_power[1])**2 +
                        (wonted_power[2])**2)**0.5 / self.Vrel
            return dmass_dt, [wonted_power[0]+back_powers[0], wonted_power[1]+back_powers[1], wonted_power[2]+back_powers[2]], [0, 0, 0]

#            if velocity_mod - wonted_velocity_mod > 1:
#                wonted_power = [0, 0, 0]
#                for i in range(3):
#                    if self.velocity[i]-wonted_velocity[i] > 1:
#                        wonted_power[i] = - \
#                            self.mass * \
#                            min((self.velocity[i]-wonted_velocity[i]), 60)

#                    if self.velocity[i]-wonted_velocity[i] < -0.0001:
#                        wonted_power[i] =  \
#                            self.mass * \
#                            min((wonted_velocity[i] - self.velocity[i]), 60)
#                dmass_dt = ((wonted_power[0])**2 +
#                            (wonted_power[1])**2 +
#                           (wonted_power[2])**2)**0.5 / self.Vrel
#               return dmass_dt, [wonted_power[0]+back_powers[0], wonted_power[1]+back_powers[1], wonted_power[2]+back_powers[2]], [0, 0, 0]
#            return 0, back_powers, [0, 0, 0]

        # пока высота меньше 200км, летим вверх, затем разворот и летим по низкой орбите
        # постепенно увеличивая ее до 400 км

    def simulate_entering_orbit(
        self
    ) -> list[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray,]:
        arr_mass = []
        arr_coordinates = []
        arr_orientation = []
        arr_velocity = []
        arr_acceleration = []
        time = 0
        while time < 8000:  # 400000+R:
            time += 1
            if time >= 1200:
                time = time
            print("time:", time, "\n")
            dmass_dt, back_powers, side_powers = self._calculate_powers()
            self._update(1, back_powers, side_powers, dmass_dt)
            arr_mass.append(self.mass)
            arr_coordinates.append(copy.deepcopy(self.coordinates))
            arr_orientation.append(copy.deepcopy(self.orientation))
            arr_velocity.append(copy.deepcopy(self.velocity))
            arr_acceleration.append(copy.deepcopy(self.acceleration))
        print("end of entering to the orbit")

        return (np.array(arr_mass),
                np.array(arr_coordinates),
                np.array(arr_orientation),
                np.array(arr_velocity),
                np.array(arr_acceleration),
                )

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D


def create_the_world(coordinates):
    fig = plt.figure(figsize=(8, 8))
    ax = fig.add_subplot(111, projection='3d')

    earth_radius = 6371000  # метры

    u = np.linspace(0, 2 * np.pi, 100)
    v = np.linspace(0, np.pi, 100)
    x = earth_radius * np.outer(np.cos(u), np.sin(v))
    y = earth_radius * np.outer(np.sin(u), np.sin(v))
    z = earth_radius * np.outer(np.ones(np.size(u)), np.cos(v))

    ax.plot_surface(x, y, z, color='b', alpha=0.5)

    ax.scatter(coordinates[:, 0], coordinates[:, 1],
               coordinates[:, 2], c='r', marker='o', s=20)

    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')

    max_range = earth_radius
    ax.set_xlim(-max_range + 1000000, max_range + 1000000)
    ax.set_ylim(-max_range + 1000000, max_range + 1000000)
    ax.set_zlim(-max_range + 1000000, max_range + 1000000)

    plt.title('Мир Винни')
    plt.show()

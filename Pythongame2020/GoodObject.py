import random
from sprite import *


class GoodObject:
    def __init__(self, screen_width):
        self.width = screen_width
        self.speed = random.randrange(1, 9)
        self.sprite = Sprite("apple1.png", random.randrange(self.width), 0)
        self.sprite.change_size(15,15)
        self.point = 1
        self.lives = 0
    def update(self):
        self.sprite.y += self.speed
        if self.sprite.y > 670:
            self.reset()
    def reset(self):
        self.sprite.y = 0
        self.sprite.x = random.randrange(self.width)
        self.speed = random.randrange(3, 10)